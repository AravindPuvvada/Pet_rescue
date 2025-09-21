import React from 'react';
import type { Pet } from '../../services/api';
import { X, MapPin, Heart, Feather, Droplet, User, Weight, Calendar, Stethoscope } from 'lucide-react';

interface PetDetailsModalProps {
    pet: Pet;
    onClose: () => void;
}

const PetDetailsModal: React.FC<PetDetailsModalProps> = ({ pet, onClose }) => {

    // Safely access medical history, defaulting to an empty object
    const medical = pet.medical_history || {};

    // Concatenate location fields (using city, state, pincode)
    const locationText = [pet.city, pet.state, pet.pincode].filter(Boolean).join(', ');
    const displayLocation = locationText.trim() || 'Location Not Available';

    // FIX: Using nullish coalescing for safety. This relies on the API providing the full description.
    const displayDescription = pet.description || 'No Information Available';

    // Helper component for attribute details
    const DetailItem: React.FC<{ icon: React.ReactNode, label: string, value: React.ReactNode }> = ({ icon, label, value }) => (
        <div className="flex items-start text-gray-700 py-1">
            <span className="mr-3 text-orange-500 flex-shrink-0">{icon}</span>
            <span className="font-semibold w-1/4 text-sm">{label}:</span>
            {/* FIX: Explicitly convert value to String() to resolve TypeScript type errors */}
            <span className="text-sm font-medium">{String(value) ?? 'N/A'}</span>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all"
                onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
            >
                {/* Close Button (Top Right) */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white text-gray-600 hover:text-gray-900 transition"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="flex flex-col lg:flex-row">
                    {/* Left Column (Image and Details) */}
                    <div className="lg:w-1/3 bg-gray-50 p-6 flex flex-col items-center">
                        <div className="w-40 h-40 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden border-4 border-orange-200 mb-4">
                            {pet.image ? (
                                <img src={pet.image} alt={`Photo of ${pet.name}`} className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-16 h-16 text-gray-500" />
                            )}
                        </div>

                        <h2 className="text-3xl font-bold text-gray-800 mb-1">{pet.name ?? 'Unnamed Pet'}</h2>

                        <div className="w-full space-y-3 text-left">
                            <DetailItem icon={<Feather className="w-4 h-4" />} label="Type" value={String(pet.pet_type) ?? 'N/A'} />
                            <DetailItem icon={<Feather className="w-4 h-4" />} label="Breed" value={String(pet.breed) ?? 'N/A'} />
                            <DetailItem icon={<Heart className="w-4 h-4" />} label="Gender" value={pet.gender ?? 'N/A'} />
                            <DetailItem icon={<Weight className="w-4 h-4" />} label="Age" value={pet.age ? `${pet.age}` : 'N/A'} />
                            <DetailItem icon={<Droplet className="w-4 h-4" />} label="Color" value={pet.color ?? 'N/A'} />
                        </div>

                        <div className="w-full mt-6 pt-4 border-t border-gray-200">
                            <h4 className="text-lg font-bold text-gray-800 flex items-center mb-2"><MapPin className="w-5 h-5 mr-2 text-red-500" />Location</h4>
                            <p className="text-sm font-medium whitespace-pre-line">{displayLocation}</p>
                            <p className="text-sm text-gray-500 flex items-center">
                                <Calendar className="w-4 h-4 mr-2" /> Listed on: {pet.created_date ? new Date(pet.created_date).toLocaleDateString() : 'N/A'}
                            </p>
                        </div>
                    </div>

                    {/* Right Column (Medical and Description) */}
                    <div className="lg:w-2/3 p-6 flex flex-col"> {/* Added flex-col here */}
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">About {pet.name ?? 'Pet'}</h3>
                        <p className="text-gray-700 mb-6 whitespace-pre-line">{displayDescription}</p>

                        <h3 className="text-2xl font-bold text-gray-800 flex items-center mb-3"><Stethoscope className="w-6 h-6 mr-2 text-green-600" />Medical Information</h3>

                        {/* Always visible high-level status */}
                        <div className="flex justify-between items-center text-sm mb-4">
                            <div>
                                <span className="font-semibold text-gray-800">Diseased: </span>
                                <span className={pet.is_diseased ? 'text-red-600 font-bold' : 'text-green-600'}>
                                    {pet.is_diseased ? 'Yes' : 'No'}
                                </span>
                            </div>
                            <div>
                                <span className="font-semibold text-gray-800">Vaccinated: </span>
                                <span className={pet.is_vaccinated ? 'text-green-600 font-bold' : 'text-red-600'}>
                                    {pet.is_vaccinated ? 'Yes' : 'No'}
                                </span>
                            </div>
                        </div>

                        {/* Detailed Medical Records (Conditional Block) */}
                        {(pet.is_diseased || pet.is_vaccinated) && (
                            <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm mb-8 p-4 border rounded-lg bg-gray-50">

                                {/* Disease Details (SHOW ONLY IF DISEASED) */}
                                {pet.is_diseased && (
                                    <>
                                        <div>
                                            <span className="font-semibold text-gray-800">Disease: </span>
                                            <span className="text-gray-600">{medical.disease_name || 'Not Available'}</span>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-gray-800">Stage: </span>
                                            <span className="text-gray-600">{medical.stage || 'Not Available'}</span>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="font-semibold text-gray-800">For: </span>
                                            <span className="text-gray-600">{medical.no_of_years ? `${medical.no_of_years} years` : 'Not Available years'}</span>
                                        </div>
                                    </>
                                )}

                                {/* Vaccination Details (SHOW ONLY IF VACCINATED) */}
                                {pet.is_vaccinated && (
                                    <>
                                        <div>
                                            <span className="font-semibold text-gray-800">Vaccine: </span>
                                            <span className="text-gray-600">{medical.vaccination_name || 'Not Available'}</span>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-gray-800">Last Date: </span>
                                            <span className="text-gray-600">
                                                {medical.last_vaccinated_date ? new Date(medical.last_vaccinated_date).toLocaleDateString() : 'Not Available'}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Footer and Buttons (New Layout) */}
                        <div className="mt-auto pt-4 border-t border-gray-200 flex justify-end items-center space-x-4">
                            {/* New Report Sighting Button */}
                            <button
                                onClick={() => alert('Report Sighting functionality goes here!')} // Placeholder action
                                className="px-6 py-3 font-semibold text-orange-500 border border-orange-500 rounded-lg shadow-sm hover:bg-orange-50 transition-colors">
                                Report Sighting
                            </button>

                            {/* Modified Close Button (Original 'Report Sighting' button) */}
                            <button
                                onClick={onClose}
                                className="px-6 py-3 font-semibold text-white bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg shadow-md hover:opacity-90 transition-opacity">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PetDetailsModal;