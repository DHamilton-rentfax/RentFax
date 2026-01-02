import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout
      logo={
        <div className="text-2xl font-bold tracking-tight">
          Rent<span className="text-emerald-400">FAX</span>
        </div>
      }
      title="Welcome back"
      subtitle="Log in to access renter verification, reports, and trust insights."
      sideTitle="Renting without trust is broken"
      sideDescription="Fraud, disputes, and bad actors cost the rental industry billions every year. RentFAX restores trust by creating transparent renter histories."
      sidePoints={[
        "Verify renters before you hand over assets",
        "Build auditable renter histories, not blacklists",
        "Protect businesses and renters equally",
        "Disputes resolved with evidence and accountability",
      ]}
    >
      <div className="fade-in">
        <LoginForm />
      </div>
    </AuthLayout>
  );
}
