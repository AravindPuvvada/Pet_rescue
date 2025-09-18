// import React, { useState, useEffect } from 'react';
// // import { UserPlus, Heart, Calendar, User, Check, X } from 'lucide-react';
// import { UserPlus, Calendar, User, Check, X } from 'lucide-react';
// import { apiService } from '../../services/api';
// import type { PetAdoption } from '../../services/api';

// const AdminAdoptRequests: React.FC = () => {
//   const [requests, setRequests] = useState<PetAdoption[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState<number | null>(null);

//   useEffect(() => {
//     fetchAdoptRequests();
//   }, []);

//   const fetchAdoptRequests = async () => {
//     try {
//       setLoading(true);
//       const adoptionData = await apiService.getPetAdoptions();
//       setRequests(adoptionData);
//     } catch (error) {
//       console.error('Error fetching adoption requests:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleApproval = async (petId: number, action: 'approve' | 'reject') => {
//     try {
//       setActionLoading(petId);
//       await apiService.adminApproval({
//         request_type: 'adopt',
//         pet_id: petId,
//         action: action
//       });
//       await fetchAdoptRequests();
//     } catch (error) {
//       console.error('Error handling approval:', error);
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status.toLowerCase()) {
//       case 'pending': return 'bg-yellow-100 text-yellow-800';
//       case 'approved': return 'bg-green-100 text-green-800';
//       case 'rejected': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Adoption Requests</h1>
//           <p className="text-gray-600 mt-2">Review and manage pet adoption requests</p>
//         </div>
//         <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg font-medium">
//           Total Requests: {requests.length}
//         </div>
//       </div>

//       {/* Requests Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {requests.map((request) => (
//           <div key={request.id} className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
//             <div className="flex items-start space-x-4 mb-4">
//               {request.pet.image && (
//                 <img
//                   src={apiService.getImageUrl(request.pet.image)}
//                   alt={request.pet.name}
//                   className="w-16 h-16 object-cover rounded-lg"
//                 />
//               )}
//               <div className="flex-1">
//                 <div className="flex justify-between items-start mb-2">
//                   <h3 className="text-lg font-semibold text-gray-900">{request.pet.name}</h3>
//                   <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
//                     {request.status}
//                   </span>
//                 </div>
//                 <p className="text-gray-600 text-sm">
//                   {typeof request.pet.pet_type === 'string' ? request.pet.pet_type : request.pet.pet_type?.type || 'Unknown'} • {request.pet.breed}
//                 </p>
//               </div>
//             </div>

//             <div className="mb-4">
//               <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
//                 <User className="w-4 h-4" />
//                 <span>Requested by: {request.requestor.username}</span>
//               </div>
//               <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
//                 <Calendar className="w-4 h-4" />
//                 <span>Requested on: {new Date(request.created_date).toLocaleDateString()}</span>
//               </div>
//             </div>

//             {request.message && (
//               <div className="mb-4">
//                 <h4 className="font-medium text-gray-900 mb-2">Adoption Message:</h4>
//                 <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
//                   {request.message}
//                 </p>
//               </div>
//             )}

//             {request.status === 'Pending' && (
//               <div className="flex space-x-2">
//                 <button
//                   onClick={() => handleApproval(request.pet.id, 'approve')}
//                   disabled={actionLoading === request.pet.id}
//                   className="flex-1 flex items-center justify-center space-x-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 text-sm"
//                 >
//                   <Check className="w-4 h-4" />
//                   <span>Approve</span>
//                 </button>
//                 <button
//                   onClick={() => handleApproval(request.pet.id, 'reject')}
//                   disabled={actionLoading === request.pet.id}
//                   className="flex-1 flex items-center justify-center space-x-1 bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 text-sm"
//                 >
//                   <X className="w-4 h-4" />
//                   <span>Reject</span>
//                 </button>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {requests.length === 0 && (
//         <div className="text-center py-12">
//           <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//           <h3 className="text-lg font-medium text-gray-900 mb-2">No adoption requests</h3>
//           <p className="text-gray-600">Adoption requests will appear here when submitted.</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminAdoptRequests;


import React, { useState, useEffect, useMemo } from 'react';
// Corrected import style for verbatimModuleSyntax
import { apiService } from '../../services/api';
import type { PetAdoption } from '../../services/api';


interface AdoptionRequest {
  id: number;
  petName: string;
  requestorName: string;
  requestorEmail: string;
  message: string; // The component expects a string, not undefined
  status: 'Pending' | 'Approved' | 'Rejected';
  createdBy: string;
  modifiedBy: string;
}

// Component to inject CSS
const DashboardStyles = () => (
    <style>{`
    body { background-color: #f8f9fa; }
    .dashboard-container { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; padding: 2rem; }
    .dashboard-container h1 { color: #343a40; margin-bottom: 1rem; text-align: center; }
    .stats-container { display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center; margin-bottom: 2rem; }
    .stat-card { background-color: #fff; padding: 1.5rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); text-align: center; flex-grow: 1; min-width: 150px; }
    .stat-card h3 { margin: 0 0 0.5rem 0; color: #6c757d; font-size: 1rem; }
    .stat-card p { margin: 0; color: #007bff; font-size: 2rem; font-weight: bold; }
    .filter-container { background-color: #fff; padding: 1.5rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); margin-bottom: 2rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; }
    .filter-group { display: flex; flex-direction: column; }
    .filter-group label { margin-bottom: 0.5rem; color: #495057; font-weight: 500; }
    .filter-group input, .filter-group select { padding: 10px; border: 1px solid #ced4da; border-radius: 4px; font-size: 1rem; }
    .table-container { background-color: #fff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow-x: auto; }
    .dashboard-container table { width: 100%; border-collapse: collapse; min-width: 800px; }
    .dashboard-container th, .dashboard-container td { padding: 16px; text-align: left; border-bottom: 1px solid #dee2e6; }
    .dashboard-container .message-col { max-width: 350px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .dashboard-container thead th { background-color: #e9ecef; color: #495057; font-weight: 600; }
    .dashboard-container tbody tr:hover { background-color: #f1f3f5; }
    .dashboard-container .btn-edit { background-color: transparent; border: none; cursor: pointer; padding: 6px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: background-color 0.2s ease-in-out; }
    .dashboard-container .btn-edit svg { width: 18px; height: 18px; fill: #007bff; }
    .dashboard-container .btn-edit:hover { background-color: #e9ecef; }
    .dashboard-container .status { padding: 4px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: bold; color: #fff; text-transform: uppercase; }
    .dashboard-container .status.pending { background-color: #ffc107; color: #212529; }
    .dashboard-container .status.approved { background-color: #28a745; }
    .dashboard-container .status.rejected { background-color: #dc3545; }
    .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; z-index: 1000; }
    .edit-form-container { background-color: #fff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); width: 90%; max-width: 600px; padding: 1.5rem; border-top: 5px solid #007bff; }
    .form-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e9ecef; padding-bottom: 1rem; margin-bottom: 1.5rem; }
    .form-header h3 { margin: 0; color: #343a40; }
    .close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #6c757d; }
    .form-group { margin-bottom: 1.25rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; color: #495057; font-weight: 500; }
    .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 10px; border: 1px solid #ced4da; border-radius: 4px; font-size: 1rem; box-sizing: border-box; }
    .form-group input:disabled, .form-group textarea:disabled { background-color: #e9ecef; cursor: not-allowed; color: #495057; }
    .form-group textarea { min-height: 120px; resize: vertical; }
    .audit-info { font-size: 0.9rem; color: #6c757d; background-color: #f8f9fa; padding: 10px; border-radius: 4px; }
    .form-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 1.5rem; }
    .btn-save, .btn-cancel { border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold; transition: all 0.2s; }
    .btn-save { background-color: #28a745; color: white; }
    .btn-cancel { background-color: #6c757d; color: white; }
  `}</style>
);

const AdminAdoptRequests: React.FC = () => {
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<AdoptionRequest | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState({
    petName: '',
    requestorEmail: '',
    status: 'all',
  });

  useEffect(() => {
    const fetchAdoptionRequests = async () => {
      try {
        setLoading(true);
        const data: PetAdoption[] = await apiService.getPetAdoptions();
        
        const normalizedData: AdoptionRequest[] = data.map(item => ({
          id: item.id,
          petName: item.pet?.name || 'N/A', 
          requestorName: item.requestor?.username || 'Unknown User',
          requestorEmail: item.requestor?.email || 'no-email@provided.com',
          message: item.message || '', // Ensures message is always a string
          status: item.status,
          createdBy: item.created_by?.username || '--', //ignore these errors 
          modifiedBy: item.modified_by?.username || '--',
        }));

        setRequests(normalizedData);
      } catch (err) {
        console.error("Failed to fetch adoption requests:", err);
        setError("Could not load adoption requests. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdoptionRequests();
  }, []);

  const handleSaveChanges = async (updatedRequest: AdoptionRequest) => {
    try {
      const adoptionDataToUpdate: Partial<PetAdoption> = {
        status: updatedRequest.status,
      };
      
      const response: PetAdoption = await apiService.updatePetAdoption(updatedRequest.id, adoptionDataToUpdate);
      
      setRequests(prevRequests =>
        prevRequests.map(req =>
          req.id === response.id ? {
              ...req,
              status: response.status,
              modifiedBy: response.modified_by || '--',
          } : req
        )
      );
    } catch (err) {
      console.error("Failed to update adoption request:", err);
      alert("Failed to save changes. Please try again.");
    } finally {
      setSelectedRequest(null);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredRequests = useMemo(() => {
    return requests.filter(req =>
      req.petName.toLowerCase().includes(filters.petName.toLowerCase()) &&
      req.requestorEmail.toLowerCase().includes(filters.requestorEmail.toLowerCase()) &&
      (filters.status === 'all' || req.status === filters.status)
    );
  }, [requests, filters]);

  const stats = useMemo(() => ({
    total: requests.length,
    pending: requests.filter(r => r.status === 'Pending').length,
    approved: requests.filter(r => r.status === 'Approved').length,
    rejected: requests.filter(r => r.status === 'Rejected').length,
  }), [requests]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading requests...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>{error}</div>;
  }
  
  return (
    <>
      <DashboardStyles />
      <div className="dashboard-container">
        <h1>Adoption Request Dashboard</h1>
        
        <div className="stats-container">
            <div className="stat-card"><h3>Total Requests</h3><p>{stats.total}</p></div>
            <div className="stat-card"><h3>Pending</h3><p>{stats.pending}</p></div>
            <div className="stat-card"><h3>Approved</h3><p>{stats.approved}</p></div>
            <div className="stat-card"><h3>Rejected</h3><p>{stats.rejected}</p></div>
        </div>

        <div className="filter-container">
            <div className="filter-group">
                <label htmlFor="petName">Pet Name</label>
                <input type="text" id="petName" name="petName" value={filters.petName} onChange={handleFilterChange} placeholder="Search by pet name..." />
            </div>
            <div className="filter-group">
                <label htmlFor="requestorEmail">Requestor Email</label>
                <input type="text" id="requestorEmail" name="requestorEmail" value={filters.requestorEmail} onChange={handleFilterChange} placeholder="Search by email..." />
            </div>
            <div className="filter-group">
                <label htmlFor="status">Request Status</label>
                <select id="status" name="status" value={filters.status} onChange={handleFilterChange}>
                    <option value="all">All</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                </select>
            </div>
        </div>
        
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Pet Name</th>
                        <th>Requestor</th>
                        <th>Message</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredRequests.map((req) => (
                        <tr key={req.id}>
                            <td>{req.petName}</td>
                            <td>{req.requestorName} ({req.requestorEmail})</td>
                            <td className="message-col">{req.message}</td>
                            <td><span className={`status ${req.status.toLowerCase()}`}>{req.status}</span></td>
                            <td>
                                <button onClick={() => setSelectedRequest(req)} className="btn-edit" title="Manage Request">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/>
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
      
      {selectedRequest && (
        <EditFormModal 
            request={selectedRequest} 
            onClose={() => setSelectedRequest(null)}
            onSave={handleSaveChanges}
        />
      )}
    </>
  );
};

const EditFormModal = ({ request, onClose, onSave }: { request: AdoptionRequest, onClose: () => void, onSave: (req: AdoptionRequest) => void }) => {
  const [formData, setFormData] = useState<AdoptionRequest>(request);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, status: e.target.value as AdoptionRequest['status'] });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="edit-form-container" onClick={(e) => e.stopPropagation()}>
        <div className="form-header"><h3>Review Request: {formData.petName}</h3><button onClick={onClose} className="close-btn">✖</button></div>
        <div className="form-body">
          <div className="form-group"><label>Requestor</label><input type="text" value={`${formData.requestorName} (${formData.requestorEmail})`} disabled /></div>
          <div className="form-group"><label>Motive for Adoption</label><textarea value={formData.message} disabled /></div>
          <div className="form-group">
              <label htmlFor="status">Update Request Status</label>
              <select id="status" name="status" value={formData.status} onChange={handleStatusChange}>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
              </select>
          </div>
          <div className="form-group">
              <label>Audit Information</label>
              <div className="audit-info">
                  Created by: {formData.createdBy}<br />
                  Modified by: {formData.modifiedBy}
              </div>
          </div>
        </div>
        <div className="form-actions">
          <button onClick={() => onSave(formData)} className="btn-save">Save Changes</button>
          <button onClick={onClose} className="btn-cancel">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AdminAdoptRequests;