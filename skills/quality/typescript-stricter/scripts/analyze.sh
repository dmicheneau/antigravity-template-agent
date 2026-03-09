#!/usr/bin/env bash

# This is a mock script representing a complex tool the Antigravity agent can execute.

echo "🔍 TypeScript Stricter Tool starting..."
echo "----------------------------------------"
sleep 1

echo "[INFO] Scanning directory for .ts and .tsx files..."
sleep 1

# Mocking file analysis output
echo "[WARN] implicit 'any' detected at src/components/Button.tsx:14"
echo "[WARN] Object is of type 'unknown' at src/utils/api.ts:42"
echo "[WARN] Type 'null' is not assignable to type 'string' at src/hooks/useUser.ts:18"
echo "----------------------------------------"
echo "❌ Analysis finished with 3 warnings."
echo "💡 The agent should now propose code fixes for these warnings."
exit 1
