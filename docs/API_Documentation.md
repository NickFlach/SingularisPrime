# SINet API Documentation

## Overview

This document provides comprehensive documentation for the SINet API, enabling developers to interact with the SINet platform, its distributed nodes, industrial devices, AI models, and blockchain governance systems across our East-West-NULL_ISLAND regional architecture.

## API Architecture

The SINet API follows a RESTful architecture with the following key characteristics:

- **Regional Endpoints** - Region-specific API endpoints for East, West, and NULL_ISLAND
- **Authentication** - Zero-knowledge proof-based identity verification
- **Content Types** - JSON for request/response bodies
- **Versioning** - API version specified in URL path
- **Rate Limiting** - Region and user-specific rate limits
- **Pagination** - Cursor-based pagination for large result sets
- **Webhooks** - Event-based notifications for asynchronous operations

### Base URLs

The SINet API is available at the following base URLs:

- **East Region:** `https://east.api.sinet.network/v1/`
- **West Region:** `https://west.api.sinet.network/v1/`
- **NULL_ISLAND:** `https://null-island.api.sinet.network/v1/`
- **Global (Load Balanced):** `https://api.sinet.network/v1/`

### Authentication

All API requests require authentication using the SINet identity system:

1. **API Keys** - Developer keys for application authentication
2. **Zero-Knowledge Proof** - Identity verification without revealing credentials
3. **JWT Tokens** - Short-lived access tokens for session management

Example authentication header:
```
Authorization: Bearer {access_token}
X-SINet-Region: east
X-SINet-ZKP-Proof: {zkp_verification_data}
```

## Core API Resources

### Node Management API

Endpoints for managing SINet compute nodes across regions.

#### List Nodes

```
GET /nodes
```

Query Parameters:
- `region` - Filter by region (east, west, null_island)
- `status` - Filter by node status
- `capacity` - Filter by available capacity
- `cursor` - Pagination cursor
- `limit` - Results per page (default: 20, max: 100)

Response:
```json
{
  "data": [
    {
      "id": 1,
      "name": "east-compute-01",
      "region": "east",
      "status": "online",
      "type": "compute",
      "capacity": {
        "cpu": 64,
        "memory": 512,
        "gpu": 8,
        "storage": 2048
      },
      "utilization": {
        "cpu": 45,
        "memory": 68,
        "gpu": 92,
        "storage": 54
      },
      "lastSeen": "2025-03-05T15:32:11Z",
      "ipAddress": "10.0.1.5",
      "tags": ["high-memory", "gpu-optimized"]
    }
  ],
  "meta": {
    "cursor": "eyJpZCI6MTB9",
    "hasMore": true,
    "count": 1,
    "total": 45
  }
}
```

#### Get Node Details

```
GET /nodes/{node_id}
```

Path Parameters:
- `node_id` - The unique identifier of the node

Response:
```json
{
  "id": 1,
  "name": "east-compute-01",
  "region": "east",
  "status": "online",
  "type": "compute",
  "capacity": {
    "cpu": 64,
    "memory": 512,
    "gpu": 8,
    "storage": 2048
  },
  "utilization": {
    "cpu": 45,
    "memory": 68,
    "gpu": 92,
    "storage": 54
  },
  "lastSeen": "2025-03-05T15:32:11Z",
  "ipAddress": "10.0.1.5",
  "tags": ["high-memory", "gpu-optimized"],
  "metrics": {
    "temperature": 62,
    "powerUsage": 1250,
    "networkIn": 125000000,
    "networkOut": 84000000
  },
  "hardware": {
    "cpuModel": "AMD EPYC 9654",
    "gpuModel": "NVIDIA H100",
    "memoryType": "DDR5-4800",
    "storageType": "NVMe SSD"
  },
  "containers": [
    {
      "id": "c-8765432",
      "name": "ai-training-job-1234",
      "status": "running",
      "startTime": "2025-03-05T12:30:00Z",
      "resourceUtilization": {
        "cpu": 58,
        "memory": 128,
        "gpu": 7
      }
    }
  ]
}
```

#### Update Node Status

```
PATCH /nodes/{node_id}
```

Path Parameters:
- `node_id` - The unique identifier of the node

Request Body:
```json
{
  "status": "maintenance",
  "maintenanceReason": "Scheduled hardware upgrade",
  "estimatedCompletionTime": "2025-03-06T10:00:00Z"
}
```

Response:
```json
{
  "id": 1,
  "name": "east-compute-01",
  "region": "east",
  "status": "maintenance",
  "maintenanceReason": "Scheduled hardware upgrade",
  "estimatedCompletionTime": "2025-03-06T10:00:00Z"
}
```

### Industrial Integration API

Endpoints for interacting with industrial systems and SCADA devices.

#### List SCADA Devices

```
GET /scada/devices
```

Query Parameters:
- `region` - Filter by region
- `vendor` - Filter by device vendor
- `protocol` - Filter by protocol
- `status` - Filter by device status
- `cursor` - Pagination cursor
- `limit` - Results per page (default: 20, max: 100)

Response:
```json
{
  "data": [
    {
      "id": 1,
      "name": "siemens-plc-01",
      "region": "east",
      "vendor": "Siemens",
      "model": "S7-1500",
      "protocol": "Profinet",
      "status": "connected",
      "lastSeen": "2025-03-05T15:30:00Z",
      "ipAddress": "10.0.50.5"
    }
  ],
  "meta": {
    "cursor": "eyJpZCI6MTB9",
    "hasMore": true
  }
}
```

#### Get SCADA Device Details

```
GET /scada/devices/{device_id}
```

Path Parameters:
- `device_id` - The unique identifier of the device

Response:
```json
{
  "id": 1,
  "name": "siemens-plc-01",
  "region": "east",
  "vendor": "Siemens",
  "model": "S7-1500",
  "protocol": "Profinet",
  "status": "connected",
  "lastSeen": "2025-03-05T15:30:00Z",
  "ipAddress": "10.0.50.5",
  "firmwareVersion": "V2.9.2",
  "securityLevel": "high",
  "location": {
    "facility": "Manufacturing Plant Alpha",
    "area": "Assembly Line 3",
    "coordinates": {
      "lat": 40.7128,
      "lng": -74.0060
    }
  },
  "readings": {
    "temperature": 72.5,
    "pressure": 101.3,
    "flow": 25.6,
    "voltage": 480.2
  },
  "tags": [
    {
      "name": "TEMP_SENSOR_1",
      "dataType": "float",
      "value": 72.5,
      "unit": "F",
      "timestamp": "2025-03-05T15:30:00Z",
      "quality": "good"
    },
    {
      "name": "PRESSURE_SENSOR_1",
      "dataType": "float",
      "value": 101.3,
      "unit": "kPa",
      "timestamp": "2025-03-05T15:30:00Z",
      "quality": "good"
    }
  ],
  "alarms": [
    {
      "id": "a-12345",
      "severity": "warning",
      "message": "Temperature approaching upper limit",
      "timestamp": "2025-03-05T15:25:30Z",
      "acknowledged": false
    }
  ]
}
```

#### Read Device Tag

```
GET /scada/devices/{device_id}/tags/{tag_name}
```

Path Parameters:
- `device_id` - The unique identifier of the device
- `tag_name` - The name of the tag to read

Response:
```json
{
  "name": "TEMP_SENSOR_1",
  "dataType": "float",
  "value": 72.5,
  "unit": "F",
  "timestamp": "2025-03-05T15:30:00Z",
  "quality": "good",
  "history": [
    {
      "value": 72.3,
      "timestamp": "2025-03-05T15:25:00Z",
      "quality": "good"
    },
    {
      "value": 72.1,
      "timestamp": "2025-03-05T15:20:00Z",
      "quality": "good"
    }
  ]
}
```

#### Write Device Tag

```
POST /scada/devices/{device_id}/tags/{tag_name}
```

Path Parameters:
- `device_id` - The unique identifier of the device
- `tag_name` - The name of the tag to write

