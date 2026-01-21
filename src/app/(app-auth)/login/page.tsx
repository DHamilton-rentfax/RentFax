import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  const session = cookies().get("__session")?.value;

  if (session) {
    redirect("/dashboard");
  }

  return <LoginForm />;
}
