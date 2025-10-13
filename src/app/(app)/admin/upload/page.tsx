"use client";
import Protected from "@/components/protected";
import RenterImporter from "@/components/renter-importer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileUp } from "lucide-react";

export default function UploadPage() {
  return (
    <Protected roles={["owner", "manager"]}>
      <div className="p-4 md:p-10 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <FileUp className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-headline">Bulk Import Renters</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Upload a CSV File</CardTitle>
            <CardDescription>
              Import your existing renter data into RentFAX. The file must
              contain `name` and `email` columns. Other columns like
              `licenseNumber`, `licenseState`, `phone`, `dob`, and `notes` are
              optional.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RenterImporter />
          </CardContent>
        </Card>
      </div>
    </Protected>
  );
}
