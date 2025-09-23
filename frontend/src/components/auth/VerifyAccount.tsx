import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, KeyRound, ArrowRight } from "lucide-react";
import ThemeToggle from '../ThemeToggle';

const API_BASE_URL = "http://127.0.0.1:8000/api";

const VerifyAccount: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = (location.state as { email: string })?.email || localStorage.getItem("email") || "";

  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Redirect if email is missing (page refresh or direct access)
  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setMessage(null);

    try {
      const payload = {
        email: email.trim(),
        code: otp.trim(),
        username: location.state?.username,
        password: location.state?.password,
        phone: location.state?.phone || "",
        address: location.state?.address || "",
        pincode: location.state?.pincode || "",
        gender: location.state?.gender || "",
      };

      console.log("Sending verify request:", payload);

      const res = await fetch(`${API_BASE_URL}/verify-register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || err.error || "Verification failed");
      }

      setMessage("Account verified successfully!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage(err.message);
      } else {
        setMessage("Invalid OTP, try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Don't render component if email is missing
  if (!email) return null;

  return (
    <div className="min-h-screen bg-light-primary dark:bg-dark-background flex items-center justify-center p-4 theme-transition">
      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle variant="auth" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-light-neutral/90 dark:bg-dark-primary/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-light-secondary/20 dark:border-dark-secondary/20 p-8"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-light-accent dark:bg-dark-accent rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <span className="text-3xl">🐕‍🦺</span>
          </div>
          <h2 className="text-2xl font-bold text-light-text dark:text-dark-secondary mb-2">Verify Account</h2>
          <p className="text-light-text/70 dark:text-dark-neutral text-sm">
            We sent a verification code to <span className="font-semibold text-light-accent dark:text-dark-accent">{email}</span>
          </p>
        </div>

        {message && (
          <div
            className={`mb-4 p-3 rounded-lg text-center font-medium text-sm border ${
              message.includes("successfully")
                ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-700"
                : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-700"
            }`}
          >
            {message.includes("successfully") && (
              <CheckCircle className="w-4 h-4 inline mr-1" />
            )}
            {message}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-light-text dark:text-dark-secondary mb-2">
              Enter OTP
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text/50 dark:text-dark-neutral w-5 h-5" />
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white/70 dark:bg-dark-background/50 border border-light-secondary/30 dark:border-dark-secondary/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent focus:border-transparent transition-all duration-300 text-light-text dark:text-dark-secondary placeholder-light-text/50 dark:placeholder-dark-neutral"
                placeholder="Enter 6-digit code"
                maxLength={6}
              />
            </div>
          </div>
          
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-light-accent dark:bg-dark-accent text-white py-3 px-6 rounded-xl font-semibold text-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-light-accent/50 dark:focus:ring-dark-accent/50 transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Verify</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default VerifyAccount;