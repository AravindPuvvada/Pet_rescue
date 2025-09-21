import React, { useState, useEffect, useMemo } from 'react';
import PetCard from '../../components/petcard/PetCard';
import PetDetailsModal from '../../components/pages/PetDetails';
import { apiService } from '../../services/api';
import type { Pet } from '../../services/api';
import { X, Search } from 'lucide-react';

interface InputFilters {
    location: string;
    petType: string;
    color: string;
    breed: string;
}

const getImageUrl = (path: string | undefined) => {
    if (!path) return '';
    const API_BASE_URL = "http://127.0.0.1:8000"; // adjust if different
    return `${API_BASE_URL}${path}`;
};


const LostPetPage: React.FC = () => {
    // State for all pets fetched from API
    const [allPets, setAllPets] = useState<Pet[]>([]);

    // State for Modal Management
    const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

    // Filters the user is currently typing
    const [inputFilters, setInputFilters] = useState<InputFilters>({
        location: '',
        petType: '',
        color: '',
        breed: '',
    });

    // Filters that are actually applied
    const [activeFilters, setActiveFilters] = useState<InputFilters>({
        location: '',
        petType: '',
        color: '',
        breed: '',
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- Data Fetching: Uses apiService.getLostPets() ---
    useEffect(() => {
        const fetchLostPets = async () => {
            try {
                setLoading(true);

                // Fetch data using the specific lost pets API endpoint
                const data = await apiService.getLostPets();

                // Normalize API response to match Pet type exactly
                const normalizedPets: Pet[] = data.lost_pets.map((item) => {
                    const pet = item.pet as Pet; // assert full Pet type
                    return {
                        id: pet.id,
                        name: pet.name,
                        pet_type: pet.pet_type ?? '',
                        breed: pet.breed ?? '',
                        age: pet.age ?? undefined,
                        color: pet.color ?? '',
                        address: pet.address ?? '',
                        city: pet.city ?? '',
                        state: pet.state ?? '',
                        gender: pet.gender ?? '',
                        image: getImageUrl(item.image),
                        description: pet.description,
                        medical_history: pet.medical_history ?? null,
                        is_diseased: pet.is_diseased ?? false,
                        is_vaccinated: pet.is_vaccinated ?? false,
                        created_date: new Date().toISOString(),
                        modified_date: new Date().toISOString(),
                    };
                    });

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

    // --- Filtering Logic ---
    const filteredPets = useMemo(() => {
        const activeLocation = activeFilters.location.toLowerCase();
        const activePetType = activeFilters.petType.toLowerCase();
        const activeColor = activeFilters.color.toLowerCase();
        const activeBreed = activeFilters.breed.toLowerCase();

        if (Object.values(activeFilters).every((val) => val === '')) {
            return allPets;
        }

        return allPets.filter((pet) => {
            // Combine location fields for comprehensive search
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

    // --- Handler Functions ---
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

    // --- Modal Handlers ---
    const handleViewDetails = (pet: Pet) => {
        setSelectedPet(pet);
    };

    const handleCloseModal = () => {
        setSelectedPet(null);
    };

    const handleReportSighting = (pet: Pet) => {
        // Functionality for reporting a sighting of a lost pet
        alert(`Reporting sighting for lost pet ${pet.name}! Initiating report form...`);
    };

    // --- Render Logic ---
    const isAnyFilterActive = Object.values(activeFilters).some((v) => v !== '');
    const petsToDisplay = isAnyFilterActive ? filteredPets : allPets;

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 text-lg">{error}</div>
        );
    }

    return (
        <>
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
                            <input
                                type="text"
                                name="location"
                                value={inputFilters.location}
                                onChange={handleFilterChange}
                                placeholder="e.g., Delhi"
                                className="w-full p-2 border border-gray-300 rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Pet Type</label>
                            <select
                                name="petType"
                                value={inputFilters.petType}
                                onChange={handleFilterChange}
                                className="w-full p-2 border border-gray-300 rounded-lg"
                            >
                                <option value="">All</option>
                                <option value="Dog">Dog</option>
                                <option value="Cat">Cat</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                            <input
                                type="text"
                                name="color"
                                value={inputFilters.color}
                                onChange={handleFilterChange}
                                placeholder="e.g., Brown"
                                className="w-full p-2 border border-gray-300 rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Breed</label>
                            <input
                                type="text"
                                name="breed"
                                value={inputFilters.breed}
                                onChange={handleFilterChange}
                                placeholder="e.g., Labrador"
                                className="w-full p-2 border border-gray-300 rounded-lg"
                            />
                        </div>

                        {/* Apply & Reset Buttons */}
                        <button
                            onClick={handleApplyFilters}
                            className="flex items-center justify-center bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                        >
                            <Search className="w-4 h-4 mr-2" /> Apply
                        </button>
                        <button
                            onClick={resetFilters}
                            className="flex items-center justify-center bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                        >
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
                                // ⭐ Pass the specific button label for Lost Pets
                                reportButtonLabel="Report Sighting"
                            />
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

            {selectedPet && (
                <PetDetailsModal
                    pet={selectedPet}
                    onClose={handleCloseModal}
                    onPrimaryAction={handleReportSighting} // Use the specific report handler
                    primaryButtonLabel="Report Sighting" // Label for lost pet context
                />
            )}
        </>
    );
};

export default LostPetPage;