Request Body:
```json
{
  "value": 70.0
}
```

Response:
```json
{
  "name": "TEMP_SETPOINT",
  "dataType": "float",
  "value": 70.0,
  "unit": "F",
  "timestamp": "2025-03-05T15:32:00Z",
  "quality": "good",
  "writeStatus": "success"
}
```

### AI Model API

Endpoints for working with AI models and training infrastructure.

#### List AI Models

```
GET /ai/models
```

Query Parameters:
- `region` - Filter by region
- `task` - Filter by model task/purpose
- `status` - Filter by model status
- `cursor` - Pagination cursor
- `limit` - Results per page (default: 20, max: 100)

Response:
```json
{
  "data": [
    {
      "id": 1,
      "name": "GPT-4o",
      "version": "1.0",
      "task": "text-generation",
      "status": "deployed",
      "region": "east",
      "deploymentDate": "2025-01-15T00:00:00Z",
      "metrics": {
        "accuracy": 0.95,
        "latency": 120,
        "throughput": 250
      }
    }
  ],
  "meta": {
    "cursor": "eyJpZCI6MTB9",
    "hasMore": true
  }
}
```

#### Get AI Model Details

```
GET /ai/models/{model_id}
```

Path Parameters:
- `model_id` - The unique identifier of the model

Response:
```json
{
  "id": 1,
  "name": "GPT-4o",
  "version": "1.0",
  "task": "text-generation",
  "status": "deployed",
  "region": "east",
  "deploymentDate": "2025-01-15T00:00:00Z",
  "architecture": "Transformer",
  "parameters": 1500000000000,
  "inputShape": {
    "sequence_length": 8192,
    "embedding_dim": 4096
  },
  "metrics": {
    "accuracy": 0.95,
    "latency": 120,
    "throughput": 250,
    "trainingTime": 15000,
    "gpuHours": 23000
  },
  "hardwareRequirements": {
    "minGpu": 4,
    "recommendedGpu": 8,
    "minMemory": 128,
    "recommendedMemory": 256
  },
  "deploymentInstances": [
    {
      "id": "i-12345",
      "node": "east-compute-03",
      "status": "running",
      "deployedAt": "2025-01-15T00:00:00Z",
      "replicas": 4
    }
  ],
  "trainingData": {
    "datasets": ["common-crawl", "books-corpus", "github-code"],
    "exampleCount": 1500000000,
    "dataPoints": 5000000000000
  }
}
```

#### Create Inference Request

```
POST /ai/models/{model_id}/infer
```

Path Parameters:
- `model_id` - The unique identifier of the model

Request Body:
```json
{
  "prompt": "Create a plan for implementing quantum-resistant encryption in industrial control systems.",
  "max_tokens": 1000,
  "temperature": 0.7,
  "top_p": 0.9
}
```

Response:
```json
{
  "id": "inf-12345",
  "model": "GPT-4o",
  "status": "completed",
  "input": {
    "prompt": "Create a plan for implementing quantum-resistant encryption in industrial control systems.",
    "max_tokens": 1000,
    "temperature": 0.7,
    "top_p": 0.9
  },
  "output": "# Quantum-Resistant Encryption Implementation Plan for ICS\n\n## Phase 1: Assessment and Planning\n\n1. **Inventory all ICS systems**\n   - Document all PLCs, RTUs, and control systems\n   - Identify communication protocols used\n   - Map data flows and security boundaries\n\n2. **Risk assessment**\n   - Evaluate threat models considering quantum computing advances\n   - Prioritize systems based on criticality and lifespan\n   - Establish security requirements for each system type...",
  "metrics": {
    "tokensUsed": 743,
    "processingTime": 2.5
  }
}
```

#### Start Training Job

```
POST /ai/training/jobs
```

Request Body:
```json
{
  "modelName": "IndustrialFaultPredictor",
  "baseModel": "GPT-4o",
  "fineTuningDataset": "industrial-sensor-readings-2024",
  "hyperparameters": {
    "learningRate": 2e-5,
    "epochs": 3,
    "batchSize": 16
  },
  "region": "east",
  "hardwareRequirements": {
    "gpuType": "H100",
    "gpuCount": 8,
    "memoryGB": 512
  }
}
```

