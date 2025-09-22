// src/pages/EditPetModal.tsx

import React, { useState } from 'react';
import { X, PawPrint, MapPin, Stethoscope } from 'lucide-react';
import type { Pet } from '../../services/api'; // No longer need PetMedicalHistory here
import { apiService } from '../../services/api';
import { toast } from 'react-toastify';
interface EditPetModalProps {
    pet: Pet;
    onClose: () => void;
    onSuccess: () => void;
}

const EditPetModal: React.FC<EditPetModalProps> = ({ pet, onClose, onSuccess }) => {
    // State now initializes directly from the pet prop, including medical history
    const [formData, setFormData] = useState({
        name: pet.name || '',
        pet_type: typeof pet.pet_type === 'object' ? pet.pet_type.type : pet.pet_type || '',
        breed: pet.breed || '',
        gender: pet.gender || 'Unknown',
        age: pet.age || 0,
        color: pet.color || '',
        description: pet.description || '',
        address: pet.address || '',
        city: pet.city || '',
        state: pet.state || '',
        pincode: pet.pincode || '',
        is_vaccinated: pet.is_vaccinated || false,
        is_diseased: pet.is_diseased || false,
        // Medical history fields also initialize from the pet prop
        vaccination_name: pet.medical_history?.vaccination_name || '',
        last_vaccinated_date: pet.medical_history?.last_vaccinated_date || '',
        disease_name: pet.medical_history?.disease_name || '',
        stage: pet.medical_history?.stage || '',
        no_of_years: pet.medical_history?.no_of_years || '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ✅ The useEffect for fetching medical history is no longer needed!

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // ✅ SIMPLIFIED handleSubmit with a single API call
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Construct a single data object with nested medical history
            const updateData = {
                name: formData.name,
                pet_type: formData.pet_type,
                breed: formData.breed,
                gender: formData.gender,
                age: Number(formData.age) || 0,
                color: formData.color,
                description: formData.description,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                pincode: Number(formData.pincode) || undefined,
                is_vaccinated: formData.is_vaccinated,
                is_diseased: formData.is_diseased,
                medical_history: (formData.is_vaccinated || formData.is_diseased) ? {
                    vaccination_name: formData.vaccination_name,
                    last_vaccinated_date: formData.last_vaccinated_date,
                    disease_name: formData.disease_name,
                    stage: formData.stage,
                    no_of_years: formData.no_of_years,
                } : null,
            };

            // Call the single, powerful updatePet API
            await apiService.updatePet(pet.id, updateData);

            toast.success(`Details for ${pet.name} updated successfully!`);
            onSuccess();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            toast.error(`Failed to update pet: ${errorMessage}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // The JSX for the form remains the same as before
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl m-4 max-h-[90vh] flex transform transition-all overflow-hidden">
                <div className="w-1/3 bg-gradient-to-br from-orange-50 to-orange-100 p-8 flex flex-col items-center justify-center">
                    <div className="w-40 h-40 rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden border-4 border-white mb-4">
                        <img src={pet.image || 'https://placehold.co/200x200/FFC89B/4A2E0C?text=Pet'} alt={pet.name} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-3xl font-bold text-orange-900">{formData.name}</h3>
                    <p className="text-orange-700">{formData.breed}</p>
                </div>
                <div className="w-2/3 flex flex-col">
                    <div className="flex items-center justify-between p-6 border-b">
                        <h3 className="text-2xl font-semibold text-gray-800">Edit Pet Details</h3>
                        <button type="button" onClick={onClose} className="text-gray-400 bg-transparent hover:bg-gray-200 rounded-lg p-2"><X className="w-5 h-5" /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
                         <fieldset>
                            <legend className="text-lg font-semibold text-gray-700 flex items-center mb-3"><PawPrint className="w-5 h-5 mr-2 text-orange-500" /> Basic Info</legend>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">Pet Name</label><input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="form-input" required /></div>
                                <div><label htmlFor="pet_type" className="block mb-1 text-sm font-medium text-gray-700">Pet Type</label><input type="text" name="pet_type" id="pet_type" value={formData.pet_type} onChange={handleChange} className="form-input" /></div>
                                <div><label htmlFor="breed" className="block mb-1 text-sm font-medium text-gray-700">Breed</label><input type="text" name="breed" id="breed" value={formData.breed} onChange={handleChange} className="form-input" /></div>
                                <div><label htmlFor="gender" className="block mb-1 text-sm font-medium text-gray-700">Gender</label><select name="gender" id="gender" value={formData.gender} onChange={handleChange} className="form-input"><option>Male</option><option>Female</option><option>Unknown</option></select></div>
                                <div><label htmlFor="age" className="block mb-1 text-sm font-medium text-gray-700">Age (years)</label><input type="number" name="age" id="age" value={formData.age} onChange={handleChange} min="0" className="form-input" /></div>
                                <div><label htmlFor="color" className="block mb-1 text-sm font-medium text-gray-700">Color</label><input type="text" name="color" id="color" value={formData.color} onChange={handleChange} className="form-input" /></div>
                                <div className="md:col-span-2"><label htmlFor="description" className="block mb-1 text-sm font-medium text-gray-700">Description</label><textarea name="description" id="description" rows={3} value={formData.description} onChange={handleChange} className="form-input" /></div>
                            </div>
                        </fieldset>
                         <fieldset>
                            <legend className="text-lg font-semibold text-gray-700 flex items-center mb-3"><MapPin className="w-5 h-5 mr-2 text-orange-500" /> Location</legend>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2"><label htmlFor="address" className="block mb-1 text-sm font-medium text-gray-700">Address</label><input type="text" name="address" id="address" value={formData.address} onChange={handleChange} className="form-input" /></div>
                                <div><label htmlFor="city" className="block mb-1 text-sm font-medium text-gray-700">City</label><input type="text" name="city" id="city" value={formData.city} onChange={handleChange} className="form-input" /></div>
                                <div><label htmlFor="state" className="block mb-1 text-sm font-medium text-gray-700">State</label><input type="text" name="state" id="state" value={formData.state} onChange={handleChange} className="form-input" /></div>
                                <div><label htmlFor="pincode" className="block mb-1 text-sm font-medium text-gray-700">Pincode</label><input type="text" name="pincode" id="pincode" value={formData.pincode} onChange={handleChange} className="form-input" /></div>
                            </div>
                        </fieldset>
                         <fieldset>
                            <legend className="text-lg font-semibold text-gray-700 flex items-center mb-3"><Stethoscope className="w-5 h-5 mr-2 text-orange-500" /> Medical Status</legend>
                            <div className="flex items-center space-x-8 mb-4">
                                <label className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" name="is_vaccinated" checked={formData.is_vaccinated} onChange={handleChange} className="h-4 w-4 rounded text-orange-600 focus:ring-orange-500" /><span className="text-sm font-medium text-gray-700">Vaccinated</span></label>
                                <label className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" name="is_diseased" checked={formData.is_diseased} onChange={handleChange} className="h-4 w-4 rounded text-orange-600 focus:ring-orange-500" /><span className="text-sm font-medium text-gray-700">Diseased</span></label>
                            </div>
                             {formData.is_vaccinated && (
                                <div className="p-4 bg-gray-50 rounded-lg border space-y-3">
                                    <h4 className="font-semibold text-gray-600 text-sm">Vaccination Details</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label htmlFor="vaccination_name" className="block mb-1 text-xs font-medium text-gray-600">Vaccine Name</label><input type="text" name="vaccination_name" id="vaccination_name" value={formData.vaccination_name} onChange={handleChange} className="form-input" /></div>
                                        <div><label htmlFor="last_vaccinated_date" className="block mb-1 text-xs font-medium text-gray-600">Last Date</label><input type="date" name="last_vaccinated_date" id="last_vaccinated_date" value={formData.last_vaccinated_date} onChange={handleChange} className="form-input" /></div>
                                    </div>
                                </div>
                            )}
                            {formData.is_diseased && (
                                <div className="p-4 bg-gray-50 rounded-lg border space-y-3 mt-4">
                                    <h4 className="font-semibold text-gray-600 text-sm">Disease Details</h4>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div><label htmlFor="disease_name" className="block mb-1 text-xs font-medium text-gray-600">Disease Name</label><input type="text" name="disease_name" id="disease_name" value={formData.disease_name} onChange={handleChange} className="form-input" /></div>
                                        <div><label htmlFor="stage" className="block mb-1 text-xs font-medium text-gray-600">Stage</label><input type="text" name="stage" id="stage" value={formData.stage} onChange={handleChange} className="form-input" /></div>
                                        <div><label htmlFor="no_of_years" className="block mb-1 text-xs font-medium text-gray-600">Duration (years)</label><input type="text" name="no_of_years" id="no_of_years" value={formData.no_of_years} onChange={handleChange} className="form-input" /></div>
                                    </div>
                                </div>
                            )}
                        </fieldset>
                        <style>{`.form-input { width: 100%; padding: 0.5rem 0.75rem; font-size: 0.875rem; color: #374151; background-color: #f9fafb; border: 1px solid #d1d5db; border-radius: 0.5rem; transition: border-color 0.2s, box-shadow 0.2s; } .form-input:focus { outline: none; border-color: #f97316; box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.3); }`}</style>
                    </form>
                     <div className="flex items-center justify-end p-6 border-t mt-auto">
                        <button type="button" onClick={onClose} disabled={isSubmitting} className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white rounded-lg border hover:bg-gray-100 disabled:opacity-50">Cancel</button>
                        <button type="submit" onClick={handleSubmit} disabled={isSubmitting} className="ml-3 px-5 py-2.5 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:bg-orange-300">{isSubmitting ? 'Saving...' : 'Save Changes'}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditPetModal;