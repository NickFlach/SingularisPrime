# Changelog

All notable changes to Singularis Prime will be documented in this file.

## [0.1.0] - 2026-01-17

### Added

**MSI v1.0 - Minimal Substrate Interface**
- Core type definitions (Lanes, Domains, Events, State, Assoc, Clock)
- Capability discovery (`version()`, `capabilities()`, `attest()`)
- Domain management (`domainCreate`, `domainGrant`, `domainSeal`)
- Lane execution (`laneSpawn`, `laneYield`, `laneSleepNanos`, `laneKill`)
- Event system (`eventPublish`, `eventSubscribe`, `eventWait`)
- Addressable state (`stateMap`, `stateRead`, `stateWrite`, `stateCommit`)
- Associative memory (`assocPut`, `assocGet`, `assocQuery`, `assocForget`)
- Clock operations (`clockNowNanos`, `clockSleepUntilNanos`)

**Android Backend**
- `AndroidMsi` - Full MSI implementation using Kotlin coroutines
- `EventBus` - Topic-prefix based pub/sub
- `DomainManager` - Capability-based security
- `StateStore` - Addressable byte buffers
- `AssocStore` - Associative memory with vector similarity search
- NDK native state module for high-performance buffers

**Shinobi.Substrate**
- SP language specification
- Lowering rules (SP → MSI)
- Cognitive primitives documentation

**Documentation**
- Architecture overview
- Boot sequence documentation
- Cognitive primitives guide
- MSI formal specification

**Examples**
- Hello Substrate - First cognitive program

### Infrastructure
- Gradle build system for Android
- CMake for NDK builds
- Git configuration

## [Unreleased]

### Planned
- Linux backend (LinuxMsi)
- SP compiler/interpreter
- NNAPI integration for embeddings
- Persistence layer (Room/SQLite)
- ANN index for vector queries (HNSW/USearch)
- Hardware attestation support
