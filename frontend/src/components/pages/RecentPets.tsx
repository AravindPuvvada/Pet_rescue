// src/components/pages/RecentPets.tsx
import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Loader2, MapPin, Calendar, PawPrint, Search, Filter } from "lucide-react";
import { apiService } from "../../services/api";

// Source type for lost/found pets
type SourceType = "lost" | "found";

// Pet structure after normalization
type NormalizedPet = {
  id: number | string;
  name?: string;
  pet_type?: string;
  breed?: string;
  age?: number;
  city?: string;
  state?: string;
  image?: string | null;
  source?: SourceType;
  created_at?: string;
};

// Raw pet item returned from API
interface PetItem {
  id?: number | string;
  name?: string;
  pet_type?: string;
  breed?: string;
  age?: number;
  city?: string;
  state?: string;
  image?: string | { url?: string } | null;
  image_url?: string;
  thumbnail?: string;
  photo?: string;
  created_at?: string;
  pet?: PetItem; // in case item is wrapped
  [key: string]: unknown; // fallback for unknown fields
}

// API response structure
// interface LostFoundResponse {
//   lost_pets?: PetItem[];
//   found_pets?: PetItem[];
//   results?: PetItem[];
//   data?: PetItem[];
// }


const RecentPets: React.FC = () => {
  const [pets, setPets] = useState<NormalizedPet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [brokenImages, setBrokenImages] = useState<Record<string | number, boolean>>({});
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "lost" | "found">("all");

  // Normalize raw API item into NormalizedPet
  const normalizeItem = (item: PetItem, source: SourceType): NormalizedPet => {
    const wrappedPet = item?.pet ?? null;
    const base = wrappedPet ?? item ?? {};

    const candidates = [
      item?.image,
      item?.image_url,
      item?.thumbnail,
      item?.photo,
      base?.image,
      base?.image_url,
      base?.thumbnail,
      base?.photo,
    ];

    const imageRaw = candidates.find((c) => !!c) ?? null;

    return {
      id: base?.id ?? item?.id ?? Math.random().toString(36).slice(2, 9),
      name: base?.name ?? item?.name,
      pet_type: base?.pet_type ?? item?.pet_type,
      breed: base?.breed ?? item?.breed,
      age: base?.age ?? item?.age,
      city: base?.city ?? item?.city,
      state: base?.state ?? item?.state,
      image: imageRaw as string | null,
      source,
      created_at: base?.created_at ?? item?.created_at ?? new Date().toISOString(),
    };
  };

  // Resolve image URL for display
  const resolveImageUrl = (raw: string | { url?: string } | null | undefined): string | null => {
    if (!raw) return null;
    const val = typeof raw === "string" ? raw : raw.url ?? "";
    if (!val) return null;

    try {
      if (typeof apiService.getImageUrl === "function") {
        const resolved = apiService.getImageUrl(val);
        if (resolved) return resolved;
      }
    } catch (e) {
      console.warn("apiService.getImageUrl error:", e);
    }

    if (/^https?:\/\//i.test(val)) return val;
    if (val.startsWith("/")) {
      try {
        return `${window.location.origin}${val}`;
      } catch {
        return val;
      }
    }

    return val;
  };

  // Extract arrays from API response
  const extractArray = (resp: Record<string, unknown> | unknown[], keys: string[]): PetItem[] => {
    for (const k of keys) {
      if (Array.isArray((resp as Record<string, unknown>)?.[k])) {
        return (resp as Record<string, unknown>)[k] as PetItem[];
      }
    }
    if (Array.isArray(resp)) return resp as PetItem[];
    return [];
  };

  useEffect(() => {
  const fetchPets = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch lost and found separately
      const lostResp = await (apiService.getMyLostPets?.() ?? Promise.resolve({ lost_pets: [] }));
      const foundResp = await (apiService.getMyFoundPets?.() ?? Promise.resolve({ found_pets: [] }));

      // Use extractArray to safely get array
      const lostList = extractArray(lostResp, ["lost_pets", "results", "data"]);
      const foundList = extractArray(foundResp, ["found_pets", "results", "data"]);

      const normalizedLost = lostList.map((it) => normalizeItem(it, "lost"));
      const normalizedFound = foundList.map((it) => normalizeItem(it, "found"));

      const merged = [...normalizedLost, ...normalizedFound];

      // Deduplicate by id
      const dedupMap = new Map<string | number, NormalizedPet>();
      merged.forEach((item) => {
        const key = item.id ?? JSON.stringify(item);
        if (!dedupMap.has(key)) dedupMap.set(key, item);
      });

      // Sort by created_at descending
      const sorted = Array.from(dedupMap.values()).sort(
        (a, b) =>
          new Date(b.created_at ?? "").getTime() -
          new Date(a.created_at ?? "").getTime()
      );

      setPets(sorted);
    } catch (err) {
      console.error("Error fetching lost/found pets:", err);
      setPets([]);
      setError("Failed to load lost/found reports. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  fetchPets();
}, []);


  // Filter and search pets
  const filteredPets = useMemo(() => {
    return pets.filter((p) => {
      const matchesFilter = filter === "all" ? true : p.source === filter;
      const matchesSearch =
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.breed?.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [pets, filter, search]);

  // Handle broken images
  const handleImgError = (id: string | number) => {
    setBrokenImages((prev) => ({ ...prev, [id]: true }));
  };

  // Placeholder card for missing images
  const PlaceholderCard = () => (
    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-dark-neutral/60">
      <div className="p-6 rounded-md bg-gray-100 dark:bg-dark-primary/60">
        <PawPrint className="w-12 h-12" />
      </div>
      <div className="mt-3 text-sm font-medium">No Image</div>
    </div>
  );

  if (loading) {
    return (
      <section className="pt-12 pb-16 bg-light-neutral dark:bg-dark-background theme-transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-light-accent dark:text-dark-secondary animate-spin mb-4" />
            <p className="text-lg text-light-secondary dark:text-dark-neutral">
              Loading lost & found reports...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-12 pb-16 bg-light-neutral dark:bg-dark-background theme-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 text-left flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-4xl font-extrabold text-light-text dark:text-dark-secondary">
              Lost &amp; Found Reports
            </h2>
            <div className="w-20 h-1 bg-light-accent dark:bg-dark-accent rounded mt-2 mb-2" />
            <p className="text-lg text-light-secondary dark:text-dark-neutral max-w-2xl">
              Recent lost and found reports submitted by users.
            </p>
            {error && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-600 text-red-700 dark:text-red-300 rounded">
                {error}
              </div>
            )}
          </div>

          {/* Search + Filter */}
          <div className="flex gap-3 mt-4 sm:mt-0">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or breed..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-dark-neutral bg-white dark:bg-dark-primary text-sm w-64"
              />
            </div>
            <div className="relative">
              <Filter className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as "all" | "lost" | "found")}
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-dark-neutral bg-white dark:bg-dark-primary text-sm"
              >
                <option value="all">All Pets</option>
                <option value="lost">Lost Pets</option>
                <option value="found">Found Pets</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pets Grid */}
        {filteredPets.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-2xl font-semibold text-light-text dark:text-dark-neutral mb-2">
              No Reports Found
            </h3>
            <p className="text-light-secondary dark:text-dark-neutral/80">
              Try adjusting filters or search terms.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPets.map((p, index) => {
              const idKey = p.id ?? `idx-${index}`;
              const resolved = resolveImageUrl(p.image ?? null);
              const broken = !!brokenImages[idKey];
              const showImage = !!resolved && !broken;

              return (
                <motion.div
                  key={idKey}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.38, delay: index * 0.06 }}
                  whileHover={{ scale: 1.02 }}
                  className="group bg-white dark:bg-dark-primary rounded-2xl shadow-md dark:shadow-black/50 border border-light-primary/50 dark:border-dark-neutral/30 overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col"
                >
                  {/* Image */}
                  <div className="relative bg-gray-50 dark:bg-dark-background/40 flex items-center justify-center aspect-[4/3] overflow-hidden">
                    {showImage ? (
                      <img
                        src={resolved}
                        alt={`${p.name ?? "Pet"} ${p.breed ? `- ${p.breed}` : ""}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={() => handleImgError(idKey)}
                        loading="lazy"
                      />
                    ) : (
                      <PlaceholderCard />
                    )}
                    <div className="absolute top-3 left-3 flex items-center space-x-2">
                      {p.source && (
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm ${
                            p.source === "lost"
                              ? "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300"
                              : "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300"
                          }`}
                        >
                          {p.source === "lost" ? "Lost" : "Found"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-light-text dark:text-dark-secondary truncate mb-2">
                      {p.name ?? "Unknown"}
                    </h3>
                    <div className="space-y-1 text-sm text-light-secondary dark:text-dark-neutral flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-light-text dark:text-dark-secondary truncate">
                          {p.breed ?? "Unknown Breed"}
                        </span>
                      </div>
                      {typeof p.age === "number" && (
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-light-secondary/60 dark:text-dark-neutral/60" />
                          <span>
                            Age: {p.age} {p.age === 1 ? "year" : "years"}
                          </span>
                        </div>
                      )}
                      {(p.city || p.state) && (
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-light-secondary/60 dark:text-dark-neutral/60" />
                          <span className="truncate">
                            {[p.city, p.state].filter(Boolean).join(", ")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentPets;
