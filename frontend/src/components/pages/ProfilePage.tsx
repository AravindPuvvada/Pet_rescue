// Enhanced ProfilePage.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Save,
  X,
  LogOut,
  Trash2,
  Camera,
  Settings,
  Lock,
  Eye,
  EyeOff,
  Shield,
  CheckCircle,
  AlertCircle,
  Bell,
  Star,
  Calendar,
  Badge
} from 'lucide-react';
import { apiService } from '../../services/api';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  phone?: string;
  address?: string;
  pincode?: string;
  gender?: string;
  profile_image?: string;
}

interface ProfilePageProps {
  onLogout: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onLogout }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Settings dashboard state
  const [settingsTab, setSettingsTab] = useState<'account' | 'profile' | 'preferences'>('account');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Password change state
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    address: '',
    pincode: '',
    gender: '',
  });

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lock page scroll when modal is open and cleanup
  useEffect(() => {
    document.body.style.overflow = showSettingsModal ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [showSettingsModal]);

  // Close modal on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showSettingsModal) {
        resetSettingsModal();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showSettingsModal]);

  const fetchProfile = async () => {
    try {
      const data: any = await apiService.getProfile();
      console.log("Profile API response:", data); // 🔍 debug actual backend fields

      setProfile({
        id: data.id,
        username: data.username || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        pincode: data.pincode || '',
        gender: data.gender || '',
        profile_image: data.profile_image || null,
      });

      setFormData({
        username: data.username || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        pincode: data.pincode || '',
        gender: data.gender || '',
      });

      // Keep imagePreview in sync with backend image (if any)
      setImagePreview(data.profile_image || null);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      alert(error.detail || error.message || 'Failed to load profile');
    }
  };

  // Password validation function
  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push('Password must contain at least one special character (@$!%*?&)');
    }
    return errors;
  };

  // Calculate password strength
  const getPasswordStrength = (password: string) => {
    const errors = validatePassword(password);
    if (password.length === 0) return { strength: 0, label: '', color: 'bg-gray-200 dark:bg-dark-primary/50' };
    if (errors.length >= 4) return { strength: 25, label: 'Weak', color: 'bg-red-500' };
    if (errors.length >= 2) return { strength: 50, label: 'Fair', color: 'bg-orange-500' };
    if (errors.length === 1) return { strength: 75, label: 'Good', color: 'bg-yellow-500' };
    return { strength: 100, label: 'Strong', color: 'bg-green-500' };
  };

  // handleChange for profile inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // NOTE: we intentionally do NOT change backend here; formData.gender is used by the UI to reflect avatar live while editing.
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));

    if (passwordErrors.length > 0) {
      setPasswordErrors([]);
    }
  };

  const handleChangePassword = async () => {
    // Validate form
    const errors: string[] = [];
    if (!passwordData.current_password) {
      errors.push('Current password is required');
    }
    if (!passwordData.new_password) {
      errors.push('New password is required');
    }
    if (!passwordData.confirm_password) {
      errors.push('Password confirmation is required');
    }
    if (passwordData.new_password !== passwordData.confirm_password) {
      errors.push('New passwords do not match');
    }
    if (passwordData.current_password === passwordData.new_password) {
      errors.push('New password must be different from current password');
    }

    // Validate new password strength
    const strengthErrors = validatePassword(passwordData.new_password);
    errors.push(...strengthErrors);

    if (errors.length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setPasswordLoading(true);
    try {
      // ✅ Map frontend fields → backend fields
      await apiService.change_Password({
        old_password: passwordData.current_password,
        new_password: passwordData.new_password,
      });

      alert('Password changed successfully!');
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
      setShowSettingsModal(false);
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordErrors([error instanceof Error ? error.message : 'Failed to change password']);
    } finally {
      setPasswordLoading(false);
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB.');
        return;
      }

      setSelectedImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    // When user removes selected image, fall back to backend profile image OR avatar by gender (UI handles this)
    setImagePreview(profile?.profile_image || null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

const handleSave = async () => {
  if (!profile) return;
  setLoading(true);
  try {
    if (selectedImage) {
      // ✅ Case 1: User uploaded a real file
      const formDataWithImage = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          if (key === 'gender') {
            formDataWithImage.append(key, value); // normalize gender
          } else {
            formDataWithImage.append(key, value);
          }
        }
      });

      formDataWithImage.append('profile_image', selectedImage);

      const updatedProfile = await apiService.updateProfileWithImage(
        profile.id,
        formDataWithImage
      );

      setProfile(updatedProfile);

      apiService.updateCurrentAccountProfile({
        username: updatedProfile.username,
        email: updatedProfile.email,
        profile_image: updatedProfile.profile_image, // ✅ only real image
      });
    } else {
      // ✅ Case 2: No file uploaded → don’t send profile_image at all
      const cleanFormData: any = {};
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (key === 'gender') {
            cleanFormData[key] = value
          } else {
            cleanFormData[key] = value;
          }
        }
      });

      await apiService.updateProfile(profile.id, cleanFormData);

      setProfile((prev) =>
        prev ? { ...prev, ...cleanFormData } : null
      );

      apiService.updateCurrentAccountProfile({
        username: cleanFormData.username || profile.username,
        email: cleanFormData.email || profile.email,
        // ❌ don't include profile_image when no upload
      });
    }

    setIsEditing(false);
    setSelectedImage(null);
    setImagePreview(null);
    alert('Profile updated successfully!');

    await fetchProfile(); // refresh
} catch (error: any) {
  console.error('Full error object:', error);

  try {
    alert(JSON.stringify(error, Object.getOwnPropertyNames(error)));
  } catch (e) {
    alert('Error updating profile, could not stringify error');
  }
} finally {
  setLoading(false);
}


};


  const handleCancel = () => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
        pincode: profile.pincode || '',
        gender: profile.gender || '',
      });
    }
    setIsEditing(false);
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLogout = () => {
    onLogout();
    setShowSettingsModal(false);
  };

  const handleDeleteAccount = async () => {
    if (!profile) return;
    try {
      await apiService.deleteProfile(profile.id);
      alert('Your account has been deleted.');
      onLogout();
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Error deleting account. Please try again.');
    }
  };

  const resetSettingsModal = () => {
    setShowSettingsModal(false);
    setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
    setPasswordErrors([]);
    setShowPasswords({ current: false, new: false, confirm: false });
    setSettingsTab('account');
    setConfirmDelete(false);
    setConfirmLogout(false);
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:bg-dark-background flex items-center justify-center">
        <div className="bg-white dark:bg-dark-primary rounded-2xl shadow-xl p-8 flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 dark:border-dark-secondary border-t-transparent mb-4"></div>
          <p className="text-gray-600 dark:text-dark-neutral font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const passwordStrength = getPasswordStrength(passwordData.new_password);

  // AVATAR: determine which gender to use for avatar display
  // If editing => use formData.gender so avatar updates live while user selects gender
  // If not editing => use profile.gender fetched from backend
  const effectiveGender = isEditing ? formData.gender : profile.gender;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:bg-dark-background">
      {/* Enhanced Header with Gradient Background */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 dark:from-dark-primary dark:to-dark-background pt-20 pb-32 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white dark:bg-dark-secondary opacity-10 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white dark:bg-dark-secondary opacity-10 rounded-full translate-y-36 -translate-x-36"></div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header Content */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-2">
                <Badge className="w-8 h-8" />
                <h1 className="text-4xl font-bold tracking-tight">Profile</h1>
              </div>
              <p className="text-white/80 text-lg">Manage your account information and preferences</p>
            </div>
            
            {/* Action Buttons */}
            {!isEditing && (
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowSettingsModal(true)}
                  className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-200 border border-white/20 shadow-lg"
                >
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">Settings</span>
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 bg-white text-purple-600 px-6 py-3 rounded-xl hover:bg-white/90 dark:bg-dark-secondary dark:text-dark-background dark:hover:bg-dark-secondary/90 transition-all duration-200 shadow-lg font-medium"
                >
                  <Edit2 className="w-5 h-5" />
                  <span>Edit Profile</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        {/* Enhanced Profile Card */}
        <div className="bg-white dark:bg-dark-primary rounded-3xl shadow-2xl border border-gray-100 dark:border-dark-primary/50 overflow-hidden">
          {/* Profile Header Section */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-dark-background dark:to-dark-primary p-8 border-b border-gray-100 dark:border-dark-primary/50">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-8">
              {/* Enhanced Profile Image */}
              <div className="relative group">
                <div
                  className={`w-32 h-32 rounded-3xl overflow-hidden shadow-xl ring-4 ring-white dark:ring-dark-primary ${
                    isEditing ? 'cursor-pointer transform hover:scale-105 transition-all duration-200' : ''
                  }`}
                  onClick={handleImageClick}
                >
                  {/* RENDER ORDER (priority):
                      1) If a new image is selected (imagePreview) -> show it (no avatar)
                      2) Else if backend profile.profile_image exists -> show it (no avatar)
                      3) Else if effectiveGender === 'Male' -> show /male-avatar.png
                      4) Else if effectiveGender === 'Female' -> show /female-avatar.png
                      5) Else -> show existing User icon (current fallback)
                      This matches your specified rules exactly and preserves existing upload logic.
                  */}
                  {imagePreview || profile.profile_image ? (
                    <img
                      src={imagePreview || profile.profile_image || ''}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : effectiveGender && effectiveGender.toLowerCase() === 'male' ? (
                    // AVATAR: show static male avatar asset - ensure /male-avatar.png exists in public/
                    <img
                      src="/male-avatar.jpg"
                      alt="Male avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : effectiveGender && effectiveGender.toLowerCase() === 'female' ? (
                    // AVATAR: show static female avatar asset - ensure /female-avatar.png exists in public/
                    <img
                      src="/women-avatar.png"
                      alt="Female avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    // fallback: current User icon (unchanged behaviour)
                    <div className="w-full h-full bg-gradient-to-br from-purple-400 via-blue-500 to-indigo-600 flex items-center justify-center">
                      <User className="w-16 h-16 text-white" />
                    </div>
                  )}

                  {/* Enhanced Camera Overlay */}
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <div className="text-center text-white">
                        <Camera className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm font-medium">Change Photo</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Remove Image Button */}
                {isEditing && selectedImage && (
                  <button
                    onClick={removeSelectedImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                    title="Remove selected image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {/* Online Status Indicator */}
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-dark-primary shadow-sm"></div>

                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center sm:text-left">
                <div className="mb-4">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-dark-secondary mb-2">{profile.username}</h2>
                  <p className="text-lg text-gray-600 dark:text-dark-neutral mb-2">{profile.email}</p>
                  <div className="flex items-center justify-center sm:justify-start gap-4 text-sm text-gray-500 dark:text-dark-neutral/80">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Member since 2025</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span>Verified Member</span>
                    </div>
                  </div>
                </div>
                
                {isEditing && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-dark-primary/50 rounded-lg border border-blue-200 dark:border-blue-500/30">
                    <p className="text-blue-800 dark:text-blue-300 text-sm flex items-center">
                      <Camera className="w-4 h-4 mr-2" />
                      Click on your profile picture to update it
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Image Upload Status */}
          {isEditing && selectedImage && (
            <div className="mx-8 mt-6 p-4 bg-blue-50 dark:bg-dark-primary/50 border border-blue-200 dark:border-blue-500/30 rounded-xl">
              <p className="text-blue-800 dark:text-blue-300 text-sm flex items-center">
                <Camera className="w-4 h-4 mr-2" />
                New image selected: <span className="font-medium ml-1">{selectedImage.name}</span>
              </p>
            </div>
          )}

          {/* Enhanced Profile Information */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                {/* Username */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-dark-neutral mb-3 flex items-center">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center mr-3">
                      <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    Username
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white dark:bg-dark-background dark:text-dark-secondary dark:border-dark-neutral/50 dark:focus:bg-dark-background"
                      placeholder="Enter your username"
                    />
                  ) : (
                    <div className="bg-gray-50 dark:bg-dark-background px-4 py-3 rounded-xl border border-gray-100 dark:border-dark-neutral/50">
                      <p className="text-gray-900 dark:text-dark-secondary font-medium">{profile.username}</p>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-dark-neutral mb-3 flex items-center">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mr-3">
                      <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white dark:bg-dark-background dark:text-dark-secondary dark:border-dark-neutral/50 dark:focus:bg-dark-background"
                      placeholder="Enter your email"
                    />
                  ) : (
                    <div className="bg-gray-50 dark:bg-dark-background px-4 py-3 rounded-xl border border-gray-100 dark:border-dark-neutral/50">
                      <p className="text-gray-900 dark:text-dark-secondary font-medium">{profile.email}</p>
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-dark-neutral mb-3 flex items-center">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center mr-3">
                      <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white dark:bg-dark-background dark:text-dark-secondary dark:border-dark-neutral/50 dark:focus:bg-dark-background"
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <div className="bg-gray-50 dark:bg-dark-background px-4 py-3 rounded-xl border border-gray-100 dark:border-dark-neutral/50">
                      <p className="text-gray-900 dark:text-dark-secondary font-medium">{profile.phone || 'Not provided'}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                {/* Gender */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-dark-neutral mb-3 flex items-center">
                    <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/50 rounded-lg flex items-center justify-center mr-3">
                      <User className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                    </div>
                    Gender
                  </label>
                  {isEditing ? (
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white dark:bg-dark-background dark:text-dark-secondary dark:border-dark-neutral/50 dark:focus:bg-dark-background"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <div className="bg-gray-50 dark:bg-dark-background px-4 py-3 rounded-xl border border-gray-100 dark:border-dark-neutral/50">
                      <p className="text-gray-900 dark:text-dark-secondary font-medium">{profile.gender || 'Not specified'}</p>
                    </div>
                  )}
                </div>

                {/* Address */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-dark-neutral mb-3 flex items-center">
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex items-center justify-center mr-3">
                      <MapPin className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    Address
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white dark:bg-dark-background dark:text-dark-secondary dark:border-dark-neutral/50 dark:focus:bg-dark-background"
                      placeholder="Enter address"
                    />
                  ) : (
                    <div className="bg-gray-50 dark:bg-dark-background px-4 py-3 rounded-xl border border-gray-100 dark:border-dark-neutral/50">
                      <p className="text-gray-900 dark:text-dark-secondary font-medium">{profile.address || 'Not provided'}</p>
                    </div>
                  )}
                </div>

                {/* Pincode */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-dark-neutral mb-3 flex items-center">
                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center mr-3">
                      <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    Pincode
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white dark:bg-dark-background dark:text-dark-secondary dark:border-dark-neutral/50 dark:focus:bg-dark-background"
                      placeholder="Enter pincode"
                      maxLength={6}
                    />
                  ) : (
                    <div className="bg-gray-50 dark:bg-dark-background px-4 py-3 rounded-xl border border-gray-100 dark:border-dark-neutral/50">
                      <p className="text-gray-900 dark:text-dark-secondary font-medium">{profile.pincode || 'Not provided'}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Enhanced Action Buttons */}
            {isEditing && (
              <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-8 border-t border-gray-100 dark:border-dark-neutral/50">
                <button
                  onClick={handleCancel}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-dark-neutral dark:bg-dark-primary/60 dark:hover:bg-dark-primary transition-all duration-200 font-medium"
                >
                  <X className="w-5 h-5" />
                  <span>Cancel Changes</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg"
                >
                  {loading ? (
                    <div className="w-5 h-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Settings Modal */}
      {showSettingsModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={resetSettingsModal}
        >
          <div
            className="bg-white dark:bg-dark-background rounded-2xl max-w-6xl w-[95%] mx-auto max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-gray-200 dark:border-dark-neutral/50"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Shield className="w-8 h-8" />
                  <h3 className="text-2xl font-bold">Account Settings</h3>
                </div>
                <button
                  onClick={resetSettingsModal}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Main body: sidebar + content */}
            <div className="flex-1 min-h-0 flex overflow-hidden">
              {/* Enhanced Sidebar */}
              <aside className="w-64 flex-shrink-0 border-r border-gray-200 dark:border-dark-neutral/50 bg-gray-50 dark:bg-dark-primary p-6">
                <nav className="space-y-2">
                  <button
                    onClick={() => setSettingsTab('account')}
                    className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-3 ${
                      settingsTab === 'account'
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 shadow-sm'
                        : 'hover:bg-gray-100 text-gray-700 dark:hover:bg-dark-background dark:text-dark-neutral'
                    }`}
                  >
                    <Lock className="w-5 h-5" />
                    <span>Account Security</span>
                  </button>
                  <button
                    onClick={() => setSettingsTab('profile')}
                    className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-3 ${
                      settingsTab === 'profile'
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 shadow-sm'
                        : 'hover:bg-gray-100 text-gray-700 dark:hover:bg-dark-background dark:text-dark-neutral'
                    }`}
                  >
                    <User className="w-5 h-5" />
                    <span>Profile Info</span>
                  </button>
                  <button
                    onClick={() => setSettingsTab('preferences')}
                    className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-3 ${
                      settingsTab === 'preferences'
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 shadow-sm'
                        : 'hover:bg-gray-100 text-gray-700 dark:hover:bg-dark-background dark:text-dark-neutral'
                    }`}
                  >
                    <Bell className="w-5 h-5" />
                    <span>Preferences</span>
                  </button>
                </nav>
              </aside>

              {/* Enhanced Content area */}
              <div className="flex-1 min-w-0 overflow-y-auto p-8 bg-white dark:bg-dark-background">
                {settingsTab === 'account' && (
                  <>
                    {/* Enhanced Password Change Section */}
                    <div className="mb-12">
                      <div className="mb-8">
                        <h4 className="text-2xl font-bold text-gray-900 dark:text-dark-secondary flex items-center mb-2">
                          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center mr-3">
                            <Lock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                          </div>
                          Change Password
                        </h4>
                        <p className="text-gray-600 dark:text-dark-neutral ml-13">Update your password to keep your account secure</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          {/* Current Password */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-dark-neutral mb-3">Current Password</label>
                            <div className="relative">
                              <input
                                type={showPasswords.current ? 'text' : 'password'}
                                name="current_password"
                                value={passwordData.current_password}
                                onChange={handlePasswordChange}
                                className="w-full px-4 py-3 pr-12 border border-gray-200 dark:border-dark-neutral/50 dark:bg-dark-primary dark:text-dark-secondary rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                placeholder="Enter current password"
                              />
                              <button
                                type="button"
                                onClick={() => togglePasswordVisibility('current')}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-dark-neutral/60 dark:hover:text-dark-neutral transition-colors"
                              >
                                {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                          </div>

                          {/* New Password */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-dark-neutral mb-3">New Password</label>
                            <div className="relative">
                              <input
                                type={showPasswords.new ? 'text' : 'password'}
                                name="new_password"
                                value={passwordData.new_password}
                                onChange={handlePasswordChange}
                                className="w-full px-4 py-3 pr-12 border border-gray-200 dark:border-dark-neutral/50 dark:bg-dark-primary dark:text-dark-secondary rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                placeholder="Enter new password"
                              />
                              <button
                                type="button"
                                onClick={() => togglePasswordVisibility('new')}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-dark-neutral/60 dark:hover:text-dark-neutral transition-colors"
                              >
                                {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>

                            {/* Enhanced Password Strength Indicator */}
                            {passwordData.new_password && (
                              <div className="mt-3 p-4 bg-gray-50 dark:bg-dark-primary rounded-lg border border-gray-200 dark:border-dark-neutral/50">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium text-gray-700 dark:text-dark-neutral">Password Strength:</span>
                                  <span className={`text-sm font-bold ${
                                    passwordStrength.strength >= 75 ? 'text-green-600' :
                                    passwordStrength.strength >= 50 ? 'text-yellow-600' : 'text-red-600'
                                  }`}>
                                    {passwordStrength.label}
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-dark-primary/50 rounded-full h-2 overflow-hidden">
                                  <div 
                                    className={`h-2 rounded-full transition-all duration-500 ${passwordStrength.color}`} 
                                    style={{ width: `${passwordStrength.strength}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Confirm Password */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-dark-neutral mb-3">Confirm New Password</label>
                            <div className="relative">
                              <input
                                type={showPasswords.confirm ? 'text' : 'password'}
                                name="confirm_password"
                                value={passwordData.confirm_password}
                                onChange={handlePasswordChange}
                                className="w-full px-4 py-3 pr-12 border border-gray-200 dark:border-dark-neutral/50 dark:bg-dark-primary dark:text-dark-secondary rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                placeholder="Confirm new password"
                              />
                              <button
                                type="button"
                                onClick={() => togglePasswordVisibility('confirm')}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-dark-neutral/60 dark:hover:text-dark-neutral transition-colors"
                              >
                                {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>

                            {/* Enhanced Password Match Indicator */}
                            {passwordData.confirm_password && passwordData.new_password && (
                              <div className="mt-2">
                                {passwordData.new_password === passwordData.confirm_password ? (
                                  <div className="flex items-center text-green-600">
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    <span className="text-sm font-medium">Passwords match</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center text-red-600">
                                    <AlertCircle className="w-4 h-4 mr-2" />
                                    <span className="text-sm font-medium">Passwords don't match</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Enhanced Password Requirements */}
                        <div>
                          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-primary dark:to-dark-background rounded-2xl p-6 border border-gray-200 dark:border-dark-neutral/50 h-fit">
                            <h5 className="text-lg font-bold text-gray-900 dark:text-dark-secondary mb-4 flex items-center">
                              <Shield className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                              Password Requirements
                            </h5>
                            <ul className="space-y-3">
                              {[
                                { test: passwordData.new_password.length >= 8, text: 'At least 8 characters long' },
                                { test: /(?=.*[a-z])/.test(passwordData.new_password), text: 'One lowercase letter' },
                                { test: /(?=.*[A-Z])/.test(passwordData.new_password), text: 'One uppercase letter' },
                                { test: /(?=.*\d)/.test(passwordData.new_password), text: 'One number' },
                                { test: /(?=.*[@$!%*?&])/.test(passwordData.new_password), text: 'One special character (@$!%*?&)' }
                              ].map((req, index) => (
                                <li key={index} className="flex items-center">
                                  <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center transition-all duration-200 ${
                                    req.test ? 'bg-green-500' : 'bg-gray-300 dark:bg-dark-neutral/50'
                                  }`}>
                                    {req.test && <CheckCircle className="w-3 h-3 text-white" />}
                                  </div>
                                  <span className={`text-sm font-medium ${req.test ? 'text-green-700 dark:text-green-400' : 'text-gray-600 dark:text-dark-neutral'}`}>
                                    {req.text}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Error Messages */}
                      {passwordErrors.length > 0 && (
                        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-500/40 rounded-xl">
                          <div className="flex items-start">
                            <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                            <div>
                              {passwordErrors.map((error, index) => (
                                <p key={index} className="text-sm text-red-600 dark:text-red-400 mb-1 last:mb-0 font-medium">
                                  {error}
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Enhanced Delete Account Section */}
                    <div className="mb-12 p-6 bg-red-50 dark:bg-red-900/30 rounded-xl border border-red-200 dark:border-red-500/40">
                      <h4 className="text-xl font-bold text-red-900 dark:text-red-200 mb-3 flex items-center">
                        <div className="w-10 h-10 bg-red-100 dark:bg-red-500/20 rounded-lg flex items-center justify-center mr-3">
                          <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        Delete Account
                      </h4>
                      <p className="text-red-700 dark:text-red-300 mb-4 ml-13">
                        This action cannot be undone. All your data will be permanently removed from our servers.
                      </p>

                      {!confirmDelete ? (
                        <button
                          onClick={() => setConfirmDelete(true)}
                          className="ml-13 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 font-medium shadow-md"
                        >
                          Delete My Account
                        </button>
                      ) : (
                        <div className="ml-13 flex items-center gap-3">
                          <button
                            onClick={() => setConfirmDelete(false)}
                            className="px-6 py-3 bg-white border border-gray-300 dark:bg-dark-primary dark:border-dark-neutral/50 dark:hover:bg-dark-primary/80 dark:text-dark-secondary rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={async () => {
                              await handleDeleteAccount();
                              setConfirmDelete(false);
                            }}
                            className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 font-medium shadow-md"
                          >
                            Yes, Delete Forever
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Enhanced Logout Section */}
                    <div className="p-6 bg-orange-50 dark:bg-orange-900/30 rounded-xl border border-orange-200 dark:border-orange-500/40">
                      <h4 className="text-xl font-bold text-orange-900 dark:text-orange-200 mb-3 flex items-center">
                        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-500/20 rounded-lg flex items-center justify-center mr-3">
                          <LogOut className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                        </div>
                        Logout
                      </h4>
                      <p className="text-orange-700 dark:text-orange-300 mb-4 ml-13">
                        End your current session and return to the login page.
                      </p>

                      {!confirmLogout ? (
                        <button
                          onClick={() => setConfirmLogout(true)}
                          className="ml-13 px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all duration-200 font-medium shadow-md"
                        >
                          Logout Now
                        </button>
                      ) : (
                        <div className="ml-13 flex items-center gap-3">
                          <button
                            onClick={() => setConfirmLogout(false)}
                            className="px-6 py-3 bg-white border border-gray-300 dark:bg-dark-primary dark:border-dark-neutral/50 dark:hover:bg-dark-primary/80 dark:text-dark-secondary rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              handleLogout();
                              setConfirmLogout(false);
                            }}
                            className="px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all duration-200 font-medium shadow-md"
                          >
                            Confirm Logout
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {settingsTab === 'profile' && (
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900 dark:text-dark-secondary mb-6 flex items-center">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mr-3">
                        <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      Profile Information
                    </h4>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-500/30">
                      <p className="text-blue-900 dark:text-blue-200 text-lg font-medium mb-4">Coming Soon!</p>
                      <p className="text-blue-700 dark:text-blue-300 mb-6">
                        Manage additional profile settings, social links, bio, connected accounts, and more.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white/60 dark:bg-dark-primary/60 backdrop-blur-sm p-4 rounded-lg border border-blue-200 dark:border-blue-500/30">
                          <p className="text-blue-800 dark:text-blue-200 font-medium">Social Media Links</p>
                          <p className="text-blue-600 dark:text-blue-400 text-sm">Connect your social accounts</p>
                        </div>
                        <div className="bg-white/60 dark:bg-dark-primary/60 backdrop-blur-sm p-4 rounded-lg border border-blue-200 dark:border-blue-500/30">
                          <p className="text-blue-800 dark:text-blue-200 font-medium">Bio & About</p>
                          <p className="text-blue-600 dark:text-blue-400 text-sm">Tell others about yourself</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {settingsTab === 'preferences' && (
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900 dark:text-dark-secondary mb-6 flex items-center">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center mr-3">
                        <Bell className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      Preferences
                    </h4>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-8 border border-green-200 dark:border-green-500/30">
                      <p className="text-green-900 dark:text-green-200 text-lg font-medium mb-4">Coming Soon!</p>
                      <p className="text-green-700 dark:text-green-300 mb-6">
                        Customize your experience with language, notification, theme preferences and more.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white/60 dark:bg-dark-primary/60 backdrop-blur-sm p-4 rounded-lg border border-green-200 dark:border-green-500/30">
                          <p className="text-green-800 dark:text-green-200 font-medium">Notifications</p>
                          <p className="text-green-600 dark:text-green-400 text-sm">Manage alerts & updates</p>
                        </div>
                        <div className="bg-white/60 dark:bg-dark-primary/60 backdrop-blur-sm p-4 rounded-lg border border-green-200 dark:border-green-500/30">
                          <p className="text-green-800 dark:text-green-200 font-medium">Language</p>
                          <p className="text-green-600 dark:text-green-400 text-sm">Choose your language</p>
                        </div>
                        <div className="bg-white/60 dark:bg-dark-primary/60 backdrop-blur-sm p-4 rounded-lg border border-green-200 dark:border-green-500/30">
                          <p className="text-green-800 dark:text-green-200 font-medium">Theme</p>
                          <p className="text-green-600 dark:text-green-400 text-sm">Dark/Light mode</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Enhanced Footer */}
            <div className="flex-shrink-0 bg-gray-50 dark:bg-dark-primary border-t border-gray-200 dark:border-dark-neutral/50 p-6">
              <div className="flex justify-end space-x-4">
                <button
                  onClick={resetSettingsModal}
                  className="px-6 py-3 text-gray-700 bg-white border border-gray-300 dark:text-dark-secondary dark:bg-dark-background dark:border-dark-neutral/50 dark:hover:bg-dark-background/80 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                {settingsTab === 'account' && (
                  <button
                    onClick={handleChangePassword}
                    disabled={passwordLoading}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg transition-all duration-200"
                  >
                    {passwordLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        <span>Changing...</span>
                      </div>
                    ) : (
                      'Change Password'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;