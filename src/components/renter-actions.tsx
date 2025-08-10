'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Renter } from '@/lib/mock-data';
import RenterForm from './renter-form';
import { useToast } from './ui/use-toast';

interface RenterActionsProps {
  renter?: Renter;
  isIcon?: boolean;
}

export default function RenterActions({ renter, isIcon }: RenterActionsProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSave = (values: any) => {
    console.log('Saving renter:', values);
    toast({
      title: renter ? 'Renter Updated' : 'Renter Created',
      description: `${values.name} has been saved successfully.`,
    });
    setOpen(false);
  };

  const triggerButton = renter ? (
    isIcon ? (
      <Button aria-haspopup="true" size="icon" variant="ghost">
        <MoreHorizontal className="h-4 w-4" />
        <span className="sr-only">Toggle menu</span>
      </Button>
    ) : (
      <Button variant="outline">Edit Profile</Button>
    )
  ) : (
    <Button size="sm" className="h-8 gap-1">
      <PlusCircle className="h-3.5 w-3.5" />
      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
        Add Renter
      </span>
    </Button>
  );

  const dialogTrigger = <DialogTrigger asChild>{triggerButton}</DialogTrigger>;
  const dropdownTrigger = <DropdownMenuTrigger asChild>{triggerButton}</DropdownMenuTrigger>;

  return renter ? (
     <DropdownMenu>
      {dropdownTrigger}
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                 <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Edit</DropdownMenuItem>
            </DialogTrigger>
             <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Renter</DialogTitle>
                    <DialogDescription>
                        Update the details for {renter.name}.
                    </DialogDescription>
                </DialogHeader>
                <RenterForm renter={renter} onSave={handleSave} />
            </DialogContent>
        </Dialog>
        <DropdownMenuItem>View Rentals</DropdownMenuItem>
        <DropdownMenuItem>Add Incident</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive">
          Delete Renter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Dialog open={open} onOpenChange={setOpen}>
      {dialogTrigger}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Renter</DialogTitle>
          <DialogDescription>
            Enter the details for the new renter.
          </DialogDescription>
        </DialogHeader>
        <RenterForm onSave={handleSave} />
      </DialogContent>
    </Dialog>
  );
}
