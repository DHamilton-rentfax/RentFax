'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/client";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Loader2 } from "lucide-react";

export default function AcceptInvite({ params }: any) {
  const [invite, setInvite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/invite/${params.id}`)
      .then((res) => res.json())
      .then((data) => setInvite(data.invite))
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleAccept = async (email: string, password: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (cred.user) router.push("/company/dashboard");
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );

  if (!invite)
    return <div className="text-center text-red-500 mt-10">Invalid or expired invite</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Accept Invitation</h1>
      <p>You're invited to join {invite.companyId}</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const password = e.currentTarget.password.value;
          handleAccept(invite.email, password);
        }}
        className="mt-4 flex flex-col gap-3 w-80"
      >
        <input type="password" name="password" placeholder="Set your password" required />
        <button className="bg-blue-600 text-white py-2 rounded">Accept Invite</button>
      </form>
    </div>
  );
}
