// import React, { useState, useEffect, useMemo } from 'react';
// import { apiService } from '../../services/api';
// import type { PetAdoption } from '../../services/api';


// interface AdoptionRequest {
//   id: number;
//   petName: string;
//   requestorName: string;
//   requestorEmail: string;
//   message: string; // The component expects a string, not undefined
//   status: 'Pending' | 'Approved' | 'Rejected';
//   createdBy: string;
//   modifiedBy: string;
// }

// // Component to inject CSS
// const DashboardStyles = () => (
//     <style>{`
//     body { background-color: #f8f9fa; }
//     .dashboard-container { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; padding: 2rem; }
//     .dashboard-container h1 { color: #343a40; margin-bottom: 1rem; text-align: center; }
//     .stats-container { display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center; margin-bottom: 2rem; }
//     .stat-card { background-color: #fff; padding: 1.5rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); text-align: center; flex-grow: 1; min-width: 150px; }
//     .stat-card h3 { margin: 0 0 0.5rem 0; color: #6c757d; font-size: 1rem; }
//     .stat-card p { margin: 0; color: #007bff; font-size: 2rem; font-weight: bold; }
//     .filter-container { background-color: #fff; padding: 1.5rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); margin-bottom: 2rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; }
//     .filter-group { display: flex; flex-direction: column; }
//     .filter-group label { margin-bottom: 0.5rem; color: #495057; font-weight: 500; }
//     .filter-group input, .filter-group select { padding: 10px; border: 1px solid #ced4da; border-radius: 4px; font-size: 1rem; }
//     .table-container { background-color: #fff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow-x: auto; }
//     .dashboard-container table { width: 100%; border-collapse: collapse; min-width: 800px; }
//     .dashboard-container th, .dashboard-container td { padding: 16px; text-align: left; border-bottom: 1px solid #dee2e6; }
//     .dashboard-container .message-col { max-width: 350px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
//     .dashboard-container thead th { background-color: #e9ecef; color: #495057; font-weight: 600; }
//     .dashboard-container tbody tr:hover { background-color: #f1f3f5; }
//     .dashboard-container .btn-edit { background-color: transparent; border: none; cursor: pointer; padding: 6px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: background-color 0.2s ease-in-out; }
//     .dashboard-container .btn-edit svg { width: 18px; height: 18px; fill: #007bff; }
//     .dashboard-container .btn-edit:hover { background-color: #e9ecef; }
//     .dashboard-container .status { padding: 4px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: bold; color: #fff; text-transform: uppercase; }
//     .dashboard-container .status.pending { background-color: #ffc107; color: #212529; }
//     .dashboard-container .status.approved { background-color: #28a745; }
//     .dashboard-container .status.rejected { background-color: #dc3545; }
//     .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; z-index: 1000; }
//     .edit-form-container { background-color: #fff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); width: 90%; max-width: 600px; padding: 1.5rem; border-top: 5px solid #007bff; }
//     .form-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e9ecef; padding-bottom: 1rem; margin-bottom: 1.5rem; }
//     .form-header h3 { margin: 0; color: #343a40; }
//     .close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #6c757d; }
//     .form-group { margin-bottom: 1.25rem; }
//     .form-group label { display: block; margin-bottom: 0.5rem; color: #495057; font-weight: 500; }
//     .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 10px; border: 1px solid #ced4da; border-radius: 4px; font-size: 1rem; box-sizing: border-box; }
//     .form-group input:disabled, .form-group textarea:disabled { background-color: #e9ecef; cursor: not-allowed; color: #495057; }
//     .form-group textarea { min-height: 120px; resize: vertical; }
//     .audit-info { font-size: 0.9rem; color: #6c757d; background-color: #f8f9fa; padding: 10px; border-radius: 4px; }
//     .form-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 1.5rem; }
//     .btn-save, .btn-cancel { border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold; transition: all 0.2s; }
//     .btn-save { background-color: #28a745; color: white; }
//     .btn-cancel { background-color: #6c757d; color: white; }
//   `}</style>
// );

// const AdminAdoptRequests: React.FC = () => {
//   const [requests, setRequests] = useState<AdoptionRequest[]>([]);
//   const [selectedRequest, setSelectedRequest] = useState<AdoptionRequest | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
  
//   const [filters, setFilters] = useState({
//     petName: '',
//     requestorEmail: '',
//     status: 'all',
//   });

//   useEffect(() => {
//     const fetchAdoptionRequests = async () => {
//       try {
//         setLoading(true);
//         const data: PetAdoption[] = await apiService.getPetAdoptions();
        
