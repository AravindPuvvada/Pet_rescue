import React, { useState, useEffect } from "react";
import { apiService } from "../../services/api";
import type { FeedbackStory } from "../../services/api";

import { motion, AnimatePresence } from "framer-motion";
import { Star, CheckCircle2, User, UploadCloud } from "lucide-react";

const CreateFeedbackPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [petName, setPetName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [feedbacks, setFeedbacks] = useState<FeedbackStory[]>([]);

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
  
  const formInputClasses = "w-full bg-light-primary/50 dark:bg-dark-background/50 border border-light-secondary/30 dark:border-dark-secondary/30 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent transition-all text-light-text dark:text-dark-secondary placeholder-light-text/50 dark:placeholder-dark-neutral";


  return (
    <div className="bg-light-primary dark:bg-dark-background theme-transition min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <motion.h2
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl md:text-5xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-light-secondary to-light-accent dark:from-dark-secondary dark:to-dark-accent drop-shadow-lg"
          style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.15)" }}
        >
          Share Your Feedback 🐾
        </motion.h2>

        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-6 flex items-center justify-center gap-2 rounded-xl bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 p-4 shadow-md border border-green-200 dark:border-green-800"
            >
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <span className="font-semibold">🎉 Feedback submitted successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form
          onSubmit={handleSubmit}
          className="bg-light-neutral dark:bg-dark-primary rounded-2xl shadow-xl p-6 mb-10 border border-light-secondary/20 dark:border-dark-secondary/20"
        >
          <div className="space-y-4">
            <input
              type="text"
              className={formInputClasses}
              placeholder="Title of your story"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <textarea
              rows={4}
              className={formInputClasses}
              placeholder="Share your success story with us..."
              value={story}
              onChange={(e) => setStory(e.target.value)}
              required
            />

            <input
              type="text"
              className={formInputClasses}
              placeholder="Your Pet's Name"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              required
            />

            <div className="border-2 border-dashed border-light-secondary/50 dark:border-dark-secondary/50 rounded-lg p-6 text-center cursor-pointer hover:border-light-accent dark:hover:border-dark-accent transition-colors">
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                    className="sr-only"
                    id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                    <UploadCloud className="mx-auto h-12 w-12 text-light-text/60 dark:text-dark-neutral" />
                    <p className="mt-2 text-sm text-light-text dark:text-dark-secondary">
                        {image ? `Selected: ${image.name}` : 'Click to upload an image'}
                    </p>
                    <p className="text-xs text-light-text/50 dark:text-dark-neutral">PNG, JPG, GIF up to 10MB</p>
                </label>
            </div>


            {error && <p className="text-red-500 dark:text-red-400 text-sm text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-light-accent to-light-secondary dark:from-dark-accent dark:to-dark-primary text-white py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-transform hover:scale-[1.02] disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        </form>

        <div className="space-y-6">
          {feedbacks.map((fb) => (
            <motion.div
              key={fb.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-light-neutral dark:bg-dark-primary rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow border border-light-secondary/10 dark:border-dark-secondary/20"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-light-secondary to-light-accent dark:from-dark-secondary dark:to-dark-accent text-white font-bold text-lg flex-shrink-0">
                  <User className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-light-text dark:text-dark-secondary">{fb.title}</h3>
                  <p className="text-light-text/80 dark:text-dark-neutral mt-1">{fb.story}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400 dark:text-yellow-500" />
                    <span className="text-sm text-light-text/60 dark:text-dark-neutral">
                      by {fb.user || fb.pet_name}
                    </span>
                  </div>
                  {fb.image && (
                    <img
                      src={fb.image}
                      alt={fb.title}
                      className="mt-3 rounded-lg max-h-60 object-cover border border-light-secondary/20 dark:border-dark-secondary/20"
                    />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateFeedbackPage;