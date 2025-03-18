# OT Network API

## Overview

The SINet OT Network API provides secure access to Operational Technology (OT) devices across the East-West distributed architecture. This API allows external applications to monitor devices, collect data, and send commands to industrial equipment in a controlled and authenticated manner.

## Authentication

All OT Network API endpoints require API key authentication. Include your API key in the `X-API-Key` header of your requests.

```
X-API-Key: sinet_dev_3a7b5c2d1e8f9g6h4i5j0k
```

See [API Key Authentication](./API_Key_Authentication.md) for more details.

## Region-Specific Access

To access devices in a specific region, include the `X-SINet-Region` header:

```
X-SINet-Region: east
```

If your API key has cross-region access enabled, you can access devices in any region. Otherwise, you'll only be able to access devices in the region associated with your API key.

## Required Permissions

The OT Network API requires the following permissions:

- `read:scada` - Required for reading device information and data
- `write:scada` - Required for sending commands to devices

## Endpoints

### List Devices

**Endpoint:** `GET /api/ot-network/devices`

**Required Permissions:** `read:scada`

**Query Parameters:**
- `region` - (Optional) Filter devices by region: `east`, `west`, or `null_island`
- `protocol` - (Optional) Filter by protocol (e.g., `modbus`, `profinet`, `opc-ua`)
- `vendor` - (Optional) Filter by vendor (e.g., `Siemens`, `Rockwell`)
- `type` - (Optional) Filter by device type/category
- `status` - (Optional) Filter by status: `online`, `offline`, `maintenance`, or `error`
- `limit` - (Optional) Number of devices to return (default: 20, max: 100)
- `cursor` - (Optional) Pagination cursor for fetching next page

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Central Processing PLC-1",
      "vendor": "Siemens",
      "category": "PLC",
      "model": "S7-1500",
      "protocol": "profinet",
      "status": "online",
      "firmware": "2.8.3",
      "region": "east",
      "location": {
        "lat": 40.7128,
        "lng": -74.0060,
        "facility": "Central Processing Plant",
        "country": "United States"
      },
      "metrics": {
        "cpuLoad": 42.5,
        "memoryUsage": 36.8,
        "networkLatency": 5.2,
        "uptimeHours": 1243.5,
        "lastBackup": "2025-03-10T08:15:00Z",
        "connectedDevices": 12,
        "errorRate": 0.01
      },
      "configuration": {
        "supportedProtocols": ["profinet", "modbus-tcp"],
        "redundancyMode": "active-standby",
        "securityLevel": "high"
      }
    }
  ],
  "meta": {
    "count": 1,
    "total": 42,
    "hasMore": true,
    "cursor": "2"
  }
}
```

### Get Device Details

**Endpoint:** `GET /api/ot-network/devices/:id`

**Required Permissions:** `read:scada`

**Response:**
Same format as a single device in the List Devices response.

### Send Command to Device

**Endpoint:** `POST /api/ot-network/devices/:id/command`

**Required Permissions:** `write:scada`

**Request Body:**
```json
{
  "command": "setParameter",
  "parameters": {
    "name": "outputFrequency",
    "value": 60.5
  },
  "timeout": 5000,
  "priority": "normal"
}
```

**Response:**
```json
{
  "success": true,
  "timestamp": "2025-03-15T14:28:32Z",
  "command": "setParameter",
  "device": {
    "id": 1,
    "name": "Central Processing PLC-1",
    "status": "online"
  },
  "response": {
    "status": "accepted",
    "message": "Command sent to device",
    "executionTime": 45
  }
}
```

### Collect Device Data

**Endpoint:** `POST /api/ot-network/data-collection`

**Required Permissions:** `read:scada`

**Request Body:**
```json
{
  "deviceId": 1,
  "tags": ["cpuLoad", "memoryUsage", "errorRate"],
  "interval": 1000,
  "duration": 60000,
  "format": "json"
}
```

**Response:**
```json
{
  "success": true,
  "collectionId": "collection_a1b2c3d4e5f6",
  "device": {
    "id": 1,
    "name": "Central Processing PLC-1",
    "region": "east"
  },
  "startTime": "2025-03-15T14:30:00Z",
  "interval": 1000,
  "format": "json",
  "dataPoints": {
    "cpuLoad": 42.5,
    "memoryUsage": 36.8,
    "errorRate": 0.01
  },
  "_links": {
    "self": "/api/ot-network/data-collection/1",
    "websocket": "wss://api.sinet.network/v1/ws/data/1"
  }
}
```

### List Supported Protocols

**Endpoint:** `GET /api/ot-network/protocols`

**Required Permissions:** `read:scada`

**Response:**
```json
{
  "data": [
    {
      "id": "modbus",
      "name": "Modbus",
      "variants": ["Modbus TCP", "Modbus RTU", "Modbus ASCII"],
      "description": "Serial communications protocol originally published for use with PLCs"
    },
    {
      "id": "profinet",
      "name": "PROFINET",
      "variants": ["PROFINET RT", "PROFINET IRT"],
      "description": "Industrial Ethernet standard for automation"
    }
  ],
  "meta": {
    "count": 2
  }
}
```

### List Device Vendors

**Endpoint:** `GET /api/ot-network/vendors`

**Required Permissions:** `read:scada`

**Response:**
```json
{
  "data": [
    {
      "name": "Siemens",
      "deviceCount": 12,
      "regions": ["east", "west"]
    },
    {
      "name": "Rockwell Automation",
      "deviceCount": 8,
      "regions": ["west"]
    }
  ],
  "meta": {
    "count": 2
  }
}
```

## Websocket Data Stream

For real-time data collection, you can connect to the websocket endpoint provided in the data collection response. Authentication is handled via query parameters:

```
wss://api.sinet.network/v1/ws/data/1?apiKey=sinet_dev_3a7b5c2d1e8f9g6h4i5j0k
```

The websocket will stream data in the following format:

```json
{
  "timestamp": "2025-03-15T14:30:01Z",
  "deviceId": 1,
  "data": {
    "cpuLoad": 43.2,
    "memoryUsage": 37.1,
    "errorRate": 0.01
  }
}
```

## Error Handling

The API uses standard HTTP status codes:

- `400 Bad Request` - Invalid parameters
- `401 Unauthorized` - Missing or invalid API key
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Device not found
- `409 Conflict` - Device not in the expected state (e.g., offline)
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server-side error

Error responses include standardized error information:

```json
{
  "error": "invalid_request",
  "message": "Invalid device ID",
  "details": "Please provide a valid device ID"
}
```

## Device Status Definitions

- `online` - Device is connected and functioning normally
- `offline` - Device is not connected to the network
- `maintenance` - Device is in maintenance mode (e.g., firmware update)
- `error` - Device is reporting an error condition

## Security Considerations

- All API requests must use HTTPS
- API keys should have the minimum required permissions
- Consider using region-specific API keys when possible
- Monitor command execution for unauthorized or unusual activity
- All commands sent to devices are logged for audit purposes