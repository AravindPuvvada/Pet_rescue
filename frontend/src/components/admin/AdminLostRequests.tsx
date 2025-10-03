// import React, { useState, useMemo, useEffect, useCallback } from 'react';
// import { apiService } from '../../services/api';
// import type { PetReport, PetType, AdminPetReport } from '../../services/api';

// // --- UI Interface Definition ---
// interface UILostPetReport {
//   id: number; // Report ID
//   petName: string;
//   user: string; // User username (from AdminPetReport)
//   location: string;
//   petType: 'Dog' | 'Cat' | 'Other'; 
//   breed: string;
//   status: 'Pending' | 'Accepted'| 'Rejected' | 'Resolved' | 'Reunited';
//   imageUrl: string;
//   createdBy: string; // User username
//   modifiedBy: string; // Last modification details (e.g., "Admin User (9/18/2025, 4:25:58 PM)")
// }

// // --- Data Mapping Functions ---
// const getPetTypeString = (petType: string | PetType | undefined): 'Dog' | 'Cat' | 'Other' => {
//   if (!petType) return 'Other';
//   const typeName = typeof petType === 'string' ? petType : petType.type;
//   if (typeName.toLowerCase().includes('dog')) return 'Dog';
//   if (typeName.toLowerCase().includes('cat')) return 'Cat';
//   return 'Other';
// };

// // Maps AdminPetReport (API) to UILostPetReport (UI)
// const mapApiToUi = (apiReport: AdminPetReport): UILostPetReport => {
//   const location = apiReport.pet.address || 'N/A';
  
//   // ✅ CHANGE: Prioritize the image from the report ('image_url').
//   // Fall back to the pet's main profile image if the report has no specific image.
//   const rawImageUrl = apiReport.image_url || apiReport.pet.image; 
  
//   const formattedModifiedDate = apiReport.modified_date ? 
//                                 new Date(apiReport.modified_date).toLocaleString() : 
//                                 'N/A';

//   return {
//     id: apiReport.id,
//     petName: apiReport.pet.name,
//     user: apiReport.user,
//     location: location,
//     petType: getPetTypeString(apiReport.pet.pet_type),
//     breed: apiReport.pet.breed || 'Unknown',
//     status: apiReport.report_status,
//     imageUrl: apiService.getImageUrl(rawImageUrl), // Use the determined image URL
//     createdBy: apiReport.user,
//     modifiedBy: formattedModifiedDate, 
//   };
// };

// // --- Component to inject CSS ---
// const DashboardStyles = () => (
//   <style>{`
//     body { background-color: #f8f9fa; }
//     .dashboard-container { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; padding: 2rem; }
//     .dashboard-container h1 { color: #343a40; margin-bottom: 1rem; text-align: center; }

//     .stats-container { display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center; margin-bottom: 2rem; }
//     .stat-card { background-color: #fff; padding: 1.5rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); text-align: center; flex-grow: 1; min-width: 150px; }
//     .stat-card h3 { margin: 0 0 0.5rem 0; color: #6c757d; font-size: 1rem; }
//     .stat-card p { margin: 0; color: #007bff; font-size: 2rem; font-weight: bold; }

//     .filter-container { 
//         background-color: #fff; 
//         padding: 1.25rem; 
//         border-radius: 8px; 
//         box-shadow: 0 4px 12px rgba(0,0,0,0.06); 
//         margin-bottom: 2rem; 
//         display: grid; 
//         grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); 
//         gap: 0.75rem; 
//     }
//     .filter-group { display: flex; flex-direction: column; }
//     .filter-group label { 
//         margin-bottom: 0.4rem; 
//         color: #495057; 
//         font-weight: 500;
//         font-size: 0.85rem; 
//     }
//     .filter-group input, .filter-group select { 
//         padding: 8px 10px; 
//         border: 1px solid #ced4da; 
//         border-radius: 4px; 
//         font-size: 0.9rem; 
//     }
    
