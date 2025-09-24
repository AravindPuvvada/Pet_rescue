// import React, { useEffect, useState, useRef } from "react";
// import { Gift, Search, ChevronDown, ArrowUpDown, Medal } from "lucide-react";
// import { motion } from "framer-motion";
// import { apiService } from "../../services/api";

// interface Reward {
//   id?: number;
//   user?: number;
//   username?: string;
//   email?: string;
//   points?: number;
//   badge?: string;
//   reason?: string;
// }

// const BADGE_OPTIONS = ["", "Starter", "Bronze", "Silver", "Gold", "Platinum"];

// const RewardsPage: React.FC = () => {
//   const [rewards, setRewards] = useState<Reward[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [selectedBadge, setSelectedBadge] = useState<string>("");
//   const [search, setSearch] = useState<string>("");
//   const [ordering, setOrdering] = useState<"-points" | "points" | "">("-points");
//   const searchDebounceRef = useRef<number | undefined>(undefined);

//   const fetchRewards = async (opts?: { badge?: string; q?: string; ordering?: string }) => {
//     setLoading(true);
//     setError("");
//     try {
//       const params: string[] = [];
//       if (opts?.badge) params.push(`badge=${encodeURIComponent(opts.badge)}`);
//       if (opts?.q) params.push(`search=${encodeURIComponent(opts.q)}`);
//       if (opts?.ordering) params.push(`ordering=${encodeURIComponent(opts.ordering)}`);
//       const query = params.length ? `?${params.join("&")}` : "";
//       const data = await apiService.request(`/all-rewards/${query}`);
//       const normalized = Array.isArray(data) ? data : [data];
//       setRewards(normalized);
//     } catch (err) {
//       console.error("Failed to fetch rewards", err);
//       setError("Failed to fetch rewards");
//       setRewards([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRewards({ badge: selectedBadge, q: search, ordering });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   useEffect(() => {
//     fetchRewards({ badge: selectedBadge, q: search, ordering });
//   }, [selectedBadge, ordering]);

//   useEffect(() => {
//     if (searchDebounceRef.current) window.clearTimeout(searchDebounceRef.current);
//     searchDebounceRef.current = window.setTimeout(() => {
//       fetchRewards({ badge: selectedBadge, q: search, ordering });
//     }, 450);
//     return () => {
//       if (searchDebounceRef.current) window.clearTimeout(searchDebounceRef.current);
//     };
//   }, [search]);

//   const handleBadgeChange = (value: string) => setSelectedBadge(value);
//   const toggleOrdering = () => setOrdering((prev) => (prev === "-points" ? "points" : "-points"));

//   // Brighter gradients + clear font contrast
//   const badgeStyles = (badge?: string) => {
//     switch (badge) {
//       case "Gold":
//         return "bg-gradient-to-r from-yellow-300 to-yellow-500 text-yellow-900";
//       case "Silver":
//         return "bg-gradient-to-r from-gray-300 to-gray-500 text-gray-900";
//       case "Bronze":
//         return "bg-gradient-to-r from-orange-300 to-orange-500 text-orange-900";
//       case "Platinum":
//         return "bg-gradient-to-r from-indigo-300 to-indigo-500 text-indigo-900";
//       default:
//         return "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700";
//     }
//   };

//   // helper to detect premium badges that get shine
//   const isPremium = (badge?: string) => badge === "Gold" || badge === "Platinum";

//   return (
//     <div className="p-6 md:p-10 min-h-[70vh] bg-gradient-to-b from-gray-50 via-white to-gray-50">
//       {/* Page header */}
//       <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
//         <div className="flex items-center gap-4">
//           <div className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-sm border border-gray-100">
//             <Gift className="w-8 h-8 text-purple-700" />
//           </div>
//           <div>
//             <h1 className="text-3xl md:text-3xl font-semibold tracking-tight text-gray-900">
//               Rewards Management
//             </h1>
//             <p className="text-base text-gray-500 mt-1">
//               Track points, assign badges, and celebrate top contributors 🎉
//             </p>
//           </div>
//         </div>

//         <div className="text-center md:text-right">
//           <div className="text-sm text-gray-500">Total Users</div>
//           <div className="text-2xl font-bold text-gray-800">{rewards.length}</div>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-col md:flex-row gap-4 mb-6">
//         <div className="flex items-center bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-3 w-full md:w-1/2 shadow-sm focus-within:ring-2 focus-within:ring-purple-200 transition">
//           <Search className="w-5 h-5 text-gray-400 mr-3" />
//           <input
//             type="search"
//             placeholder="Search by username or email"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full outline-none text-base bg-transparent placeholder:text-gray-400"
//           />
//         </div>

