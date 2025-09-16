import React, { useState, useEffect } from 'react';
// import { UserPlus, Heart, Calendar, User, Check, X } from 'lucide-react';
import { UserPlus, Calendar, User, Check, X } from 'lucide-react';
import { apiService } from '../../services/api';
import type { PetAdoption } from '../../services/api';

const AdminAdoptRequests: React.FC = () => {
  const [requests, setRequests] = useState<PetAdoption[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    fetchAdoptRequests();
  }, []);

  const fetchAdoptRequests = async () => {
    try {
      setLoading(true);
      const adoptionData = await apiService.getPetAdoptions();
      setRequests(adoptionData);
    } catch (error) {
      console.error('Error fetching adoption requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (petId: number, action: 'approve' | 'reject') => {
    try {
      setActionLoading(petId);
      await apiService.adminApproval({
        request_type: 'adopt',
        pet_id: petId,
        action: action
      });
      await fetchAdoptRequests();
    } catch (error) {
      console.error('Error handling approval:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Adoption Requests</h1>
          <p className="text-gray-600 mt-2">Review and manage pet adoption requests</p>
        </div>
        <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg font-medium">
          Total Requests: {requests.length}
        </div>
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {requests.map((request) => (
          <div key={request.id} className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <div className="flex items-start space-x-4 mb-4">
              {request.pet.image && (
                <img
                  src={apiService.getImageUrl(request.pet.image)}
                  alt={request.pet.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{request.pet.name}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">
                  {typeof request.pet.pet_type === 'string' ? request.pet.pet_type : request.pet.pet_type?.type || 'Unknown'} • {request.pet.breed}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                <User className="w-4 h-4" />
                <span>Requested by: {request.requestor.username}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                <Calendar className="w-4 h-4" />
                <span>Requested on: {new Date(request.created_date).toLocaleDateString()}</span>
              </div>
            </div>

            {request.message && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Adoption Message:</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {request.message}
                </p>
              </div>
            )}

            {request.status === 'Pending' && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleApproval(request.pet.id, 'approve')}
                  disabled={actionLoading === request.pet.id}
                  className="flex-1 flex items-center justify-center space-x-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 text-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>Approve</span>
                </button>
                <button
                  onClick={() => handleApproval(request.pet.id, 'reject')}
                  disabled={actionLoading === request.pet.id}
                  className="flex-1 flex items-center justify-center space-x-1 bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 text-sm"
                >
                  <X className="w-4 h-4" />
                  <span>Reject</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {requests.length === 0 && (
        <div className="text-center py-12">
          <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No adoption requests</h3>
          <p className="text-gray-600">Adoption requests will appear here when submitted.</p>
        </div>
      )}
    </div>
  );
};

export default AdminAdoptRequests;