// import React, { useEffect, useState } from 'react';
// import { Award, Star } from 'lucide-react';
// import { motion } from 'framer-motion';
// import { apiService } from '../../services/api';
// interface Reward {
//   points: number;
//   badge: string;
//   reason: string;
//   username: string;
//   email: string;
// }

// const badgeColors: Record<string, string> = {
//   Bronze: "from-orange-400 to-yellow-600 text-white shadow-orange-200",
//   Silver: "from-gray-300 to-gray-500 text-gray-900 shadow-gray-200",
//   Gold: "from-yellow-300 to-yellow-500 text-yellow-900 shadow-yellow-200",
//   Platinum: "from-blue-200 to-indigo-400 text-indigo-900 shadow-indigo-200",
// };

// const MyRewards: React.FC = () => {
//   const [reward, setReward] = useState<Reward | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchRewards = async () => {
//       try {
//         const data = await apiService.getMyRewards();
//         setReward(data);
//       } catch (error) {
//         console.error("Error fetching rewards:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRewards();
//   }, []);

//   if (loading) {
//     return <p className="text-center mt-20 text-gray-600">Loading rewards...</p>;
//   }

//   if (!reward) {
//     return <p className="text-center mt-20 text-red-500">No rewards found</p>;
//   }

//   const badgeStyle = badgeColors[reward.badge] || "from-gray-200 to-gray-400";

//   return (
//     <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.6 }}
//         className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-10 max-w-lg w-full border border-gray-100 text-center"
//       >
//         {/* Header Icon */}
//         <motion.div
//           whileHover={{ rotate: 10 }}
//           className="flex justify-center mb-6"
//         >
//           <Award className="w-16 h-16 text-purple-600 drop-shadow-lg" />
//         </motion.div>

//         {/* Username */}
//         <h2 className="text-3xl font-bold text-gray-900 mb-2">
//           {reward.username}'s Rewards
//         </h2>
//         <p className="text-gray-600 mb-6">{reward.email}</p>

//         {/* Points Card */}
//         <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl p-8 mb-6 shadow-xl">
//           <h3 className="text-6xl font-extrabold tracking-tight">{reward.points}</h3>
//           <p className="text-lg opacity-90">Reward Points</p>
//         </div>

//         {/* Badge */}
//         <div className="mb-6">
//           <span
//             className={`inline-flex items-center gap-2 px-6 py-2 rounded-full font-semibold bg-gradient-to-r ${badgeStyle} shadow-md`}
//           >
//             <Star className="w-5 h-5" /> {reward.badge}
//           </span>
//         </div>

//         {/* Reason */}
//         <p className="text-gray-700 italic">Reason: {reward.reason}</p>
//       </motion.div>
//     </div>
//   );
// };

// export default MyRewards;

import React, { useEffect, useState } from "react";
import { Award, Star, Medal, Crown, Gem } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiService } from "../../services/api";

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
  const [showCongrats, setShowCongrats] = useState(false);
  const [prevPoints, setPrevPoints] = useState<number | null>(null);

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

  // Show congratulations ONLY when points increase
  useEffect(() => {
    if (reward?.points !== undefined && prevPoints !== null) {
      if (reward.points > prevPoints) {
        setShowCongrats(true);
        const timer = setTimeout(() => setShowCongrats(false), 3000);
        return () => clearTimeout(timer);
      }
    }
    setPrevPoints(reward?.points ?? null);
  }, [reward?.points]);

  if (loading) {
    return (
      <p className="text-center mt-20 text-gray-600 animate-pulse">
        Loading rewards...
      </p>
    );
  }

  if (!reward) {
    return (
      <p className="text-center mt-20 text-red-500">No rewards found</p>
    );
  }

  const badgeStyle = badgeColors[reward.badge] || "from-gray-200 to-gray-400";

  return (
    <div className="relative min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 overflow-hidden">
      {/* Animated Background Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-10 max-w-xl w-full border border-gray-100 text-center"
      >
        {/* Heading */}
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent drop-shadow-lg mb-10"
        >
          ✨ Your Rewards ✨
        </motion.h1>

        {/* Header Icon */}
        <motion.div
          whileHover={{ rotate: 10, scale: 1.1 }}
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
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl p-8 mb-8 shadow-xl"
        >
          <h3 className="text-6xl font-extrabold tracking-tight">
            {reward.points}
          </h3>
          <p className="text-lg opacity-90">Reward Points</p>
        </motion.div>

        {/* Progress Timeline with Line and Icons */}
        <div className="relative w-full max-w-md mx-auto mb-10">
          {/* Full line (background) */}
          <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 rounded-full"></div>

          {/* Progress line (filled) */}
          <div
            className="absolute top-6 left-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-700"
            style={{
              width:
                reward.badge === "Bronze"
                  ? "0%"
                  : reward.badge === "Silver"
                  ? "33%"
                  : reward.badge === "Gold"
                  ? "66%"
                  : "100%",
            }}
          ></div>

          {/* Badges */}
          <div className="relative flex justify-between items-center">
            {[
              { tier: "Bronze", icon: Award },
              { tier: "Silver", icon: Medal },
              { tier: "Gold", icon: Crown },
              { tier: "Platinum", icon: Gem },
            ].map(({ tier, icon: Icon }) => {
              const order = ["Bronze", "Silver", "Gold", "Platinum"];
              const currentIndex = order.indexOf(reward.badge);
              const tierIndex = order.indexOf(tier);

              const isCompleted = tierIndex <= currentIndex;
              const isCurrent = tier === reward.badge;

              return (
                <div key={tier} className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 flex items-center justify-center rounded-full border-4 transition-all duration-500 shadow-md
                      ${
                        isCompleted
                          ? "bg-gradient-to-r " +
                            badgeColors[tier] +
                            " border-purple-500"
                          : "bg-gray-200 text-gray-500 border-gray-300"
                      }
                      ${isCurrent ? "scale-125 animate-pulse" : isCompleted ? "scale-105" : ""}
                    `}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium ${
                      isCompleted ? "text-purple-600 font-semibold" : "text-gray-500"
                    }`}
                  >
                    {tier}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Badge */}
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

      {/* Congrats Animation */}
      <AnimatePresence>
        {showCongrats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1.2 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="text-6xl font-extrabold bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent drop-shadow-xl"
            >
              🎉 Celebration! 🎉
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyRewards;
