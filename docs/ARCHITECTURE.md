# Singularis Prime Architecture

## Overview

Singularis Prime is an AI-native operating system substrate designed to run cognitive programs on any hardware—from existing Android phones to future neuromorphic chips.

```
┌─────────────────────────────────────────────────────────────────┐
│                    COGNITIVE APPLICATIONS                        │
│  (Perception Loops, Memory Weaving, Attention, Decision Making) │
└────────────────────────────────┬────────────────────────────────┘
                                 │
┌────────────────────────────────▼────────────────────────────────┐
│                   SHINOBI.SUBSTRATE (SP)                        │
│  domain { }  lane { }  listen()  emit()  memory()  state()     │
└────────────────────────────────┬────────────────────────────────┘
                                 │ Lowering
┌────────────────────────────────▼────────────────────────────────┐
│                    MSI v1.0 INTERFACE                           │
│  Lanes | Events | State | Assoc | Domains | Clock              │
└────────────────────────────────┬────────────────────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         ▼                       ▼                       ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│  AndroidMsi     │   │   LinuxMsi      │   │  BareMetalMsi   │
│  (Kotlin/NDK)   │   │   (Rust/C)      │   │  (Assembly/C)   │
└────────┬────────┘   └────────┬────────┘   └────────┬────────┘
         │                     │                     │
         ▼                     ▼                     ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│   Android       │   │     Linux       │   │  Neuromorphic   │
│   Coroutines    │   │   Threads       │   │    Silicon      │
│   NNAPI         │   │   io_uring      │   │    NPU/DSP      │
└─────────────────┘   └─────────────────┘   └─────────────────┘
```

## Core Concepts

### 1. The Reset Contract

Every substrate must fulfill the **Cognitive Reset Contract**:

```yaml
substrate:
  execution_lanes: ≥1 deterministic
  state_model: addressable | associative | hybrid
  time_source: monotonic | event-based
  persistence: optional
```

This is the modern equivalent of a reset vector—the minimum guarantees any cognitive system needs.

### 2. MSI (Minimal Substrate Interface)

MSI defines **6 primitive categories**:

| Category | Purpose | Examples |
|----------|---------|----------|
| **Lanes** | Execution contexts | spawn, yield, sleep, kill |
| **Events** | Salience/signaling | publish, subscribe, wait |
| **State** | Addressable memory | map, read, write, commit |
| **Assoc** | Associative memory | put, get, query, forget |
| **Domains** | Capability containers | create, grant, seal |
| **Clock** | Time management | now, sleep_until |

### 3. Domains (Capability-Based Security)

Domains are sandboxed capability containers:

```kotlin
val scoutDomain = msi.domainCreate(
    DomainManifest(
        name = "Scout",
        grants = listOf(
            Grant.Events("sensor/"),    // Can access sensor/* topics
            Grant.Assoc("working", RW), // Can read/write "working" memory
            Grant.Clock                 // Can access time
        ),
        seal = true                     // No more grants allowed
    )
)
```

### 4. Lanes (Cognitive Loops)

Lanes are execution contexts—think threads, but designed for cognitive patterns:

```kotlin
msi.registerEntrypoint("Perception") { laneId ->
    val sub = msi.eventSubscribe(domain, "sensor/")
    while (true) {
        val event = msi.eventWait(sub)
        msi.eventPublish(domain, "percept/frame", process(event))
    }
}

msi.laneSpawn(domain, "Perception", LanePolicy(priority = HIGH))
```

### 5. Events (Salience System)

Events replace interrupts with a topic-based pub/sub system:

```
sensor/camera → percept/frame → attention/focus → action/motor
```

### 6. Associative Memory

Beyond traditional addressable memory, MSI provides associative storage:

```kotlin
// Store with embedding
msi.assocPut(domain, "working", "mem_123", AssocValue(
    bytes = embedding,
    meta = mapOf("source" to "camera")
))

// Semantic query
val results = msi.assocQuery(domain, "working", AssocQuery(
    k = 5,
    vector = queryEmbedding
))
```

## Layer Details

### Layer 0: Hardware Promise

The **contract.yaml** defines what any substrate must provide:

- At least 1 deterministic execution lane
- Addressable and/or associative state
- Monotonic or event-based time
- Minimal I/O channel

### Layer 1: MSI Implementation

Each platform implements `MSI`:

| Platform | Lanes | Events | State | Assoc |
|----------|-------|--------|-------|-------|
| Android | Coroutines | SharedFlow | ByteBuffer | HashMap + ANN |
| Linux | pthreads | epoll/io_uring | mmap | RocksDB + FAISS |
| Bare Metal | Fibers | Interrupt queue | DMA | Custom |

### Layer 2: Shinobi.Substrate

The SP language compiles to MSI:

```sp
domain "Scout" {
    grant Events("sensor/")
    seal true
}

lane "Perception" in "Scout" policy { priority high } {
    sub = listen("sensor/")
    loop {
        e = await sub
        emit("percept/frame", e.payload)
    }
}
```

### Layer 3: Cognitive Applications

Applications built on SP primitives:

- **Perception systems**: Sensor → Feature → Object
- **Memory systems**: Short-term → Working → Long-term
- **Attention systems**: Salience → Focus → Action
- **Decision systems**: Perception → Deliberation → Motor

## Data Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Sensors   │────▶│  Perception │────▶│   Memory    │
│ (Camera,etc)│     │   Lanes     │     │   Lanes     │
└─────────────┘     └──────┬──────┘     └──────┬──────┘
                          │                    │
                          ▼                    ▼
                   ┌─────────────┐     ┌─────────────┐
                   │  Attention  │◀───▶│  Associative│
                   │   Lanes     │     │   Memory    │
                   └──────┬──────┘     └─────────────┘
                          │
                          ▼
                   ┌─────────────┐     ┌─────────────┐
                   │  Decision   │────▶│   Actions   │
                   │   Lanes     │     │ (Motor,etc) │
                   └─────────────┘     └─────────────┘
```

## Security Model

1. **Capabilities, not permissions**: Domains hold capabilities
2. **Sealing**: Once sealed, no new capabilities can be added
3. **Least privilege**: Domains only get what they need
4. **Attestation**: Optional hardware-backed trust

## Growth Path

| Phase | Target | Deliverable |
|-------|--------|-------------|
| A | Android App | MSI runtime + example |
| B | SP Compiler | Lang → MSI bytecode |
| C | NPU Integration | NNAPI/vendor delegates |
| D | Linux Port | LinuxMsi implementation |
| E | Microkernel | Bare metal substrate |
| F | Neuromorphic | Spike-based events |

## Classical → AI-Native Translation

| Classical OS | Singularis Prime |
|--------------|------------------|
| Thread | Lane |
| Process | Domain |
| Interrupt | Event |
| Memory | State |
| File System | Associative Memory |
| Syscall | MSI Operation |
| Scheduler | Lane Policy |
| Permission | Grant |
