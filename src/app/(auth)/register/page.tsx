import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  const session = cookies().get("__session")?.value;

  if (session) {
    redirect("/dashboard");
  }

  return <RegisterForm />;
}
