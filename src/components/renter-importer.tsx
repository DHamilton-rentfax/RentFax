'use client';
import { useState } from 'react';
import Papa from 'papaparse';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload } from 'lucide-react';
import { importRenters } from '@/app/auth/actions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface RenterRecord {
    [key: string]: string;
}

export default function RenterImporter() {
  const [data, setData] = useState<RenterRecord[]>([]);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setLoading(true);
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setData(results.data as RenterRecord[]);
          setLoading(false);
        },
        error: (error: any) => {
            toast({ title: "Parsing Error", description: error.message, variant: "destructive" });
            setLoading(false);
        }
      });
    }
  };

  const handleUpload = async () => {
    if (data.length === 0) {
        toast({ title: "No Data", description: "No data to upload. Please select a valid CSV file.", variant: "destructive" });
        return;
    }
    setLoading(true);
    try {
      const mappedRenters = data.map(r => ({
          name: r.name,
          email: r.email,
          licenseNumber: r.licenseNumber,
          licenseState: r.licenseState,
          dob: r.dob,
          phone: r.phone,
          notes: r.notes
      }));

      const result = await importRenters({ renters: mappedRenters });
      toast({
        title: "Import Successful",
        description: `${result.count} renters have been successfully imported.`,
      });
      setData([]);
      setFileName('');
    } catch (e: any) {
        toast({ title: "Import Failed", description: e.message, variant: "destructive" });
    } finally {
        setLoading(false);
    }
  };
  
  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input id="csv-upload" type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
        <Button asChild variant="outline">
            <label htmlFor="csv-upload" className="cursor-pointer">
                <Upload className="mr-2" />
                Select CSV File
            </label>
        </Button>
        {fileName && <span className="text-muted-foreground">{fileName}</span>}
      </div>

      {data.length > 0 && (
        <div className="space-y-4">
            <h3 className="font-semibold">Preview Data ({data.length} rows)</h3>
            <div className="max-h-96 overflow-y-auto border rounded-md">
                 <Table>
                    <TableHeader>
                        <TableRow>
                            {headers.map(h => <TableHead key={h}>{h}</TableHead>)}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.slice(0, 10).map((row, i) => (
                            <TableRow key={i}>
                                {headers.map(h => <TableCell key={h} className="truncate max-w-xs">{row[h]}</TableCell>)}
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
