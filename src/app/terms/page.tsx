
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsOfServicePage() {
  return (
    <div className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-3xl md:text-4xl">Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
            
            <h2>1. Agreement to Terms</h2>
            <p>
              By using our services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>

            <h2>2. Use of Our Service</h2>
            <p>
              You must use our services in compliance with all applicable laws. You are responsible for all activities that occur under your account. You agree not to share your account credentials.
            </p>

            <h2>3. Content</h2>
            <p>
              You are responsible for the accuracy and legality of the information you submit to our network. We reserve the right to remove content that violates our policies or is otherwise objectionable.
            </p>

            <h2>4. Disclaimers</h2>
            <p>
             Our service is provided "as is." We do not warrant that the service will be uninterrupted, error-free, or completely secure. The risk scores and reports provided are for informational purposes only and should not be the sole basis for a rental decision.
            </p>

             <p className="font-bold mt-8">
              [This is a placeholder document. You must replace this with your own official Terms of Service.]
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
