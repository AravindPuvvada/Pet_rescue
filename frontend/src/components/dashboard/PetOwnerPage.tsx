// src/pages/PetOwnerPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { apiService } from '../../services/api';
import type { Pet } from '../../services/api';

// Import supporting components
import PetCard from '../petcard/PetCard';
import PetDetailsModal from '../pages/PetDetails';
import ReportLostPetForm from './ReportLostPetForm';
import UserRequestsModal from './UserRequestsModal';
import { toast } from 'react-toastify';
import EditPetModal from './EditPetModal';

const getImageUrl = (path: string | undefined) => {
  if (path) {
    const API_BASE_URL = 'http://127.0.0.1:8000';
    return `${API_BASE_URL}${path}`;
  }
  return 'https://placehold.co/600x400?text=No+Image\\nAvailable';
};

const PetOwnerPage: React.FC = () => {
  const [lostPets, setLostPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isRequestsModalOpen, setIsRequestsModalOpen] = useState<boolean>(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const fetchLostPets = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiService.getMyLostPets();
      const petsData = response.lost_pets.map(item => ({
        ...item.pet,
        image: getImageUrl(item.image),
        created_date: item.created_date,
      })) as Pet[];
      setLostPets(petsData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      toast.error('Failed to fetch your lost pets.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLostPets();
  }, [fetchLostPets]);

  const handleViewDetails = (pet: Pet) => setSelectedPet(pet);
  const handleCloseDetails = () => setSelectedPet(null);

  const handleEditPet = (pet: Pet) => {
    setEditingPet(pet);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setEditingPet(null);
    fetchLostPets();
  };

  const handleDeletePet = async (pet: Pet) => {
    if (
      window.confirm(
        `Are you sure you want to permanently delete ${pet.name}? This action cannot be undone.`
      )
    ) {
      try {
        await apiService.deletePet(pet.id);
        toast.success(`${pet.name} was successfully deleted.`);
        fetchLostPets();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        toast.error(`Failed to delete pet: ${errorMessage}`);
      }
    }
  };

  const handleEditFromDetails = (pet: Pet) => {
    handleCloseDetails();
    handleEditPet(pet);
  };

  return (
    <div className="container mx-auto p-6 bg-light-neutral dark:bg-dark-background min-h-screen">
      <style>
        {`.pet-card-container .bg-white > div:last-child { display: none !important; } 
          .pet-card-container .dark\\:bg-dark-primary > div:last-child { display: none !important; }`}
      </style>

      <div className="flex justify-between items-center mb-8 pb-4 border-b border-light-primary dark:border-dark-primary">
        <div>
          <h1 className="text-4xl font-bold text-light-text dark:text-dark-secondary">Pet Owner Hub</h1>
          <p className="text-light-secondary dark:text-dark-neutral mt-1">
            Manage your requests and report lost pets.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center px-4 py-2 font-semibold text-white bg-light-accent dark:bg-dark-accent rounded-lg shadow-md hover:bg-light-accent/90 dark:hover:bg-dark-accent/90 transition-colors"
          >
            <PlusCircle className="w-5 h-5 mr-2" /> Report a Lost Pet
          </button>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-light-text dark:text-dark-secondary mb-6">My Reported Lost Pets</h2>
      {loading && <p className="text-center text-light-secondary dark:text-dark-neutral">Loading pets...</p>}
      {error && <p className="text-center text-red-500 dark:text-red-400">Error: {error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {lostPets.length > 0 ? (
            lostPets.map((pet) => (
              <div key={pet.id} className="relative group pet-card-container h-full flex">
                <PetCard pet={pet} onViewDetails={handleViewDetails} onReport={() => {}} reportButtonLabel="" />
                <div className="absolute top-3 right-3 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => handleEditPet(pet)}
                    className="p-2 bg-light-neutral dark:bg-dark-background rounded-full shadow-lg hover:bg-light-primary dark:hover:bg-dark-primary transition-colors"
                    aria-label="Edit pet details"
                  >
                    <Pencil className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </button>
                  <button
                    onClick={() => handleDeletePet(pet)}
                    className="p-2 bg-light-neutral dark:bg-dark-background rounded-full shadow-lg hover:bg-light-primary dark:hover:bg-dark-primary transition-colors"
                    aria-label="Delete pet"
                  >
                    <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-light-primary dark:bg-dark-primary rounded-lg shadow">
              <h3 className="text-xl font-semibold text-light-text dark:text-dark-secondary">No Lost Pets Found</h3>
              <p className="text-light-secondary dark:text-dark-neutral mt-2">
                You have not reported any lost pets yet.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {selectedPet && (
        <PetDetailsModal
          pet={selectedPet}
          onClose={handleCloseDetails}
          onPrimaryAction={handleEditFromDetails}
          primaryButtonLabel="Edit Pet"
        />
      )}
      {isReportModalOpen && <ReportLostPetForm onClose={() => setIsReportModalOpen(false)} onSuccess={fetchLostPets} />}
      {isRequestsModalOpen && <UserRequestsModal onClose={() => setIsRequestsModalOpen(false)} />}
      {isEditModalOpen && editingPet && <EditPetModal pet={editingPet} onClose={() => setIsEditModalOpen(false)} onSuccess={handleEditSuccess} />}
    </div>
  );
};

export default PetOwnerPage;
