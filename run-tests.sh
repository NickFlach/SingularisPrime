#!/bin/bash

echo "Running simplified Jest tests with TypeScript and ESM compatibility..."

# Set NODE_OPTIONS to enable experimental features
export NODE_OPTIONS="--experimental-vm-modules --no-warnings"

# Run the simplified test with tight constraints
node_modules/.bin/jest \
  tests/simple-quantum.test.ts \
  --no-cache \
  --testTimeout=3000 \
  --maxWorkers=1 \
  --verbose \
  "$@"