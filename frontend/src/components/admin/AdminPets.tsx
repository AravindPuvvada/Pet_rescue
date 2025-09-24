// import React, { useState, useEffect } from 'react';
// import { Heart, MapPin, Calendar, User, X } from 'lucide-react';
// import { apiService } from '../../services/api';
// import type { Pet } from '../../services/api';

// const AdminPets: React.FC = () => {
//   const [pets, setPets] = useState<Pet[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

//   useEffect(() => {
//     fetchPets();
//   }, []);

//   const fetchPets = async () => {
//     try {
//       setLoading(true);
//       const petData = await apiService.getPets();
//       setPets(petData);
//     } catch (error) {
//       console.error('Error fetching pets:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredPets = pets.filter(
//     (pet) =>
//       pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (typeof pet.pet_type === 'string'
//         ? pet.pet_type
//         : pet.pet_type?.type || ''
//       )
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase()) ||
//       (pet.breed || '').toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Pets Management</h1>
//           <p className="text-gray-600 mt-2">View and manage all pets in the system</p>
//         </div>
//         <div className="bg-pink-100 text-pink-800 px-4 py-2 rounded-lg font-medium">
//           Total Pets: {pets.length}
//         </div>
//       </div>

//       {/* Search */}
//       <div className="bg-white rounded-lg shadow p-4">
//         <input
//           type="text"
//           placeholder="Search pets by name, type, or breed..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
//         />
//       </div>

//       {/* Pets Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredPets.map((pet) => (
//           <div
//             key={pet.id}
//             className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow cursor-pointer"
//             onClick={() => setSelectedPet(pet)}
//           >
//             {pet.image && (
//               <img
//                 src={apiService.getImageUrl(pet.image)}
//                 alt={pet.name}
//                 className="w-full h-48 object-cover"
//               />
//             )}
//             <div className="p-4">
//               <div className="flex justify-between items-start mb-2">
//                 <h3 className="text-lg font-semibold text-gray-900">{pet.name}</h3>
//                 <div className="flex space-x-1">
//                   {pet.is_vaccinated && (
//                     <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
//                       Vaccinated
//                     </span>
//                   )}
//                   {pet.is_diseased && (
//                     <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
//                       Diseased
//                     </span>
//                   )}
//                 </div>
//               </div>

//               <p className="text-gray-600 text-sm mb-2">
//                 {typeof pet.pet_type === 'string'
//                   ? pet.pet_type
//                   : pet.pet_type?.type || 'Unknown'}{' '}
//                 • {pet.breed || 'Mixed'}
//               </p>

//               <p className="text-gray-600 text-sm mb-3 line-clamp-2">{pet.description}</p>

//               <div className="space-y-2">
//                 <div className="flex items-center text-gray-500 text-xs space-x-4">
//                   <div className="flex items-center space-x-1">
//                     <MapPin className="w-3 h-3" />
//                     <span>
//                       {pet.city}, {pet.state}
//                     </span>
//                   </div>
//                   <div className="flex items-center space-x-1">
//                     <Calendar className="w-3 h-3" />
//                     <span>{pet.age} years</span>
//                   </div>
//                 </div>

//                 {pet.created_by && (
//                   <div className="flex items-center space-x-2 text-xs text-gray-500">
//                     <User className="w-3 h-3" />
//                     <span>Added by {pet.created_by.username}</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {filteredPets.length === 0 && (
//         <div className="text-center py-12">
//           <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//           <h3 className="text-lg font-medium text-gray-900 mb-2">No pets found</h3>
//           <p className="text-gray-600">Try adjusting your search terms.</p>
//         </div>
//       )}

//       {/* Pet Detail Modal */}
//       {selectedPet && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-6 relative overflow-y-auto max-h-[90vh]">
//             {/* Close button */}
//             <button
//               onClick={() => setSelectedPet(null)}
//               className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
//             >
//               <X className="w-6 h-6" />
//             </button>

//             {/* Image */}
//             {selectedPet.image && (
//               <img
//                 src={apiService.getImageUrl(selectedPet.image)}
//                 alt={selectedPet.name}
//                 className="w-full h-64 object-cover rounded-lg mb-6"
//               />
//             )}

