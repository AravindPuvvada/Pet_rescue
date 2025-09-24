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

// Updated badge colors to include dark mode classes
const badgeColors: Record<string, string> = {
  Bronze: "from-orange-400 to-yellow-600 text-white shadow-orange-200 dark:from-amber-700 dark:to-orange-800 dark:text-orange-100",
  Silver: "from-gray-300 to-gray-500 text-gray-900 shadow-gray-200 dark:from-slate-400 dark:to-slate-600 dark:text-slate-900",
  Gold: "from-yellow-300 to-yellow-500 text-yellow-900 shadow-yellow-200 dark:from-yellow-500 dark:to-amber-600 dark:text-amber-900",
  Platinum: "from-blue-200 to-indigo-400 text-indigo-900 shadow-indigo-200 dark:from-sky-300 dark:to-indigo-500 dark:text-indigo-900",
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

  useEffect(() => {
    if (reward?.points !== undefined && prevPoints !== null) {
      if (reward.points > prevPoints) {
        setShowCongrats(true);
        const timer = setTimeout(() => setShowCongrats(false), 3000);
        return () => clearTimeout(timer);
      }
    }
    setPrevPoints(reward?.points ?? null);
  }, [reward?.points, prevPoints]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-light-primary dark:bg-dark-background">
        <p className="text-center text-lg text-light-text dark:text-dark-neutral animate-pulse">
          Loading rewards...
        </p>
      </div>
    );
  }

  if (!reward) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-light-primary dark:bg-dark-background">
        <p className="text-center text-lg text-red-500 dark:text-red-400">No rewards found. Keep helping pets to earn points!</p>
      </div>
    );
  }

  const badgeStyle = badgeColors[reward.badge] || "from-gray-200 to-gray-400 dark:from-gray-600 dark:to-gray-800";

  return (
    <div className="relative min-h-screen flex justify-center items-center bg-light-primary dark:bg-dark-background px-4 overflow-hidden theme-transition">
      {/* Animated Background Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-light-accent/30 dark:bg-dark-accent/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-50 animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-light-secondary/30 dark:bg-dark-secondary/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-50 animate-pulse" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative bg-light-neutral/70 dark:bg-dark-primary/70 backdrop-blur-xl rounded-3xl shadow-2xl p-10 max-w-xl w-full border border-light-secondary/20 dark:border-dark-secondary/20 text-center"
      >
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-5xl font-extrabold bg-gradient-to-r from-light-secondary to-light-accent dark:from-dark-secondary dark:to-dark-accent bg-clip-text text-transparent drop-shadow-lg mb-10"
        >
          ✨ Your Rewards ✨
        </motion.h1>

        <motion.div
          whileHover={{ rotate: 10, scale: 1.1 }}
          className="flex justify-center mb-6"
        >
          <Award className="w-16 h-16 text-light-accent dark:text-dark-accent drop-shadow-lg" />
        </motion.div>

        <h2 className="text-3xl font-bold text-light-text dark:text-dark-secondary mb-2">
          {reward.username}'s Rewards
        </h2>
        <p className="text-light-text/70 dark:text-dark-neutral mb-6">{reward.email}</p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-light-secondary to-light-accent dark:from-dark-primary dark:to-dark-accent text-white rounded-2xl p-8 mb-8 shadow-xl"
        >
          <h3 className="text-6xl font-extrabold tracking-tight">
            {reward.points}
          </h3>
          <p className="text-lg opacity-90 dark:text-dark-secondary">Reward Points</p>
        </motion.div>

        <div className="relative w-full max-w-md mx-auto mb-10">
          <div className="absolute top-6 left-0 right-0 h-1 bg-light-primary dark:bg-dark-primary rounded-full"></div>
          <div
            className="absolute top-6 left-0 h-1 bg-gradient-to-r from-light-accent to-light-secondary dark:from-dark-accent dark:to-dark-secondary rounded-full transition-all duration-700"
            style={{
              width:
                reward.badge === "Bronze" ? "0%" :
                reward.badge === "Silver" ? "33%" :
                reward.badge === "Gold" ? "66%" : "100%",
            }}
          ></div>
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
                      ${isCompleted ? "bg-gradient-to-r " + badgeColors[tier] + " border-light-accent dark:border-dark-accent" : "bg-light-primary dark:bg-dark-primary text-light-text/50 dark:text-dark-neutral border-light-secondary/20 dark:border-dark-secondary/30"}
                      ${isCurrent ? "scale-125 animate-pulse" : isCompleted ? "scale-105" : ""}
                    `}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium ${isCompleted ? "text-light-accent dark:text-dark-accent font-semibold" : "text-light-text/60 dark:text-dark-neutral"}`}
                  >
                    {tier}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-6">
          <span
            className={`inline-flex items-center gap-2 px-6 py-2 rounded-full font-semibold bg-gradient-to-r ${badgeStyle} shadow-md`}
          >
            <Star className="w-5 h-5" /> {reward.badge}
          </span>
        </div>

        <p className="text-light-text/80 dark:text-dark-neutral italic">Reason: {reward.reason}</p>
      </motion.div>

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
              className="text-6xl font-extrabold bg-gradient-to-r from-yellow-400 to-red-500 dark:from-yellow-300 dark:to-red-400 bg-clip-text text-transparent drop-shadow-xl"
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