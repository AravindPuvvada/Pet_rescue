import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Calendar, AlertCircle } from 'lucide-react';
import { apiService } from '../../services/api';

interface Pet {
  id: number;
  name: string;
  pet_type: string;
  breed: string;
  color: string;
  age: number;
  description: string;
  city: string;
  state: string;
  image?: string;
  created_date: string;
}

const PetOwnerPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(false);
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
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const data = await apiService.getPets();
      setPets(data);
    } catch (error) {
      console.error('Error fetching pets:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== '') {
          data.append(key, value as string | Blob);
        }
      });

      await apiService.createPetWithImage(data);
      await fetchPets();
      setShowForm(false);
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
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lost Pets</h2>
          <p className="text-gray-600">Report and manage your lost pets</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-pink-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Report Lost Pet</span>
        </button>
      </div>

      {/* Upload Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Lost Pet</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Pet Name"
              value={formData.name}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
            <input
              type="text"
              name="pet_type"
              placeholder="Pet Type (Dog, Cat, etc.)"
              value={formData.pet_type}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
            <input
              type="text"
              name="breed"
              placeholder="Breed"
              value={formData.breed}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <input
              type="text"
              name="color"
              placeholder="Color"
              value={formData.color}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <input
              type="number"
              name="age"
              placeholder="Age (years)"
              value={formData.age}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <textarea
              name="description"
              placeholder="Description (last seen location, behavior, etc.)"
              value={formData.description}
              onChange={handleChange}
              className="md:col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              rows={3}
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
                className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:from-orange-600 hover:to-pink-600 transition-colors disabled:opacity-50"
              >
                {loading ? 'Reporting...' : 'Report Pet'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Pets List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pets.map((pet) => (
          <div key={pet.id} className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
            {pet.image && (
              <img
                src={pet.image}
                alt={pet.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{pet.name}</h3>
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                  Lost
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-2">{pet.pet_type} • {pet.breed}</p>
              <p className="text-gray-600 text-sm mb-3">{pet.description}</p>
              <div className="flex items-center text-gray-500 text-xs space-x-4">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>{pet.city}, {pet.state}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(pet.created_date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {pets.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No lost pets reported</h3>
          <p className="text-gray-600">Click "Report Lost Pet" to add your first pet.</p>
        </div>
      )}
    </div>
  );
};

export default PetOwnerPage;