//         <div className="flex items-center gap-3">
//           <label className="text-base text-gray-600">Badge</label>
//           <div className="relative">
//             <select
//               value={selectedBadge}
//               onChange={(e) => handleBadgeChange(e.target.value)}
//               className="appearance-none bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full px-5 py-3 pr-10 text-base shadow-sm hover:shadow-md transition"
//             >
//               <option value="">All Badges</option>
//               {BADGE_OPTIONS.slice(1).map((b) => (
//                 <option key={b} value={b}>
//                   {b}
//                 </option>
//               ))}
//             </select>
//             <ChevronDown className="w-5 h-5 text-gray-400 absolute right-3 top-3 pointer-events-none" />
//           </div>
//         </div>

//         <button
//           onClick={toggleOrdering}
//           className="ml-auto inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl px-5 py-3 text-base shadow-sm hover:scale-105 hover:shadow-md transition-transform"
//         >
//           <ArrowUpDown className="w-5 h-5 text-gray-600" />
//           <span>{ordering === "-points" ? "Top First" : "Lowest First"}</span>
//         </button>
//       </div>

//       {/* Card */}
//       <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-md border border-gray-100 overflow-hidden transition-all hover:shadow-lg">
//         {/* <-- TIGHTENED & CENTERED HEADER ROW --> */}
//         <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
//           <div className="flex items-center gap-3">
//             <div className="h-9 w-9 bg-white/60 rounded-full flex items-center justify-center">
//               <div className="h-2 w-2 rounded-full bg-indigo-400" />
//             </div>
//             <div>
//               <div className="text-lg md:text-xl font-semibold text-gray-800">Rewards Overview</div>
//               <div className="text-xs text-gray-400 mt-0.5">Manage badges and points</div>
//             </div>
//           </div>

//           <div className="text-right">
//             <div className="text-xs text-gray-400">Updated just now</div>
//           </div>
//         </div>

//         <div className="p-6">
//           {loading ? (
//             <div className="py-12 flex justify-center text-gray-400 animate-pulse text-lg">
//               Loading rewards...
//             </div>
//           ) : error ? (
//             <div className="py-12 text-center text-red-500 text-lg">{error}</div>
//           ) : rewards.length === 0 ? (
//             <div className="py-12 text-center text-gray-500 text-lg">🎁 No rewards found</div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-base">
//                 <thead>
//                   <tr className="text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
//                     <th className="py-4 px-6">User</th>
//                     <th className="py-4 px-6 text-center">Points</th>
//                     <th className="py-4 px-6 text-center">Badge</th>
//                     <th className="py-4 px-6">Reason</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {rewards.map((r, i) => (
//                     <motion.tr
//                       key={r.id ?? i}
//                       whileHover={{ scale: 1.01, y: -2 }}
//                       transition={{ type: "spring", stiffness: 200, damping: 15 }}
//                       className="border-b last:border-b-0 hover:bg-gray-50 transition"
//                       style={{ background: i % 2 === 0 ? "white" : "rgba(248,248,248,0.85)" }}
//                     >
//                       <td className="py-4 px-6 align-middle">
//                         <div className="font-semibold text-gray-900 text-base">{r.username ?? "Unknown"}</div>
//                         <div className="text-sm text-gray-400 mt-1">{r.email ?? "—"}</div>
//                       </td>

//                       {/* center-aligned points column with min width so numbers don't wrap */}
//                       <td className="py-4 px-6 font-bold text-gray-800 text-base text-center" style={{ minWidth: 110 }}>
//                         {r.points ?? 0}
//                       </td>

//                       {/* badge column: center horizontally and vertically */}
//                       <td className="py-4 px-6 text-center align-middle">
//                         <div className="flex items-center justify-center">
//                           <motion.span
//                             whileHover={isPremium(r.badge) ? { scale: 1.06 } : { scale: 1.03 }}
//                             transition={{ type: "spring", stiffness: 300, damping: 12 }}
//                             className={`relative inline-flex items-center gap-3 px-4 py-2 text-base font-semibold rounded-full ${badgeStyles(
//                               r.badge
//                             )} cursor-pointer shadow-sm`}
//                             style={{ boxShadow: "0 1px 0 rgba(0,0,0,0.03)" }}
//                           >
//                             <Medal className="w-5 h-5 drop-shadow-sm" />
//                             <span className="whitespace-nowrap">{r.badge ?? "Starter"}</span>

