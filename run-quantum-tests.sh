#!/bin/bash

# Quantum Testing Framework
# This script runs the custom quantum mechanics tests

echo "🔬 Quantum Mechanics Test Suite"
echo "==============================="
echo "Running tests with tsx..."

# Run the test runner
tsx tests/quantum-test-runner.ts

# Store the result code
RESULT=$?

if [ $RESULT -eq 0 ]; then
  echo -e "\n✅ All tests PASSED"
else
  echo -e "\n❌ Some tests FAILED"
fi

# Return the same exit code as the test runner
exit $RESULT