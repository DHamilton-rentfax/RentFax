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
import { Renter } from '@/lib/mock-data';
import { DialogFooter } from './ui/dialog';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  licenseNumber: z.string().min(1, 'License number is required.'),
  licenseState: z.string().length(2, 'State must be 2 characters.'),
  dob: z.string().refine((val) => !isNaN(Date.parse(val)), {message: "Invalid date format"}),
});

type FormData = z.infer<typeof formSchema>;

interface RenterFormProps {
    renter?: Renter;
    onSave: (values: FormData) => void;
}

export default function RenterForm({ renter, onSave }: RenterFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: renter?.name || '',
      email: renter?.email || '',
      licenseNumber: renter?.licenseNumber || '',
      licenseState: renter?.licenseState || '',
      dob: renter?.dob || '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="john@example.com" {...field} />
                </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
             <FormField
                control={form.control}
                name="licenseNumber"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>License Number</FormLabel>
                        <FormControl>
                        <Input placeholder="D1234567" {...field} />
                        </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <FormField
                control={form.control}
                name="licenseState"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>State</FormLabel>
                        <FormControl>
                        <Input placeholder="CA" {...field} />
                        </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
        </div>
         <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
            <Button type="submit">Save Renter</Button>
        </DialogFooter>

      </form>
    </Form>
  );
}
