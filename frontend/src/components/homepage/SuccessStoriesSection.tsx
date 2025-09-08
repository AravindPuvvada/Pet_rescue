import React, { useState, useEffect } from 'react';
import { Star, User } from 'lucide-react';

const SuccessStoriesSection: React.FC = () => {
  const [currentStory, setCurrentStory] = useState(0);

  const successStories = [
    {
      id: 1,
      image: "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400",
      title: "Max Found His Way Home",
      description: "After 3 days missing, Max was reunited with his family thanks to our community.",
      owner: "Sarah Johnson"
    },
    {
      id: 2,
      image: "https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=400",
      title: "Luna's Rescue Story",
      description: "Luna was found injured and nursed back to health before finding her forever home.",
      owner: "Mike Chen"
    },
    {
      id: 3,
      image: "https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=400",
      title: "Buddy's Second Chance",
      description: "Abandoned but not forgotten, Buddy found a loving family through PetRescue.",
      owner: "Emma Davis"
    }
  ];

  // Auto-rotate success stories
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStory((prev) => (prev + 1) % successStories.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [successStories.length]);

  return (
    <section id="stories" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Success <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">Stories</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Every reunion tells a story of hope, community, and the unbreakable bond between pets and their families
          </p>
        </div>

        {/* Story Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img
                  src={successStories[currentStory].image}
                  alt={successStories[currentStory].title}
                  className="w-full h-64 md:h-80 object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center mb-4">
                  <Star className="w-5 h-5 text-yellow-400 mr-1" />
                  <Star className="w-5 h-5 text-yellow-400 mr-1" />
                  <Star className="w-5 h-5 text-yellow-400 mr-1" />
                  <Star className="w-5 h-5 text-yellow-400 mr-1" />
                  <Star className="w-5 h-5 text-yellow-400 mr-3" />
                  <span className="text-sm text-gray-500">Success Story</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {successStories[currentStory].title}
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  {successStories[currentStory].description}
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center mr-3">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{successStories[currentStory].owner}</div>
                    <div className="text-sm text-gray-500">Pet Owner</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Story Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {successStories.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStory(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentStory 
                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 w-8' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStoriesSection;