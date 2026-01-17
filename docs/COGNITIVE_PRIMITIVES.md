# Cognitive Primitives

This document defines the cognitive primitives available in Singularis Prime—the building blocks for AI-native applications.

## Overview

Singularis Prime replaces classical OS concepts with cognitive equivalents:

| Classical | Cognitive | Purpose |
|-----------|-----------|---------|
| Thread | Lane | Execution context |
| Process | Domain | Capability boundary |
| Interrupt | Event | Salience signal |
| Memory | State | Addressable storage |
| Database | Assoc | Associative memory |
| Syscall | Op | Substrate operation |

## 1. Lanes (Execution)

Lanes are cognitive execution contexts—continuous loops that process events and update state.

### Characteristics

- **Cooperative**: Lanes yield at await points
- **Policy-driven**: Priority, energy, affinity
- **Domain-bound**: Capabilities inherited from domain
- **Persistent**: Can run indefinitely

### Lane Policies

```kotlin
data class LanePolicy(
    val priority: Priority,      // LOW, NORMAL, HIGH, REALTIME
    val energyBudget: Energy,    // LOW, BALANCED, UNBOUNDED
    val affinity: Affinity       // ANY, LITTLE, BIG, NPU
)
```

### Common Patterns

**Perception Loop**
```sp
lane "Perception" policy { priority high } {
    sub = listen("sensor/")
    loop {
        raw = await sub
        processed = transform(raw)
        emit("percept/", processed)
    }
}
```

**Memory Loop**
```sp
lane "Memory" policy { priority normal, energy low } {
    sub = listen("percept/")
    loop {
        percept = await sub
        embedding = embed(percept)
        memory("working").put(hash(percept), embedding)
    }
}
```

**Attention Loop**
```sp
lane "Attention" policy { priority high } {
    sub = listen("context/focus")
    loop {
        focus = await sub
        relevant = memory("working").query(k: 5, vector: embed(focus))
        for item in relevant {
            emit("attention/item", item)
        }
    }
}
```

## 2. Events (Salience)

Events are the signaling primitive—how lanes communicate and respond to changes.

### Event Structure

```kotlin
data class Event(
    val id: EventId,
    val topic: String,           // Hierarchical: "sensor/camera/frame"
    val tsNanos: Long,           // Timestamp
    val payload: ByteArray,      // Raw data
    val meta: Map<String, String> // Metadata
)
```

### Topic Patterns

```
sensor/           → All sensor events
sensor/camera     → Camera events only
sensor/camera/*   → Camera subtopics
percept/          → All perceptions
attention/        → Attention outputs
action/           → Motor commands
system/           → System events
```

### Quality of Service

- **BEST_EFFORT**: Fire and forget (default)
- **AT_LEAST_ONCE**: Retry until acknowledged
- **EXACTLY_ONCE**: Transactional (future)

