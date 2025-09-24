// src/pages/PetRescuerPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { apiService } from '../../services/api';
import type { Pet } from '../../services/api';

// Import supporting components
import PetCard from '../petcard/PetCard';
import PetDetailsModal from '../pages/PetDetails';
import ReportFoundPetForm from './ReportFoundPetForm';
import { toast } from 'react-toastify';
import EditPetModal from './EditPetModal';

const getImageUrl = (path: string | undefined) => {
  if (path) {
    const API_BASE_URL = 'http://127.0.0.1:8000';
    return `${API_BASE_URL}${path}`;
  }
  return 'https://placehold.co/600x400?text=No+Image\\nAvailable';
};

const PetRescuerPage: React.FC = () => {
  const [foundPets, setFoundPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const fetchFoundPets = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiService.getMyFoundPets();
      const petsData = response.found_pets.map(report => ({
        ...report.pet,
        image: getImageUrl(report.image),
        created_date: report.created_date,
      }));
      setFoundPets(petsData as Pet[]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      toast.error('Failed to fetch your found pets.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFoundPets();
  }, [fetchFoundPets]);

  const handleViewDetails = (pet: Pet) => setSelectedPet(pet);
  const handleCloseDetails = () => setSelectedPet(null);

  const handleEditPet = (pet: Pet) => {
    setEditingPet(pet);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setEditingPet(null);
    fetchFoundPets();
  };

  const handleDeletePet = async (pet: Pet) => {
    if (window.confirm(`Are you sure you want to permanently delete the report for ${pet.name}?`)) {
      try {
        await apiService.deletePet(pet.id);
        toast.success(`Report for ${pet.name} was successfully deleted.`);
        setFoundPets(currentPets => currentPets.filter(p => p.id !== pet.id));
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to delete pet report.');
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
        {`.pet-card-container .bg-light-primary > div:last-child { display: none !important; } 
          .pet-card-container .dark\\:bg-dark-primary > div:last-child { display: none !important; }`}
      </style>

      <div className="flex justify-between items-center mb-8 pb-4 border-b border-light-primary dark:border-dark-primary">
        <div>
          <h1 className="text-4xl font-bold text-light-text dark:text-dark-secondary">My Rescued Pets</h1>
          <p className="text-light-secondary dark:text-dark-neutral mt-1">Manage the pets you have reported as found.</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center px-4 py-2 font-semibold text-white bg-light-accent dark:bg-dark-accent rounded-lg shadow-md hover:bg-light-accent/90 dark:hover:bg-dark-accent/90 transition-colors"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Report a Found Pet
          </button>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-light-text dark:text-dark-secondary mb-6">Your Reported Found Pets</h2>
      {loading && <p className="text-center text-light-secondary dark:text-dark-neutral">Loading your pets...</p>}
      {error && <p className="text-center text-red-500 dark:text-red-400">Error: {error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {foundPets.length > 0 ? (
            foundPets.map((pet) => (
              <div key={pet.id} className="relative group pet-card-container h-full flex">
                <PetCard
                  pet={pet}
                  onViewDetails={handleViewDetails}
                  onReport={() => {}}
                  reportButtonLabel=""
                />
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
              <h3 className="text-xl font-semibold text-light-text dark:text-dark-secondary">No Pets Reported</h3>
              <p className="text-light-secondary dark:text-dark-neutral mt-2">You have not reported any found pets yet.</p>
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
      {isReportModalOpen && (
        <ReportFoundPetForm
          onClose={() => setIsReportModalOpen(false)}
          onSuccess={fetchFoundPets}
        />
      )}
      {isEditModalOpen && editingPet && (
        <EditPetModal
          pet={editingPet}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
};

export default PetRescuerPage;
