import React, { useState, useEffect } from "react";
import { apiService } from "../../services/api";
import type { FeedbackStory } from "../../services/api";

import { motion, AnimatePresence } from "framer-motion";
import { Star, CheckCircle2, User } from "lucide-react";

const CreateFeedbackPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [petName, setPetName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [feedbacks, setFeedbacks] = useState<FeedbackStory[]>([]);

  // Fetch all feedbacks
  const loadFeedbacks = async () => {
    try {
      const data = await apiService.getFeedbackStories();
      setFeedbacks(data);
    } catch (err) {
      console.error("Error fetching feedbacks", err);
    }
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("story", story);
      formData.append("pet_name", petName);
      if (image) {
        formData.append("image", image);
      }

      await apiService.createFeedbackStory(formData);

      setSuccess(true);
      setTitle("");
      setStory("");
      setPetName("");
      setImage(null);

      // Refresh list
      loadFeedbacks();

      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error("Submit error:", err);
      const message = err?.detail || err?.message || JSON.stringify(err);
      setError("Failed: " + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* 3D Styled Heading */}
      <motion.h2
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl md:text-5xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500 drop-shadow-lg"
        style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.15)" }}
      >
        Share Your Feedback 🐾
      </motion.h2>

      {/* Success Animation */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-6 flex items-center justify-center gap-2 rounded-xl bg-green-100 text-green-800 p-4 shadow-md"
          >
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            <span className="font-semibold">🎉 Feedback submitted successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl p-6 mb-10"
      >
        <div className="space-y-4">
          <input
            type="text"
            className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            rows={4}
            className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400"
            placeholder="Your story..."
            value={story}
            onChange={(e) => setStory(e.target.value)}
            required
          />

          <input
            type="text"
            className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400"
            placeholder="Pet name"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            required
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-600"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-pink-500 text-white py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-transform hover:scale-[1.02]"
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>
      </form>

      {/* Feedback List */}
      <div className="space-y-6">
        {feedbacks.map((fb) => (
          <motion.div
            key={fb.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-bold text-lg">
                <User className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900">{fb.title}</h3>
                <p className="text-gray-600 mt-1">{fb.story}</p>
                <div className="mt-2 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-gray-500">
                    by {fb.user || fb.pet_name}
                  </span>
                </div>
                {fb.image && (
                  <img
                    src={fb.image}
                    alt={fb.title}
                    className="mt-3 rounded-lg max-h-60 object-cover"
                  />
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CreateFeedbackPage;
