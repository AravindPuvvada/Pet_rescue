// src/components/forms/UserReportForm.tsx

import React, { useState } from 'react';
import { apiService } from '../../services/api';
import type { Pet } from '../../services/api'; // Corrected: type-only import
import { X } from 'lucide-react';

export type ReportType = 'Sighting' | 'Reclaim' | 'Adoption';

interface UserReportFormProps {
  pet: Pet;
  reportType: ReportType;
  onClose: () => void;
  onSubmitSuccess: (petName: string, reportType: ReportType) => void;
}

const UserReportForm: React.FC<UserReportFormProps> = ({
  pet,
  reportType,
  onClose,
  onSubmitSuccess,
}) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dynamic content based on the report type
  const formContent = {
    Sighting: {
      title: 'Report Sighting',
      prompt: `You are reporting a sighting of`,
      placeholder: `Provide details about where and when you saw ${pet.name}...`,
    },
    Reclaim: {
      title: 'Reclaim Pet',
      prompt: `You are reclaiming ownership of`,
      placeholder: `Provide information to help verify your ownership of ${pet.name}...`,
    },
    Adoption: {
      title: 'Adoption Request',
      prompt: `You are requesting to adopt`,
      placeholder: `Tell us why you'd be a great owner for ${pet.name}...`,
    },
  };

  const { title, prompt, placeholder } = formContent[reportType];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!pet.report_id) {
        throw new Error("Cannot submit report: Original pet report ID is missing.");
      }
      
      await apiService.createUserReport({
        pet_report_id: pet.report_id,
        report_type: reportType,
        message: message,
      });

      onSubmitSuccess(pet.name, reportType);
    } catch (err: unknown) {
    let errorMessage = "An unexpected error occurred. Please try again.";

    if (err instanceof Error) {
      errorMessage = err.message;
    }

    // If this is an Axios-style error
    if (typeof err === "object" && err !== null && "response" in err) {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      errorMessage = axiosErr.response?.data?.error ?? errorMessage;
    }

    console.error("User report submission failed:", err);
    setError(errorMessage);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl p-6 lg:p-8 w-full max-w-lg relative transform transition-all scale-95 hover:scale-100 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
          aria-label="Close form"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <p className="text-gray-600 mt-1">
            {prompt} <span className="font-semibold text-orange-500">{pet.name}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Your Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-shadow"
              placeholder={placeholder}
              required
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="w-full bg-gray-200 text-gray-700 font-semibold px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold px-4 py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Submitting...
                </>
              ) : (
                'Submit Report'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserReportForm;