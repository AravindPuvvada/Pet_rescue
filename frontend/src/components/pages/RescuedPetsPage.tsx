// import React, { useState, useEffect, useMemo } from 'react';
// import PetCard from '../../components/petcard/PetCard';
// import PetDetailsModal from '../../components/pages/PetDetails';
// import { apiService } from '../../services/api';
// import type { Pet } from '../../services/api';
// import { X, Search } from 'lucide-react';

// interface InputFilters {
//   location: string;
//   petType: string;
//   color: string;
//   breed: string;
// }

// const getImageUrl = (path: string | undefined) => {
//   if (!path) return '';
//   const API_BASE_URL = "http://127.0.0.1:8000"; // adjust if different
//   return `${API_BASE_URL}${path}`;
// };


// const FoundPetPage: React.FC = () => {
//   // State for all pets fetched from API
//   const [allPets, setAllPets] = useState<Pet[]>([]);

//   // State for Modal Management
//   const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

//   // Filters the user is currently typing
//   const [inputFilters, setInputFilters] = useState<InputFilters>({
//     location: '',
//     petType: '',
//     color: '',
//     breed: '',
//   });

//   // Filters that are actually applied
//   const [activeFilters, setActiveFilters] = useState<InputFilters>({
//     location: '',
//     petType: '',
//     color: '',
//     breed: '',
//   });

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // --- Data Fetching: Uses apiService.getFoundPets() ---
//   useEffect(() => {
//     const fetchFoundPets = async () => {
//       try {
//         setLoading(true);

//         // Fetch data using the specific found pets API endpoint
//         const data = await apiService.getFoundPets();

//         // Normalize API response to match Pet type exactly
//         const normalizedPets: Pet[] = data.found_pets.map((item) => ({
//           id: item.pet.id,
//           name: item.pet.name,
//           pet_type: item.pet.pet_type ?? '',
//           breed: item.pet.breed ?? '',
//           age: item.pet.age ?? undefined,
//           color: item.pet.color ?? '',

//           address: item.pet.address ?? '',
//           city: item.pet.city ?? '',
//           state: item.pet.state ?? '',
//           pincode: item.pet.pincode ?? undefined,
//           gender: item.pet.gender ?? '',

//           image: getImageUrl(item.image),
//           description: item.pet.description,
//           medical_history: item.pet.medical_history ?? null,
//           is_diseased: item.pet.is_diseased ?? false,
//           is_vaccinated: item.pet.is_vaccinated ?? false,
//           created_date: new Date().toISOString(),
//           modified_date: new Date().toISOString(),
//         }));

//         setAllPets(normalizedPets);
//       } catch (err) {
//         console.error(err);
//         setError('Failed to load found pet data. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFoundPets();
//   }, []);

//   // --- Filtering Logic ---
//   const filteredPets = useMemo(() => {
//     const activeLocation = activeFilters.location.toLowerCase();
//     const activePetType = activeFilters.petType.toLowerCase();
//     const activeColor = activeFilters.color.toLowerCase();
//     const activeBreed = activeFilters.breed.toLowerCase();

//     if (Object.values(activeFilters).every((val) => val === '')) {
//       return allPets;
//     }

//     return allPets.filter((pet) => {
//       // Combine location fields for comprehensive search
//       const petLocation = `${String(pet.city || '')} ${String(pet.state || '')} ${String(pet.address || '')}`.toLowerCase();
//       const petType = String(pet.pet_type || '').toLowerCase();
//       const petColor = String(pet.color || '').toLowerCase();
//       const petBreed = String(pet.breed || '').toLowerCase();

//       return (
//         petLocation.includes(activeLocation) &&
//         petType.includes(activePetType) &&
//         petColor.includes(activeColor) &&
//         petBreed.includes(activeBreed)
//       );
//     });
//   }, [allPets, activeFilters]);

//   // --- Handler Functions ---
//   const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setInputFilters((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleApplyFilters = () => {
//     setActiveFilters(inputFilters);
//   };

//   const resetFilters = () => {
//     setInputFilters({ location: '', petType: '', color: '', breed: '' });
//     setActiveFilters({ location: '', petType: '', color: '', breed: '' });
//   };

