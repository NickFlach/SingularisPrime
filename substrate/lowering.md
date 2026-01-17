# SP → MSI Lowering Rules

This document defines how Singularis Prime (SP) syntax compiles to MSI (Minimal Substrate Interface) calls.

## Overview

```
┌─────────────────────────────────────────┐
│         Singularis Prime Code           │
│  (domain, lane, listen, emit, memory)   │
└────────────────┬────────────────────────┘
                 │ SP Compiler
                 ▼
┌─────────────────────────────────────────┐
│            MSI IR / Bytecode            │
│   (op codes for MSI interface calls)    │
└────────────────┬────────────────────────┘
                 │ Substrate Backend
                 ▼
┌─────────────────────────────────────────┐
│         Android / Linux / Bare Metal    │
│    (AndroidMsi, LinuxMsi, BareMetalMsi) │
└─────────────────────────────────────────┘
```

## Lowering Table

| SP Construct | MSI Call(s) |
|--------------|-------------|
| `domain "X" { grants..., seal }` | `domainCreate(manifest)` |
| `grant Events("pfx")` | Included in `DomainManifest.grants` |
| `grant State("name", perms)` | Included in `DomainManifest.grants` |
| `grant Assoc("space", perms)` | Included in `DomainManifest.grants` |
| `grant Clock` | Included in `DomainManifest.grants` |
| `grant Accel("npu")` | Included in `DomainManifest.grants` |
| `lane "L" in "X" policy {...} {...}` | `laneSpawn(domainId, entrypoint="L", policy)` |
| `listen("topic/")` | `eventSubscribe(domainId, "topic/")` |
| `await sub` | `eventWait(subId, timeout=null)` |
| `await sub timeout(ms)` | `eventWait(subId, timeout=ms*1_000_000)` |
| `emit("t", bytes)` | `eventPublish(domainId, "t", bytes, QoS.BEST_EFFORT)` |
| `emit("t", bytes, qos: at_least_once)` | `eventPublish(domainId, "t", bytes, QoS.AT_LEAST_ONCE)` |
| `state("scratch", n, rw)` | `stateMap(domainId, "scratch", n, Perms.RW)` |
| `state.read(h, off, len)` | `stateRead(handle, offset, len)` |
| `state.write(h, off, bytes)` | `stateWrite(handle, offset, bytes)` |
| `state.commit(h)` | `stateCommit(handle)` |
| `memory("space")` | Returns `AssocAccessor(domainId, "space")` |
| `memory("space").put(k, v)` | `assocPut(domainId, "space", k, v)` |
| `memory("space").get(k)` | `assocGet(domainId, "space", k)` |
| `memory("space").query(k: n, vector: v)` | `assocQuery(domainId, "space", {k: n, vector: v})` |
| `memory("space").forget(k)` | `assocForget(domainId, "space", k)` |
| `clock.now()` | `clockNowNanos()` |
| `sleep(ms)` | `clockSleepUntilNanos(now + ms*1_000_000)` |
| `lane.yield()` | `laneYield(currentLaneId)` |

## Detailed Examples

### Domain Declaration

**SP:**
```sp
domain "Scout" {
    grant Events("sensor/")
    grant Events("percept/")
    grant Assoc("working", rw)
    grant Clock
    seal true
}
```

**Lowered MSI (Kotlin):**
```kotlin
val scoutDomain = msi.domainCreate(
    DomainManifest(
        name = "Scout",
        grants = listOf(
            Grant.Events("sensor/"),
            Grant.Events("percept/"),
            Grant.Assoc("working", Grant.Perms.RW),
            Grant.Clock
        ),
        seal = true
    )
)
```

### Lane Declaration

**SP:**
```sp
lane "Perception" in "Scout" policy { priority high, energy balanced } {
    sub = listen("sensor/")
    loop {
        e = await sub
        emit("percept/frame", e.payload)
    }
}
```

**Lowered MSI (Kotlin):**
```kotlin
// Register entrypoint
msi.registerEntrypoint("Perception") { laneId ->
    val sub = msi.eventSubscribe(scoutDomain, "sensor/")
    while (true) {
        val e = msi.eventWait(sub) ?: continue
        msi.eventPublish(scoutDomain, "percept/frame", e.payload, QoS.BEST_EFFORT)
    }
}

// Spawn lane
msi.laneSpawn(
    domain = scoutDomain,
    entrypoint = "Perception",
    policy = LanePolicy(
        priority = LanePolicy.Priority.HIGH,
        energyBudget = LanePolicy.EnergyBudget.BALANCED,
        affinity = LanePolicy.Affinity.ANY
    )
)
```

