// import React, { useState, useEffect } from 'react';
// import { Heart, MapPin, Calendar, User } from 'lucide-react';
// import { apiService } from '../../services/api';
// import type { Pet } from '../../services/api';

// const AdminPets: React.FC = () => {
//   const [pets, setPets] = useState<Pet[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');

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

//   const filteredPets = pets.filter(pet =>
//     pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     (typeof pet.pet_type === 'string' ? pet.pet_type : pet.pet_type?.type || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
//     (pet.breed || '').toLowerCase().includes(searchTerm.toLowerCase())
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
//           <div key={pet.id} className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
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
//                 {typeof pet.pet_type === 'string' ? pet.pet_type : pet.pet_type?.type || 'Unknown'} • {pet.breed || 'Mixed'}
//               </p>
              
//               <p className="text-gray-600 text-sm mb-3 line-clamp-2">{pet.description}</p>
              
//               <div className="space-y-2">
//                 <div className="flex items-center text-gray-500 text-xs space-x-4">
//                   <div className="flex items-center space-x-1">
//                     <MapPin className="w-3 h-3" />
//                     <span>{pet.city}, {pet.state}</span>
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
//     </div>
//   );
// };

// export default AdminPets;


import React, { useState, useEffect } from 'react';
import { Heart, MapPin, Calendar, User, X } from 'lucide-react';
import { apiService } from '../../services/api';
import type { Pet } from '../../services/api';

const AdminPets: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const petData = await apiService.getPets();
      setPets(petData);
    } catch (error) {
      console.error('Error fetching pets:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPets = pets.filter(
    (pet) =>
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (typeof pet.pet_type === 'string'
        ? pet.pet_type
        : pet.pet_type?.type || ''
      )
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (pet.breed || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pets Management</h1>
          <p className="text-gray-600 mt-2">View and manage all pets in the system</p>
        </div>
        <div className="bg-pink-100 text-pink-800 px-4 py-2 rounded-lg font-medium">
          Total Pets: {pets.length}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <input
          type="text"
          placeholder="Search pets by name, type, or breed..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
        />
      </div>

      {/* Pets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPets.map((pet) => (
          <div
            key={pet.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => setSelectedPet(pet)}
          >
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
                <div className="flex space-x-1">
                  {pet.is_vaccinated && (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                      Vaccinated
                    </span>
                  )}
                  {pet.is_diseased && (
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                      Diseased
                    </span>
                  )}
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-2">
                {typeof pet.pet_type === 'string'
                  ? pet.pet_type
                  : pet.pet_type?.type || 'Unknown'}{' '}
                • {pet.breed || 'Mixed'}
              </p>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{pet.description}</p>

              <div className="space-y-2">
                <div className="flex items-center text-gray-500 text-xs space-x-4">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>
                      {pet.city}, {pet.state}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{pet.age} years</span>
                  </div>
                </div>

                {pet.created_by && (
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <User className="w-3 h-3" />
                    <span>Added by {pet.created_by.username}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPets.length === 0 && (
        <div className="text-center py-12">
          <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No pets found</h3>
          <p className="text-gray-600">Try adjusting your search terms.</p>
        </div>
      )}

      {/* Pet Detail Modal */}
      {selectedPet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-6 relative overflow-y-auto max-h-[90vh]">
            {/* Close button */}
            <button
              onClick={() => setSelectedPet(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image */}
            {selectedPet.image && (
              <img
                src={apiService.getImageUrl(selectedPet.image)}
                alt={selectedPet.name}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
            )}

            {/* Pet Details */}
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedPet.name}</h2>
            <p className="text-gray-600 mb-4">{selectedPet.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p><span className="font-medium">Type:</span> {typeof selectedPet.pet_type === 'string' ? selectedPet.pet_type : selectedPet.pet_type?.type}</p>
                <p><span className="font-medium">Breed:</span> {selectedPet.breed || 'Mixed'}</p>
                <p><span className="font-medium">Color:</span> {selectedPet.color}</p>
                <p><span className="font-medium">Age:</span> {selectedPet.age} years</p>
                <p><span className="font-medium">Weight:</span> {selectedPet.weight} kg</p>
              </div>
              <div>
                <p><span className="font-medium">Gender:</span> {selectedPet.gender}</p>
                <p><span className="font-medium">City:</span> {selectedPet.city}</p>
                <p><span className="font-medium">State:</span> {selectedPet.state}</p>
                <p><span className="font-medium">Pincode:</span> {selectedPet.pincode}</p>
                <p><span className="font-medium">Vaccinated:</span> {selectedPet.is_vaccinated ? 'Yes' : 'No'}</p>
                <p><span className="font-medium">Diseased:</span> {selectedPet.is_diseased ? 'Yes' : 'No'}</p>
              </div>
            </div>

            <div className="mt-6 text-sm text-gray-500">
              <p>Created: {new Date(selectedPet.created_date).toLocaleDateString()}</p>
              <p>Last Updated: {new Date(selectedPet.modified_date).toLocaleDateString()}</p>
              {selectedPet.created_by && <p>Added by: {selectedPet.created_by.username}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPets;
