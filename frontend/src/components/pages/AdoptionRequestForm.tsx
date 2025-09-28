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
      <div className="bg-light-neutral dark:bg-dark-background rounded-xl shadow-2xl p-6 lg:p-8 w-full max-w-lg relative transform transition-all scale-95 hover:scale-100 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-light-secondary/60 hover:text-light-secondary dark:text-dark-neutral hover:dark:text-dark-secondary transition-colors"
          aria-label="Close form"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-light-text dark:text-dark-secondary">Adoption Request</h2>
          <p className="text-light-secondary mt-1 dark:text-dark-neutral">
            You are requesting to adopt <span className="font-semibold text-light-accent dark:text-dark-accent">{pet.name}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-medium text-light-text dark:text-dark-neutral mb-2">
              Your Message (Optional)
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 border border-light-primary rounded-lg transition-shadow bg-white text-light-text placeholder:text-light-text/70 focus:ring-2 focus:ring-light-accent focus:border-light-accent dark:bg-dark-primary dark:border-dark-primary/50 dark:text-dark-secondary dark:placeholder:text-dark-neutral dark:focus:ring-dark-accent dark:focus:border-dark-accent"
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
              className="w-full bg-light-primary text-light-secondary font-semibold px-4 py-3 rounded-lg hover:bg-light-secondary/20 transition-colors disabled:opacity-50 dark:bg-dark-primary dark:text-dark-secondary dark:hover:bg-dark-secondary/20"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center bg-light-accent text-white font-semibold px-4 py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed dark:bg-dark-accent"
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