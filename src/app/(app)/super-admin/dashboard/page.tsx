'use client'

import { useEffect, useState } from 'react'
import { getAllUsers } from '@/lib/super-admin/getAllUsers'
import { updateUserRole } from '@/lib/super-admin/updateUserRole'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'

function MetricsWidget() {
  const [stats, setStats] = useState<any>(null)
  useEffect(() => {
    fetch('/api/admin/metrics').then(r => r.json()).then(setStats)
  }, [])
  if (!stats) return <p>Loading metrics...</p>
  return (
    <div className="grid grid-cols-3 gap-4 my-6">
      {Object.entries(stats).map(([k,v])=>(
        <div key={k} className="bg-white shadow p-4 rounded text-center">
          <p className="text-xl font-bold">{v as any}</p>
          <p className="text-sm text-gray-500 capitalize">{k.replace(/([A-Z])/g,' $1')}</p>
        </div>
      ))}
    </div>
  )
}

export default function SuperAdminDashboard() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const res = await getAllUsers()
      setUsers(res)
      setLoading(false)
    }
    load()
  }, [])

  const handleRoleChange = async (uid: string, role: string) => {
    await updateUserRole(uid, role)
    setUsers((prev) =>
      prev.map((u) => (u.uid === uid ? { ...u, role } : u))
    )
  }

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    )

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold">Super Admin Dashboard</h1>
        
        <MetricsWidget />

        <Card>
          <CardHeader>
            <CardTitle>Manage Users</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 border-b">
                  <th className="py-2">Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Change Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.uid} className="border-b last:border-none">
                    <td className="py-2">{u.name || '—'}</td>
                    <td>{u.email}</td>
                    <td className="capitalize">{u.role}</td>
                    <td>
                      <Select
                        value={u.role}
                        onValueChange={(val) => handleRoleChange(u.uid, val)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="renter">Renter</SelectItem>
                          <SelectItem value="company">Company</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="superadmin">Super Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
