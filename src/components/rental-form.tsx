'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Building, Home, DollarSign, BedDouble, Bath } from 'lucide-react';

const formSchema = z.object({
  address: z.string().min(5, 'Please enter a valid address.'),
  city: z.string().min(2, 'Please enter a valid city.'),
  state: z.string().min(2, 'Please enter a 2-letter state code.').max(2, 'Please enter a 2-letter state code.'),
  zip: z.string().regex(/^\d{5}$/, 'Please enter a valid 5-digit ZIP code.'),
  rent: z.coerce.number().min(1, 'Please enter a valid monthly rent amount.'),
  bedrooms: z.coerce.number().int().min(0, 'Bedrooms cannot be negative.'),
  bathrooms: z.coerce.number().min(0.5, 'Bathrooms must be at least 0.5.'),
});

type FormData = z.infer<typeof formSchema>;

export default function RentalForm() {
  const { toast } = useToast();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: '',
      city: '',
      state: '',
      zip: '',
      rent: undefined,
      bedrooms: undefined,
      bathrooms: undefined,
    },
  });

  function onSubmit(values: FormData) {
    console.log(values);
    toast({
      title: 'Report Generating!',
      description: 'Your rental report is being created. This is a demo submission.',
      variant: 'default',
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property Address</FormLabel>
              <div className="relative">
                 <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <FormControl>
                  <Input placeholder="123 Main St" {...field} className="pl-10" />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                 <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <FormControl>
                    <Input placeholder="Anytown" {...field} className="pl-10"/>
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <FormControl>
                    <Input placeholder="CA" {...field} className="pl-10"/>
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="zip"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ZIP Code</FormLabel>
                <FormControl>
                  <Input placeholder="90210" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
                control={form.control}
                name="rent"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Monthly Rent</FormLabel>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <FormControl>
                            <Input type="number" placeholder="2500" {...field} className="pl-10"/>
                        </FormControl>
                    </div>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="bedrooms"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Bedrooms</FormLabel>
                     <div className="relative">
                        <BedDouble className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <FormControl>
                            <Input type="number" placeholder="2" {...field} className="pl-10"/>
                        </FormControl>
                    </div>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="bathrooms"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Bathrooms</FormLabel>
                     <div className="relative">
                        <Bath className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <FormControl>
                            <Input type="number" step="0.5" placeholder="1.5" {...field} className="pl-10"/>
                        </FormControl>
                    </div>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>
        <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" size="lg">
          Generate Report
        </Button>
      </form>
    </Form>
  );
}
