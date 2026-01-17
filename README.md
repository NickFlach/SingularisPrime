# Singularis Prime OS

An AI-native operating system substrate designed for neuromorphic and cognitive computing.

## Philosophy

Operating systems do not start as software. They start as a **truce with physics**.

The first file is not an app, a UI, or even an OS file. It's the code that the CPU is forced to run when power turns on. Everything else grows outward from that unavoidable fact.

## Architecture

### Layer 0: Hardware Promise (MSI - Minimal Substrate Interface)

Instead of binding to specific silicon (ARM, x86, RISC-V, neuromorphic), we define **contracts** that any substrate must fulfill:

- **Execution Lanes**: At least one deterministic execution context
- **Events**: Interrupt/spike/signal/message system
- **State**: Addressable memory or associative/synaptic store
- **Clock**: Monotonic time or event-driven timebase
- **Domains**: Sandboxed namespaces for lanes + state + permissions

### Layer 1: Cognitive Reset Contract

When power is applied, the system must present these guarantees:

```yaml
substrate:
  execution_lanes: ≥1 deterministic
  state_model: addressable | associative | hybrid
  time_source: monotonic | event-based
  persistence: optional
```

### Layer 2: MSI v1.0 (Minimal Substrate Interface)

The canonical "hardware promise" surface that any backend must implement:

- **Capability Discovery**: `msi.version()`, `msi.capabilities()`, `msi.attest()`
- **Execution**: `lane.spawn()`, `lane.yield()`, `lane.sleep()`, `lane.kill()`
- **Events**: `event.publish()`, `event.subscribe()`, `event.wait()`
- **State**: `state.map()`, `state.read()`, `state.write()`, `state.commit()`
- **Associative**: `assoc.put()`, `assoc.get()`, `assoc.query()`, `assoc.forget()`
- **Domains**: `domain.create()`, `domain.grant()`, `domain.seal()`

### Layer 3: Shinobi.Substrate (Singularis Prime Kernel Module)

SP code doesn't call Android/Linux directly. It calls MSI. The backend is just one substrate implementation.

```sp
domain "Scout" {
  grant Events("sensor/")
  grant Assoc("working", rw)
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

## Project Structure

```
SingularisPrime/
├── msi/                    # MSI v1.0 specification
│   ├── contract.yaml       # Hardware promise document
│   ├── idl.ts             # Reference IDL (TypeScript)
│   └── spec.md            # Formal specification
├── android/               # Android backend implementation
│   ├── msi-android/       # Kotlin MSI implementation
│   └── msi-native/        # NDK fast buffers
├── substrate/             # Shinobi.Substrate kernel
│   ├── spec.sp            # SP module contract
│   └── lowering.md        # SP → MSI compilation rules
├── examples/              # Example cognitive programs
│   └── hello-substrate/   # First "Hello World"
└── docs/                  # Documentation
    ├── ARCHITECTURE.md
    ├── BOOT_SEQUENCE.md
    └── COGNITIVE_PRIMITIVES.md
```

## First Three Files

Your first three files in this architecture are:

1. **`msi/contract.yaml`** - CPU awakening contract
2. **`msi/idl.ts`** - Memory reality / interface definition
3. **`substrate/kernel.sp`** - First abstraction

## Growth Path

| Stage | Goal |
|-------|------|
| A | MSI runtime in Android app |
| B | SP-to-MSI bridge/compiler |
| C | Sensor + NPU integration |
| D | System-level evolution (bare metal/microkernel) |

## License

MIT
