// src/components/pages/RecentPets.tsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Heart, MapPin, Calendar, Shield, PawPrint } from "lucide-react";
import { apiService } from "../../services/api";

type NormalizedPet = {
  id: number | string;
  name?: string;
  pet_type?: string;
  breed?: string;
  age?: number;
  city?: string;
  state?: string;
  image?: string | null;
  is_vaccinated?: boolean;
  is_diseased?: boolean;
};

const RecentPets: React.FC = () => {
  const [pets, setPets] = useState<NormalizedPet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [brokenImages, setBrokenImages] = useState<Record<string | number, boolean>>({});
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const normalizeItem = (item: any): NormalizedPet => {
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
      image: imageRaw,
      is_vaccinated: base?.is_vaccinated ?? item?.is_vaccinated,
      is_diseased: base?.is_diseased ?? item?.is_diseased,
    };
  };

  const resolveImageUrl = (raw: string | null | undefined): string | null => {
    if (!raw) return null;

    let val: string = "";

    if (typeof raw === "string") {
      val = raw;
    } else if ((raw as any)?.url && typeof (raw as any).url === "string") {
      val = (raw as any).url;
    } else {
      return null;
    }

    try {
      if (typeof (apiService as any).getImageUrl === "function") {
        const resolved = (apiService as any).getImageUrl(val);
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

  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await apiService.getRecentlyAddedPets();
        const list = Array.isArray(resp?.recent_pets) ? resp.recent_pets : Array.isArray(resp) ? resp : [];
        const normalized: NormalizedPet[] = list.map(normalizeItem);
        setPets(normalized);
      } catch (err) {
        console.error("Error fetching recent pets:", err);
        setPets([]);
        setError("Failed to load recent pets. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  if (loading) {
    return (
      <section className="pt-12 pb-16 bg-light-neutral dark:bg-dark-background theme-transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-light-accent dark:text-dark-secondary animate-spin mb-4" />
            <p className="text-lg text-light-secondary dark:text-dark-neutral">Loading recent pets...</p>
          </div>
        </div>
      </section>
    );
  }

  const PlaceholderCard = () => (
    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-dark-neutral/60">
      <div className="p-6 rounded-md bg-gray-100 dark:bg-dark-primary/60">
        <PawPrint className="w-12 h-12" />
      </div>
      <div className="mt-3 text-sm font-medium">No Image</div>
    </div>
  );

  const handleImgError = (id: string | number) => {
    setBrokenImages((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section className="pt-12 pb-16 bg-light-neutral dark:bg-dark-background theme-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-left">
          <h2 className="text-4xl font-extrabold text-light-text dark:text-dark-secondary">Recently Added</h2>
          <div className="w-20 h-1 bg-light-accent dark:bg-dark-accent rounded mt-2 mb-4" />
          <p className="text-lg text-light-secondary dark:text-dark-neutral max-w-2xl">
            Meet the newest members of our rescue family — each one is waiting for a loving home.
          </p>
          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-600 text-red-700 dark:text-red-300 rounded">
              {error}
            </div>
          )}
        </div>

        {/* Pets Grid */}
        {pets.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-2xl font-semibold text-light-text dark:text-dark-neutral mb-2">No Recent Pets</h3>
            <p className="text-light-secondary dark:text-dark-neutral/80">Check back soon for new arrivals!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pets.map((p, index) => {
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
                  {/* ✅ Fixed Image Container */}
                  <div className="relative bg-gray-50 dark:bg-dark-background/40 flex items-center justify-center aspect-[4/3] overflow-hidden">
                    {showImage ? (
                      <img
                        src={resolved as string}
                        alt={`${p.name ?? "Pet"}, ${p.breed ?? ""} ${p.pet_type ?? ""}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={() => handleImgError(idKey)}
                        loading="lazy"
                      />
                    ) : (
                      <PlaceholderCard />
                    )}

                    <button
                      onClick={() => toggleFavorite(Number(p.id))}
                      className="absolute top-3 right-3 w-9 h-9 bg-white/90 dark:bg-dark-background/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                      aria-label={`Favorite ${p.name}`}
                    >
                      <Heart
                        className={`w-5 h-5 transition-colors ${
                          favorites.includes(Number(p.id))
                            ? "text-red-500 fill-current"
                            : "text-light-secondary dark:text-dark-neutral hover:text-red-400"
                        }`}
                      />
                    </button>

                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-white/90 dark:bg-dark-background/80 backdrop-blur-sm text-light-text dark:text-dark-secondary shadow-sm">
                        {p.pet_type ?? "Unknown"}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-light-text dark:text-dark-secondary truncate">
                        {p.name ?? "Unknown"}
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {p.is_vaccinated && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300">
                            <Shield className="w-3 h-3 mr-1" /> Vaccinated
                          </span>
                        )}
                        {p.is_diseased ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300">
                            Needs Care
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
                            Healthy
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1 text-sm text-light-secondary dark:text-dark-neutral flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-light-text dark:text-dark-secondary truncate">
                          {p.breed ?? "Unknown Breed"}
                        </span>
                        <span className="text-light-secondary/60 dark:text-dark-neutral/60">•</span>
                        <span className="capitalize">{p.pet_type ?? "Unknown"}</span>
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
                          <span className="truncate">{[p.city, p.state].filter(Boolean).join(", ")}</span>
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
