# Singularis Prime Boot Sequence

## Overview

Unlike classical operating systems that start with assembly reset vectors, Singularis Prime starts with a **Cognitive Reset Contract**—a set of guarantees the substrate must fulfill before cognitive programs can run.

```
┌─────────────────────────────────────────────────────────────────┐
│                      POWER ON / INIT                            │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│              PHASE 0: SUBSTRATE PROBE                           │
│  • Query capabilities                                           │
│  • Verify MSI minimum requirements                              │
│  • Optional: Hardware attestation                               │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│              PHASE 1: ROOT DOMAIN                               │
│  • Create root/host domain                                      │
│  • Grant all capabilities                                       │
│  • Initialize clock binding                                     │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│              PHASE 2: STATE INITIALIZATION                      │
│  • Map core state regions                                       │
│  • Initialize associative memory spaces                         │
│  • Bind clock source                                            │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│              PHASE 3: EVENT SYSTEM                              │
│  • Initialize event bus                                         │
│  • Register core topics                                         │
│  • Set up system event handlers                                 │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│              PHASE 4: COGNITIVE BOOTSTRAP                       │
│  • Register kernel entrypoints                                  │
│  • Spawn kernel lanes                                           │
│  • Enter main cognitive loop                                    │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│              PHASE 5: APPLICATION DOMAINS                       │
│  • Load application manifests                                   │
│  • Create sandboxed domains                                     │
│  • Spawn application lanes                                      │
└─────────────────────────────────────────────────────────────────┘
```

## Phase Details

### Phase 0: Substrate Probe

The first thing any Singularis Prime system does is interrogate the substrate:

```kotlin
// Query substrate
val version = msi.version()
val caps = msi.capabilities()

// Verify minimum requirements
require(caps.lanes.min >= 1) { "MSI VIOLATION: No execution lanes" }
require(caps.state.model != null) { "MSI VIOLATION: No state model" }
require(caps.clock.model != null) { "MSI VIOLATION: No clock" }

// Log substrate identity
log("[BOOT] Substrate v${version}")
log("[BOOT] Lanes: ${caps.lanes.min}-${caps.lanes.max ?: "∞"}")
log("[BOOT] State: ${caps.state.model}")
log("[BOOT] Clock: ${caps.clock.model}")

// Optional: Hardware attestation
if (caps.security.attest) {
    val attestation = msi.attest()
    log("[BOOT] Attestation: ${attestation.provider}")
}
```

### Phase 1: Root Domain

Create the root domain with all capabilities:

```kotlin
val rootDomain = msi.domainCreate(
    DomainManifest(
        name = "kernel",
        grants = listOf(
            Grant.Events("*"),           // All topics
            Grant.State("*", RW),        // All state
            Grant.Assoc("*", RW),        // All memory
            Grant.Clock,
            Grant.Accel(CPU),
            Grant.Accel(GPU),
            Grant.Accel(NPU)
        ),
        seal = false  // Kernel can grant more later
    )
)
```

### Phase 2: State Initialization

Map core state regions:

```kotlin
// Kernel scratch space
val kernelState = msi.stateMap(rootDomain, "kernel.scratch", 1024 * 1024, RW)

// System configuration
val configState = msi.stateMap(rootDomain, "system.config", 64 * 1024, R)

// Initialize associative memory spaces
// (These are created on-demand, but we can prime them)
msi.assocPut(rootDomain, "system.registry", "boot.time", AssocValue(
    bytes = msi.clockNowNanos().toByteArray(),
    meta = mapOf("type" to "timestamp")
))
```

### Phase 3: Event System

Initialize the event topology:

```kotlin
// Core system topics
val systemTopics = listOf(
    "system/boot",
    "system/shutdown",
    "system/error",
    "kernel/lane/spawn",
    "kernel/lane/exit",
    "kernel/domain/create",
    "sensor/*",
    "percept/*",
    "attention/*",
    "action/*"
)

// Publish boot event
msi.eventPublish(
    rootDomain,
    "system/boot",
    "Singularis Prime ${version}".toByteArray(),
    QoS.BEST_EFFORT,
    mapOf("ts" to msi.clockNowNanos().toString())
)
```

### Phase 4: Cognitive Bootstrap

Register and spawn kernel lanes:

