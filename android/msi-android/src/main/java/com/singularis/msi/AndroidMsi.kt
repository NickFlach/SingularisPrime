package com.singularis.msi

import android.os.Process
import android.os.SystemClock
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.Channel
import java.util.UUID
import java.util.concurrent.ConcurrentHashMap

/**
 * Android implementation of the MSI (Minimal Substrate Interface).
 * 
 * This is the "AI-native substrate" running inside Android without needing ROM/root.
 * It maps MSI primitives to Android constructs:
 * - Lanes → Kotlin coroutines
 * - Events → Topic-based pub/sub
 * - State → ByteArray buffers (future: mmap/ASharedMemory)
 * - Assoc → In-memory associative store (future: SQLite/ANN)
 */
class AndroidMsi(
    private val scope: CoroutineScope = CoroutineScope(SupervisorJob() + Dispatchers.Default)
) : MSI {

    private val domains = DomainManager()
    private val bus = EventBus()
    private val state = StateStore()
    private val assoc = AssocStore()

    private val lanes = ConcurrentHashMap<LaneId, Job>()
    private val entrypoints = ConcurrentHashMap<String, suspend (LaneId) -> Unit>()

    // =========================================================================
    // CAPABILITY DISCOVERY
    // =========================================================================

    override fun version(): Semver = Semver(1, 0, 0)

    override fun capabilities(): Caps = Caps(
        lanes = LaneCaps(min = 1, max = null, realtime = false),
        events = EventCaps(model = EventModel.TOPIC, maxTopics = null),
        state = StateCaps(model = StateModel.HYBRID, maxBytes = null),
        clock = ClockCaps(model = ClockModel.MONOTONIC),
        security = SecurityCaps(model = SecurityModel.APP_SANDBOX, attest = false),
        accel = AccelCaps(cpu = true, gpu = false, npu = false, dsp = false)
    )

    override suspend fun attest(): Attestation {
        // v1: No attestation. Future: Play Integrity / Key Attestation
        return Attestation(present = false)
    }

    // =========================================================================
    // ENTRYPOINT REGISTRATION
    // =========================================================================

    /**
     * Registers an entrypoint function that can be spawned as a lane.
     * Call this before laneSpawn() to define available cognitive loops.
     */
    fun registerEntrypoint(name: String, fn: suspend (LaneId) -> Unit) {
        entrypoints[name] = fn
    }

    /**
     * Unregisters an entrypoint.
     */
    fun unregisterEntrypoint(name: String) {
        entrypoints.remove(name)
    }

    // =========================================================================
    // CLOCK
    // =========================================================================

    override fun clockNowNanos(): Long = SystemClock.elapsedRealtimeNanos()

    override suspend fun clockSleepUntilNanos(t: Long) {
        val now = clockNowNanos()
        val deltaNanos = (t - now).coerceAtLeast(0L)
        val deltaMs = deltaNanos / 1_000_000L
        if (deltaMs > 0) {
            delay(deltaMs)
        }
    }

    // =========================================================================
    // DOMAINS
    // =========================================================================

    override fun domainCreate(manifest: DomainManifest): DomainId {
        return domains.create(manifest)
    }

    override fun domainGrant(domain: DomainId, grant: Grant) {
        domains.grant(domain, grant)
    }

    override fun domainSeal(domain: DomainId) {
        domains.seal(domain)
    }

    // =========================================================================
    // LANES (EXECUTION CONTEXTS)
    // =========================================================================

    override fun laneSpawn(domain: DomainId?, entrypoint: String, policy: LanePolicy): LaneId {
        val fn = entrypoints[entrypoint] 
            ?: error("Unknown entrypoint: $entrypoint. Register with registerEntrypoint() first.")

        val id = UUID.randomUUID().toString()

        val dispatcher = when (policy.priority) {
            LanePolicy.Priority.LOW -> Dispatchers.IO
            LanePolicy.Priority.NORMAL -> Dispatchers.Default
            LanePolicy.Priority.HIGH -> Dispatchers.Default
            LanePolicy.Priority.REALTIME -> Dispatchers.Default // Best effort on Android
        }

        val job = scope.launch(dispatcher) {
            applyThreadPolicy(policy)
            try {
                fn(id)
            } catch (e: CancellationException) {
                // Normal cancellation
            } catch (e: Exception) {
                // Log error but don't crash substrate
                e.printStackTrace()
            }
        }

        lanes[id] = job
        return id
    }

    private fun applyThreadPolicy(policy: LanePolicy) {
        val priority = when (policy.priority) {
            LanePolicy.Priority.LOW -> Process.THREAD_PRIORITY_BACKGROUND
            LanePolicy.Priority.NORMAL -> Process.THREAD_PRIORITY_DEFAULT
            LanePolicy.Priority.HIGH -> Process.THREAD_PRIORITY_MORE_FAVORABLE
            LanePolicy.Priority.REALTIME -> Process.THREAD_PRIORITY_URGENT_AUDIO
        }
        try {
            Process.setThreadPriority(priority)
        } catch (_: Throwable) {
            // Ignore if we can't set priority
        }
    }

    override fun laneYield(lane: LaneId) {
        // Cooperative yield - v1: no-op, coroutines handle this
    }

    override suspend fun laneSleepNanos(lane: LaneId, nanos: Long) {
        if (!lanes.containsKey(lane)) return
        delay(nanos / 1_000_000L)
    }

    override fun laneKill(lane: LaneId) {
        lanes.remove(lane)?.cancel()
    }

    override fun laneSetPolicy(lane: LaneId, policy: LanePolicy) {
        // v1: Policy applied only at launch
        // Future: Could adjust thread priority dynamically
    }

    /**
     * Checks if a lane is still running.
     */
    fun laneIsAlive(lane: LaneId): Boolean {
        return lanes[lane]?.isActive == true
    }

    /**
     * Returns count of active lanes.
     */
    fun laneCount(): Int = lanes.count { it.value.isActive }

    // =========================================================================
    // EVENTS (SALIENCE SYSTEM)
    // =========================================================================

    override fun eventPublish(
        domain: DomainId?,
        topic: String,
        payload: ByteArray,
        qos: QoS,
        meta: Map<String, String>
    ): EventId {
        // Check domain permission
        if (domain != null) {
            val topicPrefix = topic.substringBeforeLast('/', topic)
            if (!domains.allowed(domain, Grant.Events(topicPrefix))) {
                error("Domain not allowed to publish to topic: $topic")
            }
        }

        val id = UUID.randomUUID().toString()
        val event = Event(
            id = id,
            topic = topic,
            tsNanos = clockNowNanos(),
            payload = payload,
            meta = meta
        )
        bus.publish(event)
        return id
    }

    override fun eventSubscribe(domain: DomainId?, topicPrefix: String, filterExpr: String?): SubId {
        // Check domain permission
        if (domain != null && !domains.allowed(domain, Grant.Events(topicPrefix))) {
            error("Domain not allowed to subscribe to: $topicPrefix")
        }

        val (id, _) = bus.subscribe(topicPrefix, filterExpr)
        return id
    }

    override suspend fun eventWait(sub: SubId, timeoutNanos: Long?): Event? {
        val channel = bus.channelFor(sub) ?: return null

        return if (timeoutNanos == null) {
            channel.receive()
        } else {
            withTimeoutOrNull(timeoutNanos / 1_000_000L) {
                channel.receive()
            }
        }
    }

    override fun eventAck(eventId: EventId) {
        // v1: No-op (best-effort QoS)
        // Future: Implement at-least-once delivery tracking
    }

    // =========================================================================
    // ADDRESSABLE STATE
    // =========================================================================

    override fun stateMap(domain: DomainId?, name: String, bytes: Int, perms: Grant.Perms): StateHandle {
        // Check domain permission
        if (domain != null && !domains.allowed(domain, Grant.State(name, perms))) {
            error("Domain not allowed to map state: $name")
        }

        return state.map(name, bytes, perms)
    }

    override fun stateRead(handle: StateHandle, offset: Int, len: Int): ByteArray {
        return state.read(handle, offset, len)
    }

    override fun stateWrite(handle: StateHandle, offset: Int, data: ByteArray) {
        state.write(handle, offset, data)
    }

    override fun stateCommit(handle: StateHandle) {
        state.commit(handle)
    }

    // =========================================================================
    // ASSOCIATIVE STATE
    // =========================================================================

    override fun assocPut(domain: DomainId?, space: AssocSpace, key: String, value: AssocValue) {
        // Check domain permission
        if (domain != null && !domains.allowed(domain, Grant.Assoc(space, Grant.Perms.RW))) {
            error("Domain not allowed to put to assoc space: $space")
        }

        // Add timestamp if not present
        val valueWithTs = if (value.tsNanos == null) {
            value.copy(tsNanos = clockNowNanos())
        } else {
            value
        }

        assoc.put(space, key, valueWithTs)
    }

    override fun assocGet(domain: DomainId?, space: AssocSpace, key: String): AssocValue? {
        // Check domain permission
        if (domain != null && !domains.allowed(domain, Grant.Assoc(space, Grant.Perms.R))) {
            error("Domain not allowed to get from assoc space: $space")
        }

        return assoc.get(space, key)
    }

    override fun assocQuery(domain: DomainId?, space: AssocSpace, q: AssocQuery): List<AssocResult> {
        // Check domain permission
        if (domain != null && !domains.allowed(domain, Grant.Assoc(space, Grant.Perms.R))) {
            error("Domain not allowed to query assoc space: $space")
        }

        return assoc.query(space, q)
    }

    override fun assocForget(domain: DomainId?, space: AssocSpace, keyOrPolicy: String) {
        // Check domain permission
        if (domain != null && !domains.allowed(domain, Grant.Assoc(space, Grant.Perms.RW))) {
            error("Domain not allowed to forget from assoc space: $space")
        }

        assoc.forget(space, keyOrPolicy)
    }

    // =========================================================================
    // LIFECYCLE
    // =========================================================================

    /**
     * Shuts down the substrate, cancelling all lanes and clearing state.
     */
    fun shutdown() {
        // Cancel all lanes
        lanes.values.forEach { it.cancel() }
        lanes.clear()

        // Clear event subscriptions
        bus.clear()

        // Clear state and assoc (optional - could preserve for persistence)
        state.clear()
        assoc.clear()

        // Cancel coroutine scope
        scope.cancel()
    }

    /**
     * Returns substrate statistics for debugging.
     */
    fun stats(): Map<String, Any> = mapOf(
        "version" to version().toString(),
        "lanes_active" to laneCount(),
        "domains" to domains.domainCount(),
        "event_subscriptions" to bus.subscriptionCount(),
        "state_regions" to state.regionCount(),
        "assoc_spaces" to assoc.listSpaces().size
    )
}
