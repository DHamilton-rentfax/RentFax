
"use client";
import { whoAmI } from "@/app/auth/actions";
import { useEffect, useState } from "react";

export default function WhoAmIPage() {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await whoAmI();
        setUserInfo(user);
      } catch (e: any) {
        setError(e.message);
      }
    }
    fetchUser();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Who Am I?</h1>
      <pre>{JSON.stringify(userInfo, null, 2)}</pre>
    </div>
  );
}
