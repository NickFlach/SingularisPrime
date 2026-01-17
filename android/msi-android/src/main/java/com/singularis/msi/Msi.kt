package com.singularis.msi

/**
 * MSI v1.0 - Minimal Substrate Interface
 * Kotlin interface definition for Android backend
 */

// =============================================================================
// BASIC TYPES
// =============================================================================

data class Semver(val major: Int, val minor: Int, val patch: Int) {
    override fun toString() = "$major.$minor.$patch"
}

enum class ClockModel { MONOTONIC, EVENT }
enum class StateModel { ADDRESSABLE, ASSOCIATIVE, HYBRID }
enum class EventModel { QUEUE, TOPIC, SIGNAL }
enum class SecurityModel { NONE, APP_SANDBOX, TEE, SE }

data class AccelCaps(
    val cpu: Boolean = true,
    val gpu: Boolean = false,
    val npu: Boolean = false,
    val dsp: Boolean = false
)

data class LaneCaps(
    val min: Int = 1,
    val max: Int? = null,
    val realtime: Boolean = false
)

data class EventCaps(
    val model: EventModel = EventModel.TOPIC,
    val maxTopics: Int? = null
)

data class StateCaps(
    val model: StateModel = StateModel.HYBRID,
    val maxBytes: Long? = null
)

data class ClockCaps(val model: ClockModel = ClockModel.MONOTONIC)

data class SecurityCaps(
    val model: SecurityModel = SecurityModel.APP_SANDBOX,
    val attest: Boolean = false
)

data class Caps(
    val lanes: LaneCaps,
    val events: EventCaps,
    val state: StateCaps,
    val clock: ClockCaps,
    val security: SecurityCaps,
    val accel: AccelCaps
)

data class Attestation(
    val present: Boolean,
    val provider: String? = null,
    val token: String? = null
)

// =============================================================================
// HANDLE TYPES
// =============================================================================

typealias LaneId = String
typealias DomainId = String
typealias StateHandle = String
typealias AssocSpace = String
typealias SubId = String
typealias EventId = String

// =============================================================================
// QOS & POLICIES
// =============================================================================

enum class QoS { BEST_EFFORT, AT_LEAST_ONCE, EXACTLY_ONCE }

data class LanePolicy(
    val priority: Priority = Priority.NORMAL,
    val energyBudget: EnergyBudget = EnergyBudget.BALANCED,
    val affinity: Affinity = Affinity.ANY
) {
    enum class Priority { LOW, NORMAL, HIGH, REALTIME }
    enum class EnergyBudget { LOW, BALANCED, UNBOUNDED }
    enum class Affinity { ANY, LITTLE, BIG, NPU }
}

// =============================================================================
// DOMAIN GRANTS
// =============================================================================

sealed class Grant {
    data class Events(val topicPrefix: String) : Grant()
    data class State(val name: String, val perms: Perms) : Grant()
    data class Assoc(val space: String, val perms: Perms) : Grant()
    data object Clock : Grant()
    data class Accel(val which: Which) : Grant() {
        enum class Which { CPU, GPU, NPU, DSP }
    }

    enum class Perms { R, RW }
}

data class DomainManifest(
    val name: String,
    val grants: List<Grant>,
    val seal: Boolean
)

// =============================================================================
// EVENT TYPES
// =============================================================================

data class Event(
    val id: EventId,
    val topic: String,
    val tsNanos: Long,
    val payload: ByteArray,
    val meta: Map<String, String> = emptyMap()
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false
        other as Event
        return id == other.id
    }

    override fun hashCode(): Int = id.hashCode()
}

// =============================================================================
// ASSOCIATIVE STATE TYPES
// =============================================================================

data class AssocValue(
    val bytes: ByteArray,
    val meta: Map<String, String> = emptyMap(),
    val tsNanos: Long? = null
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false
        other as AssocValue
        return bytes.contentEquals(other.bytes) && meta == other.meta
    }

    override fun hashCode(): Int {
        var result = bytes.contentHashCode()
        result = 31 * result + meta.hashCode()
        return result
    }
}