//     .table-container { background-color: #fff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow-x: auto; }
//     .dashboard-container table { width: 100%; border-collapse: collapse; min-width: 800px; }
//     .dashboard-container th, .dashboard-container td { padding: 16px; text-align: left; border-bottom: 1px solid #dee2e6; white-space: nowrap; }
//     .dashboard-container thead th { background-color: #e9ecef; color: #495057; font-weight: 600; }
//     .dashboard-container tbody tr:hover { background-color: #f1f3f5; }
    
//     .dashboard-container .btn-edit {
//         background-color: transparent;
//         border: none;
//         cursor: pointer;
//         padding: 6px;
//         border-radius: 50%;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         transition: background-color 0.2s ease-in-out;
//     }
//     .dashboard-container .btn-edit svg {
//         width: 18px;
//         height: 18px;
//         fill: #007bff;
//     }
//     .dashboard-container .btn-edit:hover {
//         background-color: #e9ecef;
//     }

//     .dashboard-container .status { padding: 4px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: bold; color: #fff; text-transform: uppercase; }
//     .dashboard-container .status.pending { background-color: #ffc107; color: #212529; }
//     .dashboard-container .status.accepted { background-color: #28a745; }
//     .dashboard-container .status.rejected { background-color: #fa0303ff; }
//     .dashboard-container .status.resolved { background-color: #6f42c1; }
//     .dashboard-container .status.reunited { background-color: #17a2b8; }

//     .modal-overlay { 
//         position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
//         background-color: rgba(0,0,0,0.6); display: flex; 
//         justify-content: center; align-items: center; z-index: 1000; 
//         overflow-y: auto;
//         padding: 1rem;
//     }
//     .edit-form-container { 
//         background-color: #fff; border-radius: 8px; 
//         box-shadow: 0 4px 12px rgba(0,0,0,0.1); width: 95%; 
//         max-width: 800px;
//         padding: 1.5rem; border-top: 5px solid #007bff;
//         position: relative;
//         overflow-y: auto;
//         max-height: 90vh;
//     }
//     .form-header { 
//         display: flex; justify-content: space-between; align-items: center; 
//         border-bottom: 1px solid #e9ecef; padding-bottom: 1rem; margin-bottom: 1.5rem; 
//     }
//     .form-header h3 { margin: 0; color: #343a40; }
//     .close-btn { 
//         background: none; border: none; font-size: 1.5rem; 
//         cursor: pointer; color: #6c757d; 
//     }
    
//     .form-top-details {
//         display: flex;
//         gap: 1.5rem;
//         margin-bottom: 1.5rem;
//         align-items: flex-start;
//     }
//     .pet-image-wrapper {
//         flex-shrink: 0;
//         width: 150px;
//         height: 150px;
//         overflow: hidden;
//         border-radius: 8px;
//         border: 1px solid #e9ecef;
//         background-color: #f1f3f5;
//         display: flex;
//         justify-content: center;
//         align-items: center;
//     }
//     .pet-image-wrapper img { 
//         max-width: 100%; 
//         max-height: 100%;
//         object-fit: cover;
//         display: block;
//     }
//     .pet-info-right {
//         flex-grow: 1;
//     }
//     .pet-info-right h4 {
//         margin-top: 0;
//         margin-bottom: 0.5rem;
//         color: #343a40;
//         font-size: 1.5rem;
//     }
//     .pet-info-right p {
//         margin: 0;
//         color: #6c757d;
//         font-size: 1rem;
//         line-height: 1.5;
//     }

//     .form-group { margin-bottom: 1.25rem; }
//     .form-group label { display: block; margin-bottom: 0.5rem; color: #495057; font-weight: 500; font-size: 1rem; }
//     .form-group input, .form-group select { width: 100%; padding: 10px; border: 1px solid #ced4da; border-radius: 4px; font-size: 1rem; box-sizing: border-box; }
//     .form-group input:disabled { background-color: #e9ecef; cursor: not-allowed; }
    
