"use client";
import { useState } from "react";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, AlertCircle } from "lucide-react";
import { importRenters } from "@/app/auth/actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface RenterRecord {
  [key: string]: string;
}

export default function RenterImporter() {
  const [data, setData] = useState<RenterRecord[]>([]);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const { toast } = useToast();

  const validateRow = (row: RenterRecord, index: number) => {
    const required = ["name", "licenseNumber", "licenseState", "email", "dob"];
    const missing = required.filter((field) => !row[field]);
    if (missing.length)
      return `Row ${index + 2}: Missing required field(s): ${missing.join(", ")}`;
    return null;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setData([]);
      setErrors([]);
      setLoading(true);
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const rows = results.data as RenterRecord[];
          const validationErrors = rows
            .map(validateRow)
            .filter(Boolean) as string[];

          if (validationErrors.length > 0) {
            setErrors(validationErrors);
          } else {
            setData(rows);
          }
          setLoading(false);
        },
        error: (error: any) => {
          toast({
            title: "Parsing Error",
            description: error.message,
            variant: "destructive",
          });
          setLoading(false);
        },
      });
    }
  };

  const handleUpload = async () => {
    if (data.length === 0) {
      toast({
        title: "No Data",
        description: "No data to upload. Please select a valid CSV file.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const mappedRenters = data.map((r) => ({
        name: r.name,
        email: r.email,
        licenseNumber: r.licenseNumber,
        licenseState: r.licenseState,
        dob: r.dob,
        phone: r.phone,
        notes: r.notes,
      }));

      const result = await importRenters({ renters: mappedRenters });
      toast({
        title: "Import Successful",
        description: `${result.count} renters have been successfully imported.`,
      });
      setData([]);
      setFileName("");
      setErrors([]);
    } catch (e: any) {
      toast({
        title: "Import Failed",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const headers = data.length > 0 ? Object.keys(data[0]) : [];
  const hasValidData = data.length > 0 && errors.length === 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          id="csv-upload"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button asChild variant="outline">
          <label htmlFor="csv-upload" className="cursor-pointer">
            <Upload className="mr-2" />
            Select CSV File
          </label>
        </Button>
        {fileName && <span className="text-muted-foreground">{fileName}</span>}
      </div>

      {loading && (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="animate-spin" />
          <span className="ml-2">Processing file...</span>
        </div>
      )}

      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Validation Errors Found</AlertTitle>
          <AlertDescription>
            Please fix these issues in your CSV file and re-upload.
            <ul className="list-disc pl-5 mt-2 max-h-40 overflow-y-auto">
              {errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {hasValidData && (
        <div className="space-y-4">
          <h3 className="font-semibold">Preview Data ({data.length} rows)</h3>
          <div className="max-h-96 overflow-y-auto border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  {headers.map((h) => (
                    <TableHead key={h}>{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.slice(0, 10).map((row, i) => (
                  <TableRow key={i}>
                    {headers.map((h) => (
                      <TableCell key={h} className="truncate max-w-xs">
                        {row[h]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Button onClick={handleUpload} disabled={loading}>
            {loading && <Loader2 className="mr-2 animate-spin" />}
            Import {data.length} Renters
          </Button>
        </div>
      )}
    </div>
  );
}
