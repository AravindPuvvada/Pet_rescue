import React from 'react';
import { useState } from 'react';
import type { Pet } from '../../services/api';
import { apiService } from '../../services/api';
import { X } from 'lucide-react';

interface AdoptionRequestFormProps {
  pet: Pet;
  onClose: () => void;
  onSubmitSuccess: (petName: string) => void;
}

const AdoptionRequestForm: React.FC<AdoptionRequestFormProps> = ({ pet, onClose, onSubmitSuccess }) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // This object now correctly matches the PetAdoptionRequest interface
      // and the backend serializer's expectations.
      await apiService.createPetAdoption({
        pet_id: pet.id, // Correctly uses pet_id
        message: message,
        status: 'Pending',
      });
      onSubmitSuccess(pet.name);
    } catch (err) {
      console.error('Adoption request failed:', err);
      setError('An unexpected error occurred while submitting your request. Please try again.');
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
          <h2 className="text-2xl font-bold text-gray-800">Adoption Request</h2>
          <p className="text-gray-600 mt-1">
            You are requesting to adopt <span className="font-semibold text-orange-500">{pet.name}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Your Message (Optional)
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-shadow"
              placeholder={`Tell us why you'd be a great owner for ${pet.name}...`}
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
                'Submit Request'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdoptionRequestForm;

