import React, { useState, useEffect, useMemo } from 'react';
import { apiService } from '../../services/api';
import type { AdminUserReport } from '../../services/api';
import toast, { Toaster } from 'react-hot-toast';

// Styling component
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
    .dashboard-container table { width: 100%; border-collapse: collapse; min-width: 900px; }
    .dashboard-container th, .dashboard-container td { padding: 16px; text-align: left; border-bottom: 1px solid #dee2e6; }
    .dashboard-container .message-col { max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .dashboard-container thead th { background-color: #e9ecef; color: #495057; font-weight: 600; }
    .dashboard-container tbody tr:hover { background-color: #f1f3f5; }
    .dashboard-container .btn-edit { background-color: transparent; border: none; cursor: pointer; padding: 6px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: background-color 0.2s ease-in-out; }
    .dashboard-container .btn-edit svg { width: 18px; height: 18px; fill: #007bff; }
    .dashboard-container .btn-edit:hover { background-color: #e9ecef; }
    .dashboard-container .status { padding: 4px 12px; border-radius: 12px; font-size: 0.8rem; font-weight: bold; text-transform: uppercase; }
    .dashboard-container .status.pending { background-color: #ffc107; color: #212529; }
    .dashboard-container .status.accepted { background-color: #28a745; color: white; }
    .dashboard-container .status.reunited { background-color: #17a2b8; color: white; }
    .dashboard-container .status.resolved { background-color: #6f42c1; color: white; }
    .dashboard-container .status.rejected { background-color: #dc3545; color: white; }
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
    .form-actions { display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-top: 1.5rem; }
    .btn-save, .btn-cancel { border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold; transition: all 0.2s; }
    .btn-save { background-color: #28a745; color: white; }
    .btn-cancel { background-color: #6c757d; color: white; }
    .audit-info { font-size: 0.8rem; color: #6c757d; }
    .form-actions-right { display: flex; gap: 10px; }
    `}</style>
);

const AdminUserReports: React.FC = () => {
    const [reports, setReports] = useState<AdminUserReport[]>([]);
    const [selectedReport, setSelectedReport] = useState<AdminUserReport | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [filters, setFilters] = useState({
        petName: '',
        requesterEmail: '',
        status: 'all',
    });

    useEffect(() => {
        const fetchUserReports = async () => {
            setLoading(true);
            try {
                const data = await apiService.getAdminUserReports();
                setReports(data);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch user reports.');
                toast.error('Failed to fetch user reports.');
            } finally {
                setLoading(false);
            }
        };
        fetchUserReports();
    }, []);

    const handleSaveChanges = async (updatedReport: AdminUserReport) => {
        const originalReport = reports.find(r => r.id === updatedReport.id);
        if (originalReport?.report_status === updatedReport.report_status) {
            setSelectedReport(null);
            return;
        }

        const promise = apiService.updateUserReportStatus(updatedReport.id, updatedReport.report_status);
        
        toast.promise(promise, {
            loading: 'Saving changes...',
            success: (savedReport) => {
                setReports(prevReports =>
                    prevReports.map(req => req.id === savedReport.id ? savedReport : req)
                );
                setSelectedReport(null);
                return `Status for report #${savedReport.id} updated successfully!`;
            },
            error: 'Failed to update status. Please try again.',
        });
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const filteredReports = useMemo(() => {
        return reports.filter(req =>
            req.pet_report.pet.name.toLowerCase().includes(filters.petName.toLowerCase()) &&
            (req.created_by?.email || '').toLowerCase().includes(filters.requesterEmail.toLowerCase()) &&
            (filters.status === 'all' || req.report_status === filters.status)
        );
    }, [reports, filters]);

    const stats = useMemo(() => ({
        total: reports.length,
        pending: reports.filter(r => r.report_status === 'Pending').length,
        accepted: reports.filter(r => r.report_status === 'Accepted').length,
        reunited: reports.filter(r => r.report_status === 'Reunited').length,
        resolved: reports.filter(r => r.report_status === 'Resolved').length,
        rejected: reports.filter(r => r.report_status === 'Rejected').length,
    }), [reports]);

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading user reports...</div>;
    if (error) return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>{error}</div>;

    return (
        <>
            <DashboardStyles />
            <Toaster position="top-center" reverseOrder={false} />
            <div className="dashboard-container">
                <h1>User Reports Dashboard</h1>

                <div className="stats-container">
                    <div className="stat-card"><h3>Total Reports</h3><p>{stats.total}</p></div>
                    <div className="stat-card"><h3>Pending</h3><p>{stats.pending}</p></div>
                    <div className="stat-card"><h3>Accepted</h3><p>{stats.accepted}</p></div>
                    <div className="stat-card"><h3>Reunited</h3><p>{stats.reunited}</p></div>
                    <div className="stat-card"><h3>Resolved</h3><p>{stats.resolved}</p></div>
                    <div className="stat-card"><h3>Rejected</h3><p>{stats.rejected}</p></div>
                </div>

                <div className="filter-container">
                    <div className="filter-group">
                        <label htmlFor="petName">Pet Name</label>
                        <input type="text" id="petName" name="petName" value={filters.petName} onChange={handleFilterChange} placeholder="Search by pet name..." />
                    </div>
                    <div className="filter-group">
                        <label htmlFor="requesterEmail">Requester Email</label>
                        <input type="text" id="requesterEmail" name="requesterEmail" value={filters.requesterEmail} onChange={handleFilterChange} placeholder="Search by requester..." />
                    </div>
                    <div className="filter-group">
                        <label htmlFor="status">Report Status</label>
                        <select id="status" name="status" value={filters.status} onChange={handleFilterChange}>
                            <option value="all">All</option>
                            <option value="Pending">Pending</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Reunited">Reunited</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Pet Name</th>
                                <th>Request Type</th>
                                <th>Pet Reported By</th>
                                <th>Requester</th>
                                <th>Message</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReports.map((req) => (
                                <tr key={req.id}>
                                    <td>{req.pet_report.pet.name}</td>
                                    <td>{req.report_type}</td>
                                    <td>{req.pet_report_creator.email}</td>
                                    <td>{req.created_by?.email || 'N/A'}</td>
                                    <td className="message-col" title={req.message}>{req.message}</td>
                                    <td><span className={`status ${req.report_status.toLowerCase()}`}>{req.report_status}</span></td>
                                    <td>
                                        <button onClick={() => setSelectedReport(req)} className="btn-edit" title="Manage Report">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedReport && (
                <ReportReviewModal
                    report={selectedReport}
                    onClose={() => setSelectedReport(null)}
                    onSave={handleSaveChanges}
                />
            )}
        </>
    );
};

const ReportReviewModal = ({ report, onClose, onSave }: { report: AdminUserReport, onClose: () => void, onSave: (req: AdminUserReport) => void }) => {
    const [formData, setFormData] = useState<AdminUserReport>(report);

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData({ ...formData, report_status: e.target.value as AdminUserReport['report_status'] });
    };
    
    const formatDate = (dateString: string) => new Date(dateString).toLocaleString();

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="edit-form-container" onClick={(e) => e.stopPropagation()}>
                <div className="form-header"><h3>Review Report: {formData.pet_report.pet.name}</h3><button onClick={onClose} className="close-btn">✖</button></div>
                <div className="form-body">
                    <div className="form-group"><label>Pet Reported By</label><input type="text" value={`${formData.pet_report_creator.email} (Original Status: ${formData.pet_report.pet_status})`} disabled /></div>
                    <div className="form-group"><label>Requester ({formData.report_type})</label><input type="text" value={`${formData.created_by?.username || 'N/A'} (${formData.created_by?.email || 'N/A'})`} disabled /></div>
                    <div className="form-group"><label>Message from Requester</label><textarea value={formData.message} disabled /></div>
                    <div className="form-group">
                        <label htmlFor="status">Update Request Status</label>
                        <select id="status" name="status" value={formData.report_status} onChange={handleStatusChange}>
                            <option value="Pending">Pending</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Reunited">Reunited</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                </div>
                <div className="form-actions">
                    <div className="audit-info">
                        {/* UPDATED: Show username instead of email */}
                        <div><strong>Created:</strong> {formatDate(formData.created_date)} by {formData.created_by?.username || 'N/A'}</div>
                        <div><strong>Updated:</strong> {formatDate(formData.modified_date)} by {formData.modified_by?.username || 'N/A'}</div>
                    </div>
                    <div className="form-actions-right">
                        <button onClick={() => onSave(formData)} className="btn-save">Save Changes</button>
                        <button onClick={onClose} className="btn-cancel">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUserReports;