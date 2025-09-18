// import React, { useState, useEffect } from 'react';
// // import { Search, MapPin, Calendar, User, Check, X } from 'lucide-react';
// import { Search, MapPin, Check, X } from 'lucide-react';
// import { apiService } from '../../services/api';
// import type { PetReport } from '../../services/api';

// const AdminFoundRequests: React.FC = () => {
//   const [requests, setRequests] = useState<PetReport[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState<number | null>(null);

//   useEffect(() => {
//     fetchFoundRequests();
//   }, []);

//   const fetchFoundRequests = async () => {
//     try {
//       setLoading(true);
//       const response = await apiService.getPetsByTab('found');
//       setRequests(response.results as PetReport[]);
//     } catch (error) {
//       console.error('Error fetching found requests:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleApproval = async (petId: number, action: 'approve' | 'reject') => {
//     try {
//       setActionLoading(petId);
//       await apiService.adminApproval({
//         request_type: 'found',
//         pet_id: petId,
//         action: action
//       });
//       await fetchFoundRequests();
//     } catch (error) {
//       console.error('Error handling approval:', error);
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status.toLowerCase()) {
//       case 'pending': return 'bg-yellow-100 text-yellow-800';
//       case 'accepted': return 'bg-green-100 text-green-800';
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
//           <h1 className="text-3xl font-bold text-gray-900">Found Pet Requests</h1>
//           <p className="text-gray-600 mt-2">Review and manage found pet reports</p>
//         </div>
//         <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-lg font-medium">
//           Total Requests: {requests.length}
//         </div>
//       </div>

//       {/* Requests Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {requests.map((request) => (
//           <div key={request.id} className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
//             {request.image && (
//               <img
//                 src={apiService.getImageUrl(request.image)}
//                 alt={request.pet.name}
//                 className="w-full h-48 object-cover"
//               />
//             )}
//             <div className="p-4">
//               <div className="flex justify-between items-start mb-2">
//                 <h3 className="text-lg font-semibold text-gray-900">{request.pet.name || 'Unknown'}</h3>
//                 <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.report_status)}`}>
//                   {request.report_status}
//                 </span>
//               </div>
              
//               <p className="text-gray-600 text-sm mb-3">
//                 {typeof request.pet.pet_type === 'string' ? request.pet.pet_type : request.pet.pet_type?.type || 'Unknown'} • {request.pet.breed}
//               </p>
              
//               <div className="flex items-center text-gray-500 text-xs space-x-4 mb-4">
//                 <div className="flex items-center space-x-1">
//                   <Search className="w-3 h-3" />
//                   <span>Found Pet</span>
//                 </div>
//                 <div className="flex items-center space-x-1">
//                   <MapPin className="w-3 h-3" />
//                   <span>{request.pet.city}, {request.pet.state}</span>
//                 </div>
//               </div>
              
//               {request.report_status === 'Pending' && (
//                 <div className="flex space-x-2">
//                   <button
//                     onClick={() => handleApproval(request.pet.id, 'approve')}
//                     disabled={actionLoading === request.pet.id}
//                     className="flex-1 flex items-center justify-center space-x-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 text-sm"
//                   >
//                     <Check className="w-4 h-4" />
//                     <span>Approve</span>
//                   </button>
//                   <button
//                     onClick={() => handleApproval(request.pet.id, 'reject')}
//                     disabled={actionLoading === request.pet.id}
//                     className="flex-1 flex items-center justify-center space-x-1 bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 text-sm"
//                   >
//                     <X className="w-4 h-4" />
//                     <span>Reject</span>
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>

//       {requests.length === 0 && (
//         <div className="text-center py-12">
//           <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//           <h3 className="text-lg font-medium text-gray-900 mb-2">No found pet requests</h3>
//           <p className="text-gray-600">Found pet reports will appear here when submitted.</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminFoundRequests;





// import React, { useState, useEffect } from 'react';
// import type { PetReport } from '../../services/api';
// import { apiService } from '../../services/api';

// const AdminFoundRequests = () => {
//   const [reports, setReports] = useState<PetReport[]>([]);
//   const [filteredReports, setFilteredReports] = useState<PetReport[]>([]);
//   const [selectedReport, setSelectedReport] = useState<PetReport | null>(null);
//   const [filters, setFilters] = useState({
//     petType: 'all',
//     locationFound: '',
//     foundByUser: '',
//     status: 'all',
//   });

//   useEffect(() => {
//     const fetchReports = async () => {
//       try {
//         const data = await apiService.getPetReports(); // adjust if you have a specific `getFoundReports`
//         setReports(data);
//         setFilteredReports(data);
//       } catch (err) {
//         console.error('Failed to fetch pet reports:', err);
//       }
//     };

//     fetchReports();
//   }, []);

//   useEffect(() => {
//     let tempReports = reports;

//     if (filters.petType !== 'all') {
//       tempReports = tempReports.filter(r => r.pet?.type === filters.petType);
//     }
//     if (filters.locationFound.trim() !== '') {
//       tempReports = tempReports.filter(r =>
//         r.location_found.toLowerCase().includes(filters.locationFound.toLowerCase())
//       );
//     }
//     if (filters.foundByUser.trim() !== '') {
//       tempReports = tempReports.filter(r =>
//         r.found_by_user?.username
//           .toLowerCase()
//           .includes(filters.foundByUser.toLowerCase())
//       );
//     }
//     if (filters.status !== 'all') {
//       tempReports = tempReports.filter(r => r.report_status === filters.status);
//     }

//     setFilteredReports(tempReports);
//   }, [filters, reports]);

//   const stats = {
//     total: filteredReports.length,
//     pending: filteredReports.filter(r => r.report_status === 'Pending').length,
//     accepted: filteredReports.filter(r => r.report_status === 'Accepted').length,
//     resolved: filteredReports.filter(r => r.report_status === 'Resolved').length,
//     reunited: filteredReports.filter(r => r.report_status === 'Reunited').length,
//   };

//   const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     setFilters({ ...filters, [e.target.name]: e.target.value });
//   };

//   const handleSaveChanges = async (updatedReport: PetReport) => {
//     try {
//       // Call API to update
//       await apiService.updatePetReport(updatedReport.id, updatedReport);

//       setReports(prev =>
//         prev.map(r => (r.id === updatedReport.id ? updatedReport : r))
//       );
//       setSelectedReport(null);
//     } catch (err) {
//       console.error('Failed to update report:', err);
//     }
//   };
//   const DashboardStyles = () => (
//   <style>{`
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


//   return (
//     <>
//     <DashboardStyles />
//       <div className="dashboard-container">
//         <h1>Found Pet Dashboard</h1>
        
//         {/* Stats */}
//         <div className="stats-container">
//           <div className="stat-card"><h3>Total Reports</h3><p>{stats.total}</p></div>
//           <div className="stat-card"><h3>Pending</h3><p>{stats.pending}</p></div>
//           <div className="stat-card"><h3>Accepted</h3><p>{stats.accepted}</p></div>
//           <div className="stat-card"><h3>Resolved</h3><p>{stats.resolved}</p></div>
//           <div className="stat-card"><h3>Reunited</h3><p>{stats.reunited}</p></div>
//         </div>

//         {/* Filters */}
//         <div className="filter-container">
//           <div className="filter-group">
//             <label>Pet Type</label>
//             <select name="petType" value={filters.petType} onChange={handleFilterChange}>
//               <option value="all">All</option>
//               <option value="Dog">Dog</option>
//               <option value="Cat">Cat</option>
//               <option value="Other">Other</option>
//             </select>
//           </div>
//           <div className="filter-group">
//             <label>Location Found</label>
//             <input
//               type="text"
//               name="locationFound"
//               value={filters.locationFound}
//               onChange={handleFilterChange}
//               placeholder="Search..."
//             />
//           </div>
//           <div className="filter-group">
//             <label>Found By User</label>
//             <input
//               type="text"
//               name="foundByUser"
//               value={filters.foundByUser}
//               onChange={handleFilterChange}
//               placeholder="Search..."
//             />
//           </div>
//           <div className="filter-group">
//             <label>Status</label>
//             <select name="status" value={filters.status} onChange={handleFilterChange}>
//               <option value="all">All</option>
//               <option value="Pending">Pending</option>
//               <option value="Accepted">Accepted</option>
//               <option value="Resolved">Resolved</option>
//               <option value="Reunited">Reunited</option>
//             </select>
//           </div>
//         </div>
        
//         {/* Reports Table */}
//         <div className="table-container">
//           <table>
//             <thead>
//               <tr>
//                 <th>Pet Type</th>
//                 <th>Breed</th>
//                 <th>Location Found</th>
//                 <th>Found By</th>
//                 <th>Status</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredReports.map((rep) => (
//                 <tr key={rep.id}>
//                   <td>{typeof rep.pet.pet_type === 'string' ? rep.pet.pet_type : rep.pet.pet_type?.type}</td>
//                   <td>{rep.pet.breed}</td>
//                   <td>{rep.pet.address || rep.pet.city}</td>
//                   <td>{rep.user.username}</td>
//                   <td><span className={`status ${rep.report_status.toLowerCase()}`}>{rep.report_status}</span></td>
//                   <td>
//                     <button onClick={() => setSelectedReport(rep)} className="btn-edit" title="Edit Report">✏️</button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
      
//       {selectedReport && (
//         <EditFormModal
//           report={selectedReport}
//           onClose={() => setSelectedReport(null)}
//           onSave={handleSaveChanges}
//         />
//       )}
//     </>
//   );
// };

// // Modal component
// const EditFormModal = ({
//   report,
//   onClose,
//   onSave,
// }: {
//   report: PetReport;
//   onClose: () => void;
//   onSave: (rep: PetReport) => void;
// }) => {
//   const [formData, setFormData] = useState<PetReport>(report);

//   const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setFormData({ ...formData, report_status: e.target.value as PetReport['report_status'] });
//   };

//   return (
//     <div className="modal-overlay" onClick={onClose}>
//       <div className="edit-form-container" onClick={(e) => e.stopPropagation()}>
//         <div className="form-header">
//           <h3>Review Found Pet Report</h3>
//           <button onClick={onClose} className="close-btn">✖</button>
//         </div>
//         <div className="form-body">
//           <div className="form-top-details">
//             <div className="pet-image-wrapper">
//               {formData.image && <img src={formData.image} alt={formData.pet.name} />}
//             </div>
//             <div className="pet-info-right">
//               <h4>{formData.pet.breed} {typeof formData.pet.pet_type === 'string' ? formData.pet.pet_type : formData.pet.pet_type?.type}</h4>
//               <p>A {formData.pet.breed} {formData.pet.pet_type && (typeof formData.pet.pet_type === 'string' ? formData.pet.pet_type : formData.pet.pet_type.type)} was found.</p>
//             </div>
//           </div>
//           <div className="form-group"><label>Found By</label><input type="text" value={formData.user.username} disabled /></div>
//           <div className="form-group"><label>Location Found</label><input type="text" value={formData.pet.address || formData.pet.city || ''} disabled /></div>
//           <div className="form-group">
//             <label htmlFor="status">Update Report Status</label>
//             <select id="status" name="status" value={formData.report_status} onChange={handleStatusChange}>
//               <option value="Pending">Pending</option>
//               <option value="Accepted">Accepted</option>
//               <option value="Resolved">Resolved</option>
//               <option value="Reunited">Reunited</option>
//             </select>
//           </div>
//           <div className="form-group">
//             <label>Audit Information</label>
//             <div className="audit-info">
//               Created by: {formData.pet.created_by?.username || 'N/A'}<br />
//               Modified by: {formData.pet.modified_by?.username || 'N/A'}
//             </div>
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

// export default AdminFoundRequests;

import React, { useState, useEffect } from 'react';
import type { PetReport } from '../../services/api';
import { apiService } from '../../services/api';

const AdminFoundRequests = () => {
  const [reports, setReports] = useState<PetReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<PetReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<PetReport | null>(null);
  const [filters, setFilters] = useState({
    petType: 'all',
    locationFound: '',
    foundByUser: '',
    status: 'all',
  });

  useEffect(() => {
  const fetchReports = async () => {
    try {
      const data = await apiService.getPetReports();
      console.log('API reports:', data); // <-- check what rep.pet actually contains
      const foundReports = data.filter((rep) => rep.pet_status === 'Found');
      setReports(foundReports);
      setFilteredReports(foundReports);
    } catch (err) {
      console.error('Failed to fetch pet reports:', err);
    }
  };

  fetchReports();
}, []);

  useEffect(() => {
    let tempReports = reports;

    if (filters.petType !== 'all') {
      tempReports = tempReports.filter(
        (r) =>
          (typeof r.pet?.pet_type === 'string'
            ? r.pet?.pet_type
            : r.pet?.pet_type?.type) === filters.petType
      );
    }
    if (filters.locationFound.trim() !== '') {
      tempReports = tempReports.filter((r) =>
        (r.pet?.address || r.pet?.city || '')
          .toLowerCase()
          .includes(filters.locationFound.toLowerCase())
      );
    }
    if (filters.foundByUser.trim() !== '') {
      tempReports = tempReports.filter((r) =>
        (r.user?.username || '')
          .toLowerCase()
          .includes(filters.foundByUser.toLowerCase())
      );
    }
    if (filters.status !== 'all') {
      tempReports = tempReports.filter((r) => r.report_status === filters.status);
    }

    setFilteredReports(tempReports);
  }, [filters, reports]);

  const stats = {
    total: filteredReports.length,
    pending: filteredReports.filter((r) => r.report_status === 'Pending').length,
    accepted: filteredReports.filter((r) => r.report_status === 'Accepted').length,
    resolved: filteredReports.filter((r) => r.report_status === 'Resolved').length,
    reunited: filteredReports.filter((r) => r.report_status === 'Reunited').length,
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = async (updatedReport: PetReport) => {
    try {
      await apiService.updatePetReport(updatedReport.id, updatedReport);

      setReports((prev) =>
        prev.map((r) => (r.id === updatedReport.id ? updatedReport : r))
      );
      setSelectedReport(null);
    } catch (err) {
      console.error('Failed to update report:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 text-gray-800">
      <h1 className="mb-8 text-center text-3xl font-bold text-gray-800">
        Found Pet Dashboard
      </h1>

      {/* Stats Section */}
      <div className="mb-8 flex flex-wrap justify-center gap-4">
        <StatCard label="Total Reports" value={stats.total} color="text-blue-600" />
        <StatCard label="Pending" value={stats.pending} color="text-yellow-500" />
        <StatCard label="Accepted" value={stats.accepted} color="text-green-600" />
        <StatCard label="Resolved" value={stats.resolved} color="text-gray-600" />
        <StatCard label="Reunited" value={stats.reunited} color="text-indigo-600" />
      </div>

      {/* Filters Section */}
      <div className="mb-8 grid grid-cols-1 gap-4 rounded-lg bg-white p-6 shadow-md md:grid-cols-2 lg:grid-cols-4">
        <FilterSelect
          label="Pet Type"
          name="petType"
          value={filters.petType}
          onChange={handleFilterChange}
          options={['all', 'Dog', 'Cat', 'Other']}
        />
        <FilterInput
          label="Location Found"
          name="locationFound"
          value={filters.locationFound}
          onChange={handleFilterChange}
        />
        <FilterInput
          label="Found By User"
          name="foundByUser"
          value={filters.foundByUser}
          onChange={handleFilterChange}
        />
        <FilterSelect
          label="Status"
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          options={['all', 'Pending', 'Accepted', 'Resolved', 'Reunited']}
        />
      </div>

      {/* Reports Table Section */}
      <div className="overflow-x-auto rounded-lg bg-white shadow-md">
        <table className="min-w-full table-auto border-collapse text-left">
          <thead>
            <tr className="bg-gray-200 text-gray-600">
              <th className="p-4 font-semibold">Pet Name</th>
              <th className="p-4 font-semibold">Pet Type</th>
              <th className="p-4 font-semibold">Breed</th>
              <th className="p-4 font-semibold">Location Found</th>
              <th className="p-4 font-semibold">Found By</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((rep) => (
              <tr
                key={rep.id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="p-4 text-gray-700">{rep.pet?.name || 'N/A'}</td>
                <td className="p-4 text-gray-700">
                  {typeof rep.pet?.pet_type === 'string'
                    ? rep.pet?.pet_type
                    : rep.pet?.pet_type?.type || 'N/A'}
                </td>
                <td className="p-4 text-gray-700">{rep.pet?.breed || 'N/A'}</td>
                <td className="p-4 text-gray-700">
                  {rep.pet?.address || rep.pet?.city || 'N/A'}
                </td>
                <td className="p-4 text-gray-700">{rep.user?.username || 'N/A'}</td>
                <td className="p-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                      rep.report_status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : rep.report_status === 'Accepted'
                        ? 'bg-green-100 text-green-800'
                        : rep.report_status === 'Resolved'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-indigo-100 text-indigo-800'
                    }`}
                  >
                    {rep.report_status}
                  </span>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => setSelectedReport(rep)}
                    className="rounded-full p-2 text-blue-600 transition duration-200 hover:bg-gray-200"
                    title="Edit Report"
                  >
                    ✏️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedReport && (
        <EditFormModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onSave={handleSaveChanges}
        />
      )}
    </div>
  );
};

// ✅ Components
const StatCard = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="flex-1 rounded-lg bg-white p-6 text-center shadow-md min-w-[150px]">
    <h3 className="text-sm font-semibold text-gray-500">{label}</h3>
    <p className={`mt-2 text-3xl font-bold ${color}`}>{value}</p>
  </div>
);

const FilterInput = ({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="flex flex-col">
    <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder="Search..."
      className="rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
    />
  </div>
);

const FilterSelect = ({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
}) => (
  <div className="flex flex-col">
    <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt.charAt(0).toUpperCase() + opt.slice(1)}
        </option>
      ))}
    </select>
  </div>
);

// ✅ Modal
const EditFormModal = ({
  report,
  onClose,
  onSave,
}: {
  report: PetReport;
  onClose: () => void;
  onSave: (rep: PetReport) => void;
}) => {
  const [formData, setFormData] = useState<PetReport>(report);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, report_status: e.target.value as PetReport['report_status'] });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      onClick={onClose}
    >
      <div
        className="relative w-[90%] max-w-xl transform rounded-lg bg-white p-6 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between border-b pb-4">
          <h3 className="text-xl font-bold text-gray-800">Review Found Pet Report</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            ✖
          </button>
        </div>
        <div className="grid gap-6">
          <div className="flex items-start gap-4">
            <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-lg">
              {formData.image ? (
                <img
                  src={formData.image}
                  alt={formData.pet?.name || 'Pet'}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-200 text-sm text-gray-500">
                  No Image
                </div>
              )}
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-800">
                {formData.pet?.breed || 'Unknown'}{' '}
                {typeof formData.pet?.pet_type === 'string'
                  ? formData.pet.pet_type
                  : formData.pet?.pet_type?.type || ''}
              </h4>
              <p className="mt-1 text-sm text-gray-600">
                A {formData.pet?.breed || 'pet'} was found.
              </p>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700">Found By</label>
              <input
                type="text"
                value={formData.user?.username || 'N/A'}
                disabled
                className="rounded-md border border-gray-300 bg-gray-100 p-2 text-sm text-gray-700"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700">Location Found</label>
              <input
                type="text"
                value={formData.pet?.address || formData.pet?.city || 'N/A'}
                disabled
                className="rounded-md border border-gray-300 bg-gray-100 p-2 text-sm text-gray-700"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="status" className="mb-1 text-sm font-medium text-gray-700">
                Update Report Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.report_status}
                onChange={handleStatusChange}
                className="rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              >
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Resolved">Resolved</option>
                <option value="Reunited">Reunited</option>
              </select>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => onSave(formData)}
            className="rounded-md bg-green-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-green-600"
          >
            Save Changes
          </button>
          <button
            onClick={onClose}
            className="rounded-md bg-gray-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminFoundRequests;
