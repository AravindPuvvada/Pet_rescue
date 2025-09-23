import React, { useState } from 'react';
import type { Pet } from '../../services/api';
import { MapPin, Activity, Info, Send } from 'lucide-react';

// Define the structure for the data this form will submit
export interface ReportData {
  location: string;
  condition: string;
  notes: string;
}

// Define the props for our reusable form component
interface ReportPetFormProps {
  pet: Pet;
  title: string;
  submitButtonLabel: string;
  onClose: () => void;
  onSubmit: (data: ReportData) => Promise<void>;
}

const ReportPetForm: React.FC<ReportPetFormProps> = ({ pet, title, submitButtonLabel, onClose, onSubmit }) => {
  const [location, setLocation] = useState('');
  const [condition, setCondition] = useState('Seems Okay');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!location.trim()) {
      setError('Sighting location is a required field.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      await onSubmit({ location, condition, notes });
    } catch (apiError) {
      console.error("Submission failed:", apiError);
      setError('Could not submit the report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-all animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>

          <div className="bg-gray-50 p-4 rounded-md mb-6 flex items-center gap-4 border border-gray-200">
            <img
              src={pet.image}
              alt={`Photo of ${pet.name}`}
              className="w-20 h-20 object-cover rounded-md"
            />
            <div className="text-sm text-gray-700">
              <p><strong>Name:</strong> {pet.name}</p>
              <p><strong>Breed:</strong> {pet.breed}</p>
              <p><strong>Originally Lost At:</strong> {pet.city}, {pet.state}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="location" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <MapPin className="w-4 h-4 mr-2 text-orange-500" />
                Where did you see the pet? <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Near City Centre Mall, Kolkata"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400"
                required
              />
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>

            <div>
              <label htmlFor="condition" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <Activity className="w-4 h-4 mr-2 text-orange-500" />
                What was the pet's condition?
              </label>
              <select
                id="condition"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-orange-400"
              >
                <option>Seems Okay</option>
                <option>Injured / Limping</option>
                <option>Scared / Anxious</option>
                <option>Malnourished / Thin</option>
                <option>Other (describe in notes)</option>
              </select>
            </div>

            <div>
              <label htmlFor="notes" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <Info className="w-4 h-4 mr-2 text-orange-500" />
                Additional Notes
              </label>
              <textarea
                id="notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., 'It was hiding under a car and seemed friendly.'"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400"
              ></textarea>
            </div>

            <div className="mt-6 flex justify-end gap-4 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center justify-center px-5 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    {submitButtonLabel}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportPetForm;