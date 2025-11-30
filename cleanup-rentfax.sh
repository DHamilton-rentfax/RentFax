#!/bin/bash

echo "⚠️  Starting safe cleanup of RentFAX project…"

# 1. DELETE lib folder OUTSIDE src/
if [ -d "./lib" ]; then
    echo "🗑️  Removing root-level ./lib folder..."
    rm -rf ./lib
fi

# 2. DELETE duplicate publicRecords folder inside src/lib
if [ -d "./src/lib/publicRecords" ]; then
    echo "🗑️  Removing deprecated src/lib/publicRecords (camelCase)..."
    rm -rf ./src/lib/publicRecords
fi

# 3. DELETE deprecated admin/global actions in src/actions
if [ -d "./src/actions/admin/global" ]; then
    echo "🗑️  Removing deprecated src/actions/admin/global..."
    rm -rf ./src/actions/admin/global
fi

# 4. DELETE old incidents folder IF empty
if [ -d "./src/incidents" ]; then
    echo "🗑️  Removing stale src/incidents folder..."
    rm -rf ./src/incidents
fi

# 5. DELETE duplicate renter dashboard folder
if [ -d "./src/app/app/(renter)" ]; then
    echo "🗑️  Removing duplicate src/app/app/(renter)..."
    rm -rf "./src/app/app/(renter)"
fi

echo "🎉 Cleanup complete! Project structure is now corrected and stable."
