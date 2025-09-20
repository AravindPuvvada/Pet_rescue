import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Heart, ArrowRight, CheckCircle, Phone, MapPin, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
  pincode: string;
  gender: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  address?: string;
  pincode?: string;
  gender?: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    pincode: '',
    gender: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  // Pet reunion images for carousel
  const petImages = [
    {
      url: "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800",
      caption: "Max reunited with his family after 5 days"
    },
    {
      url: "https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=800",
      caption: "Luna found her way home through our community"
    },
    {
      url: "https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=800",
      caption: "Buddy's rescue story touched thousands of hearts"
    },
    {
      url: "https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg?auto=compress&cs=tinysrgb&w=800",
      caption: "Bella's journey from lost to loved"
    }
  ];

  // Auto-rotate images
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % petImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [petImages.length]);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^[0-9]{10}$/.test(phone);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (formData.pincode && (formData.pincode.length !== 6 || !/^[0-9]+$/.test(formData.pincode))) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setMessage(null);

    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        ...(formData.phone && { phone: formData.phone }),
        ...(formData.address && { address: formData.address }),
        ...(formData.pincode && { pincode: formData.pincode }),
        ...(formData.gender && { gender: formData.gender })
      };

      await apiService.register(userData);
      
      setMessage('Account created successfully! Please login to continue.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error: unknown) {
  console.error('Registration error:', error);

  if (error instanceof Error) {
    setMessage(error.message);
  } else {
    setMessage('Registration failed. Please try again.');
  }
}
 finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
  className="flex items-center justify-center min-h-screen bg-gray-50 px-6"
>
 <div
  className="w-[92%] max-w-5xl scale-95 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 flex overflow-hidden"
>

          {/* Left Side - Image Carousel */}
          <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden min-w-0">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-sky-500/20 z-10"></div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <img
                  src={petImages[currentImageIndex].url}
                  alt="Pet reunion story"
                  className="w-full h-full object-cover"  /* removed scale-95 to avoid overflow */
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </motion.div>
            </AnimatePresence>

            {/* Overlay Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
              <motion.div
                key={currentImageIndex}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="backdrop-blur-md bg-white/10 rounded-xl p-4 border border-white/20"
              >
                <div className="flex items-center mb-3">
                  <Heart className="w-4 h-4 text-orange-400 mr-2" />
                  <span className="text-white font-semibold text-sm">Success Story</span>
                </div>
                <p className="text-white text-sm font-medium leading-relaxed">
                  {petImages[currentImageIndex].caption}
                </p>
              </motion.div>
            </div>

            {/* Image Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
              {petImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentImageIndex 
                      ? 'bg-white w-6' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="w-full lg:w-1/2 p-4 lg:p-8 flex flex-col justify-center min-w-0">
            {/* Header */}
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-12 h-12 bg-gradient-to-r from-orange-500 to-sky-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg"
              >
                <Heart className="w-6 h-6 text-white" />
              </motion.div>
              
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2"
              >
                Create Your Account
              </motion.h1>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-gray-600 text-base"
              >
                Join PetRescue and help pets find their way home
              </motion.p>
            </div>

            {/* Success/Error Message */}
            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`mb-4 p-3 rounded-lg text-center font-medium backdrop-blur-sm border text-sm ${
                    message.includes('successfully')
                      ? 'bg-green-50/80 text-green-700 border-green-200'
                      : 'bg-red-50/80 text-red-700 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-center">
                    {message.includes('successfully') && (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    {message}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Registration Form */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="backdrop-blur-xl bg-white/70 rounded-2xl p-6 shadow-2xl border border-white/20 max-h-[450px] overflow-y-auto"
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username and Email - 2 columns on desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-700">
                      Username
                    </label>
                    <div className="relative group">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-orange-500 transition-colors" />
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-3 py-2.5 bg-white/50 backdrop-blur-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-300 placeholder-gray-400 text-sm ${
                          errors.username ? 'border-red-300 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        placeholder="Choose username"
                      />
                    </div>
                    {errors.username && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-600 text-xs"
                      >
                        {errors.username}
                      </motion.p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-700">
                      Email Address
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-orange-500 transition-colors" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-3 py-2.5 bg-white/50 backdrop-blur-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-300 placeholder-gray-400 text-sm ${
                          errors.email ? 'border-red-300 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        placeholder="Enter email address"
                      />
                    </div>
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-600 text-xs"
                      >
                        {errors.email}
                      </motion.p>
                    )}
                  </div>
                </div>

                {/* Password Fields - 2 columns on desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-700">
                      Password
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-orange-500 transition-colors" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-10 py-2.5 bg-white/50 backdrop-blur-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-300 placeholder-gray-400 text-sm ${
                          errors.password ? 'border-red-300 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        placeholder="Create password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-600 text-xs"
                      >
                        {errors.password}
                      </motion.p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-700">
                      Confirm Password
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-orange-500 transition-colors" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-10 py-2.5 bg-white/50 backdrop-blur-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-300 placeholder-gray-400 text-sm ${
                          errors.confirmPassword ? 'border-red-300 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        placeholder="Confirm password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-600 text-xs"
                      >
                        {errors.confirmPassword}
                      </motion.p>
                    )}
                  </div>
                </div>

                {/* Phone and Gender - 2 columns on desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-700">
                      Phone Number (Optional)
                    </label>
                    <div className="relative group">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-orange-500 transition-colors" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-3 py-2.5 bg-white/50 backdrop-blur-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-300 placeholder-gray-400 text-sm ${
                          errors.phone ? 'border-red-300 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        placeholder="Enter phone number"
                      />
                    </div>
                    {errors.phone && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-600 text-xs"
                      >
                        {errors.phone}
                      </motion.p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-700">
                      Gender (Optional)
                    </label>
                    <div className="relative group">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-orange-500 transition-colors" />
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-3 py-2.5 bg-white/50 backdrop-blur-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-300 text-sm ${
                          errors.gender ? 'border-red-300 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    {errors.gender && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-600 text-xs"
                      >
                        {errors.gender}
                      </motion.p>
                    )}
                  </div>
                </div>

                {/* Address - Full width */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-700">
                    Address (Optional)
                  </label>
                  <div className="relative group">
                    <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4 group-focus-within:text-orange-500 transition-colors" />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-3 py-2.5 bg-white/50 backdrop-blur-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-300 placeholder-gray-400 text-sm ${
                        errors.address ? 'border-red-300 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      placeholder="Enter your address"
                    />
                  </div>
                  {errors.address && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-600 text-xs"
                    >
                      {errors.address}
                    </motion.p>
                  )}
                </div>

                {/* Pincode - Single column */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-700">
                    Pincode (Optional)
                  </label>
                  <div className="relative group">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-orange-500 transition-colors" />
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-3 py-2.5 bg-white/50 backdrop-blur-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-300 placeholder-gray-400 text-sm ${
                        errors.pincode ? 'border-red-300 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      placeholder="Enter pincode"
                      maxLength={6}
                    />
                  </div>
                  {errors.pincode && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-600 text-xs"
                    >
                      {errors.pincode}
                    </motion.p>
                  )}
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-orange-500 to-sky-500 text-white py-3 px-4 rounded-xl font-semibold text-base hover:from-orange-600 hover:to-sky-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* Sign In Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-center mt-4"
            >
              <p className="text-gray-600 text-sm">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-orange-500 hover:text-orange-600 transition-colors text-sm"
                >
                  Sign In
                </Link>
              </p>
            </motion.div>
          </div>
              </div>
    </motion.div>
  );
};


export default Register;
