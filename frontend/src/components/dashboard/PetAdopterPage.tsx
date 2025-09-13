import React, { useState, useEffect } from 'react';
import { Heart, MapPin, Calendar, Send } from 'lucide-react';
import { apiService } from '../../services/api';

interface Pet {
  id: number;
  name: string;
  pet_type: string;
  breed: string;
  color: string;
  age: number;
  description: string;
  city: string;
  state: string;
  image?: string;
  created_date: string;
}
interface PetAdoption {
  id: number;
  pet: Pet;
  created_date: string;
}

const PetAdopterPage: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [adoptionMessage, setAdoptionMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchAvailablePets();
  }, []);

  const fetchAvailablePets = async () => {
  try {
    const response = await apiService.getPetsByTab('adopt') as { results: PetAdoption[] };

    // Convert PetAdoption format to Pet format for display
    const petsData: Pet[] = response.results.map((adoption: PetAdoption) => ({
      id: adoption.pet.id,
      name: adoption.pet.name,
      pet_type: adoption.pet.pet_type || '',
      breed: adoption.pet.breed || '',
      color: adoption.pet.color || '',
      age: adoption.pet.age || 0,
      description: adoption.pet.description || '',
      city: adoption.pet.city || '',
      state: adoption.pet.state || '',
      image: adoption.pet.image,
      created_date: adoption.created_date || new Date().toISOString()
    }));

    setPets(petsData);
  } catch (error) {
    console.error('Error fetching pets:', error);
    setMessage({ text: 'Failed to fetch available pets', type: 'error' });
  }
};


  const handleAdoptionRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPet) return;

    setLoading(true);
    try {
      await apiService.createPetAdoption({
        pet: selectedPet.id,
        message: adoptionMessage,
        status: 'Pending'
      });
      
      // Reset form
      setSelectedPet(null);
      setAdoptionMessage('');
      setMessage({ text: 'Adoption request submitted successfully!', type: 'success' });
      await fetchAvailablePets();
    } catch (error) {
      console.error('Error submitting adoption request:', error);
      setMessage({ text: 'Failed to submit adoption request', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Available for Adoption</h2>
        <p className="text-gray-600">Find your perfect companion and give them a loving home</p>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
          {message.text}
        </div>
      )}
      {/* Adoption Request Form */}
      {selectedPet && (
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Adoption Request for {selectedPet.name}
          </h3>
          <form onSubmit={handleAdoptionRequest} className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              {selectedPet.image && (
                <img
                  src={apiService.getImageUrl(selectedPet.image)}
                  alt={selectedPet.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              )}
              <div>
                <h4 className="font-semibold text-gray-900">{selectedPet.name}</h4>
                <p className="text-gray-600 text-sm">{selectedPet.pet_type} • {selectedPet.breed}</p>
                <p className="text-gray-500 text-xs">{selectedPet.city}, {selectedPet.state}</p>
              </div>
            </div>
            
            <textarea
              value={adoptionMessage}
              onChange={(e) => setAdoptionMessage(e.target.value)}
              placeholder="Tell us why you want to adopt this pet. Include information about your living situation, experience with pets, and how you plan to care for them..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={6}
              required
            />
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setSelectedPet(null)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Submitting...' : 'Submit Request'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Available Pets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pets.map((pet) => (
          <div key={pet.id} className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
            {pet.image && (
              <img
                src={apiService.getImageUrl(pet.image)}
                alt={pet.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{pet.name}</h3>
                <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">
                  Available
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-2">{pet.pet_type} • {pet.breed}</p>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{pet.description}</p>
              
              <div className="flex items-center text-gray-500 text-xs space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>{pet.city}, {pet.state}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{pet.age} years old</span>
                </div>
              </div>
              
              <button
                onClick={() => setSelectedPet(pet)}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors text-sm font-medium flex items-center justify-center space-x-2"
              >
                <Heart className="w-4 h-4" />
                <span>Request Adoption</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {pets.length === 0 && (
        <div className="text-center py-12">
          <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No pets available for adoption</h3>
          <p className="text-gray-600">Check back later for pets looking for their forever homes.</p>
        </div>
      )}
    </div>
  );
};

export default PetAdopterPage;