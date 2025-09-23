// src/pages/ReportFoundPetForm.tsx

import React, { useState } from 'react';
import { X, PawPrint, MapPin, Stethoscope, Camera } from 'lucide-react';
import { apiService } from '../../services/api';
import type { LostPetRequestCreate } from '../../services/api';
import { toast } from 'react-toastify';

interface ReportFoundPetFormProps {
    onClose: () => void;
    onSuccess: () => void;
}

const ReportFoundPetForm: React.FC<ReportFoundPetFormProps> = ({ onClose, onSuccess }) => {
    // State is correctly hardcoded for a 'Found' pet report
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

    // Using the corrected, robust form handlers we developed
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
        let finalValue: string | number | undefined = value;
        if (name === 'stage' || name === 'no_of_years') {
            finalValue = value === '' ? undefined : parseInt(value, 10);
            if (isNaN(finalValue as number)) finalValue = undefined;
        }
        setFormData(prev => ({ ...prev, medical_history: { ...prev.medical_history, [name]: finalValue }}));
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
            const requestData = { ...formData };
            const medicalHistoryPayload: { [key: string]: any } = {};

            if (requestData.pet.is_vaccinated) {
                medicalHistoryPayload.vaccination_name = requestData.medical_history?.vaccination_name;
                medicalHistoryPayload.last_vaccinated_date = requestData.medical_history?.last_vaccinated_date;
            }
            if (requestData.pet.is_diseased) {
                medicalHistoryPayload.disease_name = requestData.medical_history?.disease_name;
                medicalHistoryPayload.stage = requestData.medical_history?.stage;
                medicalHistoryPayload.no_of_years = requestData.medical_history?.no_of_years;
            }
            requestData.medical_history = medicalHistoryPayload;

            const finalApiRequest: LostPetRequestCreate = { ...requestData, pet_image: petImage || undefined };

            await apiService.createLostPetRequest(finalApiRequest);
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex transform transition-all overflow-hidden" onClick={e => e.stopPropagation()}>
                {/* Left Visual Column */}
                <div className="w-1/3 bg-gradient-to-br from-orange-50 to-orange-100 p-8 flex flex-col items-center justify-center">
                    <label htmlFor="pet_image" className="relative w-40 h-40 bg-white shadow-lg rounded-full flex items-center justify-center border-4 border-white cursor-pointer hover:border-orange-200 transition-colors group">
                        {imagePreview ? (
                            <img src={imagePreview} alt="Pet preview" className="w-full h-full object-cover rounded-full" />
                        ) : (
                            <div className="text-center text-gray-400 group-hover:text-orange-500 transition-colors">
                                <Camera className="mx-auto h-12 w-12" />
                                <span className="mt-2 block text-sm font-medium">Upload Photo</span>
                            </div>
                        )}
                        <input id="pet_image" name="pet_image" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                    </label>
                    <h3 className="text-3xl font-bold text-orange-900 mt-4 break-words text-center">
                        {formData.pet.name || 'Found Pet Report'}
                    </h3>
                    <p className="text-orange-700">{formData.pet.breed}</p>
                </div>

                {/* Right Form Column */}
                <div className="w-2/3 flex flex-col">
                    <div className="flex items-center justify-between p-6 border-b">
                        <h3 className="text-2xl font-semibold text-gray-800">Report Found Pet Details</h3>
                        <button type="button" onClick={onClose} className="text-gray-400 bg-transparent hover:bg-gray-200 rounded-lg p-2"><X className="w-5 h-5" /></button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
                        <fieldset>
                            <legend className="text-lg font-semibold text-gray-700 flex items-center mb-3"><PawPrint className="w-5 h-5 mr-2 text-orange-500" /> Basic Info</legend>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label htmlFor="name">Pet's Name (if known)</label><input type="text" name="name" id="name" value={formData.pet.name} onChange={handlePetChange} className="form-input" /></div>
                                <div><label htmlFor="pet_type">Pet Type (e.g., Dog)</label><input type="text" name="pet_type" id="pet_type" value={typeof formData.pet.pet_type === 'object' ? formData.pet.pet_type.type : formData.pet.pet_type || ''} onChange={handlePetChange} required className="form-input" /></div>
                                <div><label htmlFor="breed">Breed</label><input type="text" name="breed" id="breed" value={formData.pet.breed} onChange={handlePetChange} className="form-input" /></div>
                                <div><label htmlFor="gender">Gender</label><select name="gender" id="gender" value={formData.pet.gender} onChange={handlePetChange} className="form-input"><option>Male</option><option>Female</option><option>Unknown</option></select></div>
                                <div><label htmlFor="age">Estimated Age (years)</label><input type="number" name="age" id="age" value={formData.pet.age || ''} onChange={handlePetChange} min="0" className="form-input" /></div>
                                <div><label htmlFor="color">Color</label><input type="text" name="color" id="color" value={formData.pet.color} onChange={handlePetChange} className="form-input" /></div>
                                <div className="md:col-span-2"><label htmlFor="description">Description</label><textarea name="description" id="description" rows={2} value={formData.pet.description} onChange={handlePetChange} className="form-input" placeholder="Distinguishing marks, behavior, etc."/></div>
                            </div>
                        </fieldset>

                        <fieldset>
                            <legend className="text-lg font-semibold text-gray-700 flex items-center mb-3"><MapPin className="w-5 h-5 mr-2 text-orange-500" /> Location Found</legend>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2"><label htmlFor="address">Address</label><input type="text" name="address" id="address" value={formData.pet.address} onChange={handlePetChange} className="form-input" /></div>
                                <div><label htmlFor="city">City</label><input type="text" name="city" id="city" value={formData.pet.city} onChange={handlePetChange} className="form-input" /></div>
                                <div><label htmlFor="state">State</label><input type="text" name="state" id="state" value={formData.pet.state} onChange={handlePetChange} className="form-input" /></div>
                                <div><label htmlFor="pincode">Pincode</label><input type="number" name="pincode" id="pincode" value={formData.pet.pincode || ''} onChange={handlePetChange} className="form-input" /></div>
                            </div>
                        </fieldset>

                        <fieldset>
                            <legend className="text-lg font-semibold text-gray-700 flex items-center mb-3"><Stethoscope className="w-5 h-5 mr-2 text-orange-500" /> Medical Status (Optional)</legend>
                            <div className="p-4 bg-gray-50 rounded-lg border space-y-4">
                                <div className="flex items-center space-x-8"><label className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" name="is_vaccinated" checked={formData.pet.is_vaccinated} onChange={handlePetChange} className="h-4 w-4 rounded text-orange-600 focus:ring-orange-500" /><span className="text-sm font-medium text-gray-700">Vaccinated</span></label><label className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" name="is_diseased" checked={formData.pet.is_diseased} onChange={handlePetChange} className="h-4 w-4 rounded text-orange-600 focus:ring-orange-500" /><span className="text-sm font-medium text-gray-700">Diseased</span></label></div>
                                {formData.pet.is_vaccinated && <div className="grid grid-cols-2 gap-4 pt-4 border-t"><label>Vaccine Name<input type="text" name="vaccination_name" value={formData.medical_history?.vaccination_name} onChange={handleMedicalChange} className="form-input" /></label><label>Last Date<input type="date" name="last_vaccinated_date" value={formData.medical_history?.last_vaccinated_date} onChange={handleMedicalChange} className="form-input" /></label></div>}
                                {formData.pet.is_diseased && <div className="grid grid-cols-3 gap-4 pt-4 border-t"><label>Disease Name<input type="text" name="disease_name" value={formData.medical_history?.disease_name} onChange={handleMedicalChange} className="form-input" /></label><label>Stage<input type="number" name="stage" value={formData.medical_history?.stage || ''} onChange={handleMedicalChange} className="form-input" /></label><label>Duration (years)<input type="number" name="no_of_years" value={formData.medical_history?.no_of_years || ''} onChange={handleMedicalChange} className="form-input" /></label></div>}
                            </div>
                        </fieldset>
                    </form>

                    <div className="flex items-center justify-end p-6 border-t mt-auto">
                        <button type="button" onClick={onClose} disabled={submitting} className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white rounded-lg border hover:bg-gray-100 disabled:opacity-50">Cancel</button>
                        <button type="submit" onClick={handleSubmit} disabled={submitting} className="ml-3 px-5 py-2.5 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:bg-orange-300">{submitting ? 'Submitting...' : 'Submit Found Pet Report'}</button>
                    </div>
                </div>
                
                <style>{`
                    .form-input { display: block; width: 100%; padding: 0.5rem 0.75rem; font-size: 0.875rem; color: #374151; background-color: #f9fafb; border: 1px solid #d1d5db; border-radius: 0.5rem; transition: border-color 0.2s, box-shadow 0.2s; }
                    .form-input:focus { outline: none; border-color: #f97316; box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.3); }
                    fieldset label { display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 500; color: #4b5563; }
                `}</style>
            </div>
        </div>
    );
};

export default ReportFoundPetForm;