//   // --- Modal Handlers ---
//   const handleViewDetails = (pet: Pet) => {
//     setSelectedPet(pet);
//   };

//   const handleCloseModal = () => {
//     setSelectedPet(null);
//   };

//   const handleReportMyPet = (pet: Pet) => {
//     // Functionality for an owner claiming their pet
//     alert(`I think I found my pet! Initiating claim process for pet ID ${pet.id}...`);
//   };

//   // --- Render Logic ---
//   const isAnyFilterActive = Object.values(activeFilters).some((v) => v !== '');
//   const petsToDisplay = isAnyFilterActive ? filteredPets : allPets;

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center text-red-500 text-lg">{error}</div>
//     );
//   }

//   return (
//     <>
//       <div className="animate-fade-in container mx-auto p-4">
//         <div className="mb-8">
//           <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Found Pets</h1>
//           <p className="text-lg text-gray-600">These pets have been safely found. Help us locate their owners.</p>
//         </div>

//         {/* Filter UI Section */}
//         <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
//             <div className="lg:col-span-1">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Location (City)</label>
//               <input
//                 type="text"
//                 name="location"
//                 value={inputFilters.location}
//                 onChange={handleFilterChange}
//                 placeholder="e.g., Pune"
//                 className="w-full p-2 border border-gray-300 rounded-lg"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Pet Type</label>
//               <select
//                 name="petType"
//                 value={inputFilters.petType}
//                 onChange={handleFilterChange}
//                 className="w-full p-2 border border-gray-300 rounded-lg"
//               >
//                 <option value="">All</option>
//                 <option value="Dog">Dog</option>
//                 <option value="Cat">Cat</option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
//               <input
//                 type="text"
//                 name="color"
//                 value={inputFilters.color}
//                 onChange={handleFilterChange}
//                 placeholder="e.g., Black"
//                 className="w-full p-2 border border-gray-300 rounded-lg"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Breed</label>
//               <input
//                 type="text"
//                 name="breed"
//                 value={inputFilters.breed}
//                 onChange={handleFilterChange}
//                 placeholder="e.g., Beagle"
//                 className="w-full p-2 border border-gray-300 rounded-lg"
//               />
//             </div>

//             {/* Apply & Reset Buttons */}
//             <button
//               onClick={handleApplyFilters}
//               className="flex items-center justify-center bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
//             >
//               <Search className="w-4 h-4 mr-2" /> Apply
//             </button>
//             <button
//               onClick={resetFilters}
//               className="flex items-center justify-center bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
//             >
//               <X className="w-4 h-4 mr-2" /> Reset
//             </button>
//           </div>
//         </div>

//         {/* Pet List */}
//         {petsToDisplay.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {petsToDisplay.map((pet) => (
//               <PetCard
//                 key={pet.id}
//                 pet={pet}
//                 onViewDetails={handleViewDetails}
//                 // ⭐ Pass the specific handler for claiming the pet
//                 onReport={handleReportMyPet}
//                 // ⭐ Pass the specific button label
//                 reportButtonLabel="Report My Pet"
//               />
//             ))}
//           </div>
//         ) : (
//           <div className="text-center text-gray-500 text-lg py-16">
//             {isAnyFilterActive ? (
//               <p>No pets match the current filters.</p>
//             ) : (
//               <p>No found pets have been reported at the moment.</p>
//             )}
//           </div>
//         )}
//       </div>

//       {selectedPet && (
//         <PetDetailsModal
//           pet={selectedPet}
//           onClose={handleCloseModal}
//           onPrimaryAction={handleReportMyPet} // Use the specific claim handler
//           primaryButtonLabel="Report My Pet" // Label for found pet context
//         />
//       )}
//     </>
//   );
// };

// export default FoundPetPage;

import React, { useState, useEffect, useMemo } from 'react';
import PetCard from '../petcard/PetCard';
import PetDetailsModal from './PetDetails';
import { apiService } from '../../services/api';
import type { Pet } from '../../services/api';
import ReportPetForm, { type ReportData } from '../../components/forms/ReportPetForm';

// --- Input filters interface ---
interface InputFilters {
  location: string;
  petType: string;
  color: string;
  breed: string;
}

// --- Helper function to get image URL ---
const getImageUrl = (path: string | undefined) => {
  if (!path) return '';
  const API_BASE_URL = 'http://127.0.0.1:8000';
  return `${API_BASE_URL}${path}`;
};

const RescuedPetsPage: React.FC = () => {
  const [allPets, setAllPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
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

  // --- Fetch pets from API ---
  useEffect(() => {
    const fetchFoundPets = async () => {
      try {
        setLoading(true);
        const data = await apiService.getFoundPets();

        const normalizedPets: Pet[] = data.found_pets.map((item) => ({
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
          image: getImageUrl(item.image),
          description: item.pet.description,
          medical_history: item.pet.medical_history ?? null,
          is_diseased: item.pet.is_diseased ?? false,
          is_vaccinated: item.pet.is_vaccinated ?? false,
          created_date: new Date().toISOString(),
          modified_date: new Date().toISOString(),
        }));

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

  // --- Filter pets ---
  const filteredPets = useMemo(() => {
    const activeLocation = activeFilters.location.toLowerCase();
    const activePetType = activeFilters.petType.toLowerCase();
    const activeColor = activeFilters.color.toLowerCase();
    const activeBreed = activeFilters.breed.toLowerCase();

    if (Object.values(activeFilters).every((val) => val === '')) {
      return allPets;
    }

    return allPets.filter((pet) => {
      const petLocation = `${String(pet.city || '')} ${String(
        pet.state || ''
      )} ${String(pet.address || '')}`.toLowerCase();
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

  // --- Filter handlers ---
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setInputFilters((prev) => ({ ...prev, [name]: value }));
  };
  const handleApplyFilters = () => setActiveFilters(inputFilters);
  const resetFilters = () => {
    setInputFilters({ location: '', petType: '', color: '', breed: '' });
    setActiveFilters({ location: '', petType: '', color: '', breed: '' });
  };

  // --- Pet card handlers ---
  const handleViewDetails = (pet: Pet) => setSelectedPet(pet);

  const handleCloseModal = () => {
    setSelectedPet(null);
    setIsReporting(false);
  };

  const handleReportMyPet = (pet: Pet) => {
    setSelectedPet(pet);
    setIsReporting(true);
  };

  // --- Submit claim handler ---
  const handleClaimSubmit = async (reportData: ReportData) => {
    if (!selectedPet) throw new Error('No pet selected to claim.');

    const messageForAdmin = `Claim Request Details:
Claimant Location: ${reportData.location}
Pet's Sighted Condition: ${reportData.condition}
Notes: ${reportData.notes || 'N/A'}`;

    const payload = { pet_id: selectedPet.id, message: messageForAdmin };

    try {
      await apiService.createPetAdoption(payload);
      alert(
        `Your claim for ${selectedPet.name} has been submitted for admin review!`
      );
      handleCloseModal();
    } catch (apiError) {
      alert(`Error: Could not submit your claim. Please try again.`);
      throw apiError;
    }
  };

  // --- Render ---
  const isAnyFilterActive = Object.values(activeFilters).some((v) => v !== '');
  const petsToDisplay = isAnyFilterActive ? filteredPets : allPets;

  return (
    <>
      <div className="animate-fade-in container mx-auto p-4">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
            Rescued Pets
          </h1>
          <p className="text-lg text-gray-600">
            These pets have been safely found. Help us locate their owners.
          </p>
        </div>

        {/* --- Filter UI goes here --- */}

        {petsToDisplay.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {petsToDisplay.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                onViewDetails={handleViewDetails}
                onReport={handleReportMyPet}
                reportButtonLabel="Report My Pet"
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 text-lg py-16">
            No pets found matching your filters.
          </div>
        )}
      </div>

      {/* --- Modals --- */}
      {selectedPet && !isReporting && (
        <PetDetailsModal
          pet={selectedPet}
          onClose={handleCloseModal}
          onPrimaryAction={handleReportMyPet}
          primaryButtonLabel="Report My Pet"
        />
      )}

      {selectedPet && isReporting && (
        <ReportPetForm
          pet={selectedPet}
          onClose={handleCloseModal}
          onSubmit={handleClaimSubmit}
          title={`Report My Pet: ${selectedPet.name}`}
          submitButtonLabel="Submit Claim"
        />
      )}
    </>
  );
};

export default RescuedPetsPage;
