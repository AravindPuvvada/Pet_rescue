// src/components/pages/RecentPets.tsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Heart, MapPin, Calendar, Shield } from "lucide-react";

interface Pet {
  id: number;
  name: string;
  pet_type: string;
  breed: string;
  age: number;
  city: string;
  state: string;
  image?: string | null;
  is_vaccinated?: boolean;
  is_diseased?: boolean;
}

const RecentPets: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const mockPets: Pet[] = [
    {
      id: 1,
      name: "Rocky",
      pet_type: "Dog",
      breed: "Labrador",
      age: 3,
      city: "Bangalore",
      state: "Karnataka",
      image:
        "https://images.pexels.com/photos/4587990/pexels-photo-4587990.jpeg?auto=compress&cs=tinysrgb&w=400",
      is_vaccinated: true,
      is_diseased: false,
    },
    {
      id: 2,
      name: "Tommy",
      pet_type: "Dog",
      breed: "Bulldog",
      age: 2,
      city: "Bangalore",
      state: "Karnataka",
      image:
        "https://images.pexels.com/photos/406014/pexels-photo-406014.jpeg?auto=compress&cs=tinysrgb&w=400",
      is_vaccinated: false,
      is_diseased: false,
    },
    {
      id: 3,
      name: "Whiskers",
      pet_type: "Cat",
      breed: "Persian",
      age: 1,
      city: "Mumbai",
      state: "Maharashtra",
      image:
        "https://images.pexels.com/photos/127028/pexels-photo-127028.jpeg?auto=compress&cs=tinysrgb&w=400",
      is_vaccinated: true,
      is_diseased: false,
    },
    {
      id: 4,
      name: "Buddy",
      pet_type: "Dog",
      breed: "Golden Retriever",
      age: 4,
      city: "Delhi",
      state: "Delhi",
      image:
        "https://images.pexels.com/photos/46024/pexels-photo-46024.jpeg?auto=compress&cs=tinysrgb&w=400",
      is_vaccinated: false,
      is_diseased: true,
    },
  ];

  useEffect(() => {
    const fetchPets = async () => {
      try {
        // Simulating API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Uncomment the below for actual API call
        // const response = await fetch("http://127.0.0.1:8000/api/pets/recent/");
        // if (!response.ok)
        //   throw new Error(`HTTP error! status: ${response.status}`);
        // const data = await response.json();
        // setPets(data.recent_pets || []);
        throw new Error("Simulating backend fetch error to show mock data.");
      } catch (err) {
        console.warn("Backend API not available, using mock data:", err);
        setPets(mockPets);
        setError("Using demo data - backend server not connected");
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

  return (
    <section className="pt-12 pb-16 bg-light-neutral dark:bg-dark-background theme-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-left">
          {error && (
            <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 dark:border-yellow-600/50 text-yellow-700 dark:text-yellow-300 rounded-lg text-sm">
              ⚠ {error}
            </div>
          )}
          <h2 className="text-4xl font-extrabold text-light-text dark:text-dark-secondary">
            Recently Added
          </h2>
          <div className="w-20 h-1 bg-light-accent dark:bg-dark-accent rounded mt-2 mb-4"></div>
          <p className="text-lg text-light-secondary dark:text-dark-neutral max-w-2xl">
            Meet the newest members of our rescue family — each one is waiting
            for a loving home.
          </p>
        </div>

        {/* Pets Grid */}
        {pets.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-light-secondary/50 dark:text-dark-neutral/60 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-light-text dark:text-dark-neutral mb-2">
              No Recent Pets
            </h3>
            <p className="text-light-secondary dark:text-dark-neutral/80">Check back soon for new arrivals!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pets.map((pet, index) => {
              const defaultDogImgs = [
                "https://images.pexels.com/photos/356378/pexels-photo-356378.jpeg?auto=compress&cs=tinysrgb&w=400",
                "https://images.pexels.com/photos/46024/pexels-photo-46024.jpeg?auto=compress&cs=tinysrgb&w=400",
                "https://images.pexels.com/photos/4587990/pexels-photo-4587990.jpeg?auto=compress&cs=tinysrgb&w=400",
              ];
              const defaultCatImgs = [
                "https://images.pexels.com/photos/617278/pexels-photo-617278.jpeg?auto=compress&cs=tinysrgb&w=400",
                "https://images.pexels.com/photos/127028/pexels-photo-127028.jpeg?auto=compress&cs=tinysrgb&w=400",
                "https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=400",
              ];

              const defaultImg =
                pet.pet_type.toLowerCase() === "dog"
                  ? defaultDogImgs[index % defaultDogImgs.length]
                  : defaultCatImgs[index % defaultCatImgs.length];

              return (
                <motion.div
                  key={pet.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="group bg-white dark:bg-dark-primary rounded-2xl shadow-md dark:shadow-black/50 border border-light-primary/50 dark:border-dark-neutral/30 overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col"
                >
                  <div className="relative overflow-hidden h-56">
                    <img
                      src={pet.image || defaultImg}
                      alt={`${pet.name}, a ${pet.breed} ${pet.pet_type}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = defaultImg;
                      }}
                      loading="lazy"
                    />
                    <button
                      onClick={() => toggleFavorite(pet.id)}
                      className="absolute top-3 right-3 w-9 h-9 bg-white/90 dark:bg-dark-background/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                      aria-label={`Favorite ${pet.name}`}
                    >
                      <Heart
                        className={`w-5 h-5 transition-colors ${
                          favorites.includes(pet.id)
                            ? "text-red-500 fill-current"
                            : "text-light-secondary dark:text-dark-neutral hover:text-red-400"
                        }`}
                      />
                    </button>
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-white/90 dark:bg-dark-background/80 backdrop-blur-sm text-light-text dark:text-dark-secondary shadow-sm">
                        {pet.pet_type}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-light-text dark:text-dark-secondary truncate">
                        {pet.name}
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {pet.is_vaccinated && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300">
                            <Shield className="w-3 h-3 mr-1" /> Vaccinated
                          </span>
                        )}
                        {pet.is_diseased ? (
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
                          {pet.breed}
                        </span>
                        <span className="text-light-secondary/60 dark:text-dark-neutral/60">•</span>
                        <span className="capitalize">{pet.pet_type}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-light-secondary/60 dark:text-dark-neutral/60" />
                        <span>
                          Age: {pet.age} {pet.age === 1 ? "year" : "years"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-light-secondary/60 dark:text-dark-neutral/60" />
                        <span className="truncate">
                          {pet.city}, {pet.state}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-4">
                      <button className="flex-1 bg-light-accent text-white py-2 px-4 rounded-lg font-semibold hover:bg-light-accent/90 dark:bg-dark-accent dark:hover:bg-dark-accent/90 hover:shadow-md transition-all text-sm">
                        View Details
                      </button>
                      <button className="px-4 py-2 border-2 border-light-secondary/40 dark:border-dark-neutral/50 text-light-secondary dark:text-dark-neutral rounded-lg font-semibold hover:border-light-accent hover:text-light-accent dark:hover:border-dark-secondary dark:hover:text-dark-secondary transition-colors text-sm">
                        Contact
                      </button>
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