//             {/* Pet Details */}
//             <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedPet.name}</h2>
//             <p className="text-gray-600 mb-4">{selectedPet.description}</p>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <p><span className="font-medium">Type:</span> {typeof selectedPet.pet_type === 'string' ? selectedPet.pet_type : selectedPet.pet_type?.type}</p>
//                 <p><span className="font-medium">Breed:</span> {selectedPet.breed || 'Mixed'}</p>
//                 <p><span className="font-medium">Color:</span> {selectedPet.color}</p>
//                 <p><span className="font-medium">Age:</span> {selectedPet.age} years</p>
//                 <p><span className="font-medium">Weight:</span> {selectedPet.weight} kg</p>
//               </div>
//               <div>
//                 <p><span className="font-medium">Gender:</span> {selectedPet.gender}</p>
//                 <p><span className="font-medium">City:</span> {selectedPet.city}</p>
//                 <p><span className="font-medium">State:</span> {selectedPet.state}</p>
//                 <p><span className="font-medium">Pincode:</span> {selectedPet.pincode}</p>
//                 <p><span className="font-medium">Vaccinated:</span> {selectedPet.is_vaccinated ? 'Yes' : 'No'}</p>
//                 <p><span className="font-medium">Diseased:</span> {selectedPet.is_diseased ? 'Yes' : 'No'}</p>
//               </div>
//             </div>

//             <div className="mt-6 text-sm text-gray-500">
//               <p>Created: {new Date(selectedPet.created_date).toLocaleDateString()}</p>
//               <p>Last Updated: {new Date(selectedPet.modified_date).toLocaleDateString()}</p>
//               {selectedPet.created_by && <p>Added by: {selectedPet.created_by.username}</p>}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminPets;


// import React, { useState, useEffect } from 'react';
// import { Heart, MapPin, Calendar, User, X } from 'lucide-react';
// import { apiService } from '../../services/api';
// import type { Pet } from '../../services/api';

// const AdminPets: React.FC = () => {
//  const [pets, setPets] = useState<Pet[]>([]);
//  const [loading, setLoading] = useState(true);
//  const [searchTerm, setSearchTerm] = useState('');
//  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

//  useEffect(() => {
//   fetchPets();
//  }, []);

//  const fetchPets = async () => {
//  try {
//   setLoading(true);
//   const petData = await apiService.getPets();
//   setPets(petData);
//  } catch (error) {
//   console.error('Error fetching pets:', error);
//  } finally {
//   setLoading(false);
//  }
//  };

//  const filteredPets = pets.filter(
//  (pet) =>
//  pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//  (typeof pet.pet_type === 'string'
//   ? pet.pet_type
//   : pet.pet_type?.type || ''
//  )
//  .toLowerCase() 
//  .includes(searchTerm.toLowerCase()) ||
//  (pet.breed || '').toLowerCase().includes(searchTerm.toLowerCase())
//  );

//  if (loading) {
//  return (
//  <div className="flex items-center justify-center h-64">
//  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
//  </div>
//  );
//  }

//  return (
//  <div className="space-y-6 bg-[#E8E0D3] min-h-screen text-black dark:text-white p-6">
//  {/* Header */}
//  <div className="flex justify-between items-center">
//  <div>
//    <h1 className="text-3xl font-bold text-[#5B4438] dark:text-gray-800">Pets Management</h1>
//  <p className="text-black dark:text-gray-500 mt-2">View and manage all pets in the system</p>
//  </div>
//  <div className="bg-pink-100 text-pink-800 dark:bg-pink-800 dark:text-pink-100 px-4 py-2 rounded-lg font-medium dark:bg-green-500 dark:text-black">
//  Total Pets: {pets.length}
//  </div>
//  </div>

//  {/* Search */}
//  <div className="bg-[#F5EFE6] dark:bg-gray-800 rounded-lg shadow p-4 border border-[#5B4438]/20 dark:border-gray-700">
//  <input
//  type="text"
//  placeholder="Search pets by name, type, or breed..."
//  value={searchTerm}
//  onChange={(e) => setSearchTerm(e.target.value)}
//  className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
//  />
//  </div>

//  {/* Pets Grid */}
//  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//  {filteredPets.map((pet) => (
//  <div
//  key={pet.id}
//  className="bg-[#F5EFE6] dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-[#5B4438]/20 dark:border-gray-700 hover:shadow-xl transition-shadow cursor-pointer"
//  onClick={() => setSelectedPet(pet)}
//  >
//  {pet.image && (
//  <img
//  src={apiService.getImageUrl(pet.image)}
//  alt={pet.name}
//  className="w-full h-48 object-cover"
//  />
//  )}
//  <div className="p-4">
//  <div className="flex justify-between items-start mb-2">
//  <h3 className="text-lg font-semibold text-[#5B4438] dark:text-white">{pet.name}</h3>
//  <div className="flex space-x-1">
//  {pet.is_vaccinated && (
//  <span className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 text-xs font-medium px-2 py-1 rounded-full">
//  Vaccinated
//  </span>
//  )}
//  {pet.is_diseased && (
//  <span className="bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100 text-xs font-medium px-2 py-1 rounded-full">
//  Diseased
//  </span>
//  )}
//  </div>
//  </div>

