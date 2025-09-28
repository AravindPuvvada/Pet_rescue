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
        // Semantic colors are kept for clarity across themes
        let colors = 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600';
        if (lowerStatus.includes('accepted') || lowerStatus.includes('approved')) {
            colors = 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700';
        } else if (lowerStatus.includes('pending')) {
            colors = 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-700';
        } else if (lowerStatus.includes('rejected')) {
            colors = 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700';
        }
        return <span className={`px-3 py-1 text-xs font-bold rounded-full border ${colors}`}>{status}</span>;
    };
    
    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex flex-col items-center justify-center p-16 text-light-secondary dark:text-dark-neutral">
                    <Loader2 className="w-10 h-10 animate-spin mb-4 text-light-accent dark:text-dark-accent" />
                    <p className="font-semibold text-lg">Loading Your Requests...</p>
                </div>
            );
        }

        if (error) {
            return <div className="p-16 text-center text-red-600 font-medium dark:text-red-400">{error}</div>;
        }

        if (!requests) return null;

        const lostReports = requests.reports.filter(r => r.pet_status === 'Lost');
        const foundReports = requests.reports.filter(r => r.pet_status === 'Found');

        if (activeTab === 'lost') {
            return lostReports.length > 0 ? (
                <div className="space-y-3">
                    {lostReports.map(report => (
                        <div key={`lost-${report.id}`} className="bg-light-neutral border border-light-primary rounded-xl p-4 flex justify-between items-center hover:bg-light-primary/50 transition-colors dark:bg-dark-primary dark:border-dark-primary/50 dark:hover:bg-dark-primary/80">
                            <p className="font-bold text-light-text dark:text-dark-secondary">{report.pet_name}</p>
                            {getStatusChip(report.report_status)}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-16 text-light-secondary/70 dark:text-dark-neutral/70">
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
                        <div key={`found-${report.id}`} className="bg-light-neutral border border-light-primary rounded-xl p-4 flex justify-between items-center hover:bg-light-primary/50 transition-colors dark:bg-dark-primary dark:border-dark-primary/50 dark:hover:bg-dark-primary/80">
                            <p className="font-bold text-light-text dark:text-dark-secondary">{report.pet_name}</p>
                            {getStatusChip(report.report_status)}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-16 text-light-secondary/70 dark:text-dark-neutral/70">
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
                        <div key={`adoption-${adoption.id}`} className="bg-light-neutral border border-light-primary rounded-xl p-4 flex justify-between items-center hover:bg-light-primary/50 transition-colors dark:bg-dark-primary dark:border-dark-primary/50 dark:hover:bg-dark-primary/80">
                            <div>
                                <p className="font-bold text-light-text dark:text-dark-secondary">{adoption.pet_name}</p>
                                <p className="text-sm text-light-secondary dark:text-dark-neutral">Adoption/Claim Request</p>
                            </div>
                            {getStatusChip(adoption.status)}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-16 text-light-secondary/70 dark:text-dark-neutral/70">
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
                ? 'border-b-2 border-light-accent text-light-accent bg-light-accent/10 dark:border-dark-accent dark:text-dark-accent dark:bg-dark-accent/10'
                : 'border-b-2 border-transparent text-light-secondary hover:text-light-text hover:bg-light-primary/50 dark:text-dark-neutral dark:hover:text-dark-secondary dark:hover:bg-dark-primary/50'
            }`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-light-neutral dark:bg-dark-background rounded-2xl shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-light-primary dark:border-dark-primary flex justify-between items-center flex-shrink-0 bg-light-primary dark:bg-dark-primary rounded-t-2xl">
                    <h2 className="text-2xl font-bold text-light-text dark:text-dark-secondary">My Requests</h2>
                    <button onClick={onClose} className="p-2 rounded-full text-light-secondary hover:bg-light-primary transition-colors dark:text-dark-neutral dark:hover:bg-dark-primary/80"><X /></button>
                </div>

                <div className="flex-shrink-0 border-b border-light-primary dark:border-dark-primary px-6 bg-light-primary dark:bg-dark-primary">
                    <nav className="flex space-x-2">
                        <TabButton label="Lost Pets" icon={<Search className="w-4 h-4" />} isActive={activeTab === 'lost'} onClick={() => setActiveTab('lost')} />
                        <TabButton label="Found Pets" icon={<List className="w-4 h-4" />} isActive={activeTab === 'found'} onClick={() => setActiveTab('found')} />
                        <TabButton label="Adoptions" icon={<Heart className="w-4 h-4" />} isActive={activeTab === 'adoptions'} onClick={() => setActiveTab('adoptions')} />
                    </nav>
                </div>

                <div className="p-6 overflow-y-auto bg-light-neutral dark:bg-dark-background">
                    {renderContent()}
                </div>

                <div className="flex-shrink-0 p-4 border-t border-light-primary dark:border-dark-primary mt-auto flex justify-end bg-light-primary dark:bg-dark-primary rounded-b-2xl">
                    <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-light-text bg-light-primary/80 rounded-lg border border-light-secondary/30 hover:bg-light-primary transition-colors dark:text-dark-secondary dark:bg-dark-primary/80 dark:border-dark-primary/50 dark:hover:bg-dark-secondary/20">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserRequestsModal;