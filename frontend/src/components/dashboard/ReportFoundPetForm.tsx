// src/pages/ReportFoundPetForm.tsx

import React, { useState } from 'react';
import { X, Camera, PawPrint, MapPin, Stethoscope } from 'lucide-react';
import { apiService } from '../../services/api';
import type { LostPetRequestCreate } from '../../services/api';
import { toast } from 'react-toastify';

interface ReportFoundPetFormProps {
    onClose: () => void;
    onSuccess: () => void;
}

const ReportFoundPetForm: React.FC<ReportFoundPetFormProps> = ({ onClose, onSuccess }) => {
    // ✅ State is hardcoded to report a 'Found' pet
    const [formData, setFormData] = useState<Omit<LostPetRequestCreate, 'pet_image'>>({
        pet: {
            name: '', pet_type: '', breed: '', gender: 'Male', age: undefined,
            color: '', description: '', address: '', city: '', state: '',
            pincode: undefined, is_diseased: false, is_vaccinated: false,
        },
        report: { pet_status: 'Found', report_status: 'Pending' },
        medical_history: {
            vaccination_name: '', last_vaccinated_date: '', disease_name: '',
            stage: undefined, no_of_years: undefined,
        },
    });
    const [petImage, setPetImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // All handler functions are the same
    const handlePetChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
        let finalValue: string | number | boolean | undefined = value;
        if (name === 'age' || name === 'pincode') {
            finalValue = value === '' ? undefined : parseInt(value, 10);
            if (isNaN(finalValue as number)) finalValue = undefined;
        }
        setFormData(prev => ({ ...prev, pet: { ...prev.pet, [name]: type === 'checkbox' ? checked : finalValue }}));
    };

    const handleMedicalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, medical_history: { ...prev.medical_history, [name]: value }}));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setPetImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const fullRequestData: LostPetRequestCreate = {
                ...formData,
                pet_image: petImage || undefined,
            };
            await apiService.createLostPetRequest(fullRequestData);
            // ✅ Updated success message
            toast.success("Found pet reported successfully. An admin will review it shortly.");
            onSuccess();
            onClose();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to report pet.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col transform transition-all" onClick={e => e.stopPropagation()}>
                {/* Modal Header */}
                <div className="flex-shrink-0 p-6 border-b flex justify-between items-center">
                     {/* ✅ Updated Title */}
                    <h2 className="text-2xl font-bold text-gray-800">Report a Found Pet</h2>
                    <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors"><X /></button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="flex-grow p-8 overflow-y-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-8">
                            <fieldset className="flex flex-col items-center">
                                <label htmlFor="pet_image" className="relative w-48 h-48 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed cursor-pointer hover:border-orange-400 transition-colors group">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Pet preview" className="w-full h-full object-cover rounded-full" />
                                    ) : (
                                        <div className="text-center text-gray-500"><Camera className="mx-auto h-12 w-12" /><span className="mt-2 block text-sm font-medium">Upload Photo</span></div>
                                    )}
                                    <input id="pet_image" name="pet_image" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                                </label>
                                <p className="text-xs text-gray-500 mt-2">Click circle to upload an image</p>
                            </fieldset>
                            <fieldset>
                                <legend className="text-lg font-semibold text-gray-700 flex items-center mb-4"><PawPrint className="w-5 h-5 mr-3 text-orange-500" /> Basic Info</legend>
                                <div className="space-y-4">
                                    <div><label htmlFor="name">Pet's Name (if known)</label><input type="text" name="name" id="name" onChange={handlePetChange} className="form-input" /></div>
                                    <div><label htmlFor="pet_type">Pet Type (e.g., Dog)</label><input type="text" name="pet_type" id="pet_type" onChange={handlePetChange} required className="form-input" /></div>
                                    <div><label htmlFor="breed">Breed</label><input type="text" name="breed" id="breed" onChange={handlePetChange} className="form-input" /></div>
                                </div>
                            </fieldset>
                        </div>

                        {/* Right Column */}
                        <div className="lg:col-span-3 space-y-8">
                            <fieldset>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div><label htmlFor="color">Color</label><input type="text" name="color" id="color" onChange={handlePetChange} className="form-input" /></div>
                                    <div><label htmlFor="age">Estimated Age (years)</label><input type="number" name="age" id="age" onChange={handlePetChange} className="form-input" /></div>
                                    <div className="md:col-span-2"><label htmlFor="gender">Gender</label><select name="gender" id="gender" value={formData.pet.gender} onChange={handlePetChange} className="form-input"><option value="Male">Male</option><option value="Female">Female</option><option value="Unknown">Unknown</option></select></div>
                                    <div className="md:col-span-2"><label htmlFor="description">Description (distinguishing marks, behavior)</label><textarea name="description" id="description" rows={4} onChange={handlePetChange} className="form-input"></textarea></div>
                                </div>
                            </fieldset>
                            <fieldset>
                                 {/* ✅ Updated Legend */}
                                <legend className="text-lg font-semibold text-gray-700 flex items-center mb-4"><MapPin className="w-5 h-5 mr-3 text-orange-500" /> Location Found</legend>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2"><label htmlFor="address">Address</label><input type="text" name="address" id="address" onChange={handlePetChange} className="form-input" /></div>
                                    <div><label htmlFor="city">City</label><input type="text" name="city" id="city" onChange={handlePetChange} className="form-input" /></div>
                                    <div><label htmlFor="state">State</label><input type="text" name="state" id="state" onChange={handlePetChange} className="form-input" /></div>
                                    <div><label htmlFor="pincode">Pincode</label><input type="number" name="pincode" id="pincode" onChange={handlePetChange} className="form-input" /></div>
                                </div>
                            </fieldset>
                            <fieldset>
                                <legend className="text-lg font-semibold text-gray-700 flex items-center mb-4"><Stethoscope className="w-5 h-5 mr-3 text-orange-500" /> Medical History (Optional)</legend>
                                <div className="space-y-4 p-4 border rounded-lg bg-gray-50/80">
                                    <div className="flex items-center space-x-6"><label className="flex items-center cursor-pointer"><input type="checkbox" name="is_vaccinated" checked={formData.pet.is_vaccinated} onChange={handlePetChange} className="h-4 w-4 rounded text-orange-600 focus:ring-orange-500" /> <span className="ml-2">Vaccinated</span></label><label className="flex items-center cursor-pointer"><input type="checkbox" name="is_diseased" checked={formData.pet.is_diseased} onChange={handlePetChange} className="h-4 w-4 rounded text-orange-600 focus:ring-orange-500" /> <span className="ml-2">Has a Disease</span></label></div>
                                    {formData.pet.is_vaccinated && (<div className="grid grid-cols-2 gap-4 pt-4 border-t"><div><label htmlFor="vaccination_name">Vaccine Name</label><input type="text" name="vaccination_name" id="vaccination_name" onChange={handleMedicalChange} className="form-input" /></div><div><label htmlFor="last_vaccinated_date">Last Date</label><input type="date" name="last_vaccinated_date" id="last_vaccinated_date" onChange={handleMedicalChange} className="form-input" /></div></div>)}
                                    {formData.pet.is_diseased && (<div className="grid grid-cols-3 gap-4 pt-4 border-t"><div><label htmlFor="disease_name">Disease Name</label><input type="text" name="disease_name" id="disease_name" onChange={handleMedicalChange} className="form-input" /></div><div><label htmlFor="stage">Stage</label><input type="text" name="stage" id="stage" onChange={handleMedicalChange} className="form-input" /></div><div><label htmlFor="no_of_years">Duration</label><input type="text" name="no_of_years" placeholder="e.g., 2 years" onChange={handleMedicalChange} className="form-input" /></div></div>)}
                                </div>
                            </fieldset>
                        </div>
                    </div>
                </form>

                {/* Modal Footer */}
                <div className="flex-shrink-0 flex justify-end p-6 border-t bg-gray-50 rounded-b-2xl">
                    <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white rounded-lg border hover:bg-gray-100 mr-3">Cancel</button>
                    <button type="submit" onClick={handleSubmit} disabled={submitting} className="px-6 py-2.5 font-semibold text-white bg-orange-500 rounded-lg shadow-md hover:bg-orange-600 disabled:bg-gray-400 transition-colors">
                        {submitting ? 'Submitting...' : 'Submit Found Pet Report'}
                    </button>
                </div>
                
                <style>{`.form-input { display: block; width: 100%; padding: 0.6rem 0.9rem; font-size: 0.9rem; color: #374151; background-color: #f9fafb; border: 1px solid #d1d5db; border-radius: 0.5rem; transition: border-color 0.2s, box-shadow 0.2s; } .form-input:focus { outline: none; border-color: #f97316; box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.3); } fieldset label { display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 500; color: #4b5563; }`}</style>
            </div>
        </div>
    );
};

export default ReportFoundPetForm;