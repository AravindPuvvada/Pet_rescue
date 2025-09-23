import React, { useEffect, useState, useRef } from "react";
import { Gift, Search, ChevronDown, ArrowUpDown, Medal } from "lucide-react";
import { apiService } from "../../services/api";

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

  const fetchRewards = async (opts?: { badge?: string; q?: string; ordering?: string }) => {
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
  };

  useEffect(() => {
    fetchRewards({ badge: selectedBadge, q: search, ordering });
  }, []);

  useEffect(() => {
    fetchRewards({ badge: selectedBadge, q: search, ordering });
  }, [selectedBadge, ordering]);

  useEffect(() => {
    if (searchDebounceRef.current) window.clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = window.setTimeout(() => {
      fetchRewards({ badge: selectedBadge, q: search, ordering });
    }, 450);
    return () => {
      if (searchDebounceRef.current) window.clearTimeout(searchDebounceRef.current);
    };
  }, [search]);

  const handleBadgeChange = (value: string) => setSelectedBadge(value);
  const toggleOrdering = () => setOrdering((prev) => (prev === "-points" ? "points" : "-points"));

  const badgeStyles = (badge?: string) => {
    switch (badge) {
      case "Gold":
        return "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 shadow-sm";
      case "Silver":
        return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 shadow-sm";
      case "Bronze":
        return "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 shadow-sm";
      case "Platinum":
        return "bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-800 shadow-sm";
      default:
        return "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 shadow-sm";
    }
  };

  return (
    <div className="p-6 md:p-10 min-h-[70vh] bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl shadow-md border border-gray-100">
            <Gift className="w-7 h-7 text-purple-700" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Rewards Management</h1>
            <p className="text-sm text-gray-500 mt-1">
              Track points, assign badges, and celebrate top contributors 🎉
            </p>
          </div>
        </div>
        <div className="text-center md:text-right">
          <div className="text-xs text-gray-500">Total Users</div>
          <div className="text-xl font-bold text-gray-800">{rewards.length}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex items-center bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl px-3 py-2 w-full md:w-1/2 shadow-md focus-within:ring-2 focus-within:ring-purple-300 transition">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input
            type="search"
            placeholder="Search by username or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none text-sm bg-transparent placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Badge</label>
          <div className="relative">
            <select
              value={selectedBadge}
              onChange={(e) => handleBadgeChange(e.target.value)}
              className="appearance-none bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 pr-8 text-sm shadow-md hover:shadow-lg transition"
            >
              <option value="">All Badges</option>
              {BADGE_OPTIONS.slice(1).map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-2 pointer-events-none" />
          </div>
        </div>

        <button
          onClick={toggleOrdering}
          className="ml-auto inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-2 text-sm shadow-md hover:scale-[1.03] hover:shadow-lg transition-transform"
        >
          <ArrowUpDown className="w-4 h-4 text-gray-600" />
          <span>{ordering === "-points" ? "Top First" : "Lowest First"}</span>
        </button>
      </div>

      {/* Card */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all hover:shadow-2xl">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="text-sm font-medium text-gray-600">Rewards Overview</div>
          <div className="text-xs text-gray-400">Updated just now</div>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="py-12 flex justify-center text-gray-400 animate-pulse">
              Loading rewards...
            </div>
          ) : error ? (
            <div className="py-12 text-center text-red-500">{error}</div>
          ) : rewards.length === 0 ? (
            <div className="py-12 text-center text-gray-500">🎁 No rewards found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500 uppercase">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Points</th>
                    <th className="py-3 px-4">Badge</th>
                    <th className="py-3 px-4">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {rewards.map((r, i) => (
                    <tr
                      key={r.id ?? i}
                      className="border-b last:border-b-0 hover:bg-gray-50 transition"
                      style={{ background: i % 2 === 0 ? "white" : "rgba(248,248,248,0.8)" }}
                    >
                      <td className="py-4 px-4">
                        <div className="font-medium">{r.username ?? "Unknown"}</div>
                        <div className="text-xs text-gray-400">{r.email ?? "—"}</div>
                      </td>
                      <td className="py-4 px-4 font-semibold text-gray-800">
                        {r.points ?? 0}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${badgeStyles(
                            r.badge
                          )}`}
                        >
                          <Medal className="w-3 h-3" />
                          {r.badge ?? "Starter"}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">{r.reason ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 text-right text-xs text-gray-400">
          Showing {rewards.length} user{rewards.length !== 1 ? "s" : ""} • Data refreshed live
        </div>
      </div>
    </div>
  );
};

export default RewardsPage;