Response:
```json
{
  "id": "tj-12345",
  "status": "queued",
  "modelName": "IndustrialFaultPredictor",
  "baseModel": "GPT-4o",
  "fineTuningDataset": "industrial-sensor-readings-2024",
  "region": "east",
  "estimatedStartTime": "2025-03-05T16:00:00Z",
  "estimatedDuration": "4h 30m",
  "queuePosition": 2
}
```

### Blockchain Governance API

Endpoints for interacting with the blockchain governance system.

#### List Governance Proposals

```
GET /governance/proposals
```

Query Parameters:
- `region` - Filter by region
- `status` - Filter by proposal status
- `type` - Filter by proposal type
- `cursor` - Pagination cursor
- `limit` - Results per page (default: 20, max: 100)

Response:
```json
{
  "data": [
    {
      "id": 1,
      "title": "Increase East Region Storage Capacity",
      "description": "Proposal to increase storage capacity in East region by 500TB",
      "status": "active",
      "proposer": "0x1234567890abcdef1234567890abcdef12345678",
      "region": "east",
      "proposedAt": "2025-03-01T12:00:00Z",
      "votingEndsAt": "2025-03-08T12:00:00Z",
      "votesFor": 35,
      "votesAgainst": 5,
      "quorum": 40,
      "blockchainTxId": "0x9876543210fedcba9876543210fedcba98765432"
    }
  ],
  "meta": {
    "cursor": "eyJpZCI6MTB9",
    "hasMore": true
  }
}
```

#### Get Proposal Details

```
GET /governance/proposals/{proposal_id}
```

Path Parameters:
- `proposal_id` - The unique identifier of the proposal

Response:
```json
{
  "id": 1,
  "title": "Increase East Region Storage Capacity",
  "description": "Proposal to increase storage capacity in East region by 500TB",
  "fullDescription": "# Storage Capacity Expansion\n\nThis proposal aims to address the growing storage needs in the East region by expanding capacity by 500TB using high-performance NVMe drives. This upgrade will support increased AI model storage and industrial data archiving requirements.\n\n## Budget\n- Hardware: $250,000\n- Installation: $50,000\n- Configuration: $25,000\n\n## Timeline\n- Procurement: 2 weeks\n- Installation: 1 week\n- Testing: 1 week\n\n## Expected Benefits\n- 40% increase in available storage\n- 15% performance improvement\n- Support for 5 new large-scale AI models",
  "status": "active",
  "proposer": "0x1234567890abcdef1234567890abcdef12345678",
  "proposerName": "East Region Administrator",
  "region": "east",
  "proposedAt": "2025-03-01T12:00:00Z",
  "votingEndsAt": "2025-03-08T12:00:00Z",
  "executionDate": null,
  "votesFor": 35,
  "votesAgainst": 5,
  "quorum": 40,
  "blockchainTxId": "0x9876543210fedcba9876543210fedcba98765432",
  "blockchainAddress": "0xabcdef1234567890abcdef1234567890abcdef12",
  "requiredMajority": 0.66,
  "type": "infrastructure",
  "resourceImpact": [
    {
      "type": "storage",
      "region": "east",
      "change": "+500TB"
    }
  ],
  "votes": [
    {
      "voter": "0x2345678901abcdef2345678901abcdef23456789",
      "voterName": "Node Operator 1",
      "vote": "for",
      "votePower": 10,
      "timestamp": "2025-03-02T09:30:00Z",
      "blockchainTxId": "0xfedcba0987654321fedcba0987654321fedcba09"
    }
  ],
  "attachments": [
    {
      "id": "att-12345",
      "name": "StorageExpansionPlan.pdf",
      "contentType": "application/pdf",
      "size": 2500000,
      "url": "https://api.sinet.network/v1/governance/attachments/att-12345"
    }
  ]
}
```

