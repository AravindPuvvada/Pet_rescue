import React, { useState, useEffect, useCallback } from 'react';
// ✅ Added Calendar and MapPin icons
import { Trash2, MessageSquare, PawPrint, Calendar, MapPin } from 'lucide-react';
import { apiService } from '../../services/api';
import type { Pet } from '../../services/api';
import PetDetailsModal from '../pages/PetDetails';
import { toast } from 'react-toastify';

// ✅ Updated the local type to include the new fields
type CorrectedAdoption = {
  id: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  message?: string;
  created_date: string; // The date the request was made
  pet: Pet;
};

const getImageUrl = (path?: string) => {
    if (!path) {
        return 'https://placehold.co/600x400?text=No+Image';
    }
    if (path.startsWith('http')) {
        return path;
    }
    const API_BASE_URL = "http://127.0.0.1:8000";
    return `${API_BASE_URL}${path}`;
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full";
    let styleClasses = "";

    switch (status.toLowerCase()) {
        case 'approved': styleClasses = "bg-green-100 text-green-800"; break;
        case 'rejected': styleClasses = "bg-red-100 text-red-800"; break;
        default: styleClasses = "bg-yellow-100 text-yellow-800"; break;
    }
    return <span className={`${baseClasses} ${styleClasses}`}>{status}</span>;
};

const PetAdopterPage: React.FC = () => {
    const [myAdoptions, setMyAdoptions] = useState<CorrectedAdoption[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    // ✅ State now holds the entire selected adoption object, not just the pet
    const [selectedAdoption, setSelectedAdoption] = useState<CorrectedAdoption | null>(null);

    const fetchMyAdoptions = useCallback(async () => {
        try {
            setLoading(true);
            const adoptionRequests = await apiService.getMyPetAdoptions();
            setMyAdoptions(adoptionRequests as CorrectedAdoption[]);
            setError(null);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(message);
            toast.error("Failed to fetch your adoption requests.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMyAdoptions();
    }, [fetchMyAdoptions]);

    const handleDeleteAdoptionRequest = async (adoptionId: number, petName: string) => {
        if (window.confirm(`Are you sure you want to delete the adoption request for ${petName}? This action cannot be undone.`)) {
            try {
                await apiService.deletePetAdoption(adoptionId);
                toast.success(`Adoption request for ${petName} was successfully deleted.`);
                fetchMyAdoptions();
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
                toast.error(`Failed to delete adoption request: ${errorMessage}`);
            }
        }
    };

    // ✅ Handlers now work with the full adoption object
    const handleViewDetails = (adoption: CorrectedAdoption) => setSelectedAdoption(adoption);
    const handleCloseDetails = () => setSelectedAdoption(null);

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight">My Adoption Requests</h1>
                    <p className="text-gray-600 mt-2">Here are the pets you've shown interest in adopting. Track their status below.</p>
                </div>

                <div>
                    {loading && <p className="text-center text-gray-500 py-10">Loading your requests...</p>}
                    {error && <p className="text-center text-red-500 py-10">Error: {error}</p>}

                    {!loading && !error && (
                        myAdoptions.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {myAdoptions.map((adoption) => (
                                    <div key={adoption.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden">
                                        <div className="flex-shrink-0">
                                            <img
                                                src={getImageUrl(adoption.pet.image)}
                                                alt={adoption.pet.name}
                                                className="w-full h-56 object-cover cursor-pointer"
                                                onClick={() => handleViewDetails(adoption)}
                                            />
                                        </div>

                                        <div className="p-5 flex flex-col flex-grow">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h2 className="text-xl font-bold text-gray-900">{adoption.pet.name}</h2>
                                                     {/* ✅ ADDED Location and Date */}
                                                    <div className="text-xs text-gray-500 mt-1 space-y-1">
                                                        <p className="flex items-center"><MapPin className="w-3 h-3 mr-1.5" />{adoption.pet.city || 'N/A'}, {adoption.pet.state || 'N/A'}</p>
                                                        <p className="flex items-center"><Calendar className="w-3 h-3 mr-1.5" />Requested on: {new Date(adoption.created_date).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <StatusBadge status={adoption.status} />
                                            </div>
                                            
                                            <div className="my-4">
                                                <h3 className="text-sm font-semibold text-gray-700 flex items-center mb-2">
                                                    <MessageSquare className="w-4 h-4 mr-2 text-indigo-500" />
                                                    Your Message
                                                </h3>
                                                <p className="text-gray-600 text-sm border-l-4 border-gray-200 pl-4 italic">
                                                    {adoption.message || "You didn't provide a message."}
                                                </p>
                                            </div>

                                            <div className="mt-auto pt-4 flex items-center justify-end space-x-3">
                                                <button
                                                    onClick={() => handleViewDetails(adoption)}
                                                    className="flex items-center px-3 py-2 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors"
                                                >
                                                    <PawPrint className="w-4 h-4 mr-2" />
                                                    Details
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteAdoptionRequest(adoption.id, adoption.pet.name)}
                                                    className="flex items-center px-3 py-2 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                                                    aria-label="Delete adoption request"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md">
                                <h3 className="text-xl font-semibold text-gray-700">No Adoption Requests Yet</h3>
                                <p className="text-gray-500 mt-2">When you request to adopt a pet, your requests will appear here.</p>
                            </div>
                        )
                    )}
                </div>
                
                {/* ✅ UPDATED: Modal now has a "Delete Request" button */}
                {selectedAdoption && (
                    <PetDetailsModal
                        pet={selectedAdoption.pet}
                        onClose={handleCloseDetails}
                        primaryButtonLabel="Delete Request"
                        onPrimaryAction={() => {
                            handleDeleteAdoptionRequest(selectedAdoption.id, selectedAdoption.pet.name);
                            handleCloseDetails(); // Close modal after action
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default PetAdopterPage;