//         const normalizedData: AdoptionRequest[] = data.map(item => ({
//           id: item.id,
//           petName: item.pet?.name || 'N/A', 
//           requestorName: item.requestor?.username || 'Unknown User',
//           requestorEmail: item.requestor?.email || 'no-email@provided.com',
//           message: item.message || '', // Ensures message is always a string
//           status: item.status,
//           createdBy: item.created_by?.username || '--', //ignore these errors 
//           modifiedBy: item.modified_by?.username || '--',
//         }));

//         setRequests(normalizedData);
//       } catch (err) {
//         console.error("Failed to fetch adoption requests:", err);
//         setError("Could not load adoption requests. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAdoptionRequests();
//   }, []);

//   const handleSaveChanges = async (updatedRequest: AdoptionRequest) => {
//     try {
//       const adoptionDataToUpdate: Partial<PetAdoption> = {
//         status: updatedRequest.status,
//       };
      
//       const response: PetAdoption = await apiService.updatePetAdoption(updatedRequest.id, adoptionDataToUpdate);
      
//       setRequests(prevRequests =>
//         prevRequests.map(req =>
//           req.id === response.id ? {
//               ...req,
//               status: response.status,
//               modifiedBy: response.modified_by || '--',
//           } : req
//         )
//       );
//     } catch (err) {
//       console.error("Failed to update adoption request:", err);
//       alert("Failed to save changes. Please try again.");
//     } finally {
//       setSelectedRequest(null);
//     }
//   };

//   const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({ ...prev, [name]: value }));
//   };

//   const filteredRequests = useMemo(() => {
//     return requests.filter(req =>
//       req.petName.toLowerCase().includes(filters.petName.toLowerCase()) &&
//       req.requestorEmail.toLowerCase().includes(filters.requestorEmail.toLowerCase()) &&
//       (filters.status === 'all' || req.status === filters.status)
//     );
//   }, [requests, filters]);

//   const stats = useMemo(() => ({
//     total: requests.length,
//     pending: requests.filter(r => r.status === 'Pending').length,
//     approved: requests.filter(r => r.status === 'Approved').length,
//     rejected: requests.filter(r => r.status === 'Rejected').length,
//   }), [requests]);

//   if (loading) {
//     return <div style={{ textAlign: 'center', padding: '50px' }}>Loading requests...</div>;
//   }

//   if (error) {
//     return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>{error}</div>;
//   }
  
//   return (
//     <>
//       <DashboardStyles />
//       <div className="dashboard-container">
//         <h1>Adoption Request Dashboard</h1>
        
//         <div className="stats-container">
//             <div className="stat-card"><h3>Total Requests</h3><p>{stats.total}</p></div>
//             <div className="stat-card"><h3>Pending</h3><p>{stats.pending}</p></div>
//             <div className="stat-card"><h3>Approved</h3><p>{stats.approved}</p></div>
//             <div className="stat-card"><h3>Rejected</h3><p>{stats.rejected}</p></div>
//         </div>

//         <div className="filter-container">
//             <div className="filter-group">
//                 <label htmlFor="petName">Pet Name</label>
//                 <input type="text" id="petName" name="petName" value={filters.petName} onChange={handleFilterChange} placeholder="Search by pet name..." />
//             </div>
//             <div className="filter-group">
//                 <label htmlFor="requestorEmail">Requestor Email</label>
//                 <input type="text" id="requestorEmail" name="requestorEmail" value={filters.requestorEmail} onChange={handleFilterChange} placeholder="Search by email..." />
//             </div>
//             <div className="filter-group">
//                 <label htmlFor="status">Request Status</label>
//                 <select id="status" name="status" value={filters.status} onChange={handleFilterChange}>
//                     <option value="all">All</option>
//                     <option value="Pending">Pending</option>
//                     <option value="Approved">Approved</option>
//                     <option value="Rejected">Rejected</option>
//                 </select>
//             </div>
//         </div>
        
//         <div className="table-container">
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Pet Name</th>
//                         <th>Requestor</th>
//                         <th>Message</th>
//                         <th>Status</th>
//                         <th>Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {filteredRequests.map((req) => (
//                         <tr key={req.id}>
//                             <td>{req.petName}</td>
//                             <td>{req.requestorName} ({req.requestorEmail})</td>
//                             <td className="message-col">{req.message}</td>
//                             <td><span className={`status ${req.status.toLowerCase()}`}>{req.status}</span></td>
//                             <td>
//                                 <button onClick={() => setSelectedRequest(req)} className="btn-edit" title="Manage Request">
//                                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
//                                         <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/>
//                                     </svg>
//                                 </button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//       </div>
      
