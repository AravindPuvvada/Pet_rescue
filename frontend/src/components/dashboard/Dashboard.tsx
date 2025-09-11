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
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your pet rescue activities</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        <ActiveComponent />
      </div>
    </div>
  );
};

export default Dashboard;