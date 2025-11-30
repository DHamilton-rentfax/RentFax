'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AlertTriangle } from 'lucide-react';

import { useToast } from '@/hooks/use-toast';
import HIPAASafeUploadZone from '@/components/ui/HIPAASafeUploadZone';

// Updated Zod schema to include the consent checkbox
const incidentSchema = z.object({
  type: z.string().min(1, 'Incident type is required'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters long'),
  evidence: z.array(z.string()).optional(),
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must confirm that your submission contains no medical information.',
  }),
});

type IncidentFormInputs = z.infer<typeof incidentSchema>;

interface AddIncidentProps {
  renterId: string;
  onIncidentAdded: (incident: any) => void;
}

const forbiddenKeywords = ["diagnosis", "medical", "hospital", "therapy", "medication", "doctor"];

function validateTextInput(text: string): boolean {
  return !forbiddenKeywords.some((word) =>
    text.toLowerCase().includes(word.toLowerCase())
  );
}

export const AddIncident = ({
  renterId,
  onIncidentAdded,
}: AddIncidentProps) => {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<IncidentFormInputs>({
    resolver: zodResolver(incidentSchema),
  });

  const [serverError, setServerError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onSubmit: SubmitHandler<IncidentFormInputs> = async (data) => {
    setServerError(null);

    if (!validateTextInput(data.description)) {
      toast({
        title: 'Upload Rejected',
        description: 'Your report contains potential medical information. Please remove it before submitting.',
        variant: 'destructive',
      });
      return;
    }

    try {
      console.log('Submitting incident for renter:', renterId, data);
      console.log('File to upload:', selectedFile);

      const mockIncident = {
        id: `inc_${Date.now()}`,
        ...data,
        renterId,
        createdAt: new Date().toISOString(),
        status: 'OPEN',
      };
      onIncidentAdded(mockIncident);
      reset();
      setSelectedFile(null);
    } catch (error) {
      console.error('Failed to submit incident', error);
      setServerError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Report New Incident
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">Incident Type</label>
          <select
            id="type"
            {...register('type')}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Select type...</option>
            <option value="LATE_RENT">Late Rent</option>
            <option value="PROPERTY_DAMAGE">Property Damage</option>
            <option value="NOISE_COMPLAINT">Noise Complaint</option>
            <option value="OTHER">Other</option>
          </select>
          {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            {...register('description')}
            rows={4}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          ></textarea>
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>

        <HIPAASafeUploadZone onFileSelect={setSelectedFile} />

        {serverError && <p className="text-red-500 text-sm">{serverError}</p>}

        <div className="mt-6 bg-red-50 border border-red-300 p-3 rounded-xl text-sm text-red-800 flex items-center gap-2">
          <AlertTriangle size={18} className="text-red-600" />
          <span>
            <strong>Reminder:</strong> Do not include any medical or health-related information in your incident description or uploads.
          </span>
        </div>

        <div className="mt-4">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="consent"
                {...register('consent')}
                type="checkbox"
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="consent" className="font-medium text-gray-700">
                I confirm that no medical or health-related data is included in this submission.
              </label>
            </div>
          </div>
          {errors.consent && (
            <p className="text-red-500 text-xs mt-1">{errors.consent.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Incident'}
        </button>
      </form>
    </div>
  );
};