//       {selectedRequest && (
//         <EditFormModal 
//             request={selectedRequest} 
//             onClose={() => setSelectedRequest(null)}
//             onSave={handleSaveChanges}
//         />
//       )}
//     </>
//   );
// };

// const EditFormModal = ({ request, onClose, onSave }: { request: AdoptionRequest, onClose: () => void, onSave: (req: AdoptionRequest) => void }) => {
//   const [formData, setFormData] = useState<AdoptionRequest>(request);

//   const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setFormData({ ...formData, status: e.target.value as AdoptionRequest['status'] });
//   };

//   return (
//     <div className="modal-overlay" onClick={onClose}>
//       <div className="edit-form-container" onClick={(e) => e.stopPropagation()}>
//         <div className="form-header"><h3>Review Request: {formData.petName}</h3><button onClick={onClose} className="close-btn">✖</button></div>
//         <div className="form-body">
//           <div className="form-group"><label>Requestor</label><input type="text" value={`${formData.requestorName} (${formData.requestorEmail})`} disabled /></div>
//           <div className="form-group"><label>Motive for Adoption</label><textarea value={formData.message} disabled /></div>
//           <div className="form-group">
//               <label htmlFor="status">Update Request Status</label>
//               <select id="status" name="status" value={formData.status} onChange={handleStatusChange}>
//                   <option value="Pending">Pending</option>
//                   <option value="Approved">Approved</option>
//                   <option value="Rejected">Rejected</option>
//               </select>
//           </div>
//           <div className="form-group">
//               <label>Audit Information</label>
//               <div className="audit-info">
//                   Created by: {formData.createdBy}<br />
//                   Modified by: {formData.modifiedBy}
//               </div>
//           </div>
//         </div>
//         <div className="form-actions">
//           <button onClick={() => onSave(formData)} className="btn-save">Save Changes</button>
//           <button onClick={onClose} className="btn-cancel">Cancel</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminAdoptRequests;

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { apiService } from '../../services/api';
import type { PetAdoption } from '../../services/api';
import { Edit2, X } from 'lucide-react';

const themeClasses = {
  light: {
    pageBg: 'bg-[#E8E0D3] text-black',
    cardBg: 'bg-gray-800 border-gray-700',
    headerText: 'text-[#5B4438]',
    subText: 'text-white',
    inputBg: 'bg-white text-black placeholder-gray-500 border-gray-300 focus:ring-blue-500',
    selectBg: 'bg-white text-black border-gray-200 focus:ring-blue-400',
    modalBg: 'bg-[#F5EFE6] border-[#5B4438]/20',
    modalText: 'text-[#5B4438]',
    modalOverlay: 'bg-black bg-opacity-50',
    buttonSave: 'bg-green-600 hover:bg-green-700 text-white',
    buttonCancel: 'bg-gray-400 hover:bg-gray-500 text-white',
    statCardText: 'text-white',
    statValueText: 'text-yellow-300',
    tableHeaderText: 'text-[#5B4438]',
  },
  dark: {
    pageBg: 'bg-[#E8E0D3] text-white',
    cardBg: 'bg-gray-800 border-gray-700',
    headerText: 'text-yellow-200',
    subText: 'text-gray-300',
    inputBg: 'bg-gray-700 text-white placeholder-gray-400 border-gray-600 focus:ring-pink-500',
    selectBg: 'bg-gray-700 text-white border-gray-600 focus:ring-pink-500',
    modalBg: 'bg-gray-800 border-gray-700',
    modalText: 'text-white',
    modalOverlay: 'bg-black bg-opacity-70',
    buttonSave: 'bg-green-700 hover:bg-green-800 text-white',
    buttonCancel: 'bg-gray-600 hover:bg-gray-700 text-white',
    statCardText: 'text-gray-200',
    statValueText: 'text-yellow-200',
    tableHeaderText: 'text-yellow-200',
  },
};

interface AdoptionRequest {
  id: number;
  petName: string;
  requestorName: string;
  requestorEmail: string;
  message: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdBy: string;
  modifiedBy: string;
}