//     .audit-info { font-size: 0.9rem; color: #6c757d; background-color: #f8f9fa; padding: 10px; border-radius: 4px; }
//     .form-actions { 
//         display: flex; justify-content: flex-end; gap: 10px; margin-top: 1.5rem; 
//         border-top: 1px solid #e9ecef;
//         padding-top: 1rem;
//         position: sticky;
//         bottom: 0;
//         background-color: #fff;
//         z-index: 10;
//     }
//     .btn-save, .btn-cancel { border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold; }
//     .btn-save { background-color: #28a745; color: white; }
//     .btn-cancel { background-color: #6c757d; color: white; }
//   `}</style>
// );

// const AdminLostRequests: React.FC = () => {
//   const [reports, setReports] = useState<UILostPetReport[]>([]);
//   const [selectedReport, setSelectedReport] = useState<UILostPetReport | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [filters, setFilters] = useState({
//     petName: '',
//     user: '',
//     location: '',
//     petType: 'all',
//     status: 'all',
//   });

//   // --- API Fetching Logic ---
//   const fetchReports = useCallback(async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const apiReports = await apiService.getAdminLostPets(); 
//       const mappedReports = apiReports.map(mapApiToUi);
//       setReports(mappedReports);
//     } catch (err) {
//       console.error('Failed to fetch reports:', err);
//       setError(`Failed to load reports: ${(err as Error).message}.`);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchReports();
//   }, [fetchReports]);


//   // --- API Update Logic ---
//   const handleSaveChanges = async (updatedReport: UILostPetReport) => {
//     setSelectedReport(null);
//     setIsLoading(true);
//     setError(null);

//     try {
//         const apiUpdateData: Partial<PetReport> = {
//             report_status: updatedReport.status as PetReport['report_status'],
//             is_resolved: updatedReport.status === 'Resolved' || updatedReport.status === 'Reunited',
//         };
        
//         await apiService.updatePetReport(updatedReport.id, apiUpdateData);

//         fetchReports();
        
//     } catch (err) {
//         console.error("Update failed:", err);
//         setError(`Failed to update report ${updatedReport.id}: ${(err as Error).message}`);
//         setIsLoading(false);
//     }
//   };


//   const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({ ...prev, [name]: value }));
//   };

//   const filteredReports = useMemo(() => {
//     return reports.filter(rep => {
//       return (
//         rep.petName.toLowerCase().includes(filters.petName.toLowerCase()) &&
//         rep.user.toLowerCase().includes(filters.user.toLowerCase()) &&
//         rep.location.toLowerCase().includes(filters.location.toLowerCase()) &&
//         (filters.petType === 'all' || rep.petType === filters.petType) &&
//         (filters.status === 'all' || rep.status === filters.status)
//       );
//     });
//   }, [reports, filters]);

//   const stats = useMemo(() => ({
//     total: reports.length,
//     pending: reports.filter(r => r.status === 'Pending').length,
//     accepted: reports.filter(r => r.status === 'Accepted').length,
//     rejected: reports.filter(r => r.status === 'Rejected').length,
//     resolved: reports.filter(r => r.status === 'Resolved').length,
//     reunited: reports.filter(r => r.status === 'Reunited').length,
//   }), [reports]);

//   if (isLoading) return <div className="dashboard-container" style={{ textAlign: 'center', paddingTop: '50px' }}>Loading Lost Pet Reports...</div>;
  
//   return (
//     <>
//       <DashboardStyles />
//       <div className="dashboard-container">
//         <h1>Lost Pet Dashboard</h1>
        
//         {error && <p style={{ color: 'red', textAlign: 'center', fontWeight: 'bold' }}>Error: {error}</p>}

//         <div className="stats-container">
//           <div className="stat-card"><h3>Total Reports</h3><p>{stats.total}</p></div>
//           <div className="stat-card"><h3>Pending</h3><p>{stats.pending}</p></div>
//           <div className="stat-card"><h3>Accepted</h3><p>{stats.accepted}</p></div>
//           <div className="stat-card"><h3>Rejected</h3><p>{stats.accepted}</p></div>
//           <div className="stat-card"><h3>Resolved</h3><p>{stats.resolved}</p></div>
//           <div className="stat-card"><h3>Reunited</h3><p>{stats.reunited}</p></div>
//         </div>

//         <div className="filter-container">
//           <div className="filter-group"><label>Pet Name</label><input type="text" name="petName" value={filters.petName} onChange={handleFilterChange} placeholder="Search..."/></div>
//           <div className="filter-group"><label>User</label><input type="text" name="user" value={filters.user} onChange={handleFilterChange} placeholder="Search..."/></div>
//           <div className="filter-group"><label>Location</label><input type="text" name="location" value={filters.location} onChange={handleFilterChange} placeholder="Search..."/></div>
//           <div className="filter-group"><label>Pet Type</label><select name="petType" value={filters.petType} onChange={handleFilterChange}><option value="all">All</option><option value="Dog">Dog</option><option value="Cat">Cat</option><option value="Other">Other</option></select></div>
//           <div className="filter-group"><label>Status</label><select name="status" value={filters.status} onChange={handleFilterChange}><option value="all">All</option><option value="Pending">Pending</option><option value="Accepted">Accepted</option><option value="Resolved">Resolved</option><option value="Reunited">Reunited</option></select></div>
//         </div>
        
//         <div className="table-container">
//           <table>
//             <thead><tr><th>Pet Name</th><th>User</th><th>Last Seen Location</th><th>Pet Type</th><th>Breed</th><th>Status</th><th>Actions</th></tr></thead>
//             <tbody>
//               {filteredReports.map((rep) => (
//                 <tr key={rep.id}>
//                   <td>{rep.petName}</td><td>{rep.user}</td><td>{rep.location}</td><td>{rep.petType}</td><td>{rep.breed}</td>
//                   <td><span className={`status ${rep.status.toLowerCase()}`}>{rep.status}</span></td>
//                   <td>
//                     <button onClick={() => setSelectedReport(rep)} className="btn-edit" title="Edit Report">
//                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
//                             <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/>
//                         </svg>
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           {filteredReports.length === 0 && !isLoading && (
//             <p style={{ textAlign: 'center', padding: '20px', color: '#6c757d' }}>No lost pet reports found.</p>
//           )}
//         </div>
//       </div>
      
//       {selectedReport && (
//         <EditFormModal report={selectedReport} onClose={() => setSelectedReport(null)} onSave={handleSaveChanges} />
//       )}
//     </>
//   );
// };

// // Use the UI-specific interface here
// const EditFormModal = ({ report, onClose, onSave }: { report: UILostPetReport, onClose: () => void, onSave: (rep: UILostPetReport) => void }) => {
//     const [formData, setFormData] = useState<UILostPetReport>(report);

//     const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//       setFormData({ ...formData, status: e.target.value as UILostPetReport['status'] });
//     };

//     return (
//       <div className="modal-overlay" onClick={onClose}>
//         <div className="edit-form-container" onClick={(e) => e.stopPropagation()}>
//           <div className="form-header"><h3>Review Report ID: {formData.id}</h3><button onClick={onClose} className="close-btn">✖</button></div>
//           <div className="form-body">
//             <div className="form-top-details">
//                 <div className="pet-image-wrapper">
//                     <img src={formData.imageUrl} alt={formData.petName} onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=No+Image' }} />
//                 </div>
//                 <div className="pet-info-right">
//                     <h4>{formData.petName}</h4>
//                     <p>Type: {formData.petType}</p>
//                     <p>Breed: {formData.breed}</p>
//                 </div>
//             </div>
//             {/* Input fields related to the report creator and location (disabled as they are read-only) */}
//             <div className="form-group"><label>Reported By (Username)</label><input type="text" value={formData.user} disabled /></div>
//             <div className="form-group"><label>Last Seen Location</label><input type="text" value={formData.location} disabled /></div>
//             <div className="form-group">
//                 <label htmlFor="status">Update Report Status</label>
//                 <select id="status" name="status" value={formData.status} onChange={handleStatusChange}>
//                     <option value="Pending">Pending</option><option value="Accepted">Accepted</option><option value="Rejected">Rejected</option><option value="Resolved">Resolved</option><option value="Reunited">Reunited</option>
//                 </select>
//             </div>
//             <div className="form-group">
//                 <label>Audit Information</label>
//                 <div className="audit-info">
//                     Created by: {formData.createdBy}<br />
//                     Last Updated: {formData.modifiedBy} 
//                 </div>
//             </div>
//           </div>
//           <div className="form-actions"><button onClick={() => onSave(formData)} className="btn-save">Save Changes</button><button onClick={onClose} className="btn-cancel">Cancel</button></div>
//         </div>
//       </div>
//     );
// };

// export default AdminLostRequests;

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { apiService } from '../../services/api';
import type { PetReport, PetType, AdminPetReport } from '../../services/api';
import { Edit2, X } from 'lucide-react';

// Theme mapping as per the user's preferred style
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
  },
  dark: {
    // Custom dark theme as requested
    pageBg: 'bg-[#E8E0D3] text-white',
    cardBg: 'bg-[#F5EFE6] border-[#5B4438]/20',
    headerText: 'text-yellow-200',
    subText: 'text-gray-300',
    inputBg: 'bg-gray-700 text-white placeholder-gray-400 border-gray-600 focus:ring-pink-500',
    selectBg: 'bg-gray-700 text-white border-gray-600 focus:ring-pink-500',
    modalBg: 'bg-gray-800 border-gray-700',
    modalText: 'text-white',
    modalOverlay: 'bg-black bg-opacity-70',
    buttonSave: 'bg-green-700 hover:bg-green-800 text-white',
    buttonCancel: 'bg-gray-600 hover:bg-gray-700 text-white',
  },
};

