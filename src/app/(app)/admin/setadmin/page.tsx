"use client";
import { setUserClaims } from "@/app/auth/actions";
import { useEffect, useState } from "react";

export default function SetAdminPage() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function setAdminRole() {
      try {
        const uid = "l39fRV85YXckhBp5ItkUTRHCdmn2";
        const result = await setUserClaims({
          uid,
          role: "admin",
          companyId: "SYSTEM",
        });
        setResult(result);
      } catch (e: any) {
        setError(e.message);
      }
    }
    setAdminRole();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!result) {
    return <div>Setting admin role...</div>;
  }

  return (
    <div>
      <h1>Set Admin Role</h1>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}