const AdminAdoptRequests: React.FC = () => {
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<AdoptionRequest | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const [filters, setFilters] = useState({
    petName: '',
    requestorEmail: '',
    status: 'all',
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const fetchAdoptionRequests = useCallback(async () => {
    try {
      setLoading(true);
      const data: PetAdoption[] = await apiService.getPetAdoptions();
      
      const normalizedData: AdoptionRequest[] = data.map(item => ({
        id: item.id,
        petName: item.pet?.name || 'N/A', 
        requestorName: item.requestor?.username || 'Unknown User',
        requestorEmail: item.requestor?.email || 'no-email@provided.com',
        message: item.message || '',
        status: item.status,
        createdBy: item.created_by?.username || '--',
        modifiedBy: item.modified_by?.username || '--',
      }));
      setRequests(normalizedData);
    } catch (err) {
      console.error("Failed to fetch adoption requests:", err);
      setError("Could not load adoption requests. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdoptionRequests();
  }, [fetchAdoptionRequests]);

  const handleSaveChanges = async (updatedRequest: AdoptionRequest) => {
    setSelectedRequest(null);
    setLoading(true);
    setError(null);

    try {
      const adoptionDataToUpdate: Partial<PetAdoption> = {
        status: updatedRequest.status,
      };
      
      await apiService.updatePetAdoption(updatedRequest.id, adoptionDataToUpdate);
      fetchAdoptionRequests();

    } catch (err) {
      console.error("Failed to update adoption request:", err);
      setError("Failed to save changes. Please try again.");
      setLoading(false);
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
    return (
      <div className={`flex items-center justify-center h-screen p-6 ${themeClasses[theme].pageBg}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 ${themeClasses[theme].pageBg}`}>
      {/* Header */}
      <div>
        <h1 className={`text-3xl font-bold ${themeClasses[theme].headerText}`}>
          Adoption Request Dashboard
        </h1>
        <p className={`mt-2 ${themeClasses[theme].headerText}`}>
          Monitor and manage pet adoption requests
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 my-6">
        <div className={`rounded-lg shadow-lg p-6 text-center ${themeClasses[theme].cardBg}`}>
          <p className={`text-sm font-medium ${themeClasses[theme].statCardText}`}>Total Requests</p>
          <p className={`text-3xl font-bold ${themeClasses[theme].statValueText}`}>{stats.total}</p>
        </div>
        <div className={`rounded-lg shadow-lg p-6 text-center ${themeClasses[theme].cardBg}`}>
          <p className={`text-sm font-medium ${themeClasses[theme].statCardText}`}>Pending</p>
          <p className={`text-3xl font-bold ${themeClasses[theme].statValueText}`}>{stats.pending}</p>
        </div>
        <div className={`rounded-lg shadow-lg p-6 text-center ${themeClasses[theme].cardBg}`}>
          <p className={`text-sm font-medium ${themeClasses[theme].statCardText}`}>Approved</p>
          <p className={`text-3xl font-bold ${themeClasses[theme].statValueText}`}>{stats.approved}</p>
        </div>
        <div className={`rounded-lg shadow-lg p-6 text-center ${themeClasses[theme].cardBg}`}>
          <p className={`text-sm font-medium ${themeClasses[theme].statCardText}`}>Rejected</p>
          <p className={`text-3xl font-bold ${themeClasses[theme].statValueText}`}>{stats.rejected}</p>
        </div>
      </div>

      {/* Filters */}
      <div className={`rounded-lg shadow-lg p-4 mb-6 border ${themeClasses[theme].cardBg}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div><label className={`block text-sm font-medium mb-1 ${themeClasses[theme].statValueText}`}>Pet Name</label><input type="text" name="petName" value={filters.petName} onChange={handleFilterChange} placeholder="Search..." className={`w-full p-2 rounded border ${themeClasses[theme].inputBg}`} /></div>
          <div><label className={`block text-sm font-medium mb-1 ${themeClasses[theme].statValueText}`}>Requestor Email</label><input type="text" name="requestorEmail" value={filters.requestorEmail} onChange={handleFilterChange} placeholder="Search..." className={`w-full p-2 rounded border ${themeClasses[theme].inputBg}`} /></div>
          <div><label className={`block text-sm font-medium mb-1 ${themeClasses[theme].statValueText}`}>Status</label><select name="status" value={filters.status} onChange={handleFilterChange} className={`w-full p-2 rounded border ${themeClasses[theme].selectBg}`}><option value="all">All</option><option value="Pending">Pending</option><option value="Approved">Approved</option><option value="Rejected">Rejected</option></select></div>
        </div>
      </div>

      {/* Table */}
      <div className={`rounded-lg shadow-lg p-6 overflow-x-auto ${themeClasses[theme].cardBg}`}>
        {error && <p className="text-red-500 dark:text-red-300 mb-4 font-semibold">Error: {error}</p>}
        <table className="min-w-full">
          <thead>
            <tr className={`border-b border-[#5B4438]/20 dark:border-gray-700`}>
              <th className={`py-2 text-left ${themeClasses[theme].statValueText}`}>Pet Name</th>
              <th className={`py-2 text-left ${themeClasses[theme].statValueText}`}>Requestor</th>
              <th className={`py-2 text-left ${themeClasses[theme].statValueText}`}>Message</th>
              <th className={`py-2 text-left ${themeClasses[theme].statValueText}`}>Status</th>
              <th className={`py-2 text-left ${themeClasses[theme].statValueText}`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length > 0 ? (
              filteredRequests.map((req) => (
                <tr key={req.id} className="border-b border-[#5B4438]/20 dark:border-gray-700">
                  <td className={`py-2 ${themeClasses[theme].subText}`}>{req.petName}</td>
                  <td className={`py-2 ${themeClasses[theme].subText}`}>{req.requestorName}</td>
                  <td className={`py-2 ${themeClasses[theme].subText} max-w-xs truncate`}>{req.message}</td>
                  <td className="py-2"><span className={`status text-xs font-semibold px-2 py-1 rounded-full ${req.status === 'Pending' ? 'bg-yellow-400' : req.status === 'Approved' ? 'bg-green-500' : 'bg-red-500'}`}>{req.status}</span></td>
                  <td className="py-2">
                    <button onClick={() => setSelectedRequest(req)} className={`p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700`}>
                      <Edit2 size={18} className={`${themeClasses[theme].subText}`} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={5} className={`text-center py-4 ${themeClasses[theme].subText}`}>No adoption requests found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedRequest && (
        <EditFormModal request={selectedRequest} onClose={() => setSelectedRequest(null)} onSave={handleSaveChanges} theme={theme} />
      )}
    </div>
  );
};

const EditFormModal = ({ request, onClose, onSave, theme }: { request: AdoptionRequest, onClose: () => void, onSave: (req: AdoptionRequest) => void, theme: 'light' | 'dark' }) => {
  const [formData, setFormData] = useState<AdoptionRequest>(request);
  const modalRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, status: e.target.value as AdoptionRequest['status'] });
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${themeClasses[theme].modalOverlay}`} onClick={onClose}>
      <div ref={modalRef} className={`w-full max-w-3xl rounded-lg shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto ${themeClasses[theme].modalBg} border-t-4 border-blue-500`} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className={`absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200`}>
          <X size={24} />
        </button>

        <div className="mb-4">
          <h3 className={`text-2xl font-bold ${themeClasses[theme].modalText}`}>Review Request: {formData.petName}</h3>
        </div>

        <div className="space-y-4">
          <div className="form-group"><label className={`block text-sm font-medium ${themeClasses[theme].modalText}`}>Requestor</label><input type="text" value={`${formData.requestorName} (${formData.requestorEmail})`} disabled className={`w-full p-2 rounded border ${themeClasses[theme].inputBg} disabled:bg-gray-200 disabled:text-gray-500 dark:disabled:bg-gray-700 dark:disabled:text-gray-400`} /></div>
          <div className="form-group"><label className={`block text-sm font-medium ${themeClasses[theme].modalText}`}>Motive for Adoption</label><textarea value={formData.message} disabled className={`w-full p-2 rounded border ${themeClasses[theme].inputBg} disabled:bg-gray-200 disabled:text-gray-500 dark:disabled:bg-gray-700 dark:disabled:text-gray-400`} /></div>
          <div className="form-group">
            <label htmlFor="status" className={`block text-sm font-medium mb-1 ${themeClasses[theme].modalText}`}>Update Request Status</label>
            <select id="status" name="status" value={formData.status} onChange={handleStatusChange} className={`w-full p-2 rounded border ${themeClasses[theme].selectBg}`}>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div className={`mt-6 p-4 rounded-lg text-sm ${themeClasses[theme].cardBg}`}>
            <h5 className={`font-semibold mb-2 ${themeClasses[theme].modalText}`}>Audit Information</h5>
            <p className={`${themeClasses[theme].subText}`}>Created by: {formData.createdBy}</p>
            <p className={`${themeClasses[theme].subText}`}>Modified by: {formData.modifiedBy}</p>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#5B4438]/20 dark:border-gray-700">
          <button onClick={() => onSave(formData)} className={`px-4 py-2 rounded-lg font-semibold transition-colors ${themeClasses[theme].buttonSave}`}>
            Save Changes
          </button>
          <button onClick={onClose} className={`px-4 py-2 rounded-lg font-semibold transition-colors ${themeClasses[theme].buttonCancel}`}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAdoptRequests;