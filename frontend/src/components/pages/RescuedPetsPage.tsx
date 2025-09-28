import React, { useState, useEffect, useMemo } from 'react';
import PetCard from '../../components/petcard/PetCard';
import PetDetailsModal from '../../components/pages/PetDetails';
import { apiService } from '../../services/api';
import type { Pet } from '../../services/api';
import { X, Search } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import UserReportForm from '../forms/UserReportForm';
import type { ReportType } from '../forms/UserReportForm';

interface InputFilters {
  location: string;
  petType: string;
  color: string;
  breed: string;
}

const getImageUrl = (path: string | undefined) => {
  if (!path) return '';
  return apiService.getImageUrl(path);
};

const FoundPetPage: React.FC = () => {
  const [allPets, setAllPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [isReportFormOpen, setIsReportFormOpen] = useState(false);

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
    const fetchFoundPets = async () => {
      try {
        setLoading(true);
        const data = await apiService.getFoundPets();

        const normalizedPets: Pet[] = data.found_pets.map((item) => {
            const petData = item.pet as Pet;
            return {
                id: petData.id,
                report_id: item.report_id, // **IMPORTANT: Map the report_id**
                name: petData.name,
                pet_type: petData.pet_type ?? '',
                breed: petData.breed ?? '',
                age: petData.age ?? undefined,
                color: petData.color ?? '',
                address: petData.address ?? '',
                city: petData.city ?? '',
                state: petData.state ?? '',
                pincode: petData.pincode ?? undefined,
                gender: petData.gender ?? '',
                image: getImageUrl(item.image),
                description: petData.description,
                medical_history: petData.medical_history ?? null,
                is_diseased: petData.is_diseased ?? false,
                is_vaccinated: petData.is_vaccinated ?? false,
                created_date: item.created_date || new Date().toISOString(),
                modified_date: petData.modified_date || new Date().toISOString(),
            };
        });

        setAllPets(normalizedPets);
      } catch (err) {
        console.error(err);
        setError('Failed to load found pet data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFoundPets();
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
      const petLocation = `${String(pet.city || '')} ${String(pet.state || '')} ${String(pet.address || '')}`.toLowerCase();
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

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    setActiveFilters(inputFilters);
  };

  const resetFilters = () => {
    setInputFilters({ location: '', petType: '', color: '', breed: '' });
    setActiveFilters({ location: '', petType: '', color: '', breed: '' });
  };

  const handleViewDetails = (pet: Pet) => {
    setSelectedPet(pet);
  };

  const handleCloseModal = () => {
    setSelectedPet(null);
  };

  // **Updated Handler to open the form**
  const handleClaimPet = (pet: Pet) => {
    setSelectedPet(pet);
    setIsReportFormOpen(true);
  };

  // **New handlers for the form**
  const handleCloseReportForm = () => {
    setIsReportFormOpen(false);
    setSelectedPet(null);
  };

  const handleReportSubmitSuccess = (petName: string, reportType: ReportType) => {
    handleCloseReportForm();
    toast.success(`'${reportType}' request for ${petName} submitted successfully!`);
  };

  const petsToDisplay = useMemo(() => {
    return Object.values(activeFilters).some(v => v) ? filteredPets : allPets;
  }, [allPets, filteredPets, activeFilters]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 text-lg">{error}</div>;
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="animate-fade-in container mx-auto p-4">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2 dark:text-dark-secondary">Found Pets</h1>
          <p className="text-lg text-gray-600 dark:text-dark-neutral">These pets have been safely found. Help us locate their owners.</p>
        </div>

        {/* Filter UI Section */}
        <div className="mb-8 p-6 bg-light-neutral rounded-lg shadow-md dark:bg-dark-primary">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
                <div className="lg:col-span-1">
                    <label className="block text-sm font-medium text-light-text mb-1 dark:text-dark-secondary">Location (City)</label>
                    <input type="text" name="location" value={inputFilters.location} onChange={handleFilterChange} placeholder="e.g., Pune" className="w-full p-2 border border-light-primary rounded-lg bg-white text-light-text placeholder:text-light-text/70 dark:bg-dark-background dark:border-dark-primary dark:text-dark-secondary dark:placeholder:text-dark-neutral" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-light-text mb-1 dark:text-dark-secondary">Pet Type</label>
                    <select name="petType" value={inputFilters.petType} onChange={handleFilterChange} className="w-full p-2 border border-light-primary rounded-lg bg-white text-light-text dark:bg-dark-background dark:border-dark-primary dark:text-dark-secondary">
                        <option className="bg-white dark:bg-dark-background text-light-text dark:text-dark-secondary" value="">All</option>
                        <option className="bg-white dark:bg-dark-background text-light-text dark:text-dark-secondary" value="Dog">Dog</option>
                        <option className="bg-white dark:bg-dark-background text-light-text dark:text-dark-secondary" value="Cat">Cat</option>
                        <option className="bg-white dark:bg-dark-background text-light-text dark:text-dark-secondary" value="Other">Other</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-light-text mb-1 dark:text-dark-secondary">Color</label>
                    <input type="text" name="color" value={inputFilters.color} onChange={handleFilterChange} placeholder="e.g., Black" className="w-full p-2 border border-light-primary rounded-lg bg-white text-light-text placeholder:text-light-text/70 dark:bg-dark-background dark:border-dark-primary dark:text-dark-secondary dark:placeholder:text-dark-neutral" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-light-text mb-1 dark:text-dark-secondary">Breed</label>
                    <input type="text" name="breed" value={inputFilters.breed} onChange={handleFilterChange} placeholder="e.g., Beagle" className="w-full p-2 border border-light-primary rounded-lg bg-white text-light-text placeholder:text-light-text/70 dark:bg-dark-background dark:border-dark-primary dark:text-dark-secondary dark:placeholder:text-dark-neutral" />
                </div>
                <button onClick={handleApplyFilters} className="flex items-center justify-center bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                    <Search className="w-4 h-4 mr-2" /> Apply
                </button>
                <button onClick={resetFilters} className="flex items-center justify-center bg-light-primary text-light-secondary px-4 py-2 rounded-lg hover:bg-light-secondary/20 transition-colors dark:bg-dark-primary dark:text-dark-secondary dark:hover:bg-dark-secondary/20">
                    <X className="w-4 h-4 mr-2" /> Reset
                </button>
            </div>
        </div>

        {/* Pet List */}
        {petsToDisplay.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {petsToDisplay.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                onViewDetails={handleViewDetails}
                onReport={handleClaimPet}
                reportButtonLabel="Claim as My Pet"
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 text-lg py-16">
            {Object.values(activeFilters).some(v => v) ? (
              <p>No pets match the current filters.</p>
            ) : (
              <p>No found pets have been reported at the moment.</p>
            )}
          </div>
        )}
      </div>

      {/* Pet Details Modal (only show if form is not open) */}
      {selectedPet && !isReportFormOpen && (
        <PetDetailsModal
          pet={selectedPet}
          onClose={handleCloseModal}
          onPrimaryAction={handleClaimPet}
          primaryButtonLabel="Claim as My Pet"
        />
      )}

      {/* User Report Form for Reclaiming a Pet */}
      {isReportFormOpen && selectedPet && (
        <UserReportForm
          pet={selectedPet}
          reportType="Reclaim"
          onClose={handleCloseReportForm}
          onSubmitSuccess={handleReportSubmitSuccess}
        />
      )}
    </>
  );
};

export default FoundPetPage;