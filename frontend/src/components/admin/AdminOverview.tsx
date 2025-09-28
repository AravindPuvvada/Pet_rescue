import React, { useState, useEffect } from 'react';
import { Users, Heart, AlertCircle, Search, UserPlus, CheckCircle } from 'lucide-react';
import { apiService } from '../../services/api';

interface Stats {
  totalUsers: number;
  totalPets: number;
  lostRequests: number;
  foundRequests: number;
  adoptRequests: number;
  resolvedCases: number;
}

const AdminOverview: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalPets: 0,
    lostRequests: 0,
    foundRequests: 0,
    adoptRequests: 0,
    resolvedCases: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      // Fetch various stats from different endpoints
      const [users, pets, reports, adoptions] = await Promise.all([
        apiService.getProfiles(),
        apiService.getPets(),
        apiService.getPetReports(),
        apiService.getPetAdoptions(),
      ]);

      const lostReports = reports.filter(r => r.pet_status === 'Lost');
      const foundReports = reports.filter(r => r.pet_status === 'Found');
      const resolvedReports = reports.filter(r => r.is_resolved);

      setStats({
        totalUsers: users.length,
        totalPets: pets.length,
        lostRequests: lostReports.length,
        foundRequests: foundReports.length,
        adoptRequests: adoptions.length,
        resolvedCases: resolvedReports.length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Pets',
      value: stats.totalPets,
      icon: Heart,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600'
    },
    {
      title: 'Lost Requests',
      value: stats.lostRequests,
      icon: AlertCircle,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      title: 'Found Requests',
      value: stats.foundRequests,
      icon: Search,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    {
      title: 'Adopt Requests',
      value: stats.adoptRequests,
      icon: UserPlus,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Resolved Cases',
      value: stats.resolvedCases,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
  ];
  // const themeBgClass = theme === 'light' ? 'bg-[#E8E0D3] text-black' : 'bg-gray-900 text-gray-100';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 min-h-screen p-6 bg-[#E8E0D3] bg-[#E8E0D3] text-black text-black dark:text-white">
  {/* Header */}
  <div>
    <h1 className="text-3xl font-bold text-[#5B4438] dark:text-gray-800">
      Admin Overview
    </h1>
    <p className="mt-2 text-black dark:text-gray-500">
      Monitor and manage your pet rescue platform
    </p>
  </div>

  {/* Stats Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {statCards.map((card, index) => {
      const Icon = card.icon;
      return (
        <div
          key={index}
          className="bg-[#F5EFE6] dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-[#5B4438]/20 dark:border-gray-700 hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#5B4438] dark:text-white mb-1">{card.title}</p>
              <p className="text-3xl font-bold text-[#5B4438] dark:text-yellow-300">{card.value}</p>
            </div>
            <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}>
              <Icon className={`w-6 h-6 ${card.textColor}`} />
            </div>
          </div>
        </div>
      );
    })}
  </div>

  {/* Recent Activity */}
  <div className="bg-[#F5EFE6] dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-[#5B4438]/20 dark:border-gray-700">
    <h2 className="text-xl font-semibold text-[#5B4438] dark:text-white mb-4">Platform Health</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <h3 className="font-medium text-[#5B4438] dark:text-white">Success Rate</h3>
        <div className="w-full bg-[#D8CFC0] dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" 
            style={{ width: `${stats.resolvedCases > 0 ? (stats.resolvedCases / (stats.lostRequests + stats.foundRequests)) * 100 : 0}%` }}
          ></div>
        </div>
        <p className="text-sm text-black dark:text-gray-300">{stats.resolvedCases} cases resolved</p>
      </div>
      <div className="space-y-3">
        <h3 className="font-medium text-[#5B4438] dark:text-white">Platform Activity</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-black dark:text-gray-300">Active</span>
          </div>
          <div className="text-sm text-black dark:text-gray-300">{stats.totalUsers} registered users</div>
        </div>
      </div>
    </div>
  </div>
</div>

  );
};

export default AdminOverview;