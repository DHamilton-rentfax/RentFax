import RentalForm from '@/components/rental-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ServicesPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl md:text-4xl">Generate Your Rental Report</CardTitle>
            <CardDescription className="text-lg pt-2">
              Enter the property details below to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RentalForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
