// import React, { useState } from 'react';
// import { MapPin, Calendar } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import type { Pet } from '../../services/api'; // ✅ use the API type

// interface PetCardProps {
//   pet: Pet;
// }

// // Fallback SVG
// const AnimalSilhouettePlaceholder: React.FC = () => (
//   <div className="w-full h-56 flex items-center justify-center bg-gray-200">
//     <svg
//       className="w-2/3 h-2/3 text-gray-400"
//       xmlns="http://www.w3.org/2000/svg"
//       viewBox="0 0 200 100"
//       preserveAspectRatio="xMidYMid meet"
//     >
//       <g fill="currentColor">
//         <path d="M52.5,45.2..."/>
//         <path d="M140.8,40.3..."/>
//       </g>
//     </svg>
//   </div>
// );

// const PetCard: React.FC<PetCardProps> = ({ pet }) => {
//   const navigate = useNavigate();
//   const [imageError, setImageError] = useState(false);

//   const handleImageError = () => setImageError(true);

//   const handleViewProfile = () => {
//     navigate(`/pets/${pet.id}`);
//   };

//   const truncateDescription = (text?: string) => {
//     if (!text) return 'No description available';
//     const lines = text.split('\n');
//     if (lines.length > 2) {
//       return lines.slice(0, 2).join('\n') + '...';
//     }
//     if (text.length > 100) {
//       return text.substring(0, 100) + '...';
//     }
//     return text;
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-2xl flex flex-col">
//       {pet.image && !imageError ? (
//         <img
//           src={pet.image}
//           alt={`Photo of ${pet.name}`}
//           className="w-full h-56 object-cover"
//           onError={handleImageError}
//         />
//       ) : (
//         <AnimalSilhouettePlaceholder />
//       )}

//       <div className="p-5 flex flex-col flex-grow">
//         <h3 className="text-2xl font-bold text-gray-800 mb-2">{pet.name}</h3>
//         <div className="flex items-center text-sm text-gray-600 mb-2">
//           <span>{pet.breed ?? 'Unknown breed'}</span>
//           <span className="mx-2">•</span>
//           <span>{pet.age ?? 'Unknown age'}</span>
//           <span className="mx-2">•</span>
//           <span>{pet.gender ?? 'Unknown'}</span>
//         </div>

//         <p className="text-gray-700 mb-4 text-sm flex-grow whitespace-pre-line">
//           {truncateDescription(pet.description)}
//         </p>

//         <div className="space-y-2 mb-4 text-sm text-gray-700 border-t pt-4 mt-auto">
//           <div className="flex items-center">
//             <MapPin className="w-4 h-4 mr-2 text-orange-500 flex-shrink-0" />
//             <span>Location: <strong>{pet.address ?? 'N/A'}</strong></span>
//           </div>
//           <div className="flex items-center">
//             <Calendar className="w-4 h-4 mr-2 text-orange-500 flex-shrink-0" />
//             <span>Listed on: <strong>{new Date(pet.created_date).toLocaleDateString()}</strong></span>
//           </div>
//         </div>

//         <div className="mt-auto">
//           <button
//             onClick={handleViewProfile}
//             className="w-full px-4 py-2 font-semibold text-white bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg shadow-md hover:shadow-lg"
//           >
//             View Profile
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PetCard;

import React, { useState } from 'react';
import { MapPin, Calendar, MessageSquare } from 'lucide-react'; // Import MessageSquare
import { useNavigate } from 'react-router-dom';
import type { Pet } from '../../services/api';

interface PetCardProps {
    pet: Pet;
    // New prop to handle modal open (for the card click) and reporting
    onViewDetails: (pet: Pet) => void;
    onReport: (pet: Pet) => void; // Callback for report button
}

// Fallback SVG for missing images (remains the same)
const AnimalSilhouettePlaceholder: React.FC = () => (
    <div className="w-full h-56 flex items-center justify-center bg-gray-200">
        <svg
            className="w-2/3 h-2/3 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 100"
            preserveAspectRatio="xMidYMid meet"
        >
            <g fill="currentColor">
                <path d="M52.5,45.2..."/>
                <path d="M140.8,40.3..."/>
            </g>
        </svg>
    </div>
);

const PetCard: React.FC<PetCardProps> = ({ pet, onViewDetails, onReport }) => {
    const [imageError, setImageError] = useState(false);
    const handleImageError = () => setImageError(true);

    const truncateDescription = (text?: string) => {
        if (!text) return 'No description available';
        const lines = text.split('\n');
        if (lines.length > 2) return lines.slice(0, 2).join('\n') + '...';
        if (text.length > 100) return text.substring(0, 100) + '...';
        return text;
    };
    
    // Use City, State, Pincode for a more accurate location label
    const locationDisplay = [pet.city, pet.state, pet.pincode].filter(Boolean).join(', ');

    return (
        // Card content area is clickable for viewing details
        <div 
            className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-2xl flex flex-col"
        >
            {/* Clickable Image/Info container to open modal */}
            <div 
                onClick={() => onViewDetails(pet)}
                className="cursor-pointer flex flex-col flex-grow"
            >
                {/* Image Section */}
                {pet.image && !imageError ? (
                    <img
                        src={pet.image}
                        alt={`Photo of ${pet.name}`}
                        className="w-full h-56 object-cover"
                        onError={handleImageError}
                    />
                ) : (
                    <AnimalSilhouettePlaceholder />
                )}

                {/* Info Section */}
                <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{pet.name ?? 'Unnamed'}</h3>

                    {/* Pet Attributes (moved from previous version) */}
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                        <span>{pet.breed ?? 'Unknown breed'}</span>
                        <span className="mx-2">•</span>
                        <span>{pet.age ?? 'Unknown age'}</span>
                        <span className="mx-2">•</span>
                        <span>{pet.gender ?? 'Unknown'}</span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 mb-4 text-sm flex-grow whitespace-pre-line">
                        {truncateDescription(pet.description)}
                    </p>

                    {/* Metadata */}
                    <div className="space-y-2 mb-4 text-sm text-gray-700 border-t pt-4 mt-auto">
                        <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-orange-500 flex-shrink-0" />
                            {/* ✅ Use a combination of City, State, Pincode */}
                            <span>Location: <strong>{locationDisplay || 'N/A'}</strong></span>
                        </div>
                        <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-orange-500 flex-shrink-0" />
                            <span>Listed on: <strong>{pet.created_date ? new Date(pet.created_date).toLocaleDateString() : 'N/A'}</strong></span>
                        </div>
                        <div className="flex items-center">
                            {/* Simplifed status display */}
                            <span>Status: <strong>{pet.is_vaccinated ? 'Vaccinated' : 'Unvaccinated'}, {pet.is_diseased ? 'Diseased' : 'Healthy'}</strong></span>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Report Button (Always present at the bottom) */}
            <div className="p-4 pt-0">
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent card click logic from firing
                        onReport(pet);
                    }}
                    className="w-full px-4 py-2 font-semibold text-white bg-red-500 rounded-lg shadow-md hover:bg-red-600 flex items-center justify-center transition-colors"
                >
                    <MessageSquare className="w-4 h-4 mr-2" /> Report Sighting
                </button>
            </div>
        </div>
    );
};

export default PetCard;
