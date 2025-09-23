import React, { useEffect, useState } from 'react';
import { Award, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiService } from '../../services/api';
interface Reward {
  points: number;
  badge: string;
  reason: string;
  username: string;
  email: string;
}

const badgeColors: Record<string, string> = {
  Bronze: "from-orange-400 to-yellow-600 text-white shadow-orange-200",
  Silver: "from-gray-300 to-gray-500 text-gray-900 shadow-gray-200",
  Gold: "from-yellow-300 to-yellow-500 text-yellow-900 shadow-yellow-200",
  Platinum: "from-blue-200 to-indigo-400 text-indigo-900 shadow-indigo-200",
};

const MyRewards: React.FC = () => {
  const [reward, setReward] = useState<Reward | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const data = await apiService.getMyRewards();
        setReward(data);
      } catch (error) {
        console.error("Error fetching rewards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, []);

  if (loading) {
    return <p className="text-center mt-20 text-gray-600">Loading rewards...</p>;
  }

  if (!reward) {
    return <p className="text-center mt-20 text-red-500">No rewards found</p>;
  }

  const badgeStyle = badgeColors[reward.badge] || "from-gray-200 to-gray-400";

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-10 max-w-lg w-full border border-gray-100 text-center"
      >
        {/* Header Icon */}
        <motion.div
          whileHover={{ rotate: 10 }}
          className="flex justify-center mb-6"
        >
          <Award className="w-16 h-16 text-purple-600 drop-shadow-lg" />
        </motion.div>

        {/* Username */}
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {reward.username}'s Rewards
        </h2>
        <p className="text-gray-600 mb-6">{reward.email}</p>

        {/* Points Card */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl p-8 mb-6 shadow-xl">
          <h3 className="text-6xl font-extrabold tracking-tight">{reward.points}</h3>
          <p className="text-lg opacity-90">Reward Points</p>
        </div>

        {/* Badge */}
        <div className="mb-6">
          <span
            className={`inline-flex items-center gap-2 px-6 py-2 rounded-full font-semibold bg-gradient-to-r ${badgeStyle} shadow-md`}
          >
            <Star className="w-5 h-5" /> {reward.badge}
          </span>
        </div>

        {/* Reason */}
        <p className="text-gray-700 italic">Reason: {reward.reason}</p>
      </motion.div>
    </div>
  );
};

export default MyRewards;
