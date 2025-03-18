# API Key Authentication for SINet

## Overview

SINet provides a secure API key-based authentication system for external applications to access the Operational Technology (OT) network and other resources. This system includes support for region-specific access control and fine-grained permissions.

## API Key Structure

SINet API keys have the following format:

```
sinet_<environment>_<random-string>
```

For example:
```
sinet_dev_3a7b5c2d1e8f9g6h4i5j0k
```

## Authentication Process

1. Generate an API key through the SINet platform
2. Include the API key in the `X-API-Key` header of your requests
3. Optionally include a `X-SINet-Region` header to specify which region you want to access

## API Key Management Endpoints

### List API Keys

**Endpoint:** `GET /api/keys`

**Required Permissions:** `admin` or `manage:keys`

**Query Parameters:**
- `appId` - Required. The ID of the application to get keys for.

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "apiKey": "sinet_dev_3a7b...",
      "permissions": ["read:scada", "write:scada"],
      "rateLimit": 1000,
      "region": "east",
      "allowCrossRegion": false,
      "lastAccessed": "2025-03-15T12:00:00Z"
    }
  ],
  "meta": {
    "count": 1
  }
}
```

### Create API Key

**Endpoint:** `POST /api/keys`

**Required Permissions:** `admin` or `manage:keys`

**Request Body:**
```json
{
  "name": "Production SCADA Reader",
  "appId": 1,
  "permissions": ["read:scada"],
  "rateLimit": 1000,
  "region": "east",
  "allowCrossRegion": false
}
```

**Response:**
```json
{
  "id": 2,
  "apiKey": "sinet_dev_7f8d9e0c1b2a3g4h5i6j",
  "appId": 1,
  "permissions": ["read:scada"],
  "rateLimit": 1000,
  "region": "east",
  "allowCrossRegion": false,
  "created": "2025-03-15T12:30:00Z"
}
```

> **Note:** The full API key is returned only once upon creation. Store it securely as it cannot be retrieved later.

### Get API Key Details

**Endpoint:** `GET /api/keys/:id`

**Required Permissions:** `admin` or `manage:keys`

**Response:**
```json
{
  "id": 2,
  "apiKey": "sinet_dev_7f8d9e...",
  "appId": 1,
  "permissions": ["read:scada"],
  "rateLimit": 1000,
  "region": "east",
  "allowCrossRegion": false,
  "lastAccessed": "2025-03-15T12:35:00Z"
}
```

### Update API Key

**Endpoint:** `PATCH /api/keys/:id`

**Required Permissions:** `admin` or `manage:keys`

**Request Body:**
```json
{
  "permissions": ["read:scada", "write:scada"],
  "allowCrossRegion": true
}
```

**Response:**
Same as Get API Key Details with updated values.

### Delete API Key

**Endpoint:** `DELETE /api/keys/:id`

**Required Permissions:** `admin` or `manage:keys`

**Response Status Code:** 204 (No Content)

### Verify API Key

**Endpoint:** `POST /api/keys/verify`

**Required Headers:** `X-API-Key`

**Response:**
```json
{
  "valid": true,
  "permissions": ["read:scada", "write:scada"],
  "region": "east",
  "allowCrossRegion": true,
  "rateLimit": 1000
}
```

## Available Permissions

| Permission | Description |
|------------|-------------|
| `admin` | Full access to all endpoints |
| `manage:keys` | Can create, update, and delete API keys |
| `read:scada` | Can read data from OT network devices |
| `write:scada` | Can send commands to OT network devices |
| `read:models` | Can read AI model information |
| `read:nodes` | Can read information about compute nodes |
| `read:governance` | Can read governance proposals |
| `write:governance` | Can submit governance proposals |

## Region-Based Access Control

SINet uses a decentralized East-West architecture with the following regions:

- `east` - Eastern Hemisphere resources
- `west` - Western Hemisphere resources
- `null_island` - Special region for global coordination

By default, API keys are restricted to accessing resources in their assigned region. To enable cross-region access, set `allowCrossRegion: true` when creating or updating an API key.

## Rate Limiting

All API keys have a rate limit defined in requests per minute. Once the rate limit is exceeded, requests will receive a 429 Too Many Requests response with a Retry-After header.

## Security Best Practices

1. Always use HTTPS for all API requests
2. Store API keys securely, never in client-side code
3. Use the minimum permissions required for your application
4. Rotate API keys regularly
5. Revoke unused API keys
6. Monitor API key usage for suspicious activity