data class AssocQuery(
    val k: Int,
    val vector: FloatArray? = null,
    val predicate: String? = null
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false
        other as AssocQuery
        return k == other.k && vector?.contentEquals(other.vector) ?: (other.vector == null)
    }

    override fun hashCode(): Int {
        var result = k
        result = 31 * result + (vector?.contentHashCode() ?: 0)
        return result
    }
}

data class AssocResult(
    val key: String,
    val score: Float? = null,
    val value: AssocValue? = null
)

// =============================================================================
// MSI INTERFACE
// =============================================================================

interface MSI {
    // -------------------------------------------------------------------------
    // Capability Discovery
    // -------------------------------------------------------------------------

    /** Returns the MSI version implemented by this substrate */
    fun version(): Semver

    /** Returns the capabilities of this substrate */
    fun capabilities(): Caps

    /** Optional: Returns attestation proof for this substrate */
    suspend fun attest(): Attestation

    // -------------------------------------------------------------------------
    // Clock
    // -------------------------------------------------------------------------

    /** Returns current time in nanoseconds (monotonic) */
    fun clockNowNanos(): Long

    /** Sleeps until the specified time (nanoseconds) */
    suspend fun clockSleepUntilNanos(t: Long)

    // -------------------------------------------------------------------------
    // Domains (Capability Containers)
    // -------------------------------------------------------------------------

    /** Creates a new domain with the given manifest */
    fun domainCreate(manifest: DomainManifest): DomainId

    /** Grants additional capability to a domain (if not sealed) */
    fun domainGrant(domain: DomainId, grant: Grant)

    /** Seals a domain, preventing further capability grants */
    fun domainSeal(domain: DomainId)

    // -------------------------------------------------------------------------
    // Lanes (Execution Contexts)
    // -------------------------------------------------------------------------

    /** Spawns a new lane (execution context) */
    fun laneSpawn(domain: DomainId?, entrypoint: String, policy: LanePolicy): LaneId

    /** Yields the current lane (cooperative scheduling) */
    fun laneYield(lane: LaneId)

    /** Sleeps the lane for the specified duration */
    suspend fun laneSleepNanos(lane: LaneId, nanos: Long)

    /** Terminates a lane */
    fun laneKill(lane: LaneId)

    /** Updates the policy of a running lane */
    fun laneSetPolicy(lane: LaneId, policy: LanePolicy)

    // -------------------------------------------------------------------------
    // Events (Salience System)
    // -------------------------------------------------------------------------

    /** Publishes an event to a topic */
    fun eventPublish(
        domain: DomainId?,
        topic: String,
        payload: ByteArray,
        qos: QoS,
        meta: Map<String, String> = emptyMap()
    ): EventId

    /** Subscribes to events matching a topic prefix */
    fun eventSubscribe(
        domain: DomainId?,
        topicPrefix: String,
        filterExpr: String? = null
    ): SubId

    /** Waits for the next event on a subscription */
    suspend fun eventWait(sub: SubId, timeoutNanos: Long? = null): Event?

    /** Acknowledges an event (for at-least-once QoS) */
    fun eventAck(eventId: EventId)

    // -------------------------------------------------------------------------
    // Addressable State
    // -------------------------------------------------------------------------

    /** Maps a named state region */
    fun stateMap(domain: DomainId?, name: String, bytes: Int, perms: Grant.Perms): StateHandle

    /** Reads from a state region */
    fun stateRead(handle: StateHandle, offset: Int, len: Int): ByteArray

    /** Writes to a state region */
    fun stateWrite(handle: StateHandle, offset: Int, data: ByteArray)

    /** Commits state to durable storage (if supported) */
    fun stateCommit(handle: StateHandle)

    // -------------------------------------------------------------------------
    // Associative State (Memory/Embeddings/Synapses)
    // -------------------------------------------------------------------------

    /** Puts a value into associative memory */
    fun assocPut(domain: DomainId?, space: AssocSpace, key: String, value: AssocValue)

    /** Gets a value from associative memory */
    fun assocGet(domain: DomainId?, space: AssocSpace, key: String): AssocValue?

    /** Queries associative memory (vector search or predicate) */
    fun assocQuery(domain: DomainId?, space: AssocSpace, q: AssocQuery): List<AssocResult>

    /** Forgets a key or applies a forgetting policy */
    fun assocForget(domain: DomainId?, space: AssocSpace, keyOrPolicy: String)
}
