
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PenTool } from 'lucide-react';

export default function BlogPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">
          RentFAX Blog
        </h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
          Insights, news, and best practices for the rental industry.
        </p>
      </div>
      <div className="flex justify-center">
        <Card className="w-full max-w-md text-center">
            <CardHeader>
                <div className="flex justify-center mb-4">
                    <PenTool className="w-12 h-12 text-primary" />
                </div>
                <CardTitle>Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                    Our team is currently writing some great articles. Please check back later!
                </p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