```kotlin
// Lane Registry: monitors lane lifecycle
msi.registerEntrypoint("kernel.registry") { laneId ->
    val sub = msi.eventSubscribe(rootDomain, "kernel/lane/")
    while (true) {
        val event = msi.eventWait(sub)
        // Track lane spawns and exits
        when {
            event.topic.endsWith("/spawn") -> registerLane(event)
            event.topic.endsWith("/exit") -> unregisterLane(event)
        }
    }
}

// Error Handler: catches and logs errors
msi.registerEntrypoint("kernel.errors") { laneId ->
    val sub = msi.eventSubscribe(rootDomain, "system/error")
    while (true) {
        val event = msi.eventWait(sub)
        logError(event)
        // Optionally: restart failed lanes
    }
}

// Spawn kernel lanes
msi.laneSpawn(rootDomain, "kernel.registry", LanePolicy(priority = HIGH))
msi.laneSpawn(rootDomain, "kernel.errors", LanePolicy(priority = HIGH))
```

### Phase 5: Application Domains

Load and sandbox applications:

```kotlin
// Load application manifest
val appManifest = loadManifest("com.example.app")

// Create sandboxed domain
val appDomain = msi.domainCreate(
    DomainManifest(
        name = appManifest.name,
        grants = appManifest.requestedGrants.filter { isAllowed(it) },
        seal = true  // No runtime capability expansion
    )
)

// Register and spawn application lanes
for (lane in appManifest.lanes) {
    msi.registerEntrypoint(lane.name, lane.entrypoint)
    msi.laneSpawn(appDomain, lane.name, lane.policy)
}
```

## Classical vs Singularis Prime Boot

| Classical OS | Singularis Prime |
|--------------|------------------|
| BIOS/UEFI | Substrate Probe |
| Reset Vector | Cognitive Reset Contract |
| Bootloader | Root Domain Creation |
| Kernel Init | Event System Init |
| Init Process | Kernel Lanes |
| User Processes | Application Domains |

## Minimal Boot (Android)

On Android, the "boot" happens when your app starts:

```kotlin
class SingularisApplication : Application() {
    
    lateinit var substrate: AndroidMsi
    
    override fun onCreate() {
        super.onCreate()
        
        // Phase 0-1: Create substrate
        substrate = AndroidMsi(applicationScope)
        
        // Phase 2-3: Verify and init
        bootstrapSubstrate(substrate)
        
        // Phase 4-5: Load cognitive programs
        loadCognitivePrograms(substrate)
    }
}
```

## Future: Bare Metal Boot

When targeting bare metal (neuromorphic chips, custom hardware):

```asm
; boot.s - The very first instruction
.section .text.boot
.global _start

_start:
    ; Disable interrupts
    cpsid i
    
    ; Set stack pointer
    ldr sp, =_stack_top
    
    ; Clear BSS
    bl clear_bss
    
    ; Jump to MSI bootstrap
    bl msi_bootstrap
    
    ; Enter cognitive loop (never returns)
    bl cognitive_main
    
    ; If we get here, halt
halt:
    wfi
    b halt
```

Then in C:

```c
void msi_bootstrap(void) {
    // Initialize hardware
    init_clock();
    init_memory();
    init_interrupts();
    
    // Create MSI instance
    msi_t* msi = msi_create();
    
    // Verify contract
    msi_caps_t caps = msi_capabilities(msi);
    assert(caps.lanes_min >= 1);
    
    // Hand off to cognitive bootstrap
    cognitive_bootstrap(msi);
}
```

## Boot Events Timeline

```
T=0ms     POWER_ON
T=1ms     SUBSTRATE_PROBE
T=2ms     ROOT_DOMAIN_CREATED
T=3ms     STATE_MAPPED
T=4ms     EVENT_BUS_READY
T=5ms     KERNEL_LANES_SPAWNED
T=10ms    system/boot EVENT
T=50ms    FIRST_APP_DOMAIN
T=100ms   COGNITIVE_LOOP_ACTIVE
```

## Error Recovery

If boot fails at any phase:

1. **Phase 0 fail**: Hardware incompatible → halt
2. **Phase 1 fail**: Domain creation failed → retry or halt
3. **Phase 2 fail**: Memory unavailable → reduce footprint
4. **Phase 3 fail**: Event system broken → reinitialize
5. **Phase 4 fail**: Lane spawn failed → log and continue
6. **Phase 5 fail**: App sandbox fail → skip app, continue
