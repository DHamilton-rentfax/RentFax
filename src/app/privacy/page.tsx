
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-3xl md:text-4xl">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
            
            <h2>1. Introduction</h2>
            <p>
              Welcome to RentFAX. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.
            </p>

            <h2>2. Information We Collect</h2>
            <p>
              We may collect personal identification information (Name, email address, phone number, etc.) and rental history information that you provide to us or that is provided by rental operators in our network.
            </p>

            <h2>3. How We Use Your Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul>
              <li>Provide, operate, and maintain our services.</li>
              <li>Improve, personalize, and expand our services.</li>
              <li>Understand and analyze how you use our services.</li>
              <li>Develop new products, services, features, and functionality.</li>
              <li>Communicate with you, either directly or through one of our partners.</li>
              <li>Process your transactions and manage your account.</li>
              <li>Find and prevent fraud.</li>
            </ul>

            <h2>4. Sharing Your Information</h2>
            <p>
              We do not share your personal information with third parties except as described in this Privacy Policy, such as with your explicit consent to rental operators when you apply for a new rental.
            </p>

            <p className="font-bold mt-8">
              [This is a placeholder document. You must replace this with your own official Privacy Policy.]
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
