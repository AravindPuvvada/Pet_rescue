import React, { useEffect, useState } from 'react';
import { Award, Star } from 'lucide-react';
import { apiService } from '../../services/api';

interface Reward {
  points: number;
  badge: string;
  reason: string;
  username: string;
  email: string;
}

const MyRewards: React.FC = () => {
  const [reward, setReward] = useState<Reward | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchRewards = async () => {
    try {
      const data = await apiService.getMyRewards(); // ✅ async call
      setReward(data); // ✅ inside, correct
    } catch (error) {
      console.error("Error fetching rewards:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchRewards(); // ✅ call the function
}, []);


  if (loading) {
    return <p className="text-center mt-20 text-gray-600">Loading rewards...</p>;
  }

  if (!reward) {
    return <p className="text-center mt-20 text-red-500">No rewards found</p>;
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-lg w-full border border-gray-200 text-center">
        <div className="flex justify-center mb-6">
          <Award className="w-16 h-16 text-purple-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{reward.username}'s Rewards</h2>
        <p className="text-gray-600 mb-6">{reward.email}</p>

        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl p-6 mb-6 shadow-lg">
          <h3 className="text-5xl font-extrabold">{reward.points}</h3>
          <p className="text-lg">Reward Points</p>
        </div>

        <div className="mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 font-semibold">
            <Star className="w-5 h-5" /> {reward.badge}
          </span>
        </div>

        <p className="text-gray-700 italic">Reason: {reward.reason}</p>
      </div>
    </div>
  );
};

export default MyRewards;