#### Submit Proposal

```
POST /governance/proposals
```

Request Body:
```json
{
  "title": "Deploy Quantum-Resistant VPN for Industrial Network",
  "description": "Proposal to implement post-quantum cryptography in the industrial network VPN",
  "fullDescription": "# Quantum-Resistant VPN Implementation\n\nThis proposal seeks to upgrade our industrial network VPN infrastructure with post-quantum cryptographic algorithms to protect against future quantum computing threats.\n\n## Technical Details\n- Replace RSA/ECC with CRYSTALS-Kyber for key encapsulation\n- Implement CRYSTALS-Dilithium for digital signatures\n- Deploy hybrid classical/post-quantum approach for backward compatibility\n\n## Budget\n- Software development: $150,000\n- Hardware upgrades: $75,000\n- Testing and certification: $50,000\n\n## Timeline\n- Development: 2 months\n- Testing: 1 month\n- Phased deployment: 1 month",
  "region": "global",
  "type": "security",
  "resourceImpact": [
    {
      "type": "network",
      "region": "all",
      "change": "security-upgrade"
    }
  ],
  "votingDuration": 604800, // 7 days in seconds
  "attachments": [
    {
      "name": "QuantumVPNSpecification.pdf",
      "contentType": "application/pdf",
      "content": "base64-encoded-pdf-content"
    }
  ]
}
```

Response:
```json
{
  "id": 42,
  "title": "Deploy Quantum-Resistant VPN for Industrial Network",
  "description": "Proposal to implement post-quantum cryptography in the industrial network VPN",
  "status": "pending",
  "proposer": "0x3456789012abcdef3456789012abcdef34567890",
  "region": "global",
  "proposedAt": "2025-03-05T15:45:00Z",
  "votingStartsAt": "2025-03-05T16:00:00Z",
  "votingEndsAt": "2025-03-12T16:00:00Z",
  "blockchainTxId": "0x0123456789abcdef0123456789abcdef01234567",
  "blockchainAddress": "0xcdef0123456789abcdef0123456789abcdef0123"
}
```

#### Cast Vote

```
POST /governance/proposals/{proposal_id}/votes
```

Path Parameters:
- `proposal_id` - The unique identifier of the proposal

Request Body:
```json
{
  "vote": "for",
  "justification": "This security upgrade is critical to protect our industrial systems from future quantum computing threats. The hybrid approach ensures backward compatibility while providing quantum resistance."
}
```

Response:
```json
{
  "proposalId": 42,
  "voter": "0x3456789012abcdef3456789012abcdef34567890",
  "voterName": "Security Administrator",
  "vote": "for",
  "votePower": 15,
  "timestamp": "2025-03-05T15:50:00Z",
  "blockchainTxId": "0x0123456789abcdef0123456789abcdef01234568"
}
```

### Cross-Region Synchronization API

Endpoints for managing data synchronization between regions.

#### List Region Syncs

```
GET /region-syncs
```

Query Parameters:
- `sourceRegion` - Filter by source region
- `targetRegion` - Filter by target region
- `status` - Filter by sync status
- `resourceType` - Filter by resource type
- `cursor` - Pagination cursor
- `limit` - Results per page (default: 20, max: 100)

Response:
```json
{
  "data": [
    {
      "id": 1,
      "sourceRegion": "east",
      "targetRegion": "west",
      "resourceType": "ai_model",
      "resourceId": 5,
      "resourceName": "IndustrialFaultPredictor",
      "status": "in_progress",
      "progress": 65,
      "startTime": "2025-03-05T14:30:00Z",
      "estimatedCompletionTime": "2025-03-05T16:00:00Z",
      "transferMethod": "quantum"
    }
  ],
  "meta": {
    "cursor": "eyJpZCI6MTB9",
    "hasMore": true
  }
}
```

#### Create Region Sync

```
POST /region-syncs
```

Request Body:
```json
{
  "sourceRegion": "east",
  "targetRegion": "west",
  "resourceType": "ai_model",
  "resourceId": 5,
  "transferMethod": "quantum",
  "priority": "high"
}
```

