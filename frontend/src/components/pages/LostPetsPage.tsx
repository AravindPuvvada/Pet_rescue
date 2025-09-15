import React, { useState, useEffect, useMemo } from 'react';
import PetCard from '../../components/petcard/PetCard';
import { apiService } from '../../services/api';
import type { Pet } from '../../services/api';  // <-- type-only import
import { X, Search } from 'lucide-react';



const LostPetPage: React.FC = () => {
  // State for the complete, unfiltered list of pets
  const [allPets, setAllPets] = useState<Pet[]>([]);
  
  // State for the filter input fields (what the user is typing)
  const [inputFilters, setInputFilters] = useState({
    location: '',
    petType: '',
    color: '',
    breed: '',
  });

  // State for the filters that are actually applied
  const [activeFilters, setActiveFilters] = useState({
    location: '',
    petType: '',
    color: '',
    breed: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  const fetchLostPets = async () => {
    try {
      setLoading(true);

      // Call new API
      const data = await apiService.getLostPets();

      // Flatten the API response into a Pet-like array for UI
      const normalizedPets: Pet[] = data.lost_pets.map(item => ({
        id: item.pet.id,
        name: item.pet.name,
        pet_type: item.pet.pet_type ?? '',
        breed: item.pet.breed ?? '',
        age: item.pet.age ?? undefined,
        color: item.pet.color ?? '',
        image: item.image ?? '', // from the report, not pet
        description: `${item.report_status} - ${item.pet_status}`,
        is_diseased: false, // if not in API, provide default
        is_vaccinated: false, // same
        created_date: new Date().toISOString(), // placeholder
        modified_date: new Date().toISOString(),
      }));

      setAllPets(normalizedPets);
    } catch (err) {
      console.error(err);
      setError('Failed to load lost pet data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  fetchLostPets();
}, []);


  // Filtering logic
  const filteredPets = useMemo(() => {
    if (Object.values(activeFilters).every(val => val === '')) {
      return allPets;
    }
    
    return allPets.filter(pet => {
  const petLocation = String(pet.address || '');
  const petType = String(pet.pet_type || '');
  const petColor = String(pet.color || '');
  const petBreed = String(pet.breed || '');

  return (
    petLocation.toLowerCase().includes(activeFilters.location.toLowerCase()) &&
    petType.toLowerCase().includes(activeFilters.petType.toLowerCase()) &&
    petColor.toLowerCase().includes(activeFilters.color.toLowerCase()) &&
    petBreed.toLowerCase().includes(activeFilters.breed.toLowerCase())
  );
});
  }, [allPets, activeFilters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const handleApplyFilters = () => {
    setActiveFilters(inputFilters);
  };
  
  const resetFilters = () => {
    setInputFilters({ location: '', petType: '', color: '', breed: '' });
    setActiveFilters({ location: '', petType: '', color: '', breed: '' });
  };
  
  const isAnyFilterActive = Object.values(activeFilters).some(value => value !== '');
  const petsToDisplay = isAnyFilterActive ? filteredPets : allPets;

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div></div>;
  }

  if (error) {
    return <div className="text-center text-red-500 text-lg">{error}</div>;
  }

  return (
    <div className="animate-fade-in container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Lost Pets</h1>
        <p className="text-lg text-gray-600">Help us reunite these pets with their families.</p>
      </div>

      {/* Filter UI Section */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Location (City)</label>
            <input type="text" name="location" value={inputFilters.location} onChange={handleFilterChange} placeholder="e.g., Delhi" className="w-full p-2 border border-gray-300 rounded-lg"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pet Type</label>
            <select name="petType" value={inputFilters.petType} onChange={handleFilterChange} className="w-full p-2 border border-gray-300 rounded-lg">
              <option value="">All</option>
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <input type="text" name="color" value={inputFilters.color} onChange={handleFilterChange} placeholder="e.g., Brown" className="w-full p-2 border border-gray-300 rounded-lg"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Breed</label>
            <input type="text" name="breed" value={inputFilters.breed} onChange={handleFilterChange} placeholder="e.g., Labrador" className="w-full p-2 border border-gray-300 rounded-lg"/>
          </div>
          {/* Apply Button */}
          <button onClick={handleApplyFilters} className="flex items-center justify-center bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
            <Search className="w-4 h-4 mr-2"/> Apply
          </button>
          {/* Reset Button */}
          <button onClick={resetFilters} className="flex items-center justify-center bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
            <X className="w-4 h-4 mr-2"/> Reset
          </button>
        </div>
      </div>

      {/* Render the correct list and the contextual message */}
      {petsToDisplay.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {petsToDisplay.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 text-lg py-16">
          {isAnyFilterActive ? (
            <p>No pets match the current filters.</p>
          ) : (
            <p>No lost pets have been reported at the moment.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default LostPetPage;
