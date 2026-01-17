# MSI v1.0 Specification

**Minimal Substrate Interface** - The hardware promise layer for AI-native operating systems.

## Abstract

MSI defines the minimal set of primitives any substrate must implement to host cognitive programs. It abstracts away silicon specifics (CPU, GPU, NPU, neuromorphic) while preserving the essential capabilities needed for perception, memory, attention, and action.

## 1. Design Principles

### 1.1 Hardware Agnostic
MSI makes no assumptions about:
- Instruction set architecture (x86, ARM, RISC-V, spiking)
- Memory model (von Neumann, Harvard, neuromorphic)
- Execution model (threads, fibers, event loops, spike trains)

### 1.2 Cognitive First
Primitives are designed for cognitive patterns:
- **Lanes** for continuous perception loops
- **Events** for salience-driven attention
- **Assoc** for semantic memory retrieval

### 1.3 Capability Secure
- Domains enforce least-privilege
- Sealing prevents privilege escalation
- Attestation enables trust verification

## 2. Type Definitions

### 2.1 Identifiers
```
LaneId      ::= string   // Execution context ID
DomainId    ::= string   // Capability container ID
StateHandle ::= string   // Addressable region ID
AssocSpace  ::= string   // Associative memory namespace
SubId       ::= string   // Event subscription ID
EventId     ::= string   // Event instance ID
```

### 2.2 Enumerations
```
ClockModel    ::= "monotonic" | "event"
StateModel    ::= "addressable" | "associative" | "hybrid"
EventModel    ::= "queue" | "topic" | "signal"
SecurityModel ::= "none" | "app-sandbox" | "tee" | "se"
QoS           ::= "best-effort" | "at-least-once" | "exactly-once"
Priority      ::= "low" | "normal" | "high" | "realtime"
EnergyBudget  ::= "low" | "balanced" | "unbounded"
Affinity      ::= "any" | "little" | "big" | "npu"
Perms         ::= "r" | "rw"
```

### 2.3 Structures

**Capabilities**
```
Caps {
  lanes: LaneCaps {
    min: int >= 1
    max: int?
    realtime: bool
  }
  events: EventCaps {
    model: EventModel
    maxTopics: int?
  }
  state: StateCaps {
    model: StateModel
    maxBytes: int?
  }
  clock: ClockCaps {
    model: ClockModel
  }
  security: SecurityCaps {
    model: SecurityModel
    attest: bool
  }
  accel: AccelCaps {
    cpu: true
    gpu: bool?
    npu: bool?
    dsp: bool?
  }
}
```

**Lane Policy**
```
LanePolicy {
  priority: Priority
  energyBudget: EnergyBudget?
  affinity: Affinity?
}
```

**Domain Manifest**
```
DomainManifest {
  name: string
  grants: Grant[]
  seal: bool
}

Grant ::=
  | { kind: "events", topicPrefix: string }
  | { kind: "state", name: string, perms: Perms }
  | { kind: "assoc", space: string, perms: Perms }
  | { kind: "clock" }
  | { kind: "accel", which: "cpu" | "gpu" | "npu" | "dsp" }
```

**Event**
```
Event {
  id: EventId
  topic: string
  tsNanos: int64
  payload: bytes
  meta: map<string, string>?
}
```

**Associative Value**
```
AssocValue {
  bytes: bytes
  meta: map<string, string>?
  tsNanos: int64?
}

AssocQuery {
  k: int
  vector: float[]?
  predicate: string?
}

AssocResult {
  key: string
  score: float?
  value: AssocValue?
}
```

## 3. Interface Operations

### 3.1 Discovery

| Operation | Signature | Description |
|-----------|-----------|-------------|
| `version` | `() -> Semver` | MSI version |
| `capabilities` | `() -> Caps` | Substrate capabilities |
| `attest` | `() -> Attestation` | Hardware attestation (optional) |

### 3.2 Clock

| Operation | Signature | Description |
|-----------|-----------|-------------|
| `clockNowNanos` | `() -> int64` | Current time in nanoseconds |
| `clockSleepUntilNanos` | `(t: int64) -> void` | Sleep until time t |
| `clockBindEventClock` | `(topic: string) -> void` | Bind to event-based clock (optional) |

### 3.3 Domains

| Operation | Signature | Description |
|-----------|-----------|-------------|
| `domainCreate` | `(manifest: DomainManifest) -> DomainId` | Create domain |
| `domainGrant` | `(domain: DomainId, grant: Grant) -> void` | Add capability |
| `domainSeal` | `(domain: DomainId) -> void` | Prevent further grants |

