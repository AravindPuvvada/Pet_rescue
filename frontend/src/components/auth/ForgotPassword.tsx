import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, KeyRound, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle';

const API_BASE_URL = "http://127.0.0.1:8000/api";

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({ email: '', otp: '', new_password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${API_BASE_URL}/password-reset-request/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP');
      setMessage('✅ OTP sent to your email!');
      setStep(2);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage(err.message);
      } else {
        setMessage('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${API_BASE_URL}/password-reset-confirm/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
          new_password: formData.new_password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reset password');
      setMessage('✅ Password reset successful! Redirecting...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage(err.message);
      } else {
        setMessage('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light-primary dark:bg-dark-background flex items-center justify-center p-4 theme-transition">
      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle variant="auth" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-light-neutral/90 dark:bg-dark-primary/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-light-secondary/20 dark:border-dark-secondary/20 p-8"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-light-accent dark:bg-dark-accent rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <span className="text-3xl">🔐</span>
          </div>
          <h2 className="text-2xl font-bold text-light-text dark:text-dark-secondary mb-2">
            {step === 1 ? 'Forgot Password' : 'Reset Password'}
          </h2>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-xl text-center text-sm font-medium border ${
            message.includes('✅')
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-700'
              : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-700'
          }`}>
            {message}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-light-text dark:text-dark-secondary mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text/50 dark:text-dark-neutral w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white/70 dark:bg-dark-background/50 border border-light-secondary/30 dark:border-dark-secondary/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent focus:border-transparent transition-all duration-300 text-light-text dark:text-dark-secondary placeholder-light-text/50 dark:placeholder-dark-neutral"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-light-accent dark:bg-dark-accent text-white py-3 px-6 rounded-xl font-semibold text-lg hover:opacity-90 transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Send OTP</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-light-text dark:text-dark-secondary mb-2">
                OTP Code
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text/50 dark:text-dark-neutral w-5 h-5" />
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  required
                  maxLength={6}
                  className="w-full pl-11 pr-4 py-3 bg-white/70 dark:bg-dark-background/50 border border-light-secondary/30 dark:border-dark-secondary/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent focus:border-transparent transition-all duration-300 text-light-text dark:text-dark-secondary placeholder-light-text/50 dark:placeholder-dark-neutral"
                  placeholder="Enter 6-digit OTP"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-light-text dark:text-dark-secondary mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text/50 dark:text-dark-neutral w-5 h-5" />
                <input
                  type="password"
                  name="new_password"
                  value={formData.new_password}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white/70 dark:bg-dark-background/50 border border-light-secondary/30 dark:border-dark-secondary/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent focus:border-transparent transition-all duration-300 text-light-text dark:text-dark-secondary placeholder-light-text/50 dark:placeholder-dark-neutral"
                  placeholder="Enter new password"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-light-accent dark:bg-dark-accent text-white py-3 px-6 rounded-xl font-semibold text-lg hover:opacity-90 transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Reset Password</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;