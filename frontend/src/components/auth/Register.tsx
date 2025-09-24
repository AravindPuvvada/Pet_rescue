import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle,
  Phone,
  MapPin,
  Users,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from '../ThemeToggle';

const API_BASE_URL = "http://127.0.0.1:8000/api"; // change if different

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
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    pincode: "",
    gender: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  const petImages = [
    {
      url: "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800",
      caption: "Max reunited with his family after 5 days",
    },
    {
      url: "https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=800",
      caption: "Luna found her way home through our community",
    },
    {
      url: "https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=800",
      caption: "Buddy's rescue story touched thousands of hearts",
    },
    {
      url: "https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg?auto=compress&cs=tinysrgb&w=800",
      caption: "Bella's journey from lost to loved",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % petImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [petImages.length]);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^[0-9]{10}$/.test(phone);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Enter a valid email";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone";
    }
    if (
      formData.pincode &&
      (formData.pincode.length !== 6 || !/^[0-9]+$/.test(formData.pincode))
    ) {
      newErrors.pincode = "Enter a valid 6-digit pincode";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
        ...(formData.gender && { gender: formData.gender }),
      };

      const res = await fetch(`${API_BASE_URL}/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || err.error || "Registration failed");
      }

      setMessage("Verification code sent! Please verify your account.");
      localStorage.setItem("verifyData", JSON.stringify(userData));

      setTimeout(() => {
        navigate("/verify-account", { state: userData });
      }, 1200);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage(err.message);
      } else {
        setMessage("Registration failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light-primary dark:bg-dark-background flex items-center justify-center p-4 theme-transition">
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle variant="auth" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-6xl bg-light-neutral/90 dark:bg-dark-primary/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-light-secondary/20 dark:border-dark-secondary/20 overflow-hidden"
      >
        <div className="flex flex-col lg:flex-row min-h-[700px]">
          <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-light-accent dark:bg-dark-accent">
            <div className="absolute inset-0 bg-black/10 dark:bg-black/20 z-10"></div>
            
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
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
              <motion.div
                key={currentImageIndex}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="backdrop-blur-md bg-white/10 rounded-xl p-4 border border-white/20"
              >
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-2">🐕</span>
                  <span className="text-white font-semibold text-sm">Success Story</span>
                </div>
                <p className="text-white text-sm font-medium leading-relaxed">
                  {petImages[currentImageIndex].caption}
                </p>
              </motion.div>
            </div>

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

          <div className="w-full lg:w-1/2 p-6 lg:p-10 flex flex-col justify-center">
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-light-accent dark:bg-dark-accent rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl"
              >
                <span className="text-3xl">🐾</span>
              </motion.div>
              
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-3xl font-bold text-light-text dark:text-dark-secondary mb-2"
              >
                Create Your Account
              </motion.h1>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-light-text/70 dark:text-dark-neutral"
              >
                Join PetRescue and help pets find their way home
              </motion.p>
            </div>

            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`mb-4 p-3 rounded-lg text-center font-medium backdrop-blur-sm border text-sm ${
                    message.includes("Verification code sent")
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-700'
                      : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-700'
                  }`}
                >
                  <div className="flex items-center justify-center">
                    {message.includes('Verification code sent') && (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    {message}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="bg-light-neutral/70 dark:bg-dark-primary/70 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-light-secondary/20 dark:border-dark-secondary/20 max-h-[500px] overflow-y-auto"
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-light-text dark:text-dark-secondary mb-2">
                      Username
                    </label>
                    <div className="relative group">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text/50 dark:text-dark-neutral w-5 h-5 group-focus-within:text-light-accent dark:group-focus-within:text-dark-accent transition-colors" />
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className={`w-full pl-11 pr-4 py-3 bg-white/70 dark:bg-dark-background/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent focus:border-transparent transition-all duration-300 text-light-text dark:text-dark-secondary placeholder-light-text/50 dark:placeholder-dark-neutral ${
                          errors.username ? 'border-red-300 dark:border-red-600' : 'border-light-secondary/30 dark:border-dark-secondary/30'
                        }`}
                        placeholder="Choose username"
                      />
                    </div>
                    {errors.username && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-600 dark:text-red-400 text-sm mt-1"
                      >
                        {errors.username}
                      </motion.p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-light-text dark:text-dark-secondary mb-2">
                      Email Address
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text/50 dark:text-dark-neutral w-5 h-5 group-focus-within:text-light-accent dark:group-focus-within:text-dark-accent transition-colors" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full pl-11 pr-4 py-3 bg-white/70 dark:bg-dark-background/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent focus:border-transparent transition-all duration-300 text-light-text dark:text-dark-secondary placeholder-light-text/50 dark:placeholder-dark-neutral ${
                          errors.email ? 'border-red-300 dark:border-red-600' : 'border-light-secondary/30 dark:border-dark-secondary/30'
                        }`}
                        placeholder="Enter email address"
                      />
                    </div>
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-600 dark:text-red-400 text-sm mt-1"
                      >
                        {errors.email}
                      </motion.p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-light-text dark:text-dark-secondary mb-2">
                      Password
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text/50 dark:text-dark-neutral w-5 h-5 group-focus-within:text-light-accent dark:group-focus-within:text-dark-accent transition-colors" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full pl-11 pr-10 py-3 bg-white/70 dark:bg-dark-background/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent focus:border-transparent transition-all duration-300 text-light-text dark:text-dark-secondary placeholder-light-text/50 dark:placeholder-dark-neutral ${
                          errors.password ? 'border-red-300 dark:border-red-600' : 'border-light-secondary/30 dark:border-dark-secondary/30'
                        }`}
                        placeholder="Create password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-light-text/50 dark:text-dark-neutral hover:text-light-text dark:hover:text-dark-secondary transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-600 dark:text-red-400 text-sm mt-1"
                      >
                        {errors.password}
                      </motion.p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-light-text dark:text-dark-secondary mb-2">
                      Confirm Password
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text/50 dark:text-dark-neutral w-5 h-5 group-focus-within:text-light-accent dark:group-focus-within:text-dark-accent transition-colors" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`w-full pl-11 pr-10 py-3 bg-white/70 dark:bg-dark-background/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent focus:border-transparent transition-all duration-300 text-light-text dark:text-dark-secondary placeholder-light-text/50 dark:placeholder-dark-neutral ${
                          errors.confirmPassword ? 'border-red-300 dark:border-red-600' : 'border-light-secondary/30 dark:border-dark-secondary/30'
                        }`}
                        placeholder="Confirm password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-light-text/50 dark:text-dark-neutral hover:text-light-text dark:hover:text-dark-secondary transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-600 dark:text-red-400 text-sm mt-1"
                      >
                        {errors.confirmPassword}
                      </motion.p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-light-text dark:text-dark-secondary mb-2">
                      Phone (Optional)
                    </label>
                    <div className="relative group">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text/50 dark:text-dark-neutral w-5 h-5 group-focus-within:text-light-accent dark:group-focus-within:text-dark-accent transition-colors" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full pl-11 pr-4 py-3 bg-white/70 dark:bg-dark-background/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent focus:border-transparent transition-all duration-300 text-light-text dark:text-dark-secondary placeholder-light-text/50 dark:placeholder-dark-neutral ${
                          errors.phone ? 'border-red-300 dark:border-red-600' : 'border-light-secondary/30 dark:border-dark-secondary/30'
                        }`}
                        placeholder="Enter phone"
                      />
                    </div>
                    {errors.phone && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-600 dark:text-red-400 text-sm mt-1"
                      >
                        {errors.phone}
                      </motion.p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-light-text dark:text-dark-secondary mb-2">
                      Gender (Optional)
                    </label>
                    <div className="relative group">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text/50 dark:text-dark-neutral w-5 h-5 group-focus-within:text-light-accent dark:group-focus-within:text-dark-accent transition-colors" />
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className={`w-full pl-11 pr-4 py-3 bg-white/70 dark:bg-dark-background/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent focus:border-transparent transition-all duration-300 text-light-text dark:text-dark-secondary ${
                          errors.gender ? 'border-red-300 dark:border-red-600' : 'border-light-secondary/30 dark:border-dark-secondary/30'
                        }`}
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-light-text dark:text-dark-secondary mb-2">
                    Address (Optional)
                  </label>
                  <div className="relative group">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text/50 dark:text-dark-neutral w-5 h-5 group-focus-within:text-light-accent dark:group-focus-within:text-dark-accent transition-colors" />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`w-full pl-11 pr-4 py-3 bg-white/70 dark:bg-dark-background/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent focus:border-transparent transition-all duration-300 text-light-text dark:text-dark-secondary placeholder-light-text/50 dark:placeholder-dark-neutral ${
                        errors.address ? 'border-red-300 dark:border-red-600' : 'border-light-secondary/30 dark:border-dark-secondary/30'
                      }`}
                      placeholder="Enter address"
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-light-text dark:text-dark-secondary mb-2">
                    Pincode (Optional)
                  </label>
                  <div className="relative group">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text/50 dark:text-dark-neutral w-5 h-5 group-focus-within:text-light-accent dark:group-focus-within:text-dark-accent transition-colors" />
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className={`w-full pl-11 pr-4 py-3 bg-white/70 dark:bg-dark-background/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent focus:border-transparent transition-all duration-300 text-light-text dark:text-dark-secondary placeholder-light-text/50 dark:placeholder-dark-neutral ${
                        errors.pincode ? 'border-red-300 dark:border-red-600' : 'border-light-secondary/30 dark:border-dark-secondary/30'
                      }`}
                      placeholder="Enter pincode"
                      maxLength={6}
                    />
                  </div>
                   {errors.pincode && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-600 dark:text-red-400 text-sm mt-1"
                      >
                        {errors.pincode}
                      </motion.p>
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
                      <span>Create Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-center mt-4"
            >
              <p className="text-light-text/70 dark:text-dark-neutral text-sm mb-3">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-light-accent dark:text-dark-accent hover:opacity-80 transition-colors underline underline-offset-4"
                >
                  Sign In
                </Link>
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;