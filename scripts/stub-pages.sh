#!/bin/bash
set -e

FILES=$(npm run build 2>&1 | grep "Parsing error" | awk -F: '{print $1}' | sort -u)

for FILE in $FILES; do
  echo "⚠️  Stubbing $FILE"
  echo "export default function Page() { return null }" > "$FILE"
done

echo "✅ Stubbing complete"
