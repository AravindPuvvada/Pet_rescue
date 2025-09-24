import React, { useState, useEffect, useCallback } from 'react';
import { Trash2, MessageSquare, PawPrint, Calendar, MapPin } from 'lucide-react';
import { apiService } from '../../services/api';
import type { Pet } from '../../services/api';
import PetDetailsModal from '../pages/PetDetails';
import { toast } from 'react-toastify';

type CorrectedAdoption = {
  id: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  message?: string;
  created_date: string;
  pet: Pet;
};

const getImageUrl = (path?: string) => {
  if (!path) return 'https://placehold.co/600x400?text=No+Image';
  if (path.startsWith('http')) return path;
  const API_BASE_URL = 'http://127.0.0.1:8000';
  return `${API_BASE_URL}${path}`;
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const baseClasses = 'px-3 py-1 text-xs font-semibold rounded-full';
  let styleClasses = '';

  switch (status.toLowerCase()) {
    case 'approved':
      styleClasses =
        'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      break;
    case 'rejected':
      styleClasses =
        'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      break;
    default:
      styleClasses =
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      break;
  }

  return <span className={`${baseClasses} ${styleClasses}`}>{status}</span>;
};

const PetAdopterPage: React.FC = () => {
  const [myAdoptions, setMyAdoptions] = useState<CorrectedAdoption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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
      toast.error('Failed to fetch your adoption requests.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyAdoptions();
  }, [fetchMyAdoptions]);

  const handleDeleteAdoptionRequest = async (adoptionId: number, petName: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete the adoption request for ${petName}? This action cannot be undone.`
      )
    ) {
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

  const handleViewDetails = (adoption: CorrectedAdoption) => setSelectedAdoption(adoption);
  const handleCloseDetails = () => setSelectedAdoption(null);

  return (
    <div className="bg-light-neutral dark:bg-dark-background min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-light-text dark:text-dark-secondary tracking-tight">
            My Adoption Requests
          </h1>
          <p className="text-light-secondary dark:text-dark-neutral mt-2">
            Here are the pets you've shown interest in adopting. Track their status below.
          </p>
        </div>

        <div>
          {loading && (
            <p className="text-center text-light-secondary dark:text-dark-neutral py-10">
              Loading your requests...
            </p>
          )}
          {error && (
            <p className="text-center text-red-500 dark:text-red-400 py-10">Error: {error}</p>
          )}

          {!loading && !error && (
            <>
              {myAdoptions.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myAdoptions.map((adoption) => (
                    <div
                      key={adoption.id}
                      className="bg-light-primary dark:bg-dark-primary rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden"
                    >
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
                            <h2 className="text-xl font-bold text-light-text dark:text-dark-secondary">
                              {adoption.pet.name}
                            </h2>
                            <div className="text-xs text-light-secondary dark:text-dark-neutral mt-1 space-y-1">
                              <p className="flex items-center">
                                <MapPin className="w-3 h-3 mr-1.5" />
                                {adoption.pet.city || 'N/A'}, {adoption.pet.state || 'N/A'}
                              </p>
                              <p className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1.5" />
                                Requested on: {new Date(adoption.created_date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <StatusBadge status={adoption.status} />
                        </div>

                        <div className="my-4">
                          <h3 className="text-sm font-semibold text-light-text dark:text-dark-secondary flex items-center mb-2">
                            <MessageSquare className="w-4 h-4 mr-2 text-light-secondary dark:text-dark-neutral" />
                            Your Message
                          </h3>
                          <p className="text-light-secondary dark:text-dark-neutral text-sm border-l-4 border-light-secondary/20 dark:border-dark-neutral/20 pl-4 italic">
                            {adoption.message || "You didn't provide a message."}
                          </p>
                        </div>

                        <div className="mt-auto pt-4 flex items-center justify-end space-x-3">
                          <button
                            onClick={() => handleViewDetails(adoption)}
                            className="flex items-center px-3 py-2 text-xs font-medium text-light-secondary dark:text-dark-secondary bg-light-secondary/10 dark:bg-dark-secondary/10 rounded-md hover:bg-light-secondary/20 dark:hover:bg-dark-secondary/20 transition-colors"
                          >
                            <PawPrint className="w-4 h-4 mr-2" />
                            Details
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteAdoptionRequest(adoption.id, adoption.pet.name)
                            }
                            className="flex items-center px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/40 rounded-md hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors"
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
                <div className="text-center py-16 px-6 bg-light-primary dark:bg-dark-primary rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-light-text dark:text-dark-secondary">
                    No Adoption Requests Yet
                  </h3>
                  <p className="text-light-secondary dark:text-dark-neutral mt-2">
                    When you request to adopt a pet, your requests will appear here.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {selectedAdoption && (
          <PetDetailsModal
            pet={selectedAdoption.pet}
            onClose={handleCloseDetails}
            primaryButtonLabel="Delete Request"
            onPrimaryAction={() => {
              handleDeleteAdoptionRequest(selectedAdoption.id, selectedAdoption.pet.name);
              handleCloseDetails();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default PetAdopterPage;
