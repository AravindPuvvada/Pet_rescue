// PetCard.tsx

import React, { useState } from 'react';
import { MapPin, Calendar, MessageSquare, ShieldCheck } from 'lucide-react'; // Added ShieldCheck for status
import type { Pet } from '../../services/api';

interface PetCardProps {
 pet: Pet;
 onViewDetails: (pet: Pet) => void;
 onReport: (pet: Pet) => void;
 reportButtonLabel: string;
}

// Type-specific Placeholder component
const AnimalSilhouettePlaceholder: React.FC<{ petType: string | undefined }> = ({ petType }) => {
 let iconPath;
let label;
const normalizedType = String(petType).toLowerCase();

 if (normalizedType.includes('dog')) {
 label = 'Dog';
 iconPath = 'M32 0C14.33 0 0 14.33 0 32v160c0 17.67 14.33 32 32 32h160c17.67 0 32-14.33 32-32V32c0-17.67-14.33-32-32-32H32zm138.7 138.7c-5.86 5.86-15.36 5.86-21.22 0l-17.4-17.4L96 156.4V64h42.4L160 81.6V138.7z';
 } else if (normalizedType.includes('cat')) {
 label = 'Cat';
 iconPath = 'M160 0c22.09 0 40 17.91 40 40v120c0 22.09-17.91 40-40 40H40c-22.09 0-40-17.91-40-40V40C0 17.91 17.91 0 40 0h120zm-33.1 113.1c4.54-4.54 11.9-4.54 16.44 0l16.27 16.27c4.54 4.54 4.54 11.9 0 16.44l-48.7 48.7c-4.54 4.54-11.9 4.54-16.44 0L42.1 145.8c-4.54-4.54-4.54-11.9 0-16.44l16.27-16.27c4.54-4.54 11.9-4.54 16.44 0l18.5 18.5 28.7-28.7z';
 } else {
 label = 'Pet';
 iconPath = 'M100 0c-55.23 0-100 44.77-100 100s44.77 100 100 100 100-44.77 100-100S155.23 0 100 0zM100 180c-44.18 0-80-35.82-80-80s35.82-80 80-80 80 35.82 80 80-35.82 80-80 80z';
 }
 
 return (
 <div className="w-full h-56 flex flex-col items-center justify-center bg-gray-200 dark:bg-dark-primary/80 text-gray-400 dark:text-dark-neutral/60 p-4">
 <svg className="w-1/3 h-1/3 text-gray-500 dark:text-dark-neutral/80 mb-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="currentColor" >
<path d={iconPath} />
  </svg>
  <p className="text-sm font-semibold text-gray-600 dark:text-dark-neutral">No Image ({label})</p>
 </div>
 );
};


const PetCard: React.FC<PetCardProps> = ({ pet, onViewDetails, onReport, reportButtonLabel }) => {
 const [imageError, setImageError] = useState(false);
 const handleImageError = () => setImageError(true);

 const truncateDescription = (text?: string) => {
 if (!text) return 'No description available';
 const lines = text.split('\n');
 if (lines.length > 2) return lines.slice(0, 2).join('\n') + '...';
 if (text.length > 100) return text.substring(0, 100) + '...';
 return text;
 };
 
 const locationDisplay = [pet.city, pet.state].filter(Boolean).join(', ');

 // ⭐ START OF CHANGES: Logic to build the status string
 const statusParts = [];
 if (pet.is_vaccinated) {
  statusParts.push('Vaccinated');
 }
 statusParts.push(pet.is_diseased ? 'Diseased' : 'Healthy');
 const statusDisplay = statusParts.join(', ');
 // ⭐ END OF CHANGES

 return (
  <div className="bg-white dark:bg-dark-primary rounded-xl shadow-lg hover:shadow-2xl dark:shadow-black/50 overflow-hidden transition-transform duration-300 hover:scale-105 flex flex-col">
  <div onClick={() => onViewDetails(pet)} className="cursor-pointer flex flex-col flex-grow">
  {/* Image Section */}
 {pet.image && !imageError ? (
 <img
 src={pet.image}
 alt={`Photo of ${pet.name}`}
 className="w-full h-56 object-cover"
onError={handleImageError}
  />
 ) : (
  <AnimalSilhouettePlaceholder petType={String(pet.pet_type)} />
 )}

 {/* Info Section */}
 <div className="p-5 flex flex-col flex-grow">
  <h3 className="text-2xl font-bold text-gray-800 dark:text-dark-secondary mb-2">{pet.name ?? 'Unnamed'}</h3>

  <div className="flex items-center text-sm text-gray-600 dark:text-dark-neutral mb-2 flex-wrap">
  <span>{pet.breed ?? 'Unknown breed'}</span>
   <span className="mx-2">•</span>
   <span>{pet.age ? `${pet.age} years old` : 'Unknown age'}</span>
   <span className="mx-2">•</span>
   <span>{pet.gender ?? 'Unknown'}</span>
  </div>

  {/* Description */}
  <p className="text-gray-700 dark:text-dark-neutral mb-4 text-sm flex-grow whitespace-pre-line">
   {truncateDescription(pet.description)}
  </p>

  {/* Metadata */}
  <div className="space-y-2 text-sm text-gray-700 dark:text-dark-neutral border-t dark:border-dark-neutral/30 pt-4 mt-auto">
  <div className="flex items-center">
  <MapPin className="w-4 h-4 mr-2 text-orange-500 dark:text-dark-accent flex-shrink-0" />
 <span>Location: <strong>{locationDisplay || 'N/A'}</strong></span>
  </div>
  <div className="flex items-center">
   <Calendar className="w-4 h-4 mr-2 text-orange-500 dark:text-dark-accent flex-shrink-0" />
   <span>Listed on: <strong>{pet.created_date ? new Date(pet.created_date).toLocaleDateString() : 'N/A'}</strong></span>
  </div>
  {/* ⭐ UPDATED STATUS DISPLAY */}
  <div className="flex items-center">
   <ShieldCheck className="w-4 h-4 mr-2 text-orange-500 dark:text-dark-accent flex-shrink-0" />
   <span>Status: <strong>{statusDisplay}</strong></span>
  </div>
  </div>
 </div>
  </div>
  
  {/* Report Button */}
 <div className="p-4 pt-0">
 <button
 onClick={(e) => {
  e.stopPropagation(); 
  onReport(pet);
 }}
 className="w-full px-4 py-2 font-semibold text-white bg-red-500 rounded-lg shadow-md hover:bg-red-600 flex items-center justify-center transition-colors"
 >
 <MessageSquare className="w-4 h-4 mr-2" /> {reportButtonLabel}
 </button>
 </div>
 </div>
 );
};

export default PetCard;