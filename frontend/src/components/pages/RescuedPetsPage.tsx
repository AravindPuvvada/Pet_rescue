import React, { useState, useEffect } from 'react';
import { Heart, MapPin, Calendar, Send, Search } from 'lucide-react';
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
interface PetReport {
  id: number;
  pet: Pet;
  image?: string;
  created_date: string;
}

const RescuedPetsPage: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [filteredPets, setFilteredPets] = useState<Pet[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRescuedPets();
  }, []);

  useEffect(() => {
    // Filter pets based on search term
    const filtered = pets.filter(pet =>
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.pet_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.state.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPets(filtered);
  }, [pets, searchTerm]);

  const fetchRescuedPets = async () => {
  try {
    const response = await apiService.getPetsByTab('found') as { results: PetReport[] };
    
    const petsData: Pet[] = response.results.map((report: PetReport) => ({
      id: report.pet.id,
      name: report.pet.name || 'Unknown',
      pet_type: report.pet.pet_type || '',
      breed: report.pet.breed || '',
      color: report.pet.color || '',
      age: report.pet.age || 0,
      description: report.pet.description || '',
      city: report.pet.city || '',
      state: report.pet.state || '',
      image: report.image || report.pet.image,
      created_date: report.created_date || new Date().toISOString()
    }));
    
    setPets(petsData);
  } catch (error) {
    console.error('Error fetching rescued pets:', error);
  }
};


  const handleClaimRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPet) return;

    setLoading(true);
    try {
      // Create a pet adoption request for claiming
      await apiService.createPetAdoption({
  pet: selectedPet.id,
  message: requestMessage,
  status: 'Pending'
});
      
      // Reset form
      setSelectedPet(null);
      setRequestMessage('');
      alert('Claim request submitted successfully! The rescuer will contact you soon.');
      await fetchRescuedPets();
    } catch (error) {
      console.error('Error submitting claim request:', error);
      alert('Failed to submit claim request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 mt-20">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Rescued Pets</h1>
        <p className="text-gray-600 mt-2">Browse found pets and help reunite them with their families</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by name, type, breed, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Claim Request Form */}
      {selectedPet && (
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Claim Request for {selectedPet.name}
          </h3>
          <form onSubmit={handleClaimRequest} className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              {selectedPet.image && (
                <img
                  src={selectedPet.image}
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
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
              placeholder="Please provide details to verify this is your pet. Include information about when and where they went missing, distinctive features, behavior, or any other identifying information..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Submitting...' : 'Submit Claim'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Rescued Pets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPets.map((pet) => (
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
                <h3 className="text-lg font-semibold text-gray-900">{pet.name || 'Unknown'}</h3>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                  Found
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
                  <span>Found {new Date(pet.created_date).toLocaleDateString()}</span>
                </div>
              </div>
              
              <button
                onClick={() => setSelectedPet(pet)}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-colors text-sm font-medium flex items-center justify-center space-x-2"
              >
                <Heart className="w-4 h-4" />
                <span>This is My Pet</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredPets.length === 0 && pets.length > 0 && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No pets found</h3>
          <p className="text-gray-600">Try adjusting your search terms.</p>
        </div>
      )}

      {pets.length === 0 && (
        <div className="text-center py-12">
          <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No rescued pets yet</h3>
          <p className="text-gray-600">Rescued pets will appear here when they're reported by rescuers.</p>
        </div>
      )}
    </div>
  );
};

export default RescuedPetsPage;