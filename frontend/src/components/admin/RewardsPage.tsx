import React, { useEffect, useState, useRef } from "react";
import { Gift, Search, ChevronDown, ArrowUpDown } from "lucide-react";
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
  const [ordering, setOrdering] = useState<"-points" | "points" | "">("-points"); // default: high -> low
  const searchDebounceRef = useRef<number | undefined>(undefined);

  // Build query string and fetch
  const fetchRewards = async (opts?: { badge?: string; q?: string; ordering?: string }) => {
    setLoading(true);
    setError("");
    try {
      const params: string[] = [];
      if (opts?.badge) params.push(`badge=${encodeURIComponent(opts.badge)}`);
      if (opts?.q) params.push(`search=${encodeURIComponent(opts.q)}`);
      if (opts?.ordering) params.push(`ordering=${encodeURIComponent(opts.ordering)}`);
      const query = params.length ? `?${params.join("&")}` : "";
      // Use existing apiService.request helper - it applies auth headers consistently
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

  // initial load
  useEffect(() => {
    fetchRewards({ badge: selectedBadge, q: search, ordering });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // when badge or ordering changes -> fetch immediately
  useEffect(() => {
    fetchRewards({ badge: selectedBadge, q: search, ordering });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBadge, ordering]);

  // debounced search
  useEffect(() => {
    // clear previous timer
    if (searchDebounceRef.current) {
      window.clearTimeout(searchDebounceRef.current);
    }
    // set new timer
    searchDebounceRef.current = window.setTimeout(() => {
      fetchRewards({ badge: selectedBadge, q: search, ordering });
    }, 450); // 450ms debounce

    return () => {
      if (searchDebounceRef.current) {
        window.clearTimeout(searchDebounceRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleBadgeChange = (value: string) => {
    setSelectedBadge(value);
  };

  const toggleOrdering = () => {
    setOrdering((prev) => (prev === "-points" ? "points" : "-points"));
  };

  return (
    <div className="p-8 min-h-[70vh]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-purple-100 to-purple-50 p-3 rounded-xl shadow-sm border border-white/30">
            <Gift className="w-6 h-6 text-purple-700" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold leading-tight">Rewards Management</h1>
            <p className="text-sm text-gray-500 mt-1">
              View and filter reward points awarded to users. Manage badges and identify top contributors.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-gray-500">Total Users</div>
            <div className="text-lg font-semibold">{rewards.length}</div>
          </div>
        </div>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-3 mb-6">
        {/* Search */}
        <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 w-full md:w-1/2 shadow-sm">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input
            type="search"
            placeholder="Search by username or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none text-sm placeholder:text-gray-400"
          />
        </div>

        {/* Badge dropdown styled as pill */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Badge</label>
          <div className="relative">
            <select
              value={selectedBadge}
              onChange={(e) => handleBadgeChange(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-full px-4 py-2 pr-8 text-sm shadow-sm hover:shadow transition-shadow"
            >
              <option value="">All Badges</option>
              {BADGE_OPTIONS.slice(1).map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 pointer-events-none absolute right-2 top-2" />
          </div>
        </div>

        {/* Sort toggle */}
        <button
          onClick={toggleOrdering}
          className="ml-auto md:ml-4 inline-flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm shadow-sm hover:scale-[1.02] transition transform"
          title="Toggle sort by points"
        >
          <ArrowUpDown className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-700">
            Sort: {ordering === "-points" ? "Top first" : "Lowest first"}
          </span>
        </button>
      </div>

      {/* Card / table */}
      <div className="bg-white rounded-2xl shadow-[0_6px_24px_rgba(28,30,33,0.06)] border border-gray-100 overflow-hidden">
        {/* table header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="text-sm text-gray-600">Rewards overview</div>
          <div className="text-xs text-gray-500">Updated just now</div>
        </div>

        {/* content */}
        <div className="p-4">
          {loading ? (
            <div className="py-10 flex justify-center">
              <div className="animate-pulse text-gray-400">Loading rewards...</div>
            </div>
          ) : error ? (
            <div className="py-10 text-center text-red-500">{error}</div>
          ) : rewards.length === 0 ? (
            <div className="py-10 text-center text-gray-500">
              🎁 No rewards found.
            </div>
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
                      className="border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                      style={{ background: i % 2 === 0 ? "white" : "rgba(250,250,250,0.8)" }}
                    >
                      <td className="py-4 px-4 align-top">
                        <div className="font-medium">{r.username ?? "Unknown"}</div>
                        <div className="text-xs text-gray-400">{r.email ?? "—"}</div>
                      </td>

                      <td className="py-4 px-4 align-top">
                        <div className="font-semibold text-gray-800">{r.points ?? 0}</div>
                      </td>

                      <td className="py-4 px-4 align-top">
                        <span
                          className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
                            r.badge === "Gold"
                              ? "bg-yellow-50 text-yellow-700"
                              : r.badge === "Silver"
                              ? "bg-gray-50 text-gray-700"
                              : r.badge === "Bronze"
                              ? "bg-orange-50 text-orange-700"
                              : r.badge === "Platinum"
                              ? "bg-indigo-50 text-indigo-700"
                              : "bg-gray-50 text-gray-600"
                          }`}
                        >
                          {r.badge ?? "Starter"}
                        </span>
                      </td>

                      <td className="py-4 px-4 align-top text-sm text-gray-600">
                        {r.reason ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* footer (optional actions) */}
        <div className="px-6 py-4 border-t border-gray-100 text-right text-xs text-gray-400">
          Showing {rewards.length} user{rewards.length !== 1 ? "s" : ""} • Data is calculated on the fly
        </div>
      </div>
    </div>
  );
};

export default RewardsPage;
