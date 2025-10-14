'use client';

import { useEffect, useState, useTransition } from 'react';
import { db } from '@/lib/firebase/client';
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { ActivityLog } from '@/components/disputes/ActivityLog';

export default function DisputeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { user, role, businessId } = useAuth();
  const router = useRouter();

  const [dispute, setDispute] = useState<any>(null);
  const [status, setStatus] = useState('');
  const [note, setNote] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDispute = async () => {
      try {
        const ref = doc(db, 'disputes', params.id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setDispute({ id: snap.id, ...data });
          setStatus(data.status || '');
          setAssignedTo(data.assignedTo || '');
        } else {
          toast.error('Dispute not found or access denied.');
        }
      } catch (err) {
        console.error(err);
        toast.error('Error loading dispute data.');
      } finally {
        setLoading(false);
      }
    };
    if (params.id) {
      fetchDispute();
    }
  }, [params.id]);

  const handleUpdate = async () => {
    if (!status) {
      toast.error('Status is required to update the dispute.');
      return;
    }

    startTransition(async () => {
      try {
        const ref = doc(db, 'disputes', params.id);
        await updateDoc(ref, {
          status,
          note,
          assignedTo,
          updatedAt: serverTimestamp(),
        });

        await addDoc(collection(db, 'activity_logs'), {
          disputeId: params.id,
          updatedBy: user?.uid,
          note,
          status,
          assignedTo,
          role,
          businessId,
          createdAt: serverTimestamp(),
        });

        setNote('');
        toast.success('✅ Dispute updated successfully');
      } catch (err) {
        console.error(err);
        toast.error('❌ Failed to update dispute.');
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-60">
        <Loader2 className="animate-spin h-8 w-8 text-gray-400" />
      </div>
    );
  }

  if (!dispute) {
    return (
      <div className="text-center p-10">
        <p className="text-lg font-semibold">Dispute Not Found</p>
        <p className="text-gray-500 mt-2">
          This dispute may have been deleted or you may not have permission to view it.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push('/admin/disputes')}
        >
          ← Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dispute Detail</h1>
        <Button
          variant="outline"
          onClick={() => router.push('/admin/disputes')}
        >
          ← Back to Dashboard
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="border rounded-xl p-5 bg-white shadow-sm">
            <h2 className="text-lg font-semibold mb-3">
              Description: <span className="font-normal">{dispute.description}</span>
            </h2>
            <p className="text-sm text-gray-600 mb-2">
              Amount: <span className="font-semibold">${dispute.amount?.toFixed(2)}</span>
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Status: <span className="font-medium text-blue-600">{dispute.status}</span>
            </p>
            <p className="text-sm text-gray-500 mb-2">
              Created: {dispute.createdAt?.toDate().toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500">
              Renter ID: <span className="font-mono text-xs bg-gray-100 p-1 rounded">{dispute.renterId}</span>
            </p>
          </div>

          <div className="border rounded-xl p-5 bg-white shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Update Dispute</h3>
            <div className="space-y-4">
              <Input
                placeholder="Update Status (e.g. Resolved, Under Review)"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              />
              <Textarea
                placeholder="Add a note or resolution comment (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <Input
                placeholder="Assign to a team member (UID or email)"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
              />
              <Button onClick={handleUpdate} disabled={isPending} className="w-full">
                {isPending ? (
                  <><Loader2 className="animate-spin h-4 w-4 mr-2" />Updating...</>
                ) : (
                  <><Save className="h-4 w-4 mr-2" />Save Changes</>
                )}
              </Button>
            </div>
          </div>

          <div className="border rounded-xl p-5 bg-white shadow-sm">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5" /> Evidence & Notes
            </h3>
            {dispute.evidenceUrls?.length ? (
              <ul className="list-disc list-inside space-y-2">
                {dispute.evidenceUrls.map((url: string, i: number) => (
                  <li key={i}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Uploaded Evidence {i + 1}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No evidence has been uploaded for this dispute.</p>
            )}
          </div>
        </div>

        <div className="lg:col-span-1 border rounded-xl p-5 bg-white shadow-sm h-fit">
           <ActivityLog disputeId={params.id} />
        </div>
      </div>
    </div>
  );
}
