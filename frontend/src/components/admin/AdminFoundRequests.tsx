import React, { useState, useEffect } from 'react';
// import { Search, MapPin, Calendar, User, Check, X } from 'lucide-react';
import { Search, MapPin, Check, X } from 'lucide-react';
import { apiService } from '../../services/api';
import type { PetReport } from '../../services/api';

const AdminFoundRequests: React.FC = () => {
  const [requests, setRequests] = useState<PetReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    fetchFoundRequests();
  }, []);

  const fetchFoundRequests = async () => {
    try {
      setLoading(true);
      const response = await apiService.getPetsByTab('found');
      setRequests(response.results as PetReport[]);
    } catch (error) {
      console.error('Error fetching found requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (petId: number, action: 'approve' | 'reject') => {
    try {
      setActionLoading(petId);
      await apiService.adminApproval({
        request_type: 'found',
        pet_id: petId,
        action: action
      });
      await fetchFoundRequests();
    } catch (error) {
      console.error('Error handling approval:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
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
          <h1 className="text-3xl font-bold text-gray-900">Found Pet Requests</h1>
          <p className="text-gray-600 mt-2">Review and manage found pet reports</p>
        </div>
        <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-lg font-medium">
          Total Requests: {requests.length}
        </div>
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((request) => (
          <div key={request.id} className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
            {request.image && (
              <img
                src={apiService.getImageUrl(request.image)}
                alt={request.pet.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{request.pet.name || 'Unknown'}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.report_status)}`}>
                  {request.report_status}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-3">
                {typeof request.pet.pet_type === 'string' ? request.pet.pet_type : request.pet.pet_type?.type || 'Unknown'} • {request.pet.breed}
              </p>
              
              <div className="flex items-center text-gray-500 text-xs space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <Search className="w-3 h-3" />
                  <span>Found Pet</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>{request.pet.city}, {request.pet.state}</span>
                </div>
              </div>
              
              {request.report_status === 'Pending' && (
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
          </div>
        ))}
      </div>

      {requests.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No found pet requests</h3>
          <p className="text-gray-600">Found pet reports will appear here when submitted.</p>
        </div>
      )}
    </div>
  );
};

export default AdminFoundRequests;