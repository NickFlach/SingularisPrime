#!/bin/bash

# Run Jest tests with Node and experimental VM modules flag
node --experimental-vm-modules node_modules/jest/bin/jest.js "$@"