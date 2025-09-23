// File: src/components/LoadingScreen.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'Loading...' }) => {
  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[2000] flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        aria-hidden
        initial={{ scale: 0.9 }}
        animate={{ y: [0, -14, 0], scale: [1, 1.03, 1] }}
        transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
        className="flex flex-col items-center justify-center"
      >
        <div className="relative rounded-2xl shadow-2xl p-4 bg-white/10 backdrop-blur-md">
          {/* subtle glow ring behind the dog */}
          <div className="absolute -inset-6 rounded-3xl blur-3xl opacity-30 bg-gradient-to-br from-orange-400 to-red-400"></div>

          <img
            src="/fdog.gif"
            alt="Loading dog"
            className="w-56 h-56 md:w-72 md:h-72 object-contain rounded-xl shadow-lg relative z-10"
          />
        </div>

        <motion.p
          initial={{ y: 6, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="mt-6 text-lg font-semibold text-white text-center drop-shadow-lg"
        >
          {message}
        </motion.p>

        <div className="mt-3 flex items-center gap-2">
          <div className="h-2 w-24 rounded-full bg-white/20 animate-pulse" />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoadingScreen;
