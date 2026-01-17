/**
 * Shinobi.Substrate - Singularis Prime Kernel Module Specification
 * 
 * This defines the "cognition primitives" that compile down to MSI calls.
 * SP code doesn't call Android/Linux directly. It calls MSI.
 * Android is just one substrate backend.
 */

module Shinobi.Substrate v1.0

// =============================================================================
// PRIMITIVE TYPES
// =============================================================================

type DomainId   // Capability container identifier
type LaneId     // Execution context identifier
type StateHandle // Addressable state region handle
type SubId      // Event subscription identifier
type Bytes      // Raw byte sequence
type MapStrStr  // String-to-string map

// =============================================================================
// ENUMS
// =============================================================================

enum Priority {
    low,
    normal,
    high,
    realtime
}

enum Energy {
    low,       // Minimize power consumption
    balanced,  // Default trade-off
    unbounded  // Maximum performance
}

enum Affinity {
    any,    // No preference
    little, // Efficiency cores
    big,    // Performance cores
    npu     // Neural processing unit
}

enum Perms {
    r,   // Read-only
    rw   // Read-write
}

enum QoS {
    best_effort,    // Fire and forget
    at_least_once,  // Retry until ack
    exactly_once    // Transactional (future)
}

// =============================================================================
// STRUCTS
// =============================================================================

struct LanePolicy {
    priority: Priority,
    energy: Energy,
    affinity: Affinity
}

struct Event {
    id: String,
    topic: String,
    tsNanos: Int,
    payload: Bytes,
    meta: MapStrStr
}

struct AssocValue {
    bytes: Bytes,
    meta: MapStrStr,
    tsNanos: Int?
}

struct AssocResult {
    key: String,
    score: Float?,
    value: AssocValue?
}

// =============================================================================
// GRANTS (Capability Types)
// =============================================================================

grant Events(prefix: String)           // Access to event topics
grant State(name: String, perms: Perms) // Access to addressable state
grant Assoc(space: String, perms: Perms) // Access to associative memory
grant Clock                             // Access to time
grant Accel(which: String)             // Access to accelerators (cpu|gpu|npu|dsp)

struct DomainManifest {
    name: String,
    grants: List[Grant],
    seal: Bool
}

// =============================================================================
// KERNEL OPERATIONS (Thin wrappers over MSI)
// =============================================================================

// --- Capability Discovery ---
op substrate.version() -> String
op substrate.capabilities() -> Map

// --- Domains ---
op domain.create(manifest: DomainManifest) -> DomainId
op domain.grant(domain: DomainId, grant: Grant)
op domain.seal(domain: DomainId)

// --- Lanes (Execution Contexts) ---
op lane.spawn(domain: DomainId?, entry: String, policy: LanePolicy) -> LaneId
op lane.yield(lane: LaneId)
op lane.sleep(lane: LaneId, nanos: Int)
op lane.kill(lane: LaneId)
op lane.set_policy(lane: LaneId, policy: LanePolicy)

// --- Events (Salience System) ---
op event.publish(domain: DomainId?, topic: String, payload: Bytes, qos: QoS, meta: MapStrStr?) -> String
op event.subscribe(domain: DomainId?, prefix: String, filter: String?) -> SubId
op event.wait(sub: SubId, timeoutNanos: Int?) -> Event?
op event.ack(eventId: String)

// --- Addressable State ---
op state.map(domain: DomainId?, name: String, bytes: Int, perms: Perms) -> StateHandle
op state.read(h: StateHandle, offset: Int, len: Int) -> Bytes
op state.write(h: StateHandle, offset: Int, bytes: Bytes)
op state.commit(h: StateHandle)

// --- Associative Memory ---
op memory.put(domain: DomainId?, space: String, key: String, value: AssocValue)
op memory.get(domain: DomainId?, space: String, key: String) -> AssocValue?
op memory.query(domain: DomainId?, space: String, k: Int, vector: List[Float]?) -> List[AssocResult]
op memory.forget(domain: DomainId?, space: String, keyOrPolicy: String)

// --- Clock ---
op clock.now() -> Int  // nanoseconds
op clock.sleep(nanos: Int)

// =============================================================================
// SYNTAX SUGAR (What you actually write)
// =============================================================================

/**
 * Domain declaration with grants and seal flag
 * 
 * Example:
 *   domain "Scout" {
 *     grant Events("sensor/")
 *     grant Assoc("working", rw)
 *     seal true
 *   }
 */

/**
 * Lane declaration with domain, policy, and body
 * 
 * Example:
 *   lane "Perception" in "Scout" policy { priority high, energy balanced } {
 *     sub = listen("sensor/")
 *     loop {
 *       e = await sub
 *       emit("percept/frame", e.payload)
 *     }
 *   }
 */

/**
 * Built-in functions (compile to MSI ops)
 * 
 *   listen(topic)          -> event.subscribe + returns subscription
 *   await sub              -> event.wait on subscription
 *   emit(topic, payload)   -> event.publish
 *   memory(space)          -> returns memory accessor object
 *   state(name, size, rw)  -> state.map
 *   clock.now()            -> clock.now
 *   sleep(ms)              -> clock.sleep
 */

// =============================================================================
// EXAMPLE COGNITIVE PROGRAM
// =============================================================================

/*
// Define a sandboxed domain for perception
domain "Scout" {
    grant Events("sensor/")
    grant Events("percept/")
    grant Assoc("working", rw)
    grant Clock
    seal true
}

// Perception lane: listens to sensor events, emits perceptual frames
lane "Perception" in "Scout" policy { priority high, energy balanced } {
    sub = listen("sensor/")
    loop {
        e = await sub
        // Process raw sensor data into perceptual frame
        frame = process(e.payload)
        emit("percept/frame", frame)
    }
}

// Memory weaving lane: stores perceptions in associative memory
lane "MemoryWeave" in "Scout" policy { priority normal, energy low } {
    sub = listen("percept/")
    loop {
        e = await sub
        // Create embedding from perceptual frame
        key = hash(e.payload)
        embedding = embed(e.payload)
        memory("working").put(key, embedding, meta: { ts: clock.now() })
    }
}

// Attention lane: queries memory based on current context
lane "Attention" in "Scout" policy { priority normal, energy balanced } {
    sub = listen("context/focus")
    loop {
        e = await sub
        // Query associative memory for relevant memories
        query_vec = embed(e.payload)
        results = memory("working").query(k: 5, vector: query_vec)
        
        // Emit attended memories
        for r in results {
            emit("attention/memory", r.value.bytes, meta: { score: r.score })
        }
    }
}
*/
