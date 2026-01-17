/**
 * MSI v1.0 - Minimal Substrate Interface
 * Reference IDL (Language-agnostic specification)
 * 
 * This defines the canonical "hardware promise" surface.
 * Translate to Kotlin/Swift/Rust as needed for each backend.
 */

// =============================================================================
// BASIC TYPES
// =============================================================================

export type Semver = { major: number; minor: number; patch: number };

export type ClockModel = "monotonic" | "event";
export type StateModel = "addressable" | "associative" | "hybrid";
export type EventModel = "queue" | "topic" | "signal";
export type SecurityModel = "none" | "app-sandbox" | "tee" | "se";

export type AccelCaps = {
  cpu: true;
  gpu?: boolean;
  npu?: boolean;
  dsp?: boolean;
};

export type LaneCaps = {
  min: number;          // must be >= 1
  max?: number;         // optional upper bound
  realtime?: boolean;   // "best effort" on mobile
};

export type Caps = {
  lanes: LaneCaps;
  events: { model: EventModel; maxTopics?: number };
  state: { model: StateModel; maxBytes?: number };
  clock: { model: ClockModel };
  security: { model: SecurityModel; attest?: boolean };
  accel: AccelCaps;
};

export type Attestation = {
  present: boolean;
  provider?: string; // "play-integrity" | "key-attestation" | ...
  token?: string;    // opaque
};

// =============================================================================
// HANDLE TYPES
// =============================================================================

export type LaneId = string;
export type DomainId = string;
export type StateHandle = string;
export type AssocSpace = string;
export type SubId = string;
export type EventId = string;

// =============================================================================
// QOS & POLICIES
// =============================================================================

export type QoS = "best-effort" | "at-least-once" | "exactly-once";

export type LanePolicy = {
  priority: "low" | "normal" | "high" | "realtime";
  energyBudget?: "low" | "balanced" | "unbounded";
  affinity?: "any" | "little" | "big" | "npu";
};

// =============================================================================
// DOMAIN GRANTS
// =============================================================================

export type Grant =
  | { kind: "events"; topicPrefix: string }
  | { kind: "state"; name: string; perms: "r" | "rw" }
  | { kind: "assoc"; space: string; perms: "r" | "rw" }
  | { kind: "clock" }
  | { kind: "accel"; which: "cpu" | "gpu" | "npu" | "dsp" };

export type DomainManifest = {
  name: string;
  grants: Grant[];
  seal: boolean;
};

// =============================================================================
// EVENT TYPES
// =============================================================================

export type Event = {
  id: EventId;
  topic: string;
  tsNanos: bigint;
  payload: Uint8Array;         // bytes; higher layers define schemas
  meta?: Record<string, string>;
};

// =============================================================================
// ASSOCIATIVE STATE TYPES
// =============================================================================

export type AssocValue = {
  bytes: Uint8Array;           // could be embedding, JSON, etc.
  meta?: Record<string, string>;
  tsNanos?: bigint;
};

export type AssocQuery = {
  // one of:
  vector?: Float32Array;       // for semantic/embedding queries
  predicate?: string;          // simple DSL (optional)
  k: number;                   // top-k results
};

export type AssocResult = {
  key: string;
  score?: number;              // if vector query
  value?: AssocValue;
};

// =============================================================================
// MSI INTERFACE
// =============================================================================

export interface MSI {
  // -------------------------------------------------------------------------
  // Capability Discovery
  // -------------------------------------------------------------------------
  
  /** Returns the MSI version implemented by this substrate */
  version(): Semver;
  
  /** Returns the capabilities of this substrate */
  capabilities(): Caps;
  
  /** Optional: Returns attestation proof for this substrate */
  attest?(): Promise<Attestation>;

  // -------------------------------------------------------------------------
  // Clock
  // -------------------------------------------------------------------------
  
  /** Returns current time in nanoseconds (monotonic) */
  clockNowNanos(): bigint;
  
  /** Sleeps until the specified time (nanoseconds) */
  clockSleepUntilNanos(t: bigint): Promise<void>;
  
  /** Optional: Binds clock to event topic (for event-driven time) */
  clockBindEventClock?(topic: string): void;

  // -------------------------------------------------------------------------
  // Domains (Capability Containers)
  // -------------------------------------------------------------------------
  
  /** Creates a new domain with the given manifest */
  domainCreate(manifest: DomainManifest): DomainId;
  
  /** Grants additional capability to a domain (if not sealed) */
  domainGrant(domain: DomainId, grant: Grant): void;
  
  /** Seals a domain, preventing further capability grants */
  domainSeal(domain: DomainId): void;

  // -------------------------------------------------------------------------
  // Lanes (Execution Contexts)
  // -------------------------------------------------------------------------
  
  /** Spawns a new lane (execution context) */
  laneSpawn(domain: DomainId | null, entrypoint: string, policy: LanePolicy): LaneId;
  
  /** Yields the current lane (cooperative scheduling) */
  laneYield(lane: LaneId): void;
  
  /** Sleeps the lane for the specified duration */
  laneSleepNanos(lane: LaneId, nanos: bigint): Promise<void>;
  
  /** Terminates a lane */
  laneKill(lane: LaneId): void;
  
  /** Updates the policy of a running lane */
  laneSetPolicy(lane: LaneId, policy: Partial<LanePolicy>): void;

  // -------------------------------------------------------------------------
  // Events (Salience System)
  // -------------------------------------------------------------------------
  
  /** Publishes an event to a topic */
  eventPublish(
    domain: DomainId | null,
    topic: string,
    payload: Uint8Array,
    qos: QoS,
    meta?: Record<string, string>
  ): EventId;
  
  /** Subscribes to events matching a topic prefix */
  eventSubscribe(
    domain: DomainId | null,
    topicPrefix: string,
    filterExpr?: string
  ): SubId;
  
  /** Waits for the next event on a subscription */
  eventWait(sub: SubId, timeoutNanos?: bigint): Promise<Event | null>;
  
  /** Optional: Acknowledges an event (for at-least-once QoS) */
  eventAck?(eventId: EventId): void;

  // -------------------------------------------------------------------------
  // Addressable State
  // -------------------------------------------------------------------------
  
  /** Maps a named state region */
  stateMap(
    domain: DomainId | null,
    name: string,
    bytes: number,
    perms: "r" | "rw"
  ): StateHandle;
  
  /** Reads from a state region */
  stateRead(handle: StateHandle, offset: number, len: number): Uint8Array;
  
  /** Writes to a state region */
  stateWrite(handle: StateHandle, offset: number, data: Uint8Array): void;
  
  /** Commits state to durable storage (if supported) */
  stateCommit(handle: StateHandle): void;

  // -------------------------------------------------------------------------
  // Associative State (Memory/Embeddings/Synapses)
  // -------------------------------------------------------------------------
  
  /** Puts a value into associative memory */
  assocPut(
    domain: DomainId | null,
    space: AssocSpace,
    key: string,
    value: AssocValue
  ): void;
  
  /** Gets a value from associative memory */
  assocGet(
    domain: DomainId | null,
    space: AssocSpace,
    key: string
  ): AssocValue | null;
  
  /** Queries associative memory (vector search or predicate) */
  assocQuery(
    domain: DomainId | null,
    space: AssocSpace,
    q: AssocQuery
  ): AssocResult[];
  
  /** Forgets a key or applies a forgetting policy */
  assocForget(
    domain: DomainId | null,
    space: AssocSpace,
    keyOrPolicy: string
  ): void;
}

// =============================================================================
// TYPE GUARDS
// =============================================================================

export function isEventGrant(g: Grant): g is { kind: "events"; topicPrefix: string } {
  return g.kind === "events";
}

export function isStateGrant(g: Grant): g is { kind: "state"; name: string; perms: "r" | "rw" } {
  return g.kind === "state";
}

export function isAssocGrant(g: Grant): g is { kind: "assoc"; space: string; perms: "r" | "rw" } {
  return g.kind === "assoc";
}

export function isClockGrant(g: Grant): g is { kind: "clock" } {
  return g.kind === "clock";
}

export function isAccelGrant(g: Grant): g is { kind: "accel"; which: "cpu" | "gpu" | "npu" | "dsp" } {
  return g.kind === "accel";
}

// =============================================================================
// SUBSTRATE BOOTSTRAP
// =============================================================================

/**
 * Bootstrap sequence for any MSI substrate
 */
export async function bootstrapSubstrate(msi: MSI): Promise<void> {
  // Phase 0: Probe capabilities
  const caps = msi.capabilities();
  
  if (caps.lanes.min < 1) {
    throw new Error("MSI VIOLATION: Substrate must support at least 1 lane");
  }
  
  console.log(`[MSI] Substrate v${msi.version().major}.${msi.version().minor}.${msi.version().patch}`);
  console.log(`[MSI] Lanes: ${caps.lanes.min}-${caps.lanes.max ?? "∞"}`);
  console.log(`[MSI] State: ${caps.state.model}`);
  console.log(`[MSI] Clock: ${caps.clock.model}`);
  console.log(`[MSI] Security: ${caps.security.model}`);
  
  // Phase 1: Optional attestation
  if (caps.security.attest && msi.attest) {
    const attestation = await msi.attest();
    console.log(`[MSI] Attestation: ${attestation.present ? attestation.provider : "none"}`);
  }
  
  console.log("[MSI] Substrate bootstrap complete");
}
