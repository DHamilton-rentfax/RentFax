'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PlusCircle, ListFilter, File, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import RenterActions from '@/components/renter-actions';
import { useAuth } from '@/hooks/use-auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function RentersPage() {
  const { claims } = useAuth();
  const [renters, setRenters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!claims?.companyId) {
      setLoading(false);
      return;
    }
    const q = query(
      collection(db, 'renters'),
      where('companyId', '==', claims.companyId)
    );
    const unsub = onSnapshot(q, (snapshot) => {
      setRenters(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, [claims]);

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <h1 className="text-2xl font-headline">Renters</h1>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filter
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>
                Active
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button asChild size="sm" variant="outline" className="h-8 gap-1">
            <Link href="/admin/upload">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Import CSV
              </span>
            </Link>
          </Button>
          <RenterActions />
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Renter Profiles</CardTitle>
          <CardDescription>
            Manage your renters and view their risk profiles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead className="hidden md:table-cell">
                  Incidents
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="hidden sm:table-cell">
                        <Skeleton className="h-16 w-16 rounded-md" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-4 w-32 mt-1" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-12" />
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Skeleton className="h-5 w-8" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-8" />
                      </TableCell>
                    </TableRow>
                  ))
                : renters.map((renter) => (
                    <TableRow key={renter.id}>
                      <TableCell className="hidden sm:table-cell">
                        <Image
                          alt="Renter image"
                          className="aspect-square rounded-md object-cover"
                          height="64"
                          src={renter.imageUrl || `https://placehold.co/64x64.png`}
                          width="64"
                          data-ai-hint="person"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <Link
                          href={`/renters/${renter.id}`}
                          className="hover:underline text-primary"
                        >
                          {renter.name}
                        </Link>
                        <div className="text-sm text-muted-foreground">
                          {renter.email}
                        </div>
                      </TableCell>
                       <TableCell>
                        <Badge variant={!renter.riskScore ? 'secondary' : renter.riskScore < 50 ? 'destructive' : (renter.riskScore < 75 ? 'secondary' : 'default')}>
                          {renter.riskScore ?? 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {renter.totalIncidents || 0}
                      </TableCell>
                      <TableCell>
                         <RenterActions renter={renter} isIcon={true} />
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
           {!loading && renters.length === 0 && (
                <div className="text-center p-8 text-muted-foreground">
                    No renters found. Add one to get started.
                </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
