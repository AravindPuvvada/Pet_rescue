import React, { useState, useEffect, useMemo } from 'react';
import PetCard from '../petcard/PetCard';
import PetDetailsModal from './PetDetails';
import AdoptionRequestForm from './AdoptionRequestForm';
import type { Pet } from '../../services/api';
import { apiService } from '../../services/api';

interface InputFilters {
  location: string;
  petType: string;
  color: string;
  breed: string;
}

const getImageUrl = (path: string | undefined) => {
  if (!path) return '';
  // Ensure this matches your backend's base URL
  const API_BASE_URL = "http://127.0.0.1:8000";
  return `${API_BASE_URL}${path}`;
};

const AdoptionPage: React.FC = () => {
  const [allPets, setAllPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [petToAdopt, setPetToAdopt] = useState<Pet | null>(null);
  const [inputFilters, setInputFilters] = useState<InputFilters>({
    location: '',
    petType: '',
    color: '',
    breed: '',
  });
  const [activeFilters, setActiveFilters] = useState<InputFilters>({
    location: '',
    petType: '',
    color: '',
    breed: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdoptablePets = async () => {
      try {
        setLoading(true);
        // ⭐ Step 1: Call the new, dedicated API endpoint for adoptable pets.
        const data = await apiService.getAdoptablePets();

        // ⭐ Step 2: Use the 'adoptable_pets' key from the response.
        const normalizedPets: Pet[] = data.adoptable_pets.map((item) => ({
          id: item.pet.id,
          name: item.pet.name,
          pet_type: item.pet.pet_type ?? '',
          breed: item.pet.breed ?? '',
          age: item.pet.age ?? undefined,
          color: item.pet.color ?? '',
          address: item.pet.address ?? '',
          city: item.pet.city ?? '',
          state: item.pet.state ?? '',
          pincode: item.pet.pincode ?? undefined,
          gender: item.pet.gender ?? '',
          image: getImageUrl(item.image), // Image comes from the report object
          description: item.pet.description,
          medical_history: item.pet.medical_history ?? null,
          is_diseased: item.pet.is_diseased ?? false,
          is_vaccinated: item.pet.is_vaccinated ?? false,
          created_date: item.created_date ?? new Date().toISOString(),
          modified_date: new Date().toISOString(), // This can be adjusted if needed
        }));
        setAllPets(normalizedPets);
      } catch (err) {
        console.error(err);
        setError('Failed to load adoptable pet data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdoptablePets();
  }, []);

  const filteredPets = useMemo(() => {
    const activeLocation = activeFilters.location.toLowerCase();
    const activePetType = activeFilters.petType.toLowerCase();
    const activeColor = activeFilters.color.toLowerCase();
    const activeBreed = activeFilters.breed.toLowerCase();

    if (Object.values(activeFilters).every((val) => val === '')) {
      return allPets;
    }

    return allPets.filter((pet) => {
      const petLocation = `${String(pet.city || '')} ${String(pet.state || '')} ${String(
        pet.address || ''
      )}`.toLowerCase();
      const petType = String(pet.pet_type || '').toLowerCase();
      const petColor = String(pet.color || '').toLowerCase();
      const petBreed = String(pet.breed || '').toLowerCase();

      return (
        petLocation.includes(activeLocation) &&
        petType.includes(activePetType) &&
        petColor.includes(activeColor) &&
        petBreed.includes(activeBreed)
      );
    });
  }, [allPets, activeFilters]);



  const handleViewDetails = (pet: Pet) => setSelectedPet(pet);
  const handleCloseModal = () => setSelectedPet(null);

  const handleOpenAdoptionForm = (pet: Pet) => {
    setSelectedPet(null); // Close details modal if open
    setPetToAdopt(pet);
  };
  
  const handleCloseAdoptionForm = () => setPetToAdopt(null);

  const handleAdoptionSuccess = (petName: string) => {
    alert(`Your adoption request for ${petName} has been submitted!`);
    handleCloseAdoptionForm();
  };

  const petsToDisplay = filteredPets;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 text-lg p-8">{error}</div>;
  }

  return (
    <>
      <div className="animate-fade-in container mx-auto p-4">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2 dark:text-dark-secondary">Adopt a Pet</h1>
          <p className="text-lg text-gray-600 dark:text-dark-neutral">Find your new best friend. These lovely pets are looking for a forever home.</p>
        </div>

        {/* You can re-insert your filter UI section here */}

        {petsToDisplay.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {petsToDisplay.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                onViewDetails={handleViewDetails}
                onReport={() => handleOpenAdoptionForm(pet)}
                reportButtonLabel="Request to Adopt"
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 text-lg py-16">
            <p>No pets are available for adoption at the moment.</p>
          </div>
        )}
      </div>

      {selectedPet && (
        <PetDetailsModal
          pet={selectedPet}
          onClose={handleCloseModal}
          onPrimaryAction={() => handleOpenAdoptionForm(selectedPet)}
          primaryButtonLabel="Request to Adopt"
        />
      )}

      {petToAdopt && (
        <AdoptionRequestForm
          pet={petToAdopt}
          onClose={handleCloseAdoptionForm}
          onSubmitSuccess={handleAdoptionSuccess}
        />
      )}
    </>
  );
};

export default AdoptionPage;