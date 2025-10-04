
'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { postDisputeMessage, updateDisputeStatus } from '@/app/auth/actions';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Send } from 'lucide-react';
import { format } from 'date-fns';

type DisputeStatus = 'open' | 'needs_info' | 'resolved' | 'rejected';

export default function DisputeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { user, claims } = useAuth();
  const { toast } = useToast();

  const [dispute, setDispute] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const unsub = onSnapshot(doc(db, 'disputes', id), (doc) => {
      if (doc.exists()) {
        setDispute({ id: doc.id, ...doc.data() });
      } else {
        toast({ title: 'Error', description: 'Dispute not found.', variant: 'destructive' });
        router.push('/dashboard/disputes');
      }
      setLoading(false);
    });
    return () => unsub();
  }, [id, router, toast]);

  const handlePostMessage = async () => {
    if (!newMessage.trim()) return;
    setIsSubmitting(true);
    try {
      await postDisputeMessage({ id: id, text: newMessage.trim() });
      setNewMessage('');
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (status: DisputeStatus) => {
    setIsSubmitting(true);
    try {
      await updateDisputeStatus({ id: id, status });
      toast({ title: 'Success', description: 'Dispute status updated.' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-10 space-y-6">
        <Skeleton className="h-8 w-1/4" />
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="md:col-span-1 h-48 w-full" />
          <Skeleton className="md:col-span-2 h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!dispute) {
    return null;
  }
  
  const canUpdateStatus = claims?.role && ['owner', 'manager', 'agent', 'collections'].includes(claims.role);

  return (
    <div className="p-4 md:p-10">
      <Button variant="outline" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Disputes
      </Button>
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column - Details */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dispute Details</CardTitle>
              <CardDescription>ID: {dispute.id}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Status</p>
                <Badge>{dispute.status}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium">Incident ID</p>
                <p className="text-muted-foreground">{dispute.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Renter ID</p>
                <p className="text-muted-foreground">{dispute.renterId}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Reason</p>
                <p className="text-muted-foreground">{dispute.reason}</p>
              </div>
              <div>
                <p className="text-sm font-medium">SLA Due</p>
                <p className="text-muted-foreground">
                  {format(dispute.slaDueAt.toDate(), 'PPP')}
                </p>
              </div>
            </CardContent>
            {canUpdateStatus && (
                <CardFooter>
                     <Select onValueChange={handleStatusChange} defaultValue={dispute.status} disabled={isSubmitting}>
                        <SelectTrigger>
                            <SelectValue placeholder="Update status..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="needs_info">Needs Info</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                </CardFooter>
            )}
          </Card>
        </div>

        {/* Right Column - Message Thread */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Conversation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4 max-h-[500px] overflow-y-auto p-4 border rounded-md">
                {dispute.messages.map((msg: any, index: number) => (
                  <div
                    key={index}
                    className={`flex flex-col ${
                      msg.uid === user?.uid ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`p-3 rounded-lg max-w-sm ${
                        msg.uid === user?.uid
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {msg.by} - {format(new Date(msg.at), 'p, PPP')}
                    </p>
                  </div>
                ))}
                {dispute.messages.length === 0 && <p className="text-muted-foreground text-center">No messages yet.</p>}
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Textarea
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={isSubmitting}
                className="flex-grow"
              />
              <Button onClick={handlePostMessage} disabled={isSubmitting}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
