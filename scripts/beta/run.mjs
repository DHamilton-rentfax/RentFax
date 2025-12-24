const BASE = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:9002";

const tests = [
  { name: "Home Page", path: "/", method: "GET", expect: 200 },
  { name: "Login Page", path: "/login", method: "GET", expect: 200 },
  { name: "Signup Page", path: "/signup", method: "GET", expect: 200 },

  // API: renter search
  {
    name: "Renter Search API",
    path: "/api/renters/search",
    method: "POST",
    body: { fullName: "Health Check User" },
    expect: 200,
  },

  // API: identity checkout (this may return 400 if you enforce auth — we treat 200/400 as "alive")
  {
    name: "Identity Checkout API",
    path: "/api/checkout/identity",
    method: "POST",
    body: {
      purchaser: { uid: "beta-test", mode: "INDIVIDUAL" },
      renterPayload: { name: "Test Renter", email: null, phone: null },
    },
    expect: [200, 400],
  },

  // This route might be 404 (token not real) — but should not crash the app
  {
    name: "Verify Token Route",
    path: "/verify/test-token",
    method: "GET",
    expect: [200, 404],
  },
];

async function run() {
  console.log("\n🚀 RentFAX BETA SYSTEM TESTS\n");
  let failed = 0;

  for (const t of tests) {
    try {
      const res = await fetch(`${BASE}${t.path}`, {
        method: t.method || "GET",
        headers: { "Content-Type": "application/json" },
        body: t.body ? JSON.stringify(t.body) : undefined,
      });

      const expected = Array.isArray(t.expect) ? t.expect : [t.expect || 200];
      const ok = expected.includes(res.status);

      console.log(`${ok ? "✅" : "❌"} ${t.name} → ${res.status}`);

      if (!ok) {
        failed++;
        // show small snippet for debugging
        const text = await res.text().catch(() => "");
        if (text) console.log("   ↳", text.slice(0, 200).replace(/\s+/g, " "));
      }
    } catch (err) {
      failed++;
      console.log(`❌ ${t.name} → ERROR`, err?.message || err);
    }
  }

  if (failed) {
    console.log(`\n❌ ${failed} test(s) failed\n`);
    process.exit(1);
  }

  console.log("\n✅ ALL BETA TESTS PASSED\n");
  process.exit(0);
}

run();
