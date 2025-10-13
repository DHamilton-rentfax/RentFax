"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Zod schema for form validation
const incidentSchema = z.object({
  type: z.string().min(1, "Incident type is required"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
  evidence: z.array(z.string()).optional(), // Assuming evidence will be URLs
});

type IncidentFormInputs = z.infer<typeof incidentSchema>;

interface AddIncidentProps {
  renterId: string;
  onIncidentAdded: (incident: any) => void; // Callback after incident is added
}

export const AddIncident = ({
  renterId,
  onIncidentAdded,
}: AddIncidentProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<IncidentFormInputs>({
    resolver: zodResolver(incidentSchema),
  });

  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit: SubmitHandler<IncidentFormInputs> = async (data) => {
    setServerError(null);
    try {
      // Here we would call a server action to create the incident
      console.log("Submitting incident for renter:", renterId, data);

      // const result = await createIncidentAction({ ...data, renterId });
      // if (result.success) {
      //   onIncidentAdded(result.data);
      //   reset();
      // } else {
      //   setServerError(result.error || 'An unknown error occurred.');
      // }

      // Mocking the server action call for now
      const mockIncident = {
        id: `inc_${Date.now()}`,
        ...data,
        renterId,
        createdAt: new Date().toISOString(),
        status: "OPEN",
      };
      onIncidentAdded(mockIncident);
      reset();
    } catch (error) {
      console.error("Failed to submit incident", error);
      setServerError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Report New Incident
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700"
          >
            Incident Type
          </label>
          <select
            id="type"
            {...register("type")}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Select type...</option>
            <option value="LATE_RENT">Late Rent</option>
            <option value="PROPERTY_DAMAGE">Property Damage</option>
            <option value="NOISE_COMPLAINT">Noise Complaint</option>
            <option value="OTHER">Other</option>
          </select>
          {errors.type && (
            <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            {...register("description")}
            rows={4}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Basic file upload - to be improved later */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Evidence (Optional)
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    multiple
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        </div>

        {serverError && <p className="text-red-500 text-sm">{serverError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
        >
          {isSubmitting ? "Submitting..." : "Submit Incident"}
        </button>
      </form>
    </div>
  );
};
