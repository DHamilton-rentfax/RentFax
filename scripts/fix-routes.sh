#!/bin/bash

echo "Fixing RentFAX dynamic route inconsistencies..."

# Standardize on [renterId] for renter-specific routes
if [ -d "src/app/renter/[id]" ]; then
  mv src/app/renter/[id] src/app/renter/[renterId]
  echo "Renamed: src/app/renter/[id] -> src/app/renter/[renterId]"
fi
if [ -d "src/app/api/renters/[id]" ]; then
  mv src/app/api/renters/[id] src/app/api/renters/[renterId]
  echo "Renamed: src/app/api/renters/[id] -> src/app/api/renters/[renterId]"
fi

# Standardize on [id] for dispute-specific routes
if [ -d "src/app/(customer)/disputes/[disputeId]" ]; then
  mv src/app/(customer)/disputes/[disputeId] src/app/(customer)/disputes/[id]
  echo "Renamed: src/app/(customer)/disputes/[disputeId] -> src/app/(customer)/disputes/[id]"
fi
if [ -d "src/app/api/disputes/[disputeId]" ]; then
  mv src/app/api/disputes/[disputeId] src/app/api/disputes/[id]
  echo "Renamed: src/app/api/disputes/[disputeId] -> src/app/api/disputes/[id]"
fi

echo "Done! Please restart your dev server if it's running."
