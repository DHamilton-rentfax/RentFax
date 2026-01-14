import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  const session = cookies().get("__session")?.value;

  if (session) {
    redirect("/dashboard");
  }

  return <ResetPasswordForm />;
}
