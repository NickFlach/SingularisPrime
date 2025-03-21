#!/bin/bash

echo "Running Jest tests with TypeScript and ESM compatibility..."

# Set NODE_OPTIONS to enable experimental features
export NODE_OPTIONS="--experimental-vm-modules --no-warnings"

# Run Jest with debug logging if needed
node_modules/.bin/jest \
  --no-cache \
  --detectOpenHandles \
  "$@"