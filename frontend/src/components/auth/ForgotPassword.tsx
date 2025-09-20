import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, KeyRound, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {step === 1 ? 'Forgot Password' : 'Reset Password'}
        </h2>

        {message && (
          <div className={`mb-4 p-3 rounded-xl text-center text-sm font-medium ${
            message.includes('✅')
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white/70 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </motion.button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                OTP Code
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  required
                  maxLength={6}
                  className="w-full pl-11 pr-4 py-3 bg-white/70 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter 6-digit OTP"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  name="new_password"
                  value={formData.new_password}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white/70 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter new password"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </motion.button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
