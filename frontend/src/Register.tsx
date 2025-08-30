import React, { useState } from 'react';
import { Eye, EyeOff, User, Mail, Lock, Shield, Phone, Home, MapPin, Image as ImageIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'ADMIN' | 'PET_OWNER' | 'PET_RESCUER' | 'PET_ADOPTER';
  gender?: string;
  phone?: string;
  address?: string;
  pincode?: string;
  profile_image?: File | null;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
  gender?: string;
  phone?: string;
  pincode?: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'PET_OWNER',
    gender: '',
    phone: '',
    address: '',
    pincode: '',
    profile_image: null
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.role) newErrors.role = 'Select a role';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (files) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name as keyof FormErrors]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!validateForm()) return;

  setLoading(true);
  setMessage(null);

  try {
    const dataToSend = new FormData();

    // Append other fields
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        // Role: send as array
        if (key === 'role') {
          dataToSend.append('role', value); // send as string, DRF SlugRelatedField will handle
        } else if (value instanceof File) {
          dataToSend.append(key, value); // file
        } else {
          dataToSend.append(key, String(value)); // string/number
        }
      }
    });

    const response = await fetch('http://127.0.0.1:8000/api/register/', {
      method: 'POST',
      body: dataToSend,
    });

    const data = await response.json();

    if (response.ok) {
      setMessage('Account created successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setMessage(data.detail || 'Registration failed');
    }
  } catch (err) {
    console.error(err);
    setMessage('Something went wrong. Please try again.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-600">Join Pet Rescue Pro today</p>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-lg text-center text-sm font-medium ${
            message.includes('successfully') 
              ? 'bg-green-50 text-green-600 border border-green-200' 
              : 'bg-red-50 text-red-600 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Existing fields (username, email, password, confirm password, role) remain SAME */}
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className="h-5 w-5 text-gray-400" /></div>
              <input type="text" id="username" name="username" value={formData.username} onChange={handleInputChange}
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${errors.username ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                placeholder="Enter your username" />
            </div>
            {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-gray-400" /></div>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange}
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                placeholder="Enter your email" />
            </div>
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div>
              <input type={showPassword ? 'text' : 'password'} id="password" name="password" value={formData.password} onChange={handleInputChange}
                className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                placeholder="Enter your password" />
              <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div>
              <input type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange}
                className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                placeholder="Confirm your password" />
              <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
          </div>

          {/* Role */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
  id="role"
  name="role"
  value={formData.role}
  onChange={handleInputChange}
  className={`block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${errors.role ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
>
  <option value="Admin">Admin</option>
  <option value="Pet Owner">Pet Owner</option>
  <option value="Pet Rescuer">Pet Rescuer</option>
  <option value="Pet Adopter">Pet Adopter</option>
</select>

            {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
          </div>
          {/* Gender */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <select id="gender" name="gender" value={formData.gender} onChange={handleInputChange}
              className="block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleInputChange}
                className="block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter your phone number" />
            </div>
          </div>

          {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <div className="relative flex items-center">
                <Home className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter your address"
                />
              </div>
            </div>
          {/* Pincode */}
          <div>
            <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input type="number" id="pincode" name="pincode" value={formData.pincode} onChange={handleInputChange}
                className="block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter your pincode" />
            </div>
          </div>

          {/* Profile Image */}
          <div>
            <label htmlFor="profile_image" className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
            <div className="flex items-center space-x-3">
              <ImageIcon className="h-5 w-5 text-gray-400" />
              <input type="file" id="profile_image" name="profile_image" accept="image/*" onChange={handleInputChange} />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">Already have an account?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