Response:
```json
{
  "id": 42,
  "sourceRegion": "east",
  "targetRegion": "west",
  "resourceType": "ai_model",
  "resourceId": 5,
  "resourceName": "IndustrialFaultPredictor",
  "status": "queued",
  "priority": "high",
  "queuePosition": 1,
  "estimatedStartTime": "2025-03-05T16:05:00Z",
  "transferMethod": "quantum"
}
```

#### Get Region Sync Status

```
GET /region-syncs/{sync_id}
```

Path Parameters:
- `sync_id` - The unique identifier of the sync operation

Response:
```json
{
  "id": 42,
  "sourceRegion": "east",
  "targetRegion": "west",
  "resourceType": "ai_model",
  "resourceId": 5,
  "resourceName": "IndustrialFaultPredictor",
  "status": "in_progress",
  "progress": 35,
  "startTime": "2025-03-05T16:05:00Z",
  "estimatedCompletionTime": "2025-03-05T16:30:00Z",
  "transferMethod": "quantum",
  "priority": "high",
  "transferRate": 256,
  "transferSize": 2048,
  "logs": [
    {
      "timestamp": "2025-03-05T16:05:00Z",
      "message": "Sync started, preparing quantum entanglement"
    },
    {
      "timestamp": "2025-03-05T16:10:00Z",
      "message": "Quantum entanglement established, beginning data transfer"
    },
    {
      "timestamp": "2025-03-05T16:15:00Z",
      "message": "35% complete, transferring model weights"
    }
  ]
}
```

### Developer Integration API

Endpoints for developer integrations and API keys.

#### List Developer Keys

```
GET /developer/keys
```

Query Parameters:
- `status` - Filter by key status
- `cursor` - Pagination cursor
- `limit` - Results per page (default: 20, max: 100)

Response:
```json
{
  "data": [
    {
      "id": 1,
      "name": "Production API Key",
      "prefix": "sinet_prod_",
      "created": "2025-01-15T10:00:00Z",
      "lastUsed": "2025-03-05T15:00:00Z",
      "status": "active",
      "permissions": ["read:nodes", "read:models", "read:scada"],
      "rateLimit": 1000
    }
  ],
  "meta": {
    "cursor": "eyJpZCI6MTB9",
    "hasMore": false
  }
}
```

#### Create Developer Key

```
POST /developer/keys
```

Request Body:
```json
{
  "name": "New Development Key",
  "permissions": [
    "read:nodes",
    "read:models",
    "read:scada",
    "write:scada:tags"
  ],
  "expiresIn": 7776000, // 90 days in seconds
  "rateLimit": 500
}
```

Response:
```json
{
  "id": 42,
  "name": "New Development Key",
  "key": "sinet_dev_abcdefg123456789", // Only shown once
  "prefix": "sinet_dev_",
  "created": "2025-03-05T16:00:00Z",
  "expires": "2025-06-03T16:00:00Z",
  "status": "active",
  "permissions": [
    "read:nodes",
    "read:models",
    "read:scada",
    "write:scada:tags"
  ],
  "rateLimit": 500
}
```

## WebSocket API

The SINet platform supports real-time updates through WebSocket connections.

### Connection Endpoints

- **East Region:** `wss://east.api.sinet.network/v1/ws`
- **West Region:** `wss://west.api.sinet.network/v1/ws`
- **NULL_ISLAND:** `wss://null-island.api.sinet.network/v1/ws`
- **Global:** `wss://api.sinet.network/v1/ws`

### Authentication

WebSocket connections require the same authentication as REST endpoints:

```
Connection: Upgrade
Upgrade: websocket
Sec-WebSocket-Version: 13
Sec-WebSocket-Key: {key}
Authorization: Bearer {access_token}
X-SINet-Region: east
X-SINet-ZKP-Proof: {zkp_verification_data}
```

### Subscription Messages

After establishing a connection, subscribe to specific events:

