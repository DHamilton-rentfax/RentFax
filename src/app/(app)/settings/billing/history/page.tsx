
'use client'

import { useEffect, useState } from 'react'
import { getInvoices } from '@/lib/billing/getInvoices'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function BillingHistory() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInvoices().then(data => {
        setInvoices(data);
        setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
                <Skeleton className="h-40 w-full" />
            ) : invoices.length === 0 ? (
              <p className="text-gray-500 text-sm">No invoices found.</p>
            ) : (
              <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Invoice</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((i) => (
                    <TableRow key={i.id}>
                      <TableCell>{new Date(i.created * 1000).toLocaleDateString()}</TableCell>
                      <TableCell>${(i.amount_paid / 100).toFixed(2)}</TableCell>
                      <TableCell className="capitalize"><Badge>{i.status}</Badge></TableCell>
                      <TableCell>
                        <a href={i.hosted_invoice_url} target="_blank" className="text-primary hover:underline">
                          View
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
