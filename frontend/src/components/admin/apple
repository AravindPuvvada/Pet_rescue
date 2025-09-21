import React, { useState, useEffect } from 'react';
import { AlertCircle, Calendar } from 'lucide-react';
import { apiService } from '../../services/api';

interface LostRequest {
  report_id: number;
  report_status: string;
  pet_status: string;
  image?: string;
  pet: {
    id: number;
    name: string;
    pet_type?: string;
    breed?: string;
    age?: number;
    color?: string;
  };
}

const AdminLostRequests: React.FC = () => {
  const [requests, setRequests] = useState<LostRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    fetchLostRequests();
  }, []);

  const fetchLostRequests = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAdminLostPets(); // ✅ admin endpoint
      setRequests(response.lost_pets);
    } catch (error) {
      console.error('Error fetching lost requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (petId: number, action: 'approve' | 'reject') => {
    try {
      setActionLoading(petId);
      await apiService.adminApproval({
        request_type: 'lost',
        pet_id: petId,
        action: action,
      });
      await fetchLostRequests();
    } catch (error) {
      console.error('Error handling approval:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleStatusChange = async (reportId: number, status: 'Resolved' | 'Reunited') => {
    try {
      setActionLoading(reportId);
      await apiService.manageReportStatus(reportId, status); // ✅ update status in DB
      await fetchLostRequests();
    } catch (error) {
      console.error('Error updating report status:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'resolved':
        return 'bg-blue-100 text-blue-800';
      case 'reunited':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
          <h1 className="text-3xl font-bold text-gray-900">Lost Pet Requests</h1>
          <p className="text-gray-600 mt-2">Review and manage lost pet reports</p>
        </div>
        <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg font-medium">
          Total Requests: {requests.length}
        </div>
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((request) => (
          <div
            key={request.report_id}
            className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
          >
            {request.image && (
              <img
                src={apiService.getImageUrl(request.image)}
                alt={request.pet.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{request.pet.name}</h3>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                    request.report_status
                  )}`}
                >
                  {request.report_status}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-3">
                {request.pet.pet_type} • {request.pet.breed} • {request.pet.color}
              </p>

              <div className="flex items-center text-gray-500 text-xs space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>Lost Pet</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{request.pet.age} years</span>
                </div>
              </div>

              {/* Buttons based on status */}
              {request.report_status === 'Pending' && (
                <div className="flex gap-2">
                  <button
                    disabled={actionLoading === request.report_id}
                    onClick={() => handleApproval(request.pet.id, 'approve')}
                    className="px-3 py-1 bg-green-500 text-white rounded-lg disabled:opacity-50"
                  >
                    {actionLoading === request.pet.id ? 'Approving...' : 'Accept'}
                  </button>
                  <button
                    disabled={actionLoading === request.report_id}
                    onClick={() => handleApproval(request.pet.id, 'reject')}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg disabled:opacity-50"
                  >
                    {actionLoading === request.pet.id ? 'Rejecting...' : 'Reject'}
                  </button>
                </div>
              )}

              {request.report_status === 'Accepted' && (
                <div className="flex gap-2">
                  <button
                    disabled={actionLoading === request.report_id}
                    onClick={() => handleStatusChange(request.report_id, 'Resolved')}
                    className="px-3 py-1 bg-blue-500 text-white rounded-lg disabled:opacity-50"
                  >
                    {actionLoading === request.report_id ? 'Updating...' : 'Mark as Resolved'}
                  </button>
                  <button
                    disabled={actionLoading === request.report_id}
                    onClick={() => handleStatusChange(request.report_id, 'Reunited')}
                    className="px-3 py-1 bg-purple-500 text-white rounded-lg disabled:opacity-50"
                  >
                    {actionLoading === request.report_id ? 'Updating...' : 'Mark as Reunited'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {requests.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No lost pet requests</h3>
          <p className="text-gray-600">Lost pet reports will appear here when submitted.</p>
        </div>
      )}
    </div>
  );
};

export default AdminLostRequests;