//                             {/* subtle shine only for premium badges (Gold / Platinum) */}
//                             {isPremium(r.badge) && (
//                               <motion.div
//                                 initial={{ x: "-110%" }}
//                                 animate={{ x: "110%" }}
//                                 transition={{ repeat: Infinity, duration: 2.2, ease: "linear", repeatDelay: 2 }}
//                                 className="absolute top-0 left-0 h-full w-16 opacity-30 pointer-events-none"
//                                 style={{
//                                   background:
//                                     "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%)",
//                                   transform: "skewX(-20deg)",
//                                 }}
//                               />
//                             )}
//                           </motion.span>
//                         </div>
//                       </td>

//                       <td className="py-4 px-6 text-gray-700 text-base">{r.reason ?? "—"}</td>
//                     </motion.tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         <div className="px-6 py-4 border-t border-gray-100 text-right text-sm text-gray-500">
//           Showing {rewards.length} user{rewards.length !== 1 ? "s" : ""} • Data refreshed live
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RewardsPage;


import React, { useEffect, useState, useRef, useCallback } from "react";
import { Gift, Search, ChevronDown, ArrowUpDown, Medal, Award, Sparkles, Gem, Diamond, Star, Crown } from "lucide-react";
import { motion } from "framer-motion";
import { apiService } from "../../services/api";

const themeClasses = {
  light: {
    pageBg: 'bg-gradient-to-b from-[#E8E0D3] via-[#F5EFE6] to-[#E8E0D3] text-black',
    headerBg: 'bg-white/90',
    headerIconBg: 'bg-[#5B4438]',
    headerIcon: 'text-yellow-200',
    headerText: 'text-[#5B4438]',
    subText: 'text-white',
    cardBg: 'bg-[#F5EFE6]/95 border-[#5B4438]/20',
    cardHeaderText: 'text-yellow-300',
    cardSubText: 'text-black',
    tableHeaderText: 'text-[#5B4438]',
    tableRowHover: 'hover:bg-[#E8E0D3]',
    filterBg: 'bg-white/90 border-[#5B4438]/20',
    filterText: 'text-[#5B4438]',
    filterPlaceholder: 'placeholder:text-gray-500',
    badgeText: 'text-gray-700',
  },
  dark: {
    pageBg: 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white',
    headerBg: 'bg-gray-800/90',
    headerIconBg: 'bg-yellow-200',
    headerIcon: 'text-black',
    headerText: 'text-yellow-200',
    subText: 'text-gray-300',
    cardBg: 'bg-gray-800/95 border-gray-700',
    cardHeaderText: 'text-yellow-200',
    cardSubText: 'text-gray-300',
    tableHeaderText: 'text-yellow-200',
    tableRowHover: 'hover:bg-gray-700',
    filterBg: 'bg-gray-800/90 border-gray-700',
    filterText: 'text-yellow-200',
    filterPlaceholder: 'placeholder:text-gray-400',
    badgeText: 'text-white',
  },
};

interface Reward {
  id?: number;
  user?: number;
  username?: string;
  email?: string;
  points?: number;
  badge?: string;
  reason?: string;
}

const BADGE_OPTIONS = ["", "Starter", "Bronze", "Silver", "Gold", "Platinum"];

const RewardsPage: React.FC = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBadge, setSelectedBadge] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [ordering, setOrdering] = useState<"-points" | "points" | "">("-points");
  const searchDebounceRef = useRef<number | undefined>(undefined);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const fetchRewards = useCallback(async (opts?: { badge?: string; q?: string; ordering?: string }) => {
    setLoading(true);
    setError("");
    try {
      const params: string[] = [];
      if (opts?.badge) params.push(`badge=${encodeURIComponent(opts.badge)}`);
      if (opts?.q) params.push(`search=${encodeURIComponent(opts.q)}`);
      if (opts?.ordering) params.push(`ordering=${encodeURIComponent(opts.ordering)}`);
      const query = params.length ? `?${params.join("&")}` : "";
      const data = await apiService.request(`/all-rewards/${query}`);
      const normalized = Array.isArray(data) ? data : [data];
      setRewards(normalized);
    } catch (err) {
      console.error("Failed to fetch rewards", err);
      setError("Failed to fetch rewards");
      setRewards([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    fetchRewards({ badge: selectedBadge, q: search, ordering });
  }, [selectedBadge, ordering, fetchRewards]);

  useEffect(() => {
    if (searchDebounceRef.current) window.clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = window.setTimeout(() => {
      fetchRewards({ badge: selectedBadge, q: search, ordering });
    }, 450);
    return () => {
      if (searchDebounceRef.current) window.clearTimeout(searchDebounceRef.current);
    };
  }, [search, selectedBadge, ordering, fetchRewards]);

  const handleBadgeChange = (value: string) => setSelectedBadge(value);
  const toggleOrdering = () => setOrdering((prev) => (prev === "-points" ? "points" : "-points"));

  const badgeStyles = (badge?: string) => {
    switch (badge) {
      case "Gold":
        return "bg-gradient-to-r from-yellow-300 to-yellow-500 text-yellow-900";
      case "Silver":
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-gray-900";
      case "Bronze":
        return "bg-gradient-to-r from-orange-300 to-orange-500 text-orange-900";
      case "Platinum":
        return "bg-gradient-to-r from-indigo-300 to-indigo-500 text-indigo-900";
      case "Starter":
      default:
        return "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700";
    }
  };

  const getBadgeIcon = (badge?: string) => {
    switch (badge) {
      case "Gold":
        return <Medal className="w-5 h-5 drop-shadow-sm" />;
      case "Silver":
        return <Award className="w-5 h-5 drop-shadow-sm" />;
      case "Bronze":
        return <Star className="w-5 h-5 drop-shadow-sm" />;
      case "Platinum":
        return <Diamond className="w-5 h-5 drop-shadow-sm" />;
      default:
        return <Sparkles className="w-5 h-5 drop-shadow-sm" />;
    }
  };

  const isPremium = (badge?: string) => badge === "Gold" || badge === "Platinum";

  return (
    <div className={`p-6 md:p-10 min-h-[70vh] ${themeClasses[theme].pageBg}`}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl shadow-sm border ${themeClasses[theme].headerBg} ${themeClasses[theme].cardBg}`}>
            <Gift className={`w-8 h-8 ${themeClasses[theme].headerText}`} />
          </div>
          <div>
            <h1 className={`text-3xl md:text-3xl font-semibold tracking-tight ${themeClasses[theme].headerText}`}>
              Rewards Management
            </h1>
            <p className={`text-base ${themeClasses[theme].headerText} mt-1`}>
              Track points, assign badges, and celebrate top contributors 🎉
            </p>
          </div>
        </div>

        <div className="text-center md:text-right">
          <div className={`text-sm ${themeClasses[theme].subText}`}>Total Users</div>
          <div className={`text-2xl font-bold ${themeClasses[theme].headerText}`}>{rewards.length}</div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6 ">
        <div className={`flex items-center rounded-xl px-4 py-3 w-full md:w-1/2 shadow-sm focus-within:ring-2 focus-within:ring-purple-200 transition ${themeClasses[theme].filterBg}`}>
          <Search className={`w-5 h-5 mr-3 ${themeClasses[theme].subText}`} />
          <input
            type="search"
            placeholder="Search by username or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full outline-none text-base bg-transparent ${themeClasses[theme].filterText} ${themeClasses[theme].filterPlaceholder}`}
          />
        </div>

        <div className="flex items-center gap-3">
          <label className={`text-base ${themeClasses[theme].headerText}`}>Badge</label>
          <div className="relative">
            <select
              value={selectedBadge}
              onChange={(e) => handleBadgeChange(e.target.value)}
              className={`appearance-none rounded-full px-5 py-3 pr-10 text-base shadow-sm hover:shadow-md transition ${themeClasses[theme].filterBg} ${themeClasses[theme].filterText}`}
            >
              <option value="">All Badges</option>
              {BADGE_OPTIONS.slice(1).map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <ChevronDown className={`w-5 h-5 absolute right-3 top-3 pointer-events-none ${themeClasses[theme].headerText}`} />
          </div>
        </div>

        <button
          onClick={toggleOrdering}
          className={`ml-auto inline-flex items-center gap-2 rounded-xl px-5 py-3 text-base shadow-sm hover:scale-105 hover:shadow-md transition-transform ${themeClasses[theme].filterBg} ${themeClasses[theme].filterText}`}
        >
          <ArrowUpDown className={`w-5 h-5 dark:text-gray-600`} />
          <span>{ordering === "-points" ? "Top First" : "Lowest First"}</span>
        </button>
      </div>

      <div className={`rounded-2xl shadow-md border overflow-hidden transition-all dark:bg-gray-800 ${themeClasses[theme].cardBg}`}>
        <div className={`px-6 py-4 flex items-center justify-between border-b dark:bg-gray-800 ${themeClasses[theme].cardBg}`}>
          <div className="flex items-center gap-3">
            <div className={`h-9 w-9 rounded-full flex items-center justify-center ${themeClasses[theme].headerBg}`}>
              <div className={`h-2 w-2 rounded-full ${theme === 'light' ? 'bg-indigo-400' : 'bg-yellow-200'}`} />
            </div>
            <div>
              <div className={`text-lg md:text-xl font-semibold  ${themeClasses[theme].cardHeaderText}`}>Rewards Overview</div>
              <div className={`text-xs mt-0.5 ${themeClasses[theme].subText}`}>Manage badges and points</div>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-xs ${themeClasses[theme].subText}`}>Updated just now</div>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className={`py-12 flex justify-center text-lg animate-pulse ${themeClasses[theme].subText}`}>
              Loading rewards...
            </div>
          ) : error ? (
            <div className={`py-12 text-center text-lg text-red-500`}>{error}</div>
          ) : rewards.length === 0 ? (
            <div className={`py-12 text-center text-lg ${themeClasses[theme].subText}`}>
              🎁 No rewards found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-base">
                <thead>
                  <tr className={`text-left text-sm font-semibold uppercase tracking-wide dark:text-yellow-300 ${themeClasses[theme].tableHeaderText}`}>
                    <th className="py-4 px-6">User</th>
                    <th className="py-4 px-6 text-center">Points</th>
                    <th className="py-4 px-6 text-center">Badge</th>
                    <th className="py-4 px-6">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {rewards.map((r, i) => (
                    <motion.tr
                      key={r.id ?? i}
                      whileHover={{ scale: 1.01, y: -2 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className={`border-b last:border-b-0 transition ${themeClasses[theme].tableRowHover}`}
                      style={{ background: i % 2 === 0 ? (theme === 'light' ? 'white' : 'rgba(31,41,55,0.85)') : (theme === 'light' ? 'rgba(248,248,248,0.85)' : 'rgba(17,24,39,0.85)') }}
                    >
                      <td className={`py-4 px-6 align-middle dark:bg-gray-800 ${themeClasses[theme].subText}`}>
                        <div className={`font-semibold text-base ${themeClasses[theme].subText}`}>{r.username ?? "Unknown"}</div>
                        <div className={`text-sm mt-1 ${themeClasses[theme].subText}`}>{r.email ?? "—"}</div>
                      </td>
                      <td className={`py-4 px-6 font-bold text-base text-center dark:bg-gray-800 ${themeClasses[theme].subText}`} style={{ minWidth: 110 }}>
                        {r.points ?? 0}
                      </td>
                      <td className="py-4 px-6 text-center dark:bg-gray-800 align-middle">
                        <div className="flex items-center justify-center">
                          <motion.span
                            whileHover={isPremium(r.badge) ? { scale: 1.06 } : { scale: 1.03 }}
                            transition={{ type: "spring", stiffness: 300, damping: 12 }}
                            className={`relative inline-flex items-center gap-3 px-4 py-2 text-base font-semibold rounded-full ${badgeStyles(r.badge)} cursor-pointer shadow-sm`}
                            style={{ boxShadow: "0 1px 0 rgba(0,0,0,0.03)" }}
                          >
                            {getBadgeIcon(r.badge)}
                            <span className="whitespace-nowrap">{r.badge ?? "Starter"}</span>
                            {isPremium(r.badge) && (
                              <motion.div
                                initial={{ x: "-110%" }}
                                animate={{ x: "110%" }}
                                transition={{ repeat: Infinity, duration: 2.2, ease: "linear", repeatDelay: 2 }}
                                className="absolute top-0 left-0 h-full w-16 opacity-30 pointer-events-none"
                                style={{
                                  background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%)",
                                  transform: "skewX(-20deg)",
                                }}
                              />
                            )}
                          </motion.span>
                        </div>
                      </td>
                      <td className={`py-4 px-6 text-base dark:bg-gray-800 ${themeClasses[theme].subText}`}>{r.reason ?? "—"}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className={`px-6 py-4 border-t text-right text-sm ${themeClasses[theme].subText}`}>
          Showing {rewards.length} user{rewards.length !== 1 ? "s" : ""} • Data refreshed live
        </div>
      </div>
    </div>
  );
};

export default RewardsPage;