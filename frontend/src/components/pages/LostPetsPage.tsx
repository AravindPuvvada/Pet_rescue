import React, { useState, useEffect, useMemo } from 'react';
import PetCard from '../../components/petcard/PetCard';
import PetDetailsModal from '../../components/pages/PetDetails';
import { apiService } from '../../services/api';
import type { Pet } from '../../services/api';
import { X, Search } from 'lucide-react'; // Re-added for filter buttons

// ✨ NEW: Import the reusable form and its data type
import ReportPetForm, { type ReportData } from '../../components/forms/ReportPetForm';

interface InputFilters {
    location: string;
    petType: string;
    color: string;
    breed: string;
}

const API_BASE_URL = "http://127.0.0.1:8000"; // declare globally

const getImageUrl = (path: string | undefined) => {
    if (!path) return '';
    // Assuming the path from the backend might be relative
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}${path}`;
};

const LostPetPage: React.FC = () => {
    const [allPets, setAllPets] = useState<Pet[]>([]);
    const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

    // ✨ NEW: State to control the report form modal's visibility
    const [isReporting, setIsReporting] = useState(false);

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
        const fetchLostPets = async () => {
            try {
                setLoading(true);
                const data = await apiService.getLostPets();
                const normalizedPets: Pet[] = data.lost_pets?.map((item) => ({
                    id: item.pet.id,
                    name: item.pet.name,
                    pet_type: item.pet.pet_type ?? '',
                    breed: item.pet.breed ?? '',
                    age: item.pet.age ?? undefined,
                    color: item.pet.color ?? '',
                    address: item.pet.address ?? '',
                    city: item.pet.city ?? '',
                    state: item.pet.state ?? '',
                    gender: item.pet.gender ?? '',
                    image: getImageUrl(item.image),
                    description: item.pet.description,
                    medical_history: item.pet.medical_history ?? null,
                    is_diseased: item.pet.is_diseased ?? false,
                    is_vaccinated: item.pet.is_vaccinated ?? false,
                    created_date: item.pet.created_date || new Date().toISOString(),
                    modified_date: item.pet.modified_date || new Date().toISOString(),
                })) ?? [];
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

    // --- Handler Functions ---
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setInputFilters((prev) => ({ ...prev, [name]: value }));
    };
    const handleApplyFilters = () => setActiveFilters(inputFilters);
    const resetFilters = () => {
        setInputFilters({ location: '', petType: '', color: '', breed: '' });
        setActiveFilters({ location: '', petType: '', color: '', breed: '' });
    };

    // --- Modal Handlers ---
    const handleViewDetails = (pet: Pet) => setSelectedPet(pet);
    const handleCloseModal = () => {
        setSelectedPet(null);
        setIsReporting(false); // Ensure both modals close
    };

    const handleReportSighting = (pet: Pet) => {
        setSelectedPet(pet);
        setIsReporting(true);
    };

    const handleSightingSubmit = async (reportData: ReportData) => {
        if (!selectedPet) {
            throw new Error('No pet selected for reporting.');
        }

        const payload = {
            pet: selectedPet.id,
            pet_status: 'Found',
        };

        console.log('Submitting sighting report with payload:', payload);
        console.log('User-provided details:', reportData);

        await new Promise((resolve) => setTimeout(resolve, 1000));
        alert(`Thank you! Your sighting report for ${selectedPet.name} has been submitted.`);
        handleCloseModal();
    };

    // --- Render Logic ---
    const isAnyFilterActive = Object.values(activeFilters).some((v) => v !== '');
    const petsToDisplay = isAnyFilterActive ? filteredPets : allPets;
    
    const formInputClasses = "w-full p-2 border rounded-lg bg-light-neutral dark:bg-dark-background text-light-text dark:text-dark-secondary border-light-secondary/40 dark:border-dark-neutral/50 focus:ring-1 focus:ring-light-accent focus:border-light-accent dark:focus:ring-dark-accent dark:focus:border-dark-accent transition";

    if (loading) {
        return (
            <div className="bg-light-neutral dark:bg-dark-background flex justify-center items-center min-h-screen">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-light-accent dark:border-dark-accent"></div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="bg-light-neutral dark:bg-dark-background flex justify-center items-center min-h-screen">
              <div className="text-center text-red-500 dark:text-red-400 text-lg">{error}</div>
            </div>
        );
    }

    return (
        <div className="bg-light-neutral dark:bg-dark-background min-h-screen theme-transition">
            <div className="animate-fade-in container mx-auto p-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-light-text dark:text-dark-secondary mb-2">Lost Pets</h1>
                    <p className="text-lg text-light-secondary dark:text-dark-neutral">Help us reunite these pets with their families.</p>
                </div>
                
                {/* Filter UI */}
                <div className="mb-8 p-6 bg-white dark:bg-dark-primary rounded-lg shadow-md border border-light-primary/50 dark:border-dark-neutral/30 theme-transition">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
                      <div className="lg:col-span-1">
                          <label className="block text-sm font-medium text-light-text dark:text-dark-secondary mb-1">Location (City)</label>
                          <input type="text" name="location" value={inputFilters.location} onChange={handleFilterChange} placeholder="e.g., Delhi" className={formInputClasses}/>
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-light-text dark:text-dark-secondary mb-1">Pet Type</label>
                          <select name="petType" value={inputFilters.petType} onChange={handleFilterChange} className={formInputClasses}>
                              <option value="">All</option>
                              <option value="Dog">Dog</option>
                              <option value="Cat">Cat</option>
                              <option value="Other">Other</option>
                          </select>
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-light-text dark:text-dark-secondary mb-1">Color</label>
                          <input type="text" name="color" value={inputFilters.color} onChange={handleFilterChange} placeholder="e.g., Brown" className={formInputClasses}/>
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-light-text dark:text-dark-secondary mb-1">Breed</label>
                          <input type="text" name="breed" value={inputFilters.breed} onChange={handleFilterChange} placeholder="e.g., Labrador" className={formInputClasses}/>
                      </div>
                      <button onClick={handleApplyFilters} className="flex items-center justify-center bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                          <Search className="w-4 h-4 mr-2" /> Apply
                      </button>
                      <button onClick={resetFilters} className="flex items-center justify-center bg-light-primary dark:bg-dark-neutral/20 text-light-secondary dark:text-dark-neutral px-4 py-2 rounded-lg hover:bg-light-primary/80 dark:hover:bg-dark-neutral/30 transition-colors">
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
                                onReport={handleReportSighting}
                                reportButtonLabel="Report Sighting"
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-light-secondary dark:text-dark-neutral text-lg py-16">
                        No pets found matching your filters.
                    </div>
                )}
            </div>

            {/* Pet Details Modal */}
            {selectedPet && !isReporting && (
                <PetDetailsModal
                    pet={selectedPet}
                    onClose={handleCloseModal}
                    onPrimaryAction={handleReportSighting}
                    primaryButtonLabel="Report Sighting"
                />
            )}

            {/* Report Pet Form Modal */}
            {selectedPet && isReporting && (
                <ReportPetForm
                    pet={selectedPet}
                    onClose={handleCloseModal}
                    onSubmit={handleSightingSubmit}
                    title={`Report Sighting for ${selectedPet.name}`}
                    submitButtonLabel="Submit Sighting"
                />
            )}
        </div>
    );
};

export default LostPetPage;