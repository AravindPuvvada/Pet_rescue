import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Calendar, Heart } from 'lucide-react';
import { apiService } from '../../services/api';
import type { PetType } from '../../services/api';

interface Pet {
  id: number;
  name: string;
  pet_type: string | { type: string };
  breed: string;
  color: string;
  age: number;
  description: string;
  city: string;
  state: string;
  image?: string;
  created_date: string;
}

const PetRescuerPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const [petTypes, setPetTypes] = useState<PetType[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    pet_type: '',
    breed: '',
    color: '',
    age: '',
    description: '',
    city: '',
    state: '',
    image: null as File | null,
  });

  useEffect(() => {
    fetchFoundPets();
    fetchPetTypes();
  }, []);

  const fetchPetTypes = async () => {
    try {
      const types = await apiService.getPetTypes();
      setPetTypes(types);
    } catch (error) {
      console.error('Error fetching pet types:', error);
    }
  };
  const fetchFoundPets = async () => {
    try {
      const response = await apiService.getPetsByTab('found');
      // Convert PetReport format to Pet format for display
      const petsData = response.results.map((report: any) => ({
        id: report.pet.id,
        name: report.pet.name || 'Unknown',
        pet_type: report.pet.pet_type || '',
        breed: report.pet.breed || '',
        color: report.pet.color || '',
        age: report.pet.age || 0,
        description: report.pet.description || '',
        city: report.pet.city || '',
        state: report.pet.state || '',
        image: report.image || report.pet.image,
        created_date: report.created_date || new Date().toISOString()
      }));
      setPets(petsData);
    } catch (error) {
      console.error('Error fetching pets:', error);
      setMessage({ text: 'Failed to fetch found pets', type: 'error' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create found pet request similar to lost pet request
      const requestData = {
        pet: {
          name: formData.name || 'Unknown',
          pet_type: formData.pet_type,
          breed: formData.breed,
          color: formData.color,
          age: formData.age ? parseInt(formData.age) : undefined,
          description: formData.description,
          city: formData.city,
          state: formData.state,
          is_diseased: false,
          is_vaccinated: false,
        },
        report: {
          pet_status: 'Found',
          report_status: 'Pending',
        }
      };

      // Create the pet and report
      const formDataToSend = new FormData();
      formDataToSend.append('pet', JSON.stringify(requestData.pet));
      formDataToSend.append('report', JSON.stringify(requestData.report));
      
      if (formData.image) {
        formDataToSend.append('report_image', formData.image);
      }

      // Use the lost-pet-request endpoint but modify for found pets
      // You might want to create a separate found-pet-request endpoint
      const response = await fetch('http://127.0.0.1:8000/api/lost-pet-request/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        throw new Error('Failed to report found pet');
      }

      await fetchFoundPets();
      setShowForm(false);
      setMessage({ text: 'Found pet reported successfully!', type: 'success' });
      setFormData({
        name: '',
        pet_type: '',
        breed: '',
        color: '',
        age: '',
        description: '',
        city: '',
        state: '',
        image: null,
      });
    } catch (error) {
      console.error('Error creating pet:', error);
      setMessage({ text: 'Failed to report found pet', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  const { name, value, files } = e.target as HTMLInputElement;
  setFormData((prev) => ({
    ...prev,
    [name]: files ? files[0] : value,
  }));
};


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Found Pets</h2>
          <p className="text-gray-600">Report pets you've found and help them get home</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Report Found Pet</span>
        </button>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
          {message.text}
        </div>
      )}
      {/* Upload Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Found Pet</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Pet Name (if known)"
              value={formData.name}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <select
              name="pet_type"
              value={formData.pet_type}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              <option value="">Select Pet Type</option>
              {petTypes.map((type) => (
                <option key={type.id} value={type.type}>
                  {type.type}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="breed"
              placeholder="Breed (if identifiable)"
              value={formData.breed}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <input
              type="text"
              name="color"
              placeholder="Color"
              value={formData.color}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <input
              type="number"
              name="age"
              placeholder="Estimated Age (years)"
              value={formData.age}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <input
              type="text"
              name="city"
              placeholder="Found in City"
              value={formData.city}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <textarea
              name="description"
              placeholder="Description (where found, condition, behavior, etc.)"
              value={formData.description}
              onChange={handleChange}
              className="md:col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={3}
              required
            />
            <div className="md:col-span-2 flex space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-colors disabled:opacity-50"
              >
                {loading ? 'Reporting...' : 'Report Found Pet'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Found Pets List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pets.map((pet) => (
          <div key={pet.id} className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
            {pet.image && (
              <img
                src={apiService.getImageUrl(pet.image)}
                alt={pet.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{pet.name || 'Unknown'}</h3>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                  Found
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-2">
                {typeof pet.pet_type === 'string' ? pet.pet_type : pet.pet_type?.type || 'Unknown'} • {pet.breed}
              </p>
              <p className="text-gray-600 text-sm mb-3">{pet.description}</p>
              <div className="flex items-center text-gray-500 text-xs space-x-4 mb-3">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>{pet.city}, {pet.state}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(pet.created_date).toLocaleDateString()}</span>
                </div>
              </div>
              <button className="w-full bg-blue-50 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                Contact Rescuer
              </button>
            </div>
          </div>
        ))}
      </div>

      {pets.length === 0 && (
        <div className="text-center py-12">
          <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No found pets reported</h3>
          <p className="text-gray-600">Click "Report Found Pet" to help a pet find their home.</p>
        </div>
      )}
    </div>
  );
};

export default PetRescuerPage;