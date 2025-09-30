
import { getAllDisputes } from '@/app/actions/get-all-disputes';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';

export default async function AdminDisputesPage() {
  const { disputes, error } = await getAllDisputes();

  if (error || !disputes) {
    return <div className="p-4">Error: {error || 'Could not fetch disputes.'}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin - All Submitted Disputes</h1>
      <Card>
        <CardHeader>
          <CardTitle>Dispute Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dispute ID</TableHead>
                <TableHead>Renter</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {disputes.map((dispute) => (
                <TableRow key={dispute.id}>
                  <TableCell className="font-mono text-sm">{dispute.id.substring(0, 8)}...</TableCell>
                  <TableCell>
                    {dispute.renter ? (
                      <div>
                        <p>{dispute.renter.name}</p>
                        <p className="text-xs text-gray-500">{dispute.renter.email}</p>
                      </div>
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                  <TableCell>{dispute.createdAt.toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={dispute.status === 'pending' ? 'default' : 'secondary'}>
                      {dispute.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Link href={`/admin/disputes/${dispute.id}'>
                        <Button variant="outline" size="sm">Review</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {disputes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">No disputes found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
