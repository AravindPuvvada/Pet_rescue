import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';
import LoadingScreen from '../LoadingScreem';

const API_BASE_URL = "http://127.0.0.1:8000/api";

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false); // 🔹 For button spinner
  const [showPetLoader, setShowPetLoader] = useState(false); // ✅ For full screen loader
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setShowPetLoader(true); // ✅ Show full screen loader
    setMessage('');

    try {
      // 🔹 Step 1: Login
      const loginRes = await fetch(`${API_BASE_URL}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const loginData = await loginRes.json();
      if (!loginRes.ok) throw new Error(loginData.error || 'Login failed');

      // ✅ Save tokens
      localStorage.setItem('access_token', loginData.access);
      localStorage.setItem('refresh_token', loginData.refresh);

      console.log("Access Token Stored:", loginData.access);
      setMessage('Login successful!');

      // 🔹 Step 2: Fetch profile
      const profileRes = await fetch(`${API_BASE_URL}/profile_details/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${loginData.access}`,
        },
      });

      const profileData = await profileRes.json();
      if (!profileRes.ok) throw new Error(profileData.detail || 'Failed to fetch profile');

      // ✅ Navigate based on user type
      if (profileData.is_superuser) navigate('/admin-dashboard');
      else navigate('/mainpage');

    } catch (err: unknown) {
      if (err instanceof Error) setMessage(err.message);
      else setMessage('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
      setTimeout(() => setShowPetLoader(false), 1000); // ✅ Hide loader smoothly
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="min-h-screen bg-light-primary dark:bg-dark-background flex items-center justify-center p-4 theme-transition">
      {/* ✅ Full screen loader */}
      {showPetLoader && <LoadingScreen message="Logging you in..." />}

      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle variant="auth" />
      </div>

      {/* 🔹 Keep your teammate’s original design */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-6xl bg-light-neutral/80 dark:bg-dark-primary/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-light-secondary/20 dark:border-dark-secondary/20 overflow-hidden"
      >
        <div className="flex flex-col lg:flex-row min-h-[600px]">
          
          {/* Left Side - Illustration */}
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:w-1/2 bg-gradient-to-br from-light-accent via-light-secondary to-light-primary dark:from-dark-accent dark:via-dark-primary dark:to-dark-background p-8 flex flex-col justify-center items-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-black/5"></div>
            
            {/* Animated pet illustration placeholder */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative z-10 text-center"
            >
              <div className="w-32 h-32 bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-8 mx-auto border-4 border-white/30 dark:border-white/20">
                <Heart className="w-16 h-16 text-white" />
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                Welcome Back
              </h1>
              
              <p className="text-white/90 text-lg lg:text-xl font-medium mb-8 drop-shadow">
                Sign in to continue your rescue journey
              </p>

              <div className="bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30 dark:border-white/20">
                <div className="flex items-center justify-center mb-3">
                  <Heart className="w-6 h-6 text-white mr-2" />
                  <span className="text-white font-semibold text-lg">FurryFinder</span>
                </div>
                <p className="text-white/90 text-sm leading-relaxed">
                  Connect lost pets with loving families. Our platform helps coordinate rescue efforts, track adoptions, and build a community dedicated to animal welfare.
                </p>
                <div className="mt-4 flex items-center justify-center text-white/80">
                  <Heart className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">Every pet deserves a loving home</span>
                  <Heart className="w-4 h-4 ml-1" />
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-gradient-to-r from-light-accent to-light-secondary dark:from-dark-accent dark:to-dark-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl"
              >
                <Heart className="w-8 h-8 text-white" />
              </motion.div>
              
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-3xl font-bold text-light-text dark:text-dark-secondary mb-2"
              >
                Welcome Back
              </motion.h2>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="text-light-text/70 dark:text-dark-neutral"
              >
                Sign in to your FurryFinder account
              </motion.p>
            </div>

            {/* Success/Error Message */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-6 p-4 rounded-xl text-center font-medium border ${
                  message.includes('successful')
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-700'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-700'
                }`}
              >
                {message}
              </motion.div>
            )}

            {/* Login Form */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="bg-light-neutral/70 dark:bg-dark-primary/70 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-light-secondary/20 dark:border-dark-secondary/20"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
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
                      className={`w-full pl-11 pr-4 py-3 bg-white/70 dark:bg-dark-background/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent focus:border-transparent transition-all duration-300 text-light-text dark:text-dark-secondary placeholder-light-text/50 dark:placeholder-dark-neutral ${
                        errors.email ? 'border-red-300 dark:border-red-600' : 'border-light-secondary/30 dark:border-dark-secondary/30'
                      }`}
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  {errors.email && (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-light-text dark:text-dark-secondary mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text/50 dark:text-dark-neutral w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full pl-11 pr-12 py-3 bg-white/70 dark:bg-dark-background/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent focus:border-transparent transition-all duration-300 text-light-text dark:text-dark-secondary placeholder-light-text/50 dark:placeholder-dark-neutral ${
                        errors.password ? 'border-red-300 dark:border-red-600' : 'border-light-secondary/30 dark:border-dark-secondary/30'
                      }`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-light-text/50 dark:text-dark-neutral hover:text-light-text dark:hover:text-dark-secondary transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-right mt-2">
                    <Link
                      to="/forgot-password"
                      className="text-sm font-medium text-light-accent dark:text-dark-accent hover:opacity-80 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </p>

                  {errors.password && (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.password}</p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-light-accent dark:bg-dark-accent text-white py-3 px-6 rounded-xl font-semibold text-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-light-accent/50 dark:focus:ring-dark-accent/50 transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* Sign Up Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="text-center mt-6"
            >
              <p className="text-light-text/70 dark:text-dark-neutral mb-3">
                Don't have an account?
              </p>
              <Link
                to="/register"
                className="font-semibold text-light-accent dark:text-dark-accent hover:opacity-80 transition-colors text-lg underline underline-offset-4 decoration-2"
              >
                Sign up here
              </Link>
            </motion.div>

            {/* Demo credentials note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="text-center text-sm text-light-text/50 dark:text-dark-neutral mt-4"
            >
              Demo credentials: Use any email/password combination
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;