//  <p className="text-black dark:text-gray-300 text-sm mb-2">
//  {typeof pet.pet_type === 'string'
//  ? pet.pet_type
//  : pet.pet_type?.type || 'Unknown'}{' '}
//  • {pet.breed || 'Mixed'}
//  </p>

//  <p className="text-black dark:text-gray-300 text-sm mb-3 line-clamp-2">{pet.description}</p>

//  <div className="space-y-2">
//  <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs space-x-4">
//  <div className="flex items-center space-x-1">
//  <MapPin className="w-3 h-3" />
//  <span>
//  {pet.city}, {pet.state}
//  </span>
//  </div>
//  <div className="flex items-center space-x-1">
//  <Calendar className="w-3 h-3" />
//  <span>{pet.age} years</span>
//  </div>
//  </div>

//  {pet.created_by && (
//  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
//  <User className="w-3 h-3" />
//  <span>Added by {pet.created_by.username}</span>
//  </div>
//  )}
//  </div>
//  </div>
//  </div>
//  ))}
//  </div>

//  {filteredPets.length === 0 && (
//  <div className="text-center py-12 text-[#5B4438] dark:text-white">
//  <Heart className="w-12 h-12 text-[#5B4438]/50 dark:text-gray-500 mx-auto mb-4" />
//  <h3 className="text-lg font-medium mb-2">No pets found</h3>
//  <p className="text-black dark:text-gray-300">Try adjusting your search terms.</p>
//  </div>
//  )}

//  {/* Pet Detail Modal */}
//  {selectedPet && (
//  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//  <div className="bg-[#F5EFE6] dark:bg-gray-800 w-full max-w-3xl rounded-lg shadow-lg p-6 relative overflow-y-auto max-h-[90vh]">
//  {/* Close button */}
//  <button
//  onClick={() => setSelectedPet(null)}
//  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
//  >
//  <X className="w-6 h-6" />
//  </button>

//  {/* Image */}
//  {selectedPet.image && (
//  <img
//  src={apiService.getImageUrl(selectedPet.image)}
//  alt={selectedPet.name}
//  className="w-full h-64 object-cover rounded-lg mb-6"
//  />
//  )}

//  {/* Pet Details */}
//  <h2 className="text-2xl font-bold text-[#5B4438] dark:text-white mb-2">{selectedPet.name}</h2>
//  <p className="text-black dark:text-gray-300 mb-4">{selectedPet.description}</p>
//  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> <div> <p className="text-black dark:text-white"><span className="font-medium">Type:</span> {typeof selectedPet.pet_type === 'string' ? selectedPet.pet_type : selectedPet.pet_type?.type}</p> <p className="text-black dark:text-white"><span className="font-medium">Breed:</span> {selectedPet.breed || 'Mixed'}</p> <p className="text-black dark:text-white"><span className="font-medium">Color:</span> {selectedPet.color}</p> <p className="text-black dark:text-white"><span className="font-medium">Age:</span> {selectedPet.age} years</p> <p className="text-black dark:text-white"><span className="font-medium">Weight:</span> {selectedPet.weight} kg</p> </div> <div> <p className="text-black dark:text-white"><span className="font-medium">Gender:</span> {selectedPet.gender}</p> <p className="text-black dark:text-white"><span className="font-medium">City:</span> {selectedPet.city}</p> <p className="text-black dark:text-white"><span className="font-medium">State:</span> {selectedPet.state}</p> <p className="text-black dark:text-white"><span className="font-medium">Pincode:</span> {selectedPet.pincode}</p>
//   <p className="text-black dark:text-white"><span className="font-medium">Vaccinated:</span> {selectedPet.is_vaccinated ? 'Yes' : 'No'}</p>
//  <p className="text-black dark:text-white"><span className="font-medium">Diseased:</span> {selectedPet.is_diseased ? 'Yes' : 'No'}</p>
//  </div>
//  </div>

//  <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
//  <p>Created: {new Date(selectedPet.created_date).toLocaleDateString()}</p>
//  <p>Last Updated: {new Date(selectedPet.modified_date).toLocaleDateString()}</p>
//  {selectedPet.created_by && <p>Added by: {selectedPet.created_by.username}</p>}
//  </div>
//  </div>
//  </div>
//  )}
//  </div>
//  );
// };

// export default AdminPets;

import React, { useState, useEffect, useMemo } from 'react';
import PetCard from '../petcard/PetCard';
import PetDetailsModal from '../pages/PetDetails';
import { apiService } from '../../services/api';
import type { Pet } from '../../services/api';
import { X, Search } from 'lucide-react'; // Re-added for filter buttons

// ✨ NEW: Import the reusable form and its data type
import ReportPetForm, { type ReportData } from '../forms/ReportPetForm';

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

const AdminPets: React.FC = () => {
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
                    // primaryButtonLabel="Report Sighting"
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

export default AdminPets;