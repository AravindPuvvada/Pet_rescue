// src/pages/PetOwnerPage/UserRequestsModal.tsx

import React, { useState, useEffect } from 'react';
import { X, Heart, Loader2, Search, List } from 'lucide-react';
import { apiService } from '../../services/api';

interface UserRequestsModalProps {
    onClose: () => void;
}

interface UserRequestData {
    reports: Array<{
        id: number;
        pet_name: string;
        pet_status: string;
        report_status: string;
    }>;
    adoptions: Array<{
        id: number;
        pet_name: string;
        status: string;
    }>;
}

const UserRequestsModal: React.FC<UserRequestsModalProps> = ({ onClose }) => {
    const [requests, setRequests] = useState<UserRequestData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'lost' | 'found' | 'adoptions'>('lost');

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const data = await apiService.getUserRequests();
                setRequests(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load requests.');
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, []);

    const getStatusChip = (status: string) => {
        const lowerStatus = status.toLowerCase();
        let colors = 'bg-gray-100 text-gray-800 border-gray-300'; // Default
        if (lowerStatus.includes('accepted') || lowerStatus.includes('approved')) {
            colors = 'bg-green-100 text-green-800 border-green-200';
        } else if (lowerStatus.includes('pending')) {
            colors = 'bg-yellow-100 text-yellow-800 border-yellow-200';
        } else if (lowerStatus.includes('rejected')) {
            colors = 'bg-red-100 text-red-800 border-red-200';
        }
        return <span className={`px-3 py-1 text-xs font-bold rounded-full border ${colors}`}>{status}</span>;
    };
    
    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex flex-col items-center justify-center p-16 text-gray-500">
                    <Loader2 className="w-10 h-10 animate-spin mb-4 text-orange-500" />
                    <p className="font-semibold text-lg">Loading Your Requests...</p>
                </div>
            );
        }

        if (error) {
            return <div className="p-16 text-center text-red-600 font-medium">{error}</div>;
        }

        if (!requests) return null;

        // Filter reports based on the active tab
        const lostReports = requests.reports.filter(r => r.pet_status === 'Lost');
        const foundReports = requests.reports.filter(r => r.pet_status === 'Found');

        if (activeTab === 'lost') {
            return lostReports.length > 0 ? (
                <div className="space-y-3">
                    {lostReports.map(report => (
                        <div key={`lost-${report.id}`} className="bg-white border rounded-xl p-4 flex justify-between items-center hover:bg-orange-50/50 transition-colors">
                            <p className="font-bold text-gray-800">{report.pet_name}</p>
                            {getStatusChip(report.report_status)}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-16 text-gray-400">
                    <Search className="w-12 h-12 mb-4" />
                    <p className="font-semibold text-lg">No Lost Pet Reports</p>
                    <p className="text-sm">You haven't reported any lost pets yet.</p>
                </div>
            );
        }

        if (activeTab === 'found') {
            return foundReports.length > 0 ? (
                <div className="space-y-3">
                    {foundReports.map(report => (
                        <div key={`found-${report.id}`} className="bg-white border rounded-xl p-4 flex justify-between items-center hover:bg-orange-50/50 transition-colors">
                            <p className="font-bold text-gray-800">{report.pet_name}</p>
                            {getStatusChip(report.report_status)}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-16 text-gray-400">
                    <List className="w-12 h-12 mb-4" />
                    <p className="font-semibold text-lg">No Found Pet Reports</p>
                    <p className="text-sm">You haven't reported any found pets yet.</p>
                </div>
            );
        }

        if (activeTab === 'adoptions') {
            return requests.adoptions.length > 0 ? (
                <div className="space-y-3">
                    {requests.adoptions.map(adoption => (
                        <div key={`adoption-${adoption.id}`} className="bg-white border rounded-xl p-4 flex justify-between items-center hover:bg-orange-50/50 transition-colors">
                            <div>
                                <p className="font-bold text-gray-800">{adoption.pet_name}</p>
                                <p className="text-sm text-gray-500">Adoption/Claim Request</p>
                            </div>
                            {getStatusChip(adoption.status)}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-16 text-gray-400">
                    <Heart className="w-12 h-12 mb-4" />
                    <p className="font-semibold text-lg">No Adoption Requests</p>
                    <p className="text-sm">You haven't requested to adopt any pets.</p>
                </div>
            );
        }
    };

    const TabButton: React.FC<{
        label: string;
        icon: React.ReactNode;
        isActive: boolean;
        onClick: () => void;
    }> = ({ label, icon, isActive, onClick }) => (
        <button
            onClick={onClick}
            className={`flex items-center space-x-2 py-3 px-4 font-semibold text-sm rounded-t-lg transition-colors ${
                isActive
                ? 'border-b-2 border-orange-500 text-orange-600 bg-orange-50/50'
                : 'border-b-2 border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100'
            }`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm" onClick={onClose}>
            {/* ✅ Changed max-h-[80vh] to h-[80vh] to enforce a fixed height */}
            <div className="bg-gray-50 rounded-2xl shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b flex justify-between items-center flex-shrink-0 bg-white rounded-t-2xl">
                    <h2 className="text-2xl font-bold text-gray-800">My Requests</h2>
                    <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"><X /></button>
                </div>

                <div className="flex-shrink-0 border-b px-6 bg-white">
                    <nav className="flex space-x-2">
                        <TabButton label="Lost Pets" icon={<Search className="w-4 h-4" />} isActive={activeTab === 'lost'} onClick={() => setActiveTab('lost')} />
                        <TabButton label="Found Pets" icon={<List className="w-4 h-4" />} isActive={activeTab === 'found'} onClick={() => setActiveTab('found')} />
                        <TabButton label="Adoptions" icon={<Heart className="w-4 h-4" />} isActive={activeTab === 'adoptions'} onClick={() => setActiveTab('adoptions')} />
                    </nav>
                </div>

                <div className="p-6 overflow-y-auto bg-gray-50">
                    {renderContent()}
                </div>

                <div className="flex-shrink-0 p-4 border-t mt-auto flex justify-end bg-white rounded-b-2xl">
                    <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-800 bg-gray-100 rounded-lg border border-gray-200 hover:bg-gray-200 transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserRequestsModal;