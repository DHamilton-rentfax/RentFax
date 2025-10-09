'use client'

import { useEffect, useState } from 'react'
import { getAllDisputes } from '@/lib/admin/getAllDisputes'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [disputes, setDisputes] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const router = useRouter()

  useEffect(() => {
    const load = async () => {
      const res = await getAllDisputes()
      setDisputes(res)
      setLoading(false)
    }
    load()
  }, [])

  const filtered = disputes.filter((d) =>
    (d.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (d.description || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-2xl font-semibold font-headline">Admin Dashboard</h1>

      <Card>
        <CardHeader>
          <CardTitle>Dispute Queue</CardTitle>
          <CardDescription>Review and manage all active and past disputes.</CardDescription>
          <Input
            placeholder="Search by renter email or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Renter</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                {filtered.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                            No disputes found.
                        </TableCell>
                    </TableRow>
                ) : (
                    filtered.map((d) => (
                    <TableRow
                        key={d.id}
                        className="cursor-pointer"
                        onClick={() => router.push(`/admin/disputes/${d.id}`)}
                    >
                        <TableCell>
                            <div className="font-medium">{d.name || d.email}</div>
                            <div className="text-sm text-muted-foreground">{d.email}</div>
                        </TableCell>
                        <TableCell>
                        <p className="text-sm text-muted-foreground truncate max-w-xs">
                            {d.description}
                        </p>
                        </TableCell>
                        <TableCell>
                             <Badge>
                                {d.status}
                            </Badge>
                        </TableCell>
                    </TableRow>
                    ))
                )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
