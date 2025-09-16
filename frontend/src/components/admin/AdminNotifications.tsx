import React, { useState, useEffect } from 'react';
import { Bell, User, Calendar, AlertCircle } from 'lucide-react';
import { apiService } from '../../services/api';

interface AdminNotification {
  notification_id: number;
  sender?: string;
  content: string;
  created_at: string;
  pet?: any;
  report?: any;
}

const AdminNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAdminNotifications();
      setNotifications(response.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (content: string) => {
    if (content.includes('lost')) return <AlertCircle className="w-5 h-5 text-red-500" />;
    if (content.includes('found')) return <AlertCircle className="w-5 h-5 text-green-500" />;
    if (content.includes('adoption')) return <User className="w-5 h-5 text-purple-500" />;
    return <Bell className="w-5 h-5 text-blue-500" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-2">System notifications and alerts</p>
        </div>
        <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-lg font-medium">
          Total: {notifications.length}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div key={notification.notification_id} className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {getNotificationIcon(notification.content)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-gray-900 font-medium">{notification.content}</p>
                  <span className="text-xs text-gray-500">
                    {new Date(notification.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                {notification.sender && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                    <User className="w-4 h-4" />
                    <span>From: {notification.sender}</span>
                  </div>
                )}
                
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(notification.created_at).toLocaleString()}</span>
                </div>

                {notification.pet && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-1">Related Pet:</h4>
                    <p className="text-sm text-gray-600">
                      {notification.pet.name} - {notification.pet.pet_type?.type || notification.pet.pet_type}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="text-center py-12">
          <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
          <p className="text-gray-600">System notifications will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;