### Associative Memory

**SP:**
```sp
lane "MemoryWeave" in "Scout" policy { priority normal } {
    sub = listen("percept/")
    loop {
        e = await sub
        key = hash(e.payload)
        memory("working").put(key, embed(e.payload), meta: { ts: clock.now() })
    }
}
```

**Lowered MSI (Kotlin):**
```kotlin
msi.registerEntrypoint("MemoryWeave") { laneId ->
    val sub = msi.eventSubscribe(scoutDomain, "percept/")
    while (true) {
        val e = msi.eventWait(sub) ?: continue
        val key = hash(e.payload)
        val embedding = embed(e.payload)  // External AI function
        msi.assocPut(
            domain = scoutDomain,
            space = "working",
            key = key,
            value = AssocValue(
                bytes = embedding,
                meta = mapOf("ts" to msi.clockNowNanos().toString())
            )
        )
    }
}
```

### Vector Query

**SP:**
```sp
results = memory("working").query(k: 5, vector: query_embedding)
for r in results {
    emit("attention/memory", r.value.bytes)
}
```

**Lowered MSI (Kotlin):**
```kotlin
val results = msi.assocQuery(
    domain = scoutDomain,
    space = "working",
    q = AssocQuery(k = 5, vector = queryEmbedding)
)
for (r in results) {
    r.value?.let { v ->
        msi.eventPublish(scoutDomain, "attention/memory", v.bytes, QoS.BEST_EFFORT)
    }
}
```

## Compiler Pipeline

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   SP Source  │────▶│    Parser    │────▶│  Type Check  │────▶│   Lowering   │
│    (.sp)     │     │     (AST)    │     │  (Semantic)  │     │   (MSI IR)   │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
                                                                       │
                     ┌──────────────┐     ┌──────────────┐            │
                     │   Runtime    │◀────│  Code Gen    │◀───────────┘
                     │  (Android)   │     │  (Kotlin)    │
                     └──────────────┘     └──────────────┘
```

### Phase 1: Parsing
- Tokenize SP source
- Build AST for domains, lanes, expressions

### Phase 2: Type Checking
- Verify grant references
- Check domain capability access
- Validate lane policies

### Phase 3: Lowering
- Convert AST to MSI IR (intermediate representation)
- Resolve domain/lane references
- Generate entrypoint registrations

### Phase 4: Code Generation
- Emit target language (Kotlin for Android)
- Or emit MSI bytecode for interpreter

## Future: MSI Bytecode

For interpreted execution, define a compact bytecode:

```
OPCODE      | ARGS                  | DESCRIPTION
------------|-----------------------|---------------------------
0x01 VERS   |                       | Push MSI version
0x02 CAPS   |                       | Push capabilities
0x10 DCREAT | manifest_idx          | Create domain
0x11 DGRANT | domain_idx, grant_idx | Grant capability
0x12 DSEAL  | domain_idx            | Seal domain
0x20 LSPAWN | domain_idx, entry_idx, policy | Spawn lane
0x21 LYIELD |                       | Yield current lane
0x22 LSLEEP | nanos                 | Sleep lane
0x23 LKILL  | lane_idx              | Kill lane
0x30 EPUB   | domain_idx, topic_idx, payload_idx | Publish event
0x31 ESUB   | domain_idx, prefix_idx | Subscribe
0x32 EWAIT  | sub_idx, timeout      | Wait for event
0x40 SMAP   | domain_idx, name_idx, size, perms | Map state
0x41 SREAD  | handle_idx, offset, len | Read state
0x42 SWRITE | handle_idx, offset, data_idx | Write state
0x50 APUT   | domain_idx, space_idx, key_idx, value_idx | Put assoc
0x51 AGET   | domain_idx, space_idx, key_idx | Get assoc
0x52 AQUERY | domain_idx, space_idx, query_idx | Query assoc
0x60 CNOW   |                       | Push current time
0x61 CSLEEP | nanos                 | Sleep until
```

This enables:
- Portable cognitive programs
- Hot-reload without recompilation
- Substrate-agnostic distribution
