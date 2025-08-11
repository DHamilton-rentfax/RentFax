import RenterScreener from '@/components/renter-screener';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ServicesPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl md:text-4xl">Screen a Renter</CardTitle>
            <CardDescription className="text-lg pt-2">
              Enter a renter's details to generate their risk & history report.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RenterScreener />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