// --- UI Interface Definition ---
interface UILostPetReport {
  id: number;
  petName: string;
  user: string;
  location: string;
  petType: 'Dog' | 'Cat' | 'Other';
  breed: string;
  status: 'Pending' | 'Accepted'| 'Rejected' | 'Resolved' | 'Reunited';
  imageUrl: string;
  createdBy: string;
  modifiedBy: string;
}

// --- Data Mapping Functions ---
const getPetTypeString = (petType: string | PetType | undefined): 'Dog' | 'Cat' | 'Other' => {
  if (!petType) return 'Other';
  const typeName = typeof petType === 'string' ? petType : petType.type;
  if (typeName.toLowerCase().includes('dog')) return 'Dog';
  if (typeName.toLowerCase().includes('cat')) return 'Cat';
  return 'Other';
};

const mapApiToUi = (apiReport: AdminPetReport): UILostPetReport => {
  const location = apiReport.pet.address || 'N/A';
  const rawImageUrl = apiReport.image_url || apiReport.pet.image;
  const formattedModifiedDate = apiReport.modified_date ? new Date(apiReport.modified_date).toLocaleString() : 'N/A';

  return {
    id: apiReport.id,
    petName: apiReport.pet.name,
    user: apiReport.user,
    location: location,
    petType: getPetTypeString(apiReport.pet.pet_type),
    breed: apiReport.pet.breed || 'Unknown',
    status: apiReport.report_status,
    imageUrl: apiService.getImageUrl(rawImageUrl),
    createdBy: apiReport.user,
    modifiedBy: formattedModifiedDate,
  };
};

