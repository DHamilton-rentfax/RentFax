
import AuthLayout from "@/components/auth/AuthLayout";
import SignupForm from "@/components/auth/SignupForm";

export const metadata = {
  title: "Create your RentFAX account",
  description:
    "Join RentFAX and help build trust, transparency, and accountability in the rental economy.",
};

export default function SignupPage() {
  return (
    <AuthLayout
      logo={
        <div className="text-2xl font-bold tracking-tight">
          Rent<span className="text-emerald-400">FAX</span>
        </div>
      }
      title="Create your account"
      subtitle="Set up your RentFAX profile in minutes."
      sideTitle="Trust is the missing layer in renting"
      sideDescription="The rental industry has no shared system for accountability. RentFAX creates a transparent trust layer that protects businesses and rewards good renters."
      sidePoints={[
        "Reduce fraud before it happens",
        "Create portable renter reputations",
        "Handle disputes with evidence, not guesswork",
        "Build long-term trust with your customers",
      ]}
    >
      <SignupForm />
    </AuthLayout>
  );
}