### Event Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  Sensor  │────▶│  Percept │────▶│ Attention│
│ sensor/* │     │ percept/*│     │attention/│
└──────────┘     └──────────┘     └──────────┘
     │                │                │
     │                │                │
     ▼                ▼                ▼
┌──────────┐     ┌──────────┐     ┌──────────┐
│  Memory  │◀────│  Memory  │◀────│  Action  │
│ (Assoc)  │     │ (Assoc)  │     │ action/* │
└──────────┘     └──────────┘     └──────────┘
```

## 3. Domains (Capability)

Domains are capability containers—sandboxes that define what lanes can access.

### Domain Structure

```kotlin
data class DomainManifest(
    val name: String,
    val grants: List<Grant>,
    val seal: Boolean
)
```

### Grant Types

| Grant | Purpose | Example |
|-------|---------|---------|
| `Events(prefix)` | Topic access | `Events("sensor/")` |
| `State(name, perms)` | State region | `State("scratch", RW)` |
| `Assoc(space, perms)` | Memory space | `Assoc("working", RW)` |
| `Clock` | Time access | `Clock` |
| `Accel(which)` | Accelerator | `Accel(NPU)` |

### Capability Model

```
                    ┌─────────────────────────────────┐
                    │         ROOT DOMAIN             │
                    │  (All capabilities, unsealed)   │
                    └─────────────┬───────────────────┘
                                  │ grants
          ┌───────────────────────┼───────────────────────┐
          ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  APP DOMAIN A   │     │  APP DOMAIN B   │     │  APP DOMAIN C   │
│  (sealed)       │     │  (sealed)       │     │  (sealed)       │
│                 │     │                 │     │                 │
│ Events:sensor/  │     │ Events:percept/ │     │ Events:action/  │
│ Assoc:working   │     │ Assoc:memory    │     │ State:motor     │
│ Clock           │     │ Clock           │     │ Accel:DSP       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## 4. State (Addressable)

State provides byte-addressable memory regions—traditional RAM semantics.

### Operations

```kotlin
// Map a region
val handle = msi.stateMap(domain, "scratch", 1024, RW)

// Read bytes
val data = msi.stateRead(handle, offset = 0, len = 128)

// Write bytes
msi.stateWrite(handle, offset = 0, data = bytes)

// Commit (persistence hint)
msi.stateCommit(handle)
```

### Use Cases

- **Scratch buffers**: Temporary computation
- **Frame buffers**: Image/video data
- **Ring buffers**: Streaming data
- **Config storage**: Parameters

## 5. Assoc (Associative Memory)

Assoc provides key-value storage with semantic query support—the cognitive equivalent of long-term memory.

### Value Structure

```kotlin
data class AssocValue(
    val bytes: ByteArray,        // Embedding or data
    val meta: Map<String, String>, // Metadata
    val tsNanos: Long?           // Timestamp
)
```

### Operations

```kotlin
// Store
msi.assocPut(domain, "working", "key123", AssocValue(
    bytes = embedding,
    meta = mapOf("source" to "camera", "confidence" to "0.95")
))

// Retrieve
val value = msi.assocGet(domain, "working", "key123")

// Semantic query
val results = msi.assocQuery(domain, "working", AssocQuery(
    k = 5,
    vector = queryEmbedding
))

// Forget
msi.assocForget(domain, "working", "key123")      // Specific
msi.assocForget(domain, "working", "oldest:10")   // Policy
msi.assocForget(domain, "working", "all")         // Clear
```

### Memory Spaces

```
┌─────────────────────────────────────────────────────────────────┐
│                    ASSOCIATIVE MEMORY                           │
├─────────────────┬─────────────────┬─────────────────────────────┤
│    "sensory"    │    "working"    │       "episodic"            │
│   (short-term)  │   (active)      │       (long-term)           │
│                 │                 │                             │
│ • Raw percepts  │ • Current task  │ • Past experiences          │
│ • Fades quickly │ • Attended items│ • Consolidated memories     │
│ • High churn    │ • Medium churn  │ • Low churn                 │
└─────────────────┴─────────────────┴─────────────────────────────┘
```

## 6. Clock (Time)

Clock provides time primitives—essential for temporal reasoning and scheduling.

### Operations

```kotlin
// Current time (nanoseconds since boot)
val now = msi.clockNowNanos()

// Sleep until
msi.clockSleepUntilNanos(now + 1_000_000_000L) // 1 second

// In SP syntax
ts = clock.now()
sleep(1000) // milliseconds
```

### Time Models

- **Monotonic**: Always increasing, never jumps
- **Event-based**: Time advances with events (for simulation)

## Cognitive Patterns

### Pattern 1: Perception Pipeline

```
Sensor → Feature Extraction → Object Detection → Scene Understanding
  │              │                   │                    │
  ▼              ▼                   ▼                    ▼
sensor/      percept/raw       percept/objects      percept/scene
```

### Pattern 2: Memory Consolidation

```
Sensory Buffer → Working Memory → Episodic Memory
    (1 sec)         (30 sec)        (permanent)
       │               │                 │
       └───attention───┴───rehearsal─────┘
```

### Pattern 3: Attention Mechanism

```
            ┌─────────────┐
            │  SALIENCE   │
            │  FILTER     │
            └──────┬──────┘
                   │
    ┌──────────────┼──────────────┐
    ▼              ▼              ▼
┌───────┐     ┌───────┐     ┌───────┐
│ TOP-K │     │NOVELTY│     │ GOAL  │
│SIMILAR│     │ CHECK │     │ MATCH │
└───┬───┘     └───┬───┘     └───┬───┘
    │             │             │
    └─────────────┼─────────────┘
                  ▼
            ┌─────────────┐
            │  ATTENDED   │
            │   ITEMS     │
            └─────────────┘
```

### Pattern 4: Action Selection

```
Perception → Deliberation → Selection → Execution
    │             │             │           │
 percept/    attention/     decision/    action/
```

## Best Practices

1. **Use events for loose coupling**: Lanes communicate via events, not direct calls
2. **Scope domains tightly**: Grant only needed capabilities
3. **Prefer assoc over state**: When data has semantic structure
4. **Set appropriate policies**: Match lane priority to criticality
5. **Implement backpressure**: Handle event overflow gracefully
6. **Use metadata**: Attach context to events and memory values
