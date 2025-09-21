import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Calendar, AlertCircle, Edit, Trash2, Eye } from 'lucide-react';
import { apiService } from '../../services/api';
import type { Pet } from '../../services/api';
interface UserRequests {
  reports: Array<{
    id: number;
    pet_name: string;
    pet_status: string;
    report_status: string;
    image?: string;
    is_resolved: boolean;
  }>;
  adoptions: Array<{
    id: number;
    pet_name: string;
    status: string;
  }>;
}

// 🔹 Helper to build full image URL
const getImageUrl = (path: string) => {
  const API_BASE_URL = "http://127.0.0.1:8000"; // adjust if your backend URL differs
  return `${API_BASE_URL}${path}`;
};

const PetOwnerPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const [userRequests, setUserRequests] = useState<UserRequests | null>(null);
  const [loading, setLoading] = useState(false);
  const [showRequests, setShowRequests] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; petId: number | null }>({
    open: false,
    petId: null,
  });
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [notification, setNotification] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [formData, setFormData] = useState({
    name: '',
    pet_type: '',
    breed: '',
    color: '',
    age: '',
    weight: '',
    description: '',
    address: '',
    city: '',
    state: '',
    gender: '', 
    pincode: '',
    is_diseased: false,
    is_vaccinated: false,
    image: null as File | null,
  });
  const [medicalHistory, setMedicalHistory] = useState({
    last_vaccinated_date: '',
    vaccination_name: '',
    disease_name: '',
    stage: '',
    no_of_years: '',
  });


  useEffect(() => {
    fetchLostPets();
    fetchUserRequests();
  }, []);

  const fetchUserRequests = async () => {
    try {
      const requests = await apiService.getUserRequests();
      setUserRequests(requests);
    } catch (error) {
      console.error('Error fetching user requests:', error);
    }
  };
  const fetchLostPets = async () => {
    try {
      const response = await apiService.getLostPets();
      // Convert the response format to Pet format for display
      const petsData = response.lost_pets.map(item => ({
        id: item.pet.id,
        name: item.pet.name,
        pet_type: item.pet.pet_type || '',
        breed: item.pet.breed || '',
        color: item.pet.color || '',
        age: item.pet.age || 0,
        description: '',
        city: '',
        state: '',
        image: item.image,
        created_date: new Date().toISOString(),
        gender: '',
        weight: 0,
        address: '',
        pincode: 0,
        is_diseased: false,
        is_vaccinated: false,
        modified_date: new Date().toISOString()
      }));
      setPets(petsData);
    } catch (error) {
      console.error('Error fetching pets:', error);
      setNotification({
        open: true,
        message: 'Failed to fetch lost pets',
        severity: 'error'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create FormData for proper file upload
      const formDataToSend = new FormData();
      
      // Prepare pet data
      const petData = {
        name: formData.name,
        pet_type: formData.pet_type,
        breed: formData.breed,
        color: formData.color,
        age: formData.age ? parseInt(formData.age) : undefined,
        weight: formData.weight ? parseInt(formData.weight) : undefined,
        description: formData.description,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode ? parseInt(formData.pincode) : undefined,
        is_diseased: formData.is_diseased,
        is_vaccinated: formData.is_vaccinated,
      };
      
      // Prepare report data
      const reportData = {
        pet_status: 'Lost',
        report_status: 'Pending',
      };
      
      // Add JSON data to FormData
      formDataToSend.append('pet', JSON.stringify(petData));
      formDataToSend.append('report', JSON.stringify(reportData));
      
      // Add medical history if needed
      if (formData.is_vaccinated || formData.is_diseased) {
        const medicalHistoryData = {
          last_vaccinated_date: medicalHistory.last_vaccinated_date || undefined,
          vaccination_name: medicalHistory.vaccination_name || undefined,
          disease_name: medicalHistory.disease_name || undefined,
          stage: medicalHistory.stage ? parseInt(medicalHistory.stage) : undefined,
          no_of_years: medicalHistory.no_of_years ? parseInt(medicalHistory.no_of_years) : undefined,
        };
        formDataToSend.append('medical_history', JSON.stringify(medicalHistoryData));
      }
      
      // Add image file if present
      if (formData.image) {
        formDataToSend.append('pet_image', formData.image);
      }
      
      // Send request using fetch directly for better FormData handling
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://127.0.0.1:8000/api/lost-pet-request/', {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          // Don't set Content-Type header - let browser set it with boundary for FormData
        },
        body: formDataToSend,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Upload failed' }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Upload successful:', result);

      await fetchLostPets();
      await fetchUserRequests();
      setShowForm(false);
      setMessage({ text: 'Lost pet reported successfully!', type: 'success' });
      setNotification({
        open: true,
        message: 'Lost pet reported successfully!',
        severity: 'success'
      });
      
      // Reset form
      setFormData({
        name: '',
        pet_type: '',
        breed: '',
        color: '',
        age: '',
        weight: '',
        description: '',
        address: '',
        city: '',
        state: '',
        gender: '', 
        pincode: '',
        is_diseased: false,
        is_vaccinated: false,
        image: null,
      });
      setMedicalHistory({
        last_vaccinated_date: '',
        vaccination_name: '',
        disease_name: '',
        stage: '',
        no_of_years: '',
      });
    } catch (error) {
      console.error('Error creating pet:', error);
      setMessage({ text: 'Failed to report lost pet', type: 'error' });
      setNotification({
        open: true,
        message: 'Failed to report lost pet',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const { files, checked } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : files ? files[0] : value,
    }));
  };

  const handleMedicalHistoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMedicalHistory(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDeletePet = async (petId: number) => {
    try {
      await apiService.deletePet(petId);
      await fetchLostPets();
      await fetchUserRequests();
      setMessage({ text: 'Pet deleted successfully', type: 'success' });
      setNotification({
        open: true,
        message: 'Pet deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting pet:', error);
      setMessage({ text: 'Failed to delete pet', type: 'error' });
      setNotification({
        open: true,
        message: 'Failed to delete pet',
        severity: 'error'
      });
    }
    setDeleteDialog({ open: false, petId: null });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'resolved': return 'bg-blue-100 text-blue-800';
      case 'reunited': return 'bg-purple-100 text-purple-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lost Pets</h2>
          <p className="text-gray-600">Report and manage your lost pets</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowRequests(!showRequests)}
            className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>My Requests</span>
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-pink-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Report Lost Pet</span>
          </button>
        </div>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {/* My Requests Section */}
      {showRequests && userRequests && (
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">My Requests Status</h3>
          
          {/* Pet Reports */}
          {userRequests.reports && userRequests.reports.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Pet Reports</h4>
              <div className="space-y-3">
                {userRequests.reports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {report.image && (
                        <img 
                          src={apiService.getImageUrl(report.image)} 
                          alt={report.pet_name} 
                          className="w-12 h-12 object-cover rounded-lg" 
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{report.pet_name}</p>
                        <p className="text-sm text-gray-600">{report.pet_status}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.report_status)}`}>
                        {report.report_status}
                      </span>
                      {report.is_resolved && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          Resolved
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Adoption Requests */}
          {userRequests.adoptions && userRequests.adoptions.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Adoption Requests</h4>
              <div className="space-y-3">
                {userRequests.adoptions.map((adoption) => (
                  <div key={adoption.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{adoption.pet_name}</p>
                      <p className="text-sm text-gray-600">Adoption Request</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(adoption.status)}`}>
                      {adoption.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(!userRequests.reports || userRequests.reports.length === 0) && 
           (!userRequests.adoptions || userRequests.adoptions.length === 0) && (
            <p className="text-gray-500 text-center py-4">No requests found</p>
          )}
        </div>
      )}
      {/* Upload Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Lost Pet</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                placeholder="Pet Type (e.g., Dog, Cat, Bird)"
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
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="number"
                name="weight"
                placeholder="Weight (kg)"
                value={formData.weight}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                value={formData.pincode}
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="is_diseased"
                  checked={formData.is_diseased}
                  onChange={handleChange}
                  className="rounded"
                />
                <span>Is Diseased</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="is_vaccinated"
                  checked={formData.is_vaccinated}
                  onChange={handleChange}
                  className="rounded"
                />
                <span>Is Vaccinated</span>
              </label>
            </div>

            {(formData.is_vaccinated || formData.is_diseased) && (
              <div className="border-t pt-4">
                <h4 className="text-lg font-semibold mb-4">Medical History</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.is_vaccinated && (
                    <>
                      <input
                        type="date"
                        name="last_vaccinated_date"
                        placeholder="Last Vaccinated Date"
                        value={medicalHistory.last_vaccinated_date}
                        onChange={handleMedicalHistoryChange}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        name="vaccination_name"
                        placeholder="Vaccination Name"
                        value={medicalHistory.vaccination_name}
                        onChange={handleMedicalHistoryChange}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </>
                  )}
                  {formData.is_diseased && (
                    <>
                      <input
                        type="text"
                        name="disease_name"
                        placeholder="Disease Name"
                        value={medicalHistory.disease_name}
                        onChange={handleMedicalHistoryChange}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <input
                        type="number"
                        name="stage"
                        placeholder="Disease Stage"
                        value={medicalHistory.stage}
                        onChange={handleMedicalHistoryChange}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <input
                        type="number"
                        name="no_of_years"
                        placeholder="Years with Disease"
                        value={medicalHistory.no_of_years}
                        onChange={handleMedicalHistoryChange}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </>
                  )}
                </div>
              </div>
            )}

            <textarea
              name="description"
              placeholder="Description (last seen location, behavior, distinctive features, etc.)"
              value={formData.description}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              rows={3}
            />
            
            <div className="flex space-x-3">
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
          <div key={pet.id} className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
            {pet.image && (
              <img
                src={getImageUrl(pet.image)}
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
              <p className="text-gray-600 text-sm mb-2">
                {typeof pet.pet_type === 'string' ? pet.pet_type : pet.pet_type?.type || 'Unknown'} • {pet.breed}
              </p>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{pet.description}</p>
              
              <div className="flex items-center text-gray-500 text-xs space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>{pet.city}, {pet.state}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(pet.created_date).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setDeleteDialog({ open: true, petId: pet.id })}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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

      {/* Delete Confirmation Dialog */}
      {deleteDialog.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this pet? This action cannot be undone.</p>
            <div className="flex space-x-3">
              <button
                onClick={() => setDeleteDialog({ open: false, petId: null })}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteDialog.petId && handleDeletePet(deleteDialog.petId)}
                className="flex-1 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification.open && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
          notification.severity === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {notification.message}
          <button
            onClick={() => setNotification({ ...notification, open: false })}
            className="ml-4 text-white hover:text-gray-200"
        >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default PetOwnerPage;