// src/components/pages/AdminPets.tsx
import React, { useState, useEffect, useMemo } from "react";
import { apiService, type Pet as BasePet } from "../../services/api";
import { X, Search, Filter, MapPin, PawPrint, Palette, User } from "lucide-react";

interface InputFilters {
  location: string;
  petType: string;
  color: string;
  breed: string;
  status: string;
}

// ✅ Extend base Pet with pet_status
interface PetWithStatus extends BasePet {
  pet_status: string;
}

const API_BASE_URL = "http://127.0.0.1:8000";

const getImageUrl = (path: string | undefined) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path}`;
};

const AdminPets: React.FC = () => {
  const [allPets, setAllPets] = useState<PetWithStatus[]>([]);
  const [inputFilters, setInputFilters] = useState<InputFilters>({
    location: "",
    petType: "",
    color: "",
    breed: "",
    status: "",
  });
  const [activeFilters, setActiveFilters] = useState<InputFilters>({
    location: "",
    petType: "",
    color: "",
    breed: "",
    status: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchLostAndFound = async () => {
      try {
        setLoading(true);
        setError(null);

        const [lostResp, foundResp] = await Promise.allSettled([
          apiService.getLostPets(),
          apiService.getFoundPets(),
        ]);

        const normalizePet = (item: any, status: string): PetWithStatus => {
          const petSource = item.pet ?? {};
          return {
            id: petSource.id,
            name: String(petSource.name ?? ""),
            pet_type: String(petSource.pet_type ?? ""),
            breed: String(petSource.breed ?? ""),
            age: petSource.age ?? undefined,
            color: String(petSource.color ?? ""),
            address: String(item.address ?? petSource.address ?? ""),
            city: String(item.city ?? petSource.city ?? ""),
            state: String(petSource.state ?? ""),
            gender: String(petSource.gender ?? ""),
            image: getImageUrl(item.image ?? petSource.image ?? undefined),
            description: String(petSource.description ?? item.description ?? ""),
            pet_status: status,
          } as PetWithStatus;
        };

        const lostPets: PetWithStatus[] = [];
        const foundPets: PetWithStatus[] = [];

        if (lostResp.status === "fulfilled") {
          (lostResp.value?.lost_pets ?? []).forEach((item: any) =>
            lostPets.push(normalizePet(item, "Lost"))
          );
        }
        if (foundResp.status === "fulfilled") {
          (foundResp.value?.found_pets ?? []).forEach((item: any) =>
            foundPets.push(normalizePet(item, "Found"))
          );
        }

        setAllPets([...lostPets, ...foundPets]);
      } catch (err) {
        console.error(err);
        setError("Failed to load pet data. Please try again later.");
        setAllPets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLostAndFound();
  }, []);

  const filteredPets = useMemo(() => {
    const activeLocation = activeFilters.location.trim().toLowerCase();
    const activePetType = activeFilters.petType.trim().toLowerCase();
    const activeColor = activeFilters.color.trim().toLowerCase();
    const activeBreed = activeFilters.breed.trim().toLowerCase();
    const activeStatus = activeFilters.status.trim().toLowerCase();
    const activeSearch = searchQuery.trim().toLowerCase();

    return allPets.filter((pet) => {
      const petType = String(pet.pet_type || "").toLowerCase();
      const petLocation = `${pet.city ?? ""} ${pet.state ?? ""} ${pet.address ?? ""}`.toLowerCase();
      const petColor = String(pet.color || "").toLowerCase();
      const petBreed = String(pet.breed || "").toLowerCase();
      const petStatus = String(pet.pet_status || "").toLowerCase();
      const petName = String(pet.name || "").toLowerCase();

      return (
        (activeSearch === "" || petName.includes(activeSearch)) &&
        (activeLocation === "" || petLocation.includes(activeLocation)) &&
        (activePetType === "" || petType.includes(activePetType)) &&
        (activeColor === "" || petColor.includes(activeColor)) &&
        (activeBreed === "" || petBreed.includes(activeBreed)) &&
        (activeStatus === "" || petStatus === activeStatus)
      );
    });
  }, [allPets, activeFilters, searchQuery]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setInputFilters((prev) => ({ ...prev, [name]: value }));
  };
  const handleApplyFilters = () => {
    setActiveFilters({ ...inputFilters });
    setShowFilters(false);
  };
  const resetFilters = () => {
    const cleared = {
      location: "",
      petType: "",
      color: "",
      breed: "",
      status: "",
    };
    setInputFilters(cleared);
    setActiveFilters(cleared);
  };

  const petsToDisplay = filteredPets;

  const formInputClasses =
    "w-full p-2 rounded-lg border bg-light-neutral dark:bg-dark-background text-light-text dark:text-dark-secondary border-light-secondary/40 dark:border-dark-neutral/50 focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent transition";

  if (loading) {
    return (
      <div className="bg-light-neutral dark:bg-dark-background flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-light-accent dark:border-dark-accent"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-light-neutral dark:bg-dark-background flex justify-center items-center min-h-screen">
        <div className="text-center text-red-500 dark:text-red-400 text-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light-neutral dark:bg-dark-background min-h-screen theme-transition">
      <div className="animate-fade-in container mx-auto p-4">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-light-text dark:text-dark-secondary tracking-tight">
              Lost Pets
            </h1>
            <p className="text-lg text-light-secondary dark:text-dark-neutral font-medium">
              Help us reunite these pets with their families.
            </p>
          </div>
        </div>

        {/* Search + Filters Bar */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex-1 flex items-center bg-dark-background text-dark-secondary rounded-lg shadow px-3 py-2">
            <Search className="w-5 h-5 mr-2 text-gray-400" />
            <input
              type="text"
              placeholder="Search pets by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent focus:outline-none text-light-text dark:text-dark-secondary text-base font-medium"
            />
          </div>
          <button
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold shadow hover:scale-105 transform transition"
          >
            <Filter className="w-5 h-5" /> Filters
          </button>
        </div>

        {/* Pet List */}
        {petsToDisplay.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {petsToDisplay.map((pet) => (
              <div
                key={`${(pet as any).report_id ?? pet.id}`}
                className="bg-white dark:bg-dark-primary rounded-xl shadow-md overflow-hidden transform transition hover:scale-[1.03] hover:shadow-2xl"
              >
                {/* ✅ Fixed Image Container */}
                <div className="relative aspect-[4/3] bg-gray-100 dark:bg-dark-neutral overflow-hidden">
                  {pet.image ? (
                    <img
                      src={pet.image}
                      alt={pet.name || "Pet"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}
                </div>

                <div className="p-5">
                  {/* Status Badge */}
                  <div
                    className={`inline-block mb-3 px-3 py-1 rounded-full text-xs font-semibold
                      ${
                        pet.pet_status === "Lost"
                          ? "bg-red-500 text-white"
                          : "bg-green-500 text-white"
                      }`}
                  >
                    {pet.pet_status}
                  </div>

                  {/* Name & Gender */}
                  <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-gray-500" />
                    {pet.name || "Unnamed"}{" "}
                    <span className="text-sm text-gray-500">({pet.gender || "N/A"})</span>
                  </h2>

                  {/* Breed & Type */}
                  <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm mb-1">
                    <PawPrint className="w-4 h-4" /> {pet.breed || "Unknown"} (
                    {String(pet.pet_type) || "Pet"})
                  </p>

                  {/* Color */}
                  <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm mb-1">
                    <Palette className="w-4 h-4" /> {pet.color || "Unknown"}
                  </p>

                  {/* Location */}
                  <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
                    <MapPin className="w-4 h-4" /> {pet.city || "Unknown"},{" "}
                    {pet.state || ""} {pet.address || ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-light-secondary dark:text-dark-neutral text-lg py-16">
            No pets found matching your search/filters.
          </div>
        )}
      </div>

      {/* Filters Sidebar */}
      {showFilters && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-dark-primary w-full max-w-sm h-full shadow-xl p-6 animate-[slideIn_0.3s_ease-out]">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 border-b pb-2">
              <h2 className="text-2xl font-bold text-light-text dark:text-dark-secondary">
                Filters
              </h2>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-neutral transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Fields */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={inputFilters.location}
                  onChange={handleFilterChange}
                  placeholder="e.g., Delhi"
                  className={formInputClasses}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Pet Type</label>
                <select
                  name="petType"
                  value={inputFilters.petType}
                  onChange={handleFilterChange}
                  className={formInputClasses}
                >
                  <option value="">All</option>
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Color</label>
                <input
                  type="text"
                  name="color"
                  value={inputFilters.color}
                  onChange={handleFilterChange}
                  placeholder="e.g., Brown"
                  className={formInputClasses}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Breed</label>
                <input
                  type="text"
                  name="breed"
                  value={inputFilters.breed}
                  onChange={handleFilterChange}
                  placeholder="e.g., Labrador"
                  className={formInputClasses}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Status</label>
                <select
                  name="status"
                  value={inputFilters.status}
                  onChange={handleFilterChange}
                  className={formInputClasses}
                >
                  <option value="">All</option>
                  <option value="Lost">Lost</option>
                  <option value="Found">Found</option>
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-8 gap-3">
              <button
                onClick={resetFilters}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-200 dark:bg-dark-neutral/30 text-gray-700 dark:text-dark-secondary font-semibold hover:scale-105 transform transition"
              >
                Reset
              </button>
              <button
                onClick={handleApplyFilters}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold shadow hover:scale-105 transform transition"
              >
                <Search className="w-4 h-4" /> Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPets;
