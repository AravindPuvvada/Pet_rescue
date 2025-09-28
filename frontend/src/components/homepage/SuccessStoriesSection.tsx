import React, { useState, useEffect, useRef } from 'react';
import { Star, User } from 'lucide-react';
import { apiService } from '../../services/api';

type ApiStory = {
  id: number;
  user: string; // StringRelatedField from serializer
  title: string;
  story: string; // backend 'story' field used as description
  pet_name?: string;
  submitted_at?: string;
  image?: string;      // may be relative path
  image_url?: string;  // serializer's absolute URL if available
};

const staticFallback = [
  {
    id: 1,
    image:
      "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400",
    title: "Max Found His Way Home",
    description:
      "After 3 days missing, Max was reunited with his family thanks to our community.",
    owner: "Sarah Johnson",
  },
  {
    id: 2,
    image:
      "https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=400",
    title: "Luna's Rescue Story",
    description:
      "Luna was found injured and nursed back to health before finding her forever home.",
    owner: "Mike Chen",
  },
  {
    id: 3,
    image:
      "https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=400",
    title: "Buddy's Second Chance",
    description:
      "Abandoned but not forgotten, Buddy found a loving family through PetRescue.",
    owner: "Emma Davis",
  },
];

const SuccessStoriesSection: React.FC = () => {
  const [stories, setStories] = useState<
    { id: number; image: string; title: string; description: string; owner: string }[]
  >(staticFallback);
  const [currentStory, setCurrentStory] = useState(0);
  const intervalRef = useRef<number | null>(null);

  // Fetch stories from API on mount
  useEffect(() => {
    let mounted = true;

    const fetchStories = async () => {
      try {
        const data = await apiService.getFeedbackStories(); // returns ApiStory[]
        if (!mounted) return;

        if (Array.isArray(data) && data.length > 0) {
          // Map API shape into the UI shape
          const mapped = data.map((s) => ({
            id: s.id,
            // Prefer absolute image_url, fallback to image or a placeholder
            image:
              (s as ApiStory).image_url ||
              (s as ApiStory).image ||
              'https://via.placeholder.com/800x600?text=No+image',
            title: s.title || 'Untitled Story',
            description: s.story || '',
            owner: s.user || s.pet_name || 'Pet Owner',
          }));
          setStories(mapped);
          setCurrentStory(0);
        } else {
          // keep staticFallback if API empty
          setStories(staticFallback);
          setCurrentStory(0);
        }
      } catch (err) {
        // on error keep static fallback and silently log
        console.error('Failed to load feedback stories', err);
        setStories(staticFallback);
      }
    };

    fetchStories();

    return () => {
      mounted = false;
    };
  }, []);

  // Auto-rotate carousel; restart when stories change
  useEffect(() => {
    // clear previous timer
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (stories.length <= 1) return;

    intervalRef.current = window.setInterval(() => {
      setCurrentStory((prev) => (prev + 1) % stories.length);
    }, 4000);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [stories]);

  // Guard: ensure currentStory index is valid
  useEffect(() => {
    if (currentStory >= stories.length) {
      setCurrentStory(0);
    }
  }, [stories.length, currentStory]);

  const active = stories[currentStory];

  return (
    <section id="stories" className="py-20 bg-light-neutral dark:bg-dark-background theme-transition">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-light-text dark:text-dark-secondary mb-6">
            Success <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">Stories</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto mb-8"></div>
          <p className="text-xl text-light-secondary dark:text-dark-neutral max-w-2xl mx-auto">
            Every reunion tells a story of hope, community, and the unbreakable bond between pets and their families
          </p>
        </div>

        {/* Story Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white dark:bg-dark-primary rounded-3xl shadow-2xl overflow-hidden theme-transition">
            <div className="md:flex">
              <div className="w-1000 h-300">
  <img
    src={active.image}
    alt={active.title}
    className="w-full h-full object-cover rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none"
/>
</div>

              <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center mb-4">
                  <Star className="w-5 h-5 text-yellow-400 mr-1" />
                  <Star className="w-5 h-5 text-yellow-400 mr-1" />
                  <Star className="w-5 h-5 text-yellow-400 mr-1" />
                  <Star className="w-5 h-5 text-yellow-400 mr-1" />
                  <Star className="w-5 h-5 text-yellow-400 mr-3" />
                  <span className="text-sm text-light-secondary/80 dark:text-dark-neutral/80">Success Story</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-light-text dark:text-dark-secondary mb-4">
                  {active.title}
                </h3>
                <p className="text-light-secondary dark:text-dark-neutral text-lg leading-relaxed mb-6">
                  {active.description}
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center mr-3">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    {/* <div className="font-semibold text-light-text dark:text-dark-secondary">{active.owner}</div> */}
                    <div className="text-sm text-light-secondary/80 dark:text-dark-neutral/80">Pet Owner</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Story Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {stories.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStory(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentStory
                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 w-8'
                    : 'bg-light-secondary/30 hover:bg-light-secondary/50 dark:bg-dark-neutral/30 dark:hover:bg-dark-neutral/50'
                }`}
                aria-label={`Go to story ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStoriesSection;