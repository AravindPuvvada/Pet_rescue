import React, { useState } from 'react';
import { X, PawPrint, MapPin, Stethoscope } from 'lucide-react';
import type { Pet } from '../../services/api';
import { apiService } from '../../services/api';
import { toast } from 'react-toastify';

interface EditPetModalProps {
    pet: Pet;
    onClose: () => void;
    onSuccess: () => void;
}

const EditPetModal: React.FC<EditPetModalProps> = ({ pet, onClose, onSuccess }) => {
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
        vaccination_name: pet.medical_history?.vaccination_name || '',
        last_vaccinated_date: pet.medical_history?.last_vaccinated_date || '',
        disease_name: pet.medical_history?.disease_name || '',
        stage: pet.medical_history?.stage || '',
        no_of_years: pet.medical_history?.no_of_years || '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
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

    // Reusable classes for form inputs for consistency and easier theme management
    const formInputClasses = "w-full px-3 py-2 text-sm text-light-text dark:text-dark-secondary bg-light-primary/70 dark:bg-dark-primary/50 border border-light-secondary/30 dark:border-dark-secondary/30 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent placeholder-light-text/50 dark:placeholder-dark-neutral";
    const labelClasses = "block mb-1 text-sm font-medium text-light-text dark:text-dark-secondary";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm theme-transition">
            <div className="bg-light-neutral dark:bg-dark-background rounded-2xl shadow-2xl w-full max-w-4xl m-4 max-h-[90vh] flex transform transition-all overflow-hidden border border-light-secondary/20 dark:border-dark-primary">
                {/* Left Panel */}
                <div className="w-1/3 bg-light-primary dark:bg-dark-primary p-8 flex-col items-center justify-center hidden md:flex theme-transition">
                    <div className="w-40 h-40 rounded-full bg-white dark:bg-dark-background shadow-lg flex items-center justify-center overflow-hidden border-4 border-white dark:border-dark-secondary mb-4">
                        <img src={pet.image || 'https://placehold.co/200x200/C4D8E2/4A3933?text=Pet'} alt={pet.name} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-3xl font-bold text-light-text dark:text-dark-secondary text-center">{formData.name}</h3>
                    <p className="text-light-secondary dark:text-dark-neutral text-center">{formData.breed}</p>
                </div>
                {/* Right Panel / Form */}
                <div className="w-full md:w-2/3 flex flex-col">
                    <div className="flex items-center justify-between p-6 border-b border-light-secondary/20 dark:border-dark-primary theme-transition">
                        <h3 className="text-2xl font-semibold text-light-text dark:text-dark-secondary">Edit Pet Details</h3>
                        <button type="button" onClick={onClose} className="text-light-secondary dark:text-dark-neutral bg-transparent hover:bg-light-primary dark:hover:bg-dark-primary rounded-lg p-2 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
                        {/* Basic Info Fieldset */}
                        <fieldset>
                            <legend className="text-lg font-semibold text-light-text dark:text-dark-secondary flex items-center mb-3"><PawPrint className="w-5 h-5 mr-2 text-light-accent dark:text-dark-accent" /> Basic Info</legend>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label htmlFor="name" className={labelClasses}>Pet Name</label><input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={formInputClasses} required /></div>
                                <div><label htmlFor="pet_type" className={labelClasses}>Pet Type</label><input type="text" name="pet_type" id="pet_type" value={formData.pet_type} onChange={handleChange} className={formInputClasses} /></div>
                                <div><label htmlFor="breed" className={labelClasses}>Breed</label><input type="text" name="breed" id="breed" value={formData.breed} onChange={handleChange} className={formInputClasses} /></div>
                                <div><label htmlFor="gender" className={labelClasses}>Gender</label><select name="gender" id="gender" value={formData.gender} onChange={handleChange} className={formInputClasses}><option>Male</option><option>Female</option><option>Unknown</option></select></div>
                                <div><label htmlFor="age" className={labelClasses}>Age (years)</label><input type="number" name="age" id="age" value={formData.age} onChange={handleChange} min="0" className={formInputClasses} /></div>
                                <div><label htmlFor="color" className={labelClasses}>Color</label><input type="text" name="color" id="color" value={formData.color} onChange={handleChange} className={formInputClasses} /></div>
                                <div className="md:col-span-2"><label htmlFor="description" className={labelClasses}>Description</label><textarea name="description" id="description" rows={3} value={formData.description} onChange={handleChange} className={formInputClasses} /></div>
                            </div>
                        </fieldset>

                        {/* Location Fieldset */}
                        <fieldset>
                            <legend className="text-lg font-semibold text-light-text dark:text-dark-secondary flex items-center mb-3"><MapPin className="w-5 h-5 mr-2 text-light-accent dark:text-dark-accent" /> Location</legend>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2"><label htmlFor="address" className={labelClasses}>Address</label><input type="text" name="address" id="address" value={formData.address} onChange={handleChange} className={formInputClasses} /></div>
                                <div><label htmlFor="city" className={labelClasses}>City</label><input type="text" name="city" id="city" value={formData.city} onChange={handleChange} className={formInputClasses} /></div>
                                <div><label htmlFor="state" className={labelClasses}>State</label><input type="text" name="state" id="state" value={formData.state} onChange={handleChange} className={formInputClasses} /></div>
                                <div><label htmlFor="pincode" className={labelClasses}>Pincode</label><input type="text" name="pincode" id="pincode" value={formData.pincode} onChange={handleChange} className={formInputClasses} /></div>
                            </div>
                        </fieldset>

                        {/* Medical Status Fieldset */}
                        <fieldset>
                            <legend className="text-lg font-semibold text-light-text dark:text-dark-secondary flex items-center mb-3"><Stethoscope className="w-5 h-5 mr-2 text-light-accent dark:text-dark-accent" /> Medical Status</legend>
                            <div className="flex items-center space-x-8 mb-4">
                                <label className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" name="is_vaccinated" checked={formData.is_vaccinated} onChange={handleChange} className="h-4 w-4 rounded text-light-accent dark:text-dark-accent focus:ring-light-accent dark:focus:ring-dark-accent bg-light-primary dark:bg-dark-primary border-light-secondary/50 dark:border-dark-secondary/50" /><span className={labelClasses}>Vaccinated</span></label>
                                <label className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" name="is_diseased" checked={formData.is_diseased} onChange={handleChange} className="h-4 w-4 rounded text-light-accent dark:text-dark-accent focus:ring-light-accent dark:focus:ring-dark-accent bg-light-primary dark:bg-dark-primary border-light-secondary/50 dark:border-dark-secondary/50" /><span className={labelClasses}>Diseased</span></label>
                            </div>
                             {formData.is_vaccinated && (
                                <div className="p-4 bg-light-primary dark:bg-dark-primary rounded-lg border border-light-secondary/20 dark:border-dark-secondary/20 space-y-3">
                                    <h4 className="font-semibold text-light-secondary dark:text-dark-neutral text-sm">Vaccination Details</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label htmlFor="vaccination_name" className={`${labelClasses} text-xs`}>Vaccine Name</label><input type="text" name="vaccination_name" id="vaccination_name" value={formData.vaccination_name} onChange={handleChange} className={formInputClasses} /></div>
                                        <div><label htmlFor="last_vaccinated_date" className={`${labelClasses} text-xs`}>Last Date</label><input type="date" name="last_vaccinated_date" id="last_vaccinated_date" value={formData.last_vaccinated_date} onChange={handleChange} className={formInputClasses} /></div>
                                    </div>
                                </div>
                            )}
                            {formData.is_diseased && (
                                <div className="p-4 bg-light-primary dark:bg-dark-primary rounded-lg border border-light-secondary/20 dark:border-dark-secondary/20 space-y-3 mt-4">
                                    <h4 className="font-semibold text-light-secondary dark:text-dark-neutral text-sm">Disease Details</h4>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div><label htmlFor="disease_name" className={`${labelClasses} text-xs`}>Disease Name</label><input type="text" name="disease_name" id="disease_name" value={formData.disease_name} onChange={handleChange} className={formInputClasses} /></div>
                                        <div><label htmlFor="stage" className={`${labelClasses} text-xs`}>Stage</label><input type="text" name="stage" id="stage" value={formData.stage} onChange={handleChange} className={formInputClasses} /></div>
                                        <div><label htmlFor="no_of_years" className={`${labelClasses} text-xs`}>Duration (years)</label><input type="text" name="no_of_years" id="no_of_years" value={formData.no_of_years} onChange={handleChange} className={formInputClasses} /></div>
                                    </div>
                                </div>
                            )}
                        </fieldset>
                    </form>
                     <div className="flex items-center justify-end p-6 border-t border-light-secondary/20 dark:border-dark-primary mt-auto theme-transition">
                        <button type="button" onClick={onClose} disabled={isSubmitting} className="px-5 py-2.5 text-sm font-medium text-light-text dark:text-dark-secondary bg-transparent dark:bg-dark-primary rounded-lg border border-light-secondary/30 dark:border-dark-secondary/30 hover:bg-light-primary dark:hover:bg-dark-background disabled:opacity-50 transition-colors">Cancel</button>
                        <button type="submit" onClick={handleSubmit} disabled={isSubmitting} className="ml-3 px-5 py-2.5 text-sm font-medium text-white bg-light-accent dark:bg-dark-accent rounded-lg hover:opacity-90 disabled:opacity-50 transition-colors">{isSubmitting ? 'Saving...' : 'Save Changes'}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditPetModal;
