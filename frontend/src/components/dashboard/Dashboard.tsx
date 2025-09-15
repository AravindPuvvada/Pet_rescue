import React, { useState } from 'react';
import PetOwnerPage from './PetOwnerPage';
import PetRescuerPage from './PetRescuerPage';
import PetAdopterPage from './PetAdopterPage';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pet-owner');

  const tabs = [
    { id: 'pet-owner', label: 'Pet Owner', component: PetOwnerPage },
    { id: 'pet-rescuer', label: 'Pet Rescuer', component: PetRescuerPage },
    { id: 'pet-adopter', label: 'Pet Adopter', component: PetAdopterPage },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || PetOwnerPage;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-600 mt-3 text-lg">Manage your pet rescue activities with ease</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20">
            <nav className="flex space-x-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-4 px-6 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          <div className="p-6">
            <ActiveComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;