// --- Main Component ---
const AdminLostRequests: React.FC = () => {
  const [reports, setReports] = useState<UILostPetReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<UILostPetReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const [filters, setFilters] = useState({
    petName: '',
    user: '',
    location: '',
    petType: 'all',
    status: 'all',
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const apiReports = await apiService.getAdminLostPets();
      const mappedReports = apiReports.map(mapApiToUi);
      setReports(mappedReports);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
      setError(`Failed to load reports: ${(err as Error).message}.`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);


  const handleSaveChanges = async (updatedReport: UILostPetReport) => {
    setSelectedReport(null);
    setIsLoading(true);
    setError(null);

    try {
        const apiUpdateData: Partial<PetReport> = {
            report_status: updatedReport.status as PetReport['report_status'],
            is_resolved: updatedReport.status === 'Resolved' || updatedReport.status === 'Reunited',
        };

        await apiService.updatePetReport(updatedReport.id, apiUpdateData);
        fetchReports();

    } catch (err) {
        console.error("Update failed:", err);
        setError(`Failed to update report ${updatedReport.id}: ${(err as Error).message}`);
        setIsLoading(false);
    }
  };


  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredReports = useMemo(() => {
    return reports.filter(rep => {
      return (
        rep.petName.toLowerCase().includes(filters.petName.toLowerCase()) &&
        rep.user.toLowerCase().includes(filters.user.toLowerCase()) &&
        rep.location.toLowerCase().includes(filters.location.toLowerCase()) &&
        (filters.petType === 'all' || rep.petType === filters.petType) &&
        (filters.status === 'all' || rep.status === filters.status)
      );
    });
  }, [reports, filters]);

  const stats = useMemo(() => ({
    total: reports.length,
    pending: reports.filter(r => r.status === 'Pending').length,
    accepted: reports.filter(r => r.status === 'Accepted').length,
    rejected: reports.filter(r => r.status === 'Rejected').length,
    resolved: reports.filter(r => r.status === 'Resolved').length,
    reunited: reports.filter(r => r.status === 'Reunited').length,
  }), [reports]);

  if (isLoading) return (
    <div className={`flex items-center justify-center h-screen p-6 ${themeClasses[theme].pageBg}`}>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
    </div>
  );

  return (
    <div className={`min-h-screen p-6 ${themeClasses[theme].pageBg}`}>

      {/* Header */}
      <div>
        <h1 className={`text-3xl font-bold ${themeClasses[theme].headerText} dark:text-gray-800`}>
          Lost Pet Dashboard
        </h1>
        <p className={`mt-2 ${themeClasses[theme].subText} dark:text-gray-500`}>
          Monitor and manage lost pet reports
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 my-6">
        <div className={`rounded-lg shadow-lg p-6 text-center ${themeClasses[theme].cardBg}`}>
          <p className={`text-sm font-medium ${themeClasses[theme].headerText} dark:text-gray-200`}>Total Reports</p>
          <p className={`text-3xl font-bold ${themeClasses[theme].headerText} dark:text-yellow-200`}>{stats.total}</p>
        </div>
        <div className={`rounded-lg shadow-lg p-6 text-center ${themeClasses[theme].cardBg}`}>
          <p className={`text-sm font-medium ${themeClasses[theme].headerText} dark:text-gray-200`}>Pending</p>
          <p className={`text-3xl font-bold ${themeClasses[theme].headerText} dark:text-yellow-200`}>{stats.pending}</p>
        </div>
        <div className={`rounded-lg shadow-lg p-6 text-center ${themeClasses[theme].cardBg}`}>
          <p className={`text-sm font-medium ${themeClasses[theme].headerText} dark:text-gray-200`}>Accepted</p>
          <p className={`text-3xl font-bold ${themeClasses[theme].headerText} dark:text-yellow-200`}>{stats.accepted}</p>
        </div>
        <div className={`rounded-lg shadow-lg p-6 text-center ${themeClasses[theme].cardBg}`}>
          <p className={`text-sm font-medium ${themeClasses[theme].headerText} dark:text-gray-200`}>Rejected</p>
          <p className={`text-3xl font-bold ${themeClasses[theme].headerText} dark:text-yellow-200`}>{stats.rejected}</p>
        </div>
        <div className={`rounded-lg shadow-lg p-6 text-center ${themeClasses[theme].cardBg}`}>
          <p className={`text-sm font-medium ${themeClasses[theme].headerText} dark:text-gray-200`}>Resolved</p>
          <p className={`text-3xl font-bold ${themeClasses[theme].headerText} dark:text-yellow-200`}>{stats.resolved}</p>
        </div>
        <div className={`rounded-lg shadow-lg p-6 text-center ${themeClasses[theme].cardBg}`}>
          <p className={`text-sm font-medium ${themeClasses[theme].headerText} dark:text-gray-200`}>Reunited</p>
          <p className={`text-3xl font-bold ${themeClasses[theme].headerText} dark:text-yellow-200`}>{stats.reunited}</p>
        </div>
      </div>

      {/* Filters */}
      <div className={`rounded-lg shadow-lg p-4 mb-6 border ${themeClasses[theme].cardBg}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div><label className={`block text-sm font-medium mb-1 ${themeClasses[theme].subText} dark:text-gray-300`}>Pet Name</label><input type="text" name="petName" value={filters.petName} onChange={handleFilterChange} placeholder="Search..." className={`w-full p-2 rounded border ${themeClasses[theme].inputBg} `} /></div>
          <div><label className={`block text-sm font-medium mb-1 ${themeClasses[theme].subText} dark:text-gray-300`}>User</label><input type="text" name="user" value={filters.user} onChange={handleFilterChange} placeholder="Search..." className={`w-full p-2 rounded border ${themeClasses[theme].inputBg}`} /></div>
          <div><label className={`block text-sm font-medium mb-1 ${themeClasses[theme].subText} dark:text-gray-300`}>Location</label><input type="text" name="location" value={filters.location} onChange={handleFilterChange} placeholder="Search..." className={`w-full p-2 rounded border ${themeClasses[theme].inputBg}`} /></div>
          <div><label className={`block text-sm font-medium mb-1 ${themeClasses[theme].subText} dark:text-gray-300`}>Pet Type</label><select name="petType" value={filters.petType} onChange={handleFilterChange} className={`w-full p-2 rounded border ${themeClasses[theme].selectBg}`}><option value="all">All</option><option value="Dog">Dog</option><option value="Cat">Cat</option><option value="Other">Other</option></select></div>
          <div><label className={`block text-sm font-medium mb-1 ${themeClasses[theme].subText} dark:text-gray-300`}>Status</label><select name="status" value={filters.status} onChange={handleFilterChange} className={`w-full p-2 rounded border ${themeClasses[theme].selectBg}`}><option value="all">All</option><option value="Pending">Pending</option><option value="Accepted">Accepted</option><option value="Resolved">Resolved</option><option value="Reunited">Reunited</option><option value="Rejected">Rejected</option></select></div>
        </div>
      </div>

      {/* Report Table */}
      <div className={`rounded-lg shadow-lg p-6 overflow-x-auto ${themeClasses[theme].cardBg}`}>
        {error && <p className="text-red-500 dark:text-red-300 mb-4 font-semibold">Error: {error}</p>}
        <table className="min-w-full">
          <thead>
            <tr className={`border-b border-[#5B4438]/20 dark:border-gray-700`}>
              <th className={`py-2 text-left ${themeClasses[theme].headerText} dark:text-yellow-200`}>Pet Name</th>
              <th className={`py-2 text-left ${themeClasses[theme].headerText} dark:text-yellow-200`}>User</th>
              <th className={`py-2 text-left ${themeClasses[theme].headerText} dark:text-yellow-200`}>Last Seen Location</th>
              <th className={`py-2 text-left ${themeClasses[theme].headerText} dark:text-yellow-200`}>Pet Type</th>
              <th className={`py-2 text-left ${themeClasses[theme].headerText} dark:text-yellow-200`}>Breed</th>
              <th className={`py-2 text-left ${themeClasses[theme].headerText} dark:text-yellow-200`}>Status</th>
              <th className={`py-2 text-left ${themeClasses[theme].headerText} dark:text-yellow-200`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.length > 0 ? (
              filteredReports.map((rep) => (
                <tr key={rep.id} className="border-b border-[#5B4438]/20 dark:border-gray-700">
                  <td className={`py-2 ${themeClasses[theme].subText} dark:text-gray-300`}>{rep.petName}</td>
                  <td className={`py-2 ${themeClasses[theme].subText} dark:text-gray-300`}>{rep.user}</td>
                  <td className={`py-2 ${themeClasses[theme].subText} dark:text-gray-300`}>{rep.location}</td>
                  <td className={`py-2 ${themeClasses[theme].subText} dark:text-gray-300`}>{rep.petType}</td>
                  <td className={`py-2 ${themeClasses[theme].subText} dark:text-gray-300`}>{rep.breed}</td>
                  <td className="py-2"><span className={`status text-xs font-semibold px-2 py-1 rounded-full ${rep.status === 'Pending' ? 'bg-yellow-400' : rep.status === 'Accepted' ? 'bg-green-500' : rep.status === 'Rejected' ? 'bg-red-500' : rep.status === 'Resolved' ? 'bg-purple-500' : 'bg-blue-500'}`}>{rep.status}</span></td>
                  <td className="py-2">
                    <button onClick={() => setSelectedReport(rep)} className={`p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700`}>
                      <Edit2 size={18} className={`${themeClasses[theme].subText} dark:text-gray-300`} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={7} className={`text-center py-4 ${themeClasses[theme].subText}`}>No lost pet reports found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedReport && (
        <EditFormModal report={selectedReport} onClose={() => setSelectedReport(null)} onSave={handleSaveChanges} theme={theme} />
      )}
    </div>
  );
};

const EditFormModal = ({ report, onClose, onSave, theme }: { report: UILostPetReport, onClose: () => void, onSave: (rep: UILostPetReport) => void, theme: 'light' | 'dark' }) => {
  const [formData, setFormData] = useState<UILostPetReport>(report);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, status: e.target.value as UILostPetReport['status'] });
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${themeClasses[theme].modalOverlay}`}>
      <div className={`w-full max-w-3xl rounded-lg shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto ${themeClasses[theme].modalBg} border-t-4 border-blue-500`}>
        <button onClick={onClose} className={`absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200`}>
          <X size={24} />
        </button>

        <div className="mb-4">
          <h3 className={`text-2xl font-bold ${themeClasses[theme].modalText}`}>Review Lost Report ID: {formData.id}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="md:col-span-1">
            {formData.imageUrl && (
              <img src={formData.imageUrl} alt={formData.petName} className="w-full h-auto object-cover rounded-lg shadow-md" onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image' }} />
            )}
            <div className={`mt-4 ${themeClasses[theme].modalText}`}>
              <h4 className="font-bold text-lg">{formData.petName}</h4>
              <p className="text-sm"><span className="font-medium">Type:</span> {formData.petType}</p>
              <p className="text-sm"><span className="font-medium">Breed:</span> {formData.breed}</p>
            </div>
          </div>
          <div className="md:col-span-1">
            <div className="space-y-4">
              <div className="form-group"><label className={`block text-sm font-medium ${themeClasses[theme].modalText}`}>Reported By</label><input type="text" value={formData.user} disabled className={`w-full p-2 rounded border ${themeClasses[theme].inputBg} disabled:bg-gray-200 disabled:text-gray-500 dark:disabled:bg-gray-700 dark:disabled:text-gray-400`} /></div>
              <div className="form-group"><label className={`block text-sm font-medium ${themeClasses[theme].modalText}`}>Last Seen Location</label><input type="text" value={formData.location} disabled className={`w-full p-2 rounded border ${themeClasses[theme].inputBg} disabled:bg-gray-200 disabled:text-gray-500 dark:disabled:bg-gray-700 dark:disabled:text-gray-400`} /></div>
              <div className="form-group">
                <label htmlFor="status" className={`block text-sm font-medium mb-1 ${themeClasses[theme].modalText}`}>Update Status</label>
                <select id="status" name="status" value={formData.status} onChange={handleStatusChange} className={`w-full p-2 rounded border ${themeClasses[theme].selectBg}`}>
                  <option value="Pending">Pending</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Reunited">Reunited</option>
                </select>
              </div>
            </div>
            <div className={`mt-6 p-4 rounded-lg text-sm ${themeClasses[theme].cardBg}`}>
              <h5 className={`font-semibold mb-2 ${themeClasses[theme].modalText}`}>Audit Information</h5>
              <p className={`${themeClasses[theme].subText}`}>Created by: {formData.createdBy}</p>
              <p className={`${themeClasses[theme].subText}`}>Last Updated: {formData.modifiedBy}</p>
            </div>
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

export default AdminLostRequests;