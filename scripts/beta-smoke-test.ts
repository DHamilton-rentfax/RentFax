import fetch from "node-fetch";

const BASE =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:9002";

type Test = {
  name: string;
  path: string;
  method?: "GET" | "POST";
  body?: any;
  expect?: number;
};

const tests: Test[] = [
  { name: "Home", path: "/", expect: 200 },
  { name: "Login page", path: "/login", expect: 200 },
  { name: "Signup page", path: "/signup", expect: 200 },

  {
    name: "Renter search API",
    path: "/api/renters/search",
    method: "POST",
    body: { fullName: "Test User" },
    expect: 200,
  },

  {
    name: "Identity checkout API",
    path: "/api/checkout/identity",
    method: "POST",
    body: {
      purchaser: { uid: "beta-test", mode: "INDIVIDUAL" },
      renterPayload: { name: "Test Renter" },
    },
    expect: 200,
  },
];

(async () => {
  console.log("\n🧪 RentFAX Beta Smoke Tests\n");

  for (const t of tests) {
    try {
      const res = await fetch(`${BASE}${t.path}`, {
        method: t.method || "GET",
        headers: { "Content-Type": "application/json" },
        body: t.body ? JSON.stringify(t.body) : undefined,
      });

      const ok = res.status === (t.expect ?? 200);
      console.log(
        `${ok ? "✅" : "❌"} ${t.name} → ${res.status}`
      );
    } catch (err) {
      console.log(`❌ ${t.name} → ERROR`);
      console.error(err);
    }
  }
})();
