
'use client'

import { useEffect, useState } from 'react'
import { getSystemSettings } from '@/lib/super-admin/getSystemSettings'
import { updateSystemSettings } from '@/lib/super-admin/updateSystemSettings'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'

export default function SuperAdminSettings() {
  const [settings, setSettings] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      const res = await getSystemSettings()
      setSettings(res)
    }
    load()
  }, [])

  const toggle = (key: string) =>
    setSettings({ ...settings, [key]: !settings[key] })

  const handleSave = async () => {
    setSaving(true)
    await updateSystemSettings(settings)
    setSaving(false)
  }

  if (!settings) return <p>Loading settings...</p>

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold">System Settings</h1>

        <Card>
          <CardHeader>
            <CardTitle>Global Toggles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {['aiModeration', 'billingEnabled', 'emailNotifications'].map((key) => (
              <div key={key} className="flex items-center justify-between">
                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                <Switch
                  checked={settings[key]}
                  onCheckedChange={() => toggle(key)}
                />
              </div>
            ))}
            <Button
              className="mt-4 bg-primary hover:bg-primary/90"
              disabled={saving}
              onClick={handleSave}
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
