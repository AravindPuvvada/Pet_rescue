import React, { useState, useEffect, useRef } from 'react';
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Calendar,
  RefreshCw,
  Filter,
  Users,
} from 'lucide-react';
import { apiService } from '../../services/api';
import type { AdminUser } from '../../services/api';

type ExtendedAdminUser = AdminUser & {
  profile_image?: string | null;
  phone?: string | null;
  address?: string | null;
  gender?: string | null;
  created_at?: string | null;
};

interface AdminUsersProps {
  theme?: 'light' | 'dark';
}

const AdminUsers: React.FC<AdminUsersProps> = ({ theme = 'light' }) => {
  const [users, setUsers] = useState<ExtendedAdminUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const [genderFilter, setGenderFilter] = useState<string>('');
  const [superuserFilter, setSuperuserFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const filtersRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [genderFilter, superuserFilter]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: Record<string, string> = {};
      if (genderFilter) params.gender = genderFilter;
      if (superuserFilter) params.superuser = superuserFilter;

      const data: any = await apiService.getAdminUsers(params);

      let items: ExtendedAdminUser[] = [];
      if (Array.isArray(data)) items = data as ExtendedAdminUser[];
      else if (data && Array.isArray((data as any).results)) items = (data as any).results as ExtendedAdminUser[];
      else {
        console.warn('Unexpected users response shape:', data);
        items = [];
      }

      setUsers(items);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      (u.username ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const themeBgClass = theme === 'light' ? 'bg-[#E8E0D3] text-black' : 'bg-gray-900 text-gray-100';

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-screen ${themeBgClass}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-10 space-y-6 p-6 ${themeBgClass}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#5B4438] dark:text-gray-800">
            Users Management
          </h1>
          <p className="mt-2 text-black dark:text-gray-500">
            Manage registered users on the platform
          </p>
        </div>
        <div className="bg-pink-100 text-pink-800 dark:bg-pink-800 dark:text-pink-100 px-4 py-2 rounded-lg font-medium dark:bg-green-500 dark:text-black">
          Total Users: {users.length}
        </div>
      </div>

      {/* Search + Filters */}
      <div className="bg-[#F5EFE6] dark:bg-gray-800 rounded-lg shadow p-4 border border-[#5B4438]/20 dark:border-gray-700 flex items-center gap-3 relative">
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 bg-white text-black placeholder-gray-500 border-gray-300 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:border-gray-600 dark:focus:ring-blue-400"
        />

        <div className="relative">
          <button
            onClick={() => setShowFilters((s) => !s)}
            className="ml-3 inline-flex items-center gap-2 px-3 py-2 border rounded-xl transition-colors border-[#5B4438]/20 hover:bg-white text-black dark:border-gray-700 dark:hover:bg-gray-700 dark:text-gray-200"
            aria-expanded={showFilters}
            aria-haspopup="true"
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm">Filters</span>
          </button>

          {showFilters && (
            <div ref={filtersRef} className="absolute right-0 mt-2 w-72 rounded-lg shadow-lg border p-4 z-40 bg-[#F5EFE6] border-[#5B4438]/20 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-black dark:text-gray-100">Filters</h4>
                <button
                  onClick={() => {
                    setGenderFilter('');
                    setSuperuserFilter('');
                  }}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Clear
                </button>
              </div>

              <div className="space-y-3">
                {/* Gender */}
                <div>
                  <label className="text-xs font-medium flex items-center gap-2 mb-1 text-black dark:text-gray-300">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-black dark:text-gray-300">
                      <circle cx="11" cy="11" r="3.5" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M15 3h6v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M17 5l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Gender
                  </label>
                  <select
                    value={genderFilter}
                    onChange={(e) => setGenderFilter(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 bg-white text-black border-gray-200 focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                  >
                    <option value="">All</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Role */}
                <div>
                  <label className="text-xs font-medium flex items-center gap-2 mb-1 text-black dark:text-gray-300">
                    <Users className="w-4 h-4" />
                    Role
                  </label>
                  <select
                    value={superuserFilter}
                    onChange={(e) => setSuperuserFilter(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 bg-white text-black border-gray-200 focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                  >
                    <option value="">All</option>
                    <option value="true">Admin</option>
                    <option value="false">User</option>
                  </select>
                </div>

                <div className="flex justify-end mt-2">
                  <button className="px-3 py-1 rounded-lg text-sm font-semibold hover:scale-[1.01] transition-transform bg-gradient-to-r from-blue-500 to-indigo-600 text-white dark:from-blue-700 dark:to-indigo-800 dark:text-gray-100" onClick={() => setShowFilters(false)}>
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((u) => (
          <div key={u.id} className="bg-[#F5EFE6] dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-[#5B4438]/20 dark:border-gray-700 hover:shadow-xl transition-shadow relative group cursor-pointer">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center overflow-hidden shadow-lg border-2 border-white group-hover:scale-110 transition-transform dark:border-gray-900">
                {u.profile_image ? (
                  <img src={apiService.getImageUrl(u.profile_image)} alt={u.username} className="w-14 h-14 rounded-full object-cover" />
                ) : (
                  <UserIcon className="w-7 h-7 text-white" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-lg text-[#5B4438] dark:text-yellow-200 group-hover:text-blue-700 transition-colors">
                  {u.username}
                </h3>
                <p className="text-black dark:text-gray-300 text-sm">{u.gender ?? 'Not specified'}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-black dark:text-gray-300 flex items-center space-x-2 text-sm">
                <Mail className="w-4 h-4" />
                <span>{u.email}</span>
              </div>
              {u.phone && (
                <div className="text-black dark:text-gray-300 flex items-center space-x-2 text-sm">
                  <Phone className="w-4 h-4" />
                  <span>{u.phone}</span>
                </div>
              )}
              {u.address && (
                <div className="text-black dark:text-gray-300 flex items-center space-x-2 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{u.address}</span>
                </div>
              )}
              <div className="text-black dark:text-gray-300 flex items-center space-x-2 text-sm">
                <Calendar className="w-4 h-4" />
                <span>Joined {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'Unknown'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && !error && (
        <div className="text-center py-12">
          <UserIcon className="w-14 h-14 mx-auto mb-4 animate-pulse text-gray-300 dark:text-gray-600" />
          <h3 className="text-[#5B4438] dark:text-yellow-200 text-xl font-bold mb-2">No users found</h3>
          <p className="text-black dark:text-gray-300">Try adjusting your filters or search terms.</p>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;

// import React, { useState, useEffect, useRef } from 'react';
// import {
//   User as UserIcon,
//   Mail,
//   Phone,
//   MapPin,
//   Calendar,
//   RefreshCw,
//   Filter,
//   Users,
// } from 'lucide-react';
// import { apiService } from '../../services/api';
// import type { AdminUser } from '../../services/api';

// type ExtendedAdminUser = AdminUser & {
//   profile_image?: string | null;
//   phone?: string | null;
//   address?: string | null;
//   gender?: string | null;
//   created_at?: string | null;
// };

// interface AdminUsersProps {
//   theme?: 'light' | 'dark';
// }

// const AdminUsers: React.FC<AdminUsersProps> = ({ theme = 'light' }) => {
//   const [users, setUsers] = useState<ExtendedAdminUser[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [error, setError] = useState<string | null>(null);

//   const [genderFilter, setGenderFilter] = useState<string>('');
//   const [superuserFilter, setSuperuserFilter] = useState<string>('');
//   const [showFilters, setShowFilters] = useState<boolean>(false);
//   const filtersRef = useRef<HTMLDivElement | null>(null);

//   // Theme mapping
//   const themeClasses = {
//     light: {
//       pageBg: 'bg-[#E8E0D3] text-black',
//       cardBg: 'bg-white border-gray-100',
//       cardHover: 'hover:shadow-2xl hover:scale-[1.03]',
//       heading: 'text-[#5B4438]',
//       subText: 'text-black/70',
//       inputBg: 'bg-white text-black placeholder-gray-500 border-gray-300 focus:ring-blue-500',
//       selectBg: 'bg-white text-black border-gray-200 focus:ring-blue-400',
//       buttonGradient: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white',
//       filterBg: 'bg-white border-gray-100',
//       errorBg: 'bg-red-50 border border-red-200 text-red-700',
//       spinnerBorder: 'border-orange-500',
//       placeholder: 'placeholder-gray-500',
//       filtersButton: 'border-gray-200 hover:bg-gray-50 text-gray-700',
//     },
//     dark: {
//       pageBg: 'bg-gray-900 text-gray-100',
//       cardBg: 'bg-gray-800 border-gray-700',
//       cardHover: 'hover:shadow-2xl hover:scale-[1.03]',
//       heading: 'text-gray-100',
//       subText: 'text-gray-300',
//       inputBg: 'bg-gray-700 text-gray-100 placeholder-gray-400 border-gray-700 focus:ring-blue-400',
//       selectBg: 'bg-gray-700 text-gray-100 border-gray-600 focus:ring-blue-400',
//       buttonGradient: 'bg-gradient-to-r from-blue-700 to-indigo-800 text-gray-100',
//       filterBg: 'bg-gray-800 border-gray-700',
//       errorBg: 'bg-red-900 border border-red-700 text-red-300',
//       spinnerBorder: 'border-blue-400',
//       placeholder: 'placeholder-gray-400',
//       filtersButton: 'border-gray-600 hover:bg-gray-700 text-gray-200',
//     },
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, [genderFilter, superuserFilter]);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (filtersRef.current && !filtersRef.current.contains(event.target as Node)) {
//         setShowFilters(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const params: Record<string, string> = {};
//       if (genderFilter) params.gender = genderFilter;
//       if (superuserFilter) params.superuser = superuserFilter;

//       const data: any = await apiService.getAdminUsers(params);

//       let items: ExtendedAdminUser[] = [];
//       if (Array.isArray(data)) items = data as ExtendedAdminUser[];
//       else if (data && Array.isArray((data as any).results)) items = (data as any).results as ExtendedAdminUser[];
//       else {
//         console.warn('Unexpected users response shape:', data);
//         items = [];
//       }

//       setUsers(items);
//     } catch (err) {
//       console.error('Error fetching users:', err);
//       setError('Failed to load users. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredUsers = users.filter(
//     (u) =>
//       (u.username ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (u.email ?? '').toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   if (loading) {
//     return (
//       <div className={`flex items-center justify-center h-64 ${themeClasses[theme].pageBg}`}>
//         <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${themeClasses[theme].spinnerBorder}`}></div>
//       </div>
//     );
//   }

//   return (
//     <div className={`${themeClasses[theme].pageBg} min-h-screen pb-10 space-y-6`}>
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className={`text-4xl font-extrabold tracking-tight drop-shadow-lg ${themeClasses[theme].heading}`}>
//             Users Management
//           </h1>
//           <p className={`mt-2 text-lg ${themeClasses[theme].subText}`}>
//             Manage registered users on the platform
//           </p>
//         </div>

//         <div className="flex items-center gap-3">
//           <div className="bg-gradient-to-r from-blue-400 to-purple-400 text-white px-5 py-2 rounded-xl font-semibold shadow-lg scale-100 hover:scale-105 transition-transform duration-200">
//             Total Users: {users.length}
//           </div>
//         </div>
//       </div>

//       {/* Error */}
//       {error && (
//         <div className={`px-4 py-3 rounded-xl flex items-center justify-between shadow-md ${themeClasses[theme].errorBg}`}>
//           <span>{error}</span>
//           <button onClick={fetchUsers} className="flex items-center space-x-2 text-sm font-semibold hover:underline">
//             <RefreshCw className="w-4 h-4" />
//             <span>Retry</span>
//           </button>
//         </div>
//       )}

//       {/* Search + Filters */}
//       <div className={`rounded-lg shadow p-4 flex items-center gap-3 relative ${themeClasses[theme].cardBg}`}>
//         <input
//           type="text"
//           placeholder="Search users by name or email..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className={`w-full px-4 py-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 ${themeClasses[theme].inputBg}`}
//         />

//         <div className="relative">
//           <button
//             onClick={() => setShowFilters((s) => !s)}
//             className={`ml-3 inline-flex items-center gap-2 px-3 py-2 border rounded-xl transition-colors ${themeClasses[theme].filtersButton}`}
//             aria-expanded={showFilters}
//             aria-haspopup="true"
//           >
//             <Filter className="w-4 h-4" />
//             <span className="text-sm">Filters</span>
//           </button>

//           {showFilters && (
//             <div ref={filtersRef} className={`absolute right-0 mt-2 w-72 rounded-lg shadow-lg border p-4 z-40 ${themeClasses[theme].filterBg}`}>
//               <div className="flex items-center justify-between mb-2">
//                 <h4 className={`text-sm font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>Filters</h4>
//                 <button
//                   onClick={() => {
//                     setGenderFilter('');
//                     setSuperuserFilter('');
//                   }}
//                   className="text-xs text-blue-600 hover:underline"
//                 >
//                   Clear
//                 </button>
//               </div>

//               <div className="space-y-3">
//                 {/* Gender */}
//                 <div>
//                   <label className={`text-xs font-medium flex items-center gap-2 mb-1 ${themeClasses[theme].subText}`}>
//                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//                       <circle cx="11" cy="11" r="3.5" stroke="currentColor" strokeWidth="1.5" />
//                       <path d="M15 3h6v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//                       <path d="M17 5l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//                     </svg>
//                     Gender
//                   </label>
//                   <select
//                     value={genderFilter}
//                     onChange={(e) => setGenderFilter(e.target.value)}
//                     className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 ${themeClasses[theme].selectBg}`}
//                   >
//                     <option value="">All</option>
//                     <option value="Male">Male</option>
//                     <option value="Female">Female</option>
//                     <option value="Other">Other</option>
//                   </select>
//                 </div>

//                 {/* Role */}
//                 <div>
//                   <label className={`text-xs font-medium flex items-center gap-2 mb-1 ${themeClasses[theme].subText}`}>
//                     <Users className="w-4 h-4" />
//                     Role
//                   </label>
//                   <select
//                     value={superuserFilter}
//                     onChange={(e) => setSuperuserFilter(e.target.value)}
//                     className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 ${themeClasses[theme].selectBg}`}
//                   >
//                     <option value="">All</option>
//                     <option value="true">Admin</option>
//                     <option value="false">User</option>
//                   </select>
//                 </div>

//                 <div className="flex justify-end mt-2">
//                   <button className={`px-3 py-1 rounded-lg text-sm font-semibold hover:scale-[1.01] transition-transform ${themeClasses[theme].buttonGradient}`} onClick={() => setShowFilters(false)}>
//                     Apply
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Users Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredUsers.map((u) => (
//           <div key={u.id} className={`${themeClasses[theme].cardBg} ${themeClasses[theme].cardHover} rounded-2xl p-7 border shadow-xl relative group cursor-pointer`}>
//             <div className="flex items-center space-x-4 mb-4">
//               <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center overflow-hidden shadow-lg border-2 border-white group-hover:scale-110 transition-transform">
//                 {u.profile_image ? (
//                   <img src={apiService.getImageUrl(u.profile_image)} alt={u.username} className="w-14 h-14 rounded-full object-cover" />
//                 ) : (
//                   <UserIcon className="w-7 h-7 text-white" />
//                 )}
//               </div>
//               <div>
//                 <h3 className={`${themeClasses[theme].heading} font-bold text-lg group-hover:text-blue-700 transition-colors`}>
//                   {u.username}
//                 </h3>
//                 <p className={`${themeClasses[theme].subText} text-sm`}>{u.gender ?? 'Not specified'}</p>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <div className={`${themeClasses[theme].subText} flex items-center space-x-2 text-sm`}>
//                 <Mail className="w-4 h-4" />
//                 <span>{u.email}</span>
//               </div>
//               {u.phone && (
//                 <div className={`${themeClasses[theme].subText} flex items-center space-x-2 text-sm`}>
//                   <Phone className="w-4 h-4" />
//                   <span>{u.phone}</span>
//                 </div>
//               )}
//               {u.address && (
//                 <div className={`${themeClasses[theme].subText} flex items-center space-x-2 text-sm`}>
//                   <MapPin className="w-4 h-4" />
//                   <span>{u.address}</span>
//                 </div>
//               )}
//               <div className={`${themeClasses[theme].subText} flex items-center space-x-2 text-sm`}>
//                 <Calendar className="w-4 h-4" />
//                 <span>Joined {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'Unknown'}</span>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Empty State */}
//       {filteredUsers.length === 0 && !error && (
//         <div className="text-center py-12">
//           <UserIcon className="w-14 h-14 text-gray-300 mx-auto mb-4 animate-pulse" />
//           <h3 className={`${themeClasses[theme].heading} text-xl font-bold mb-2`}>No users found</h3>
//           <p className={`${themeClasses[theme].subText}`}>Try adjusting your filters or search terms.</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminUsers;