### 3.4 Lanes

| Operation | Signature | Description |
|-----------|-----------|-------------|
| `laneSpawn` | `(domain: DomainId?, entry: string, policy: LanePolicy) -> LaneId` | Spawn lane |
| `laneYield` | `(lane: LaneId) -> void` | Cooperative yield |
| `laneSleepNanos` | `(lane: LaneId, nanos: int64) -> void` | Sleep lane |
| `laneKill` | `(lane: LaneId) -> void` | Terminate lane |
| `laneSetPolicy` | `(lane: LaneId, policy: LanePolicy) -> void` | Update policy |

### 3.5 Events

| Operation | Signature | Description |
|-----------|-----------|-------------|
| `eventPublish` | `(domain: DomainId?, topic: string, payload: bytes, qos: QoS, meta?: map) -> EventId` | Publish event |
| `eventSubscribe` | `(domain: DomainId?, prefix: string, filter?: string) -> SubId` | Subscribe to topic |
| `eventWait` | `(sub: SubId, timeout?: int64) -> Event?` | Wait for event |
| `eventAck` | `(eventId: EventId) -> void` | Acknowledge event (optional) |

### 3.6 Addressable State

| Operation | Signature | Description |
|-----------|-----------|-------------|
| `stateMap` | `(domain: DomainId?, name: string, bytes: int, perms: Perms) -> StateHandle` | Map region |
| `stateRead` | `(handle: StateHandle, offset: int, len: int) -> bytes` | Read bytes |
| `stateWrite` | `(handle: StateHandle, offset: int, data: bytes) -> void` | Write bytes |
| `stateCommit` | `(handle: StateHandle) -> void` | Commit to storage |

### 3.7 Associative State

| Operation | Signature | Description |
|-----------|-----------|-------------|
| `assocPut` | `(domain: DomainId?, space: string, key: string, value: AssocValue) -> void` | Store value |
| `assocGet` | `(domain: DomainId?, space: string, key: string) -> AssocValue?` | Retrieve value |
| `assocQuery` | `(domain: DomainId?, space: string, query: AssocQuery) -> AssocResult[]` | Semantic query |
| `assocForget` | `(domain: DomainId?, space: string, keyOrPolicy: string) -> void` | Forget value(s) |

## 4. Conformance Requirements

### 4.1 Minimum Requirements
A conforming MSI implementation MUST:
- Support at least 1 lane (`caps.lanes.min >= 1`)
- Implement monotonic or event-based clock
- Implement at least addressable OR associative state
- Implement topic-based events

### 4.2 Optional Features
- Hardware attestation (`caps.security.attest`)
- GPU/NPU/DSP acceleration (`caps.accel.*`)
- Realtime lane scheduling (`caps.lanes.realtime`)
- Exactly-once event delivery

## 5. Security Model

### 5.1 Capability Hierarchy
```
ROOT (all capabilities)
  └── APP_DOMAIN_A (subset, sealed)
  └── APP_DOMAIN_B (subset, sealed)
  └── KERNEL_DOMAIN (subset, unsealed)
```

### 5.2 Grant Semantics
- `Events(prefix)`: Can publish/subscribe to `prefix*` topics
- `State(name, perms)`: Can access state region `name` with `perms`
- `Assoc(space, perms)`: Can access assoc space `space` with `perms`
- `Clock`: Can access time operations
- `Accel(which)`: Can use specified accelerator

### 5.3 Sealing
Once a domain is sealed:
- No new grants can be added
- Existing grants cannot be modified
- Domain cannot be unsealed

## 6. Error Handling

### 6.1 Error Conditions
| Condition | Response |
|-----------|----------|
| Unknown domain | Error: "Unknown domain: {id}" |
| Domain sealed | Error: "Domain sealed: {name}" |
| Permission denied | Error: "Domain not allowed: {operation}" |
| Invalid handle | Error: "Unknown handle: {handle}" |
| Out of bounds | Error: "Access out of bounds" |
| Unknown entrypoint | Error: "Unknown entrypoint: {name}" |

### 6.2 Recovery
- Lane failures should not crash the substrate
- Event delivery failures use QoS semantics
- State corruption should be detectable

## 7. Future Extensions

### 7.1 Neuromorphic (v1.1)
- Spike events with timing
- Synaptic state model
- Attention budgets

### 7.2 Distributed (v1.2)
- Remote domain references
- Event federation
- Consensus operations

### 7.3 Quantum (v2.0)
- Qubit state regions
- Entanglement events
- Measurement operations
