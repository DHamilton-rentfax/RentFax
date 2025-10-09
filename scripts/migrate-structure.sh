#!/bin/bash
set -e

echo "🚀 Starting RentFax structure migration..."

# Ensure main route groups exist
mkdir -p src/app/(public) src/app/(renter) src/app/(admin) src/app/(ai) src/app/(auth)
mkdir -p src/components/layout src/components/ui src/components/admin src/components/renter src/components/pricing
mkdir -p src/firebase/rules src/hooks src/lib src/types

# Move public pages
[ -d src/app/about ] && mv src/app/about src/app/(public)/
[ -d src/app/how-it-works ] && mv src/app/how-it-works src/app/(public)/
[ -d src/app/pricing ] && mv src/app/pricing src/app/(public)/
[ -d src/app/blog ] && mv src/app/blog src/app/(public)/
[ -d src/app/contact ] && mv src/app/contact src/app/(public)/

# Move main page
[ -f src/app/page.tsx ] && mv src/app/page.tsx src/app/(public)/

# Move renter routes
[ -d src/app/renter ] && mv src/app/renter src/app/(renter)/

# Move admin routes
[ -d src/app/admin ] && mv src/app/admin src/app/(admin)/

# Move AI tools if they exist
[ -d src/app/api/ai ] && mv src/app/api/ai src/app/(ai)/

# Move authentication pages
[ -d src/app/login ] && mv src/app/login src/app/(auth)/
[ -d src/app/signup ] && mv src/app/signup src/app/(auth)/

# Create lockfile to protect structure
cat <<EOL > .rentfax-structure.lock
# 🚫 DO NOT MODIFY THIS FILE STRUCTURE
# RentFax Production Architecture Lock
# Valid route groups: (public), (renter), (admin), (auth), (ai)
# Managed by GPT-5 + Dominique DevOps pipeline
EOL

echo "✅ RentFax structure migration complete."