```json
{
  "type": "subscribe",
  "channels": [
    "scada.device.1.readings",
    "nodes.status",
    "governance.proposals.updates",
    "ai.models.5.metrics"
  ]
}
```

### Event Messages

The server will send events as they occur:

```json
{
  "type": "event",
  "channel": "scada.device.1.readings",
  "timestamp": "2025-03-05T16:05:00Z",
  "data": {
    "temperature": 73.2,
    "pressure": 102.1,
    "flow": 26.3,
    "voltage": 480.5
  }
}
```

```json
{
  "type": "event",
  "channel": "governance.proposals.updates",
  "timestamp": "2025-03-05T16:10:00Z",
  "data": {
    "proposalId": 42,
    "status": "passed",
    "votesFor": 75,
    "votesAgainst": 10,
    "executionScheduled": "2025-03-06T12:00:00Z"
  }
}
```

## Error Handling

The SINet API uses standard HTTP status codes and provides detailed error information in responses.

### Error Response Format

```json
{
  "error": {
    "code": "invalid_request",
    "message": "The request was invalid",
    "details": "The 'temperature' parameter must be between 0.0 and 1.0",
    "requestId": "req_abcdefg123456",
    "documentation": "https://docs.api.sinet.network/errors/invalid_request"
  }
}
```

### Common Error Codes

| Status Code | Error Code | Description |
|-------------|------------|-------------|
| 400 | invalid_request | The request was invalid |
| 401 | unauthorized | Authentication required |
| 403 | forbidden | Insufficient permissions |
| 404 | not_found | Resource not found |
| 409 | conflict | Resource conflict |
| 429 | rate_limited | Too many requests |
| 500 | server_error | Internal server error |
| 503 | service_unavailable | Service temporarily unavailable |

## Rate Limiting

The SINet API implements rate limiting based on user, region, and endpoint.

### Rate Limit Headers

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 995
X-RateLimit-Reset: 1614978000
```

### Rate Limit Response

When rate limited, the API returns a 429 status code:

```json
{
  "error": {
    "code": "rate_limited",
    "message": "Rate limit exceeded",
    "details": "You have exceeded the 1000 requests per hour allowed for your tier",
    "requestId": "req_abcdefg123456",
    "retryAfter": 120
  }
}
```

## Pagination

The SINet API uses cursor-based pagination for list endpoints.

### Request Parameters

- `cursor` - Opaque token pointing to a specific item
- `limit` - Number of items to return (default: 20, max: 100)

### Response Format

```json
{
  "data": [...],
  "meta": {
    "cursor": "eyJpZCI6MTB9",
    "hasMore": true,
    "count": 20,
    "total": 156
  }
}
```

## Webhooks

The SINet API supports webhooks for asynchronous event notifications.

### Registering a Webhook

```
POST /developer/webhooks
```

Request Body:
```json
{
  "url": "https://example.com/webhooks/sinet",
  "events": [
    "scada.device.readings",
    "governance.proposal.created",
    "governance.proposal.executed",
    "ai.model.deployed"
  ],
  "description": "Production webhook for critical events",
  "active": true,
  "secret": "your-signing-secret"
}
```

### Webhook Payload

```json
{
  "id": "evt_123456789",
  "type": "governance.proposal.executed",
  "created": "2025-03-05T16:15:00Z",
  "data": {
    "proposalId": 42,
    "title": "Deploy Quantum-Resistant VPN for Industrial Network",
    "status": "executed",
    "executedAt": "2025-03-05T16:15:00Z",
    "executionTxId": "0x0123456789abcdef0123456789abcdef01234569"
  }
}
```

### Webhook Signatures

Each webhook request includes a signature header for verification:

```
X-SINet-Signature-256: t=1646817635,v1=5257a869e7ecebeda32affa62cdca3fa51cad7e77a0e56ff536d0ce8e108d8bd
```

## Conclusion

This API documentation provides a comprehensive guide to integrating with the SINet platform. Developers can use these endpoints to manage nodes, interact with industrial devices, utilize AI models, and participate in the governance system across our East-West-NULL_ISLAND regional architecture.