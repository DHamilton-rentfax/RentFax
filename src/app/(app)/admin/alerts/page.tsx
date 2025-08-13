'use client';

import { useEffect, useState } from 'react';
import { getCompanySettings, updateCompanySettings } from '@/app/auth/actions';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function AlertEditorPage() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    getCompanySettings()
      .then((settings) => {
        setMessage(settings?.bannerMessage || '');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateCompanySettings({ bannerMessage: message });
      toast({ title: 'Alert message updated' });
    } catch (e: any) {
      toast({ title: 'Failed to update message', description: e.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl space-y-4">
       <h1 className="text-2xl font-headline">Global Alert Banner</h1>
      <Card>
        <CardHeader>
          <CardTitle>Edit Banner Message</CardTitle>
          <CardDescription>
            Set a global alert message that will be shown to all users in your company. Leave it blank to disable the banner.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <Textarea
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={loading || saving}
            placeholder="E.g., System maintenance scheduled for this Saturday at 10 PM."
          />
        </CardContent>
        <CardFooter>
           <Button onClick={handleSave} disabled={saving || loading}>
            {saving ? <Loader2 className="animate-spin" /> : null}
            {saving ? 'Saving…' : 'Save Message'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
