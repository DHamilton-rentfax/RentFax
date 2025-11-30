"use client";
import { useState } from "react";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Renter } from "@/ai/flows/renters";

import RenterForm from "./renter-form";



interface RenterActionsProps {
  renter?: Renter;
  isIcon?: boolean;
}

export default function RenterActions({ renter, isIcon }: RenterActionsProps) {
  const [open, setOpen] = useState(false);

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
  const dropdownTrigger = (
    <DropdownMenuTrigger asChild>{triggerButton}</DropdownMenuTrigger>
  );

  return renter ? (
    <DropdownMenu>
      {dropdownTrigger}
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Edit
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Renter</DialogTitle>
              <DialogDescription>
                Update the details for {renter.name}.
              </DialogDescription>
            </DialogHeader>
            <RenterForm renter={renter} onSave={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
        <Link href={`/renters/${renter.id}`}>
          <DropdownMenuItem>View Profile</DropdownMenuItem>
        </Link>
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
        <RenterForm onSave={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
