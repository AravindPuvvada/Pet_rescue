import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, KeyRound, ArrowRight } from "lucide-react";

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
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="flex items-center justify-center min-h-screen bg-gray-50 px-6"
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-4">Verify Account</h2>
        <p className="text-gray-600 text-sm text-center mb-6">
          We sent a verification code to <span className="font-semibold">{email}</span>
        </p>
        {message && (
          <div
            className={`mb-4 p-3 rounded-lg text-center font-medium text-sm ${
              message.includes("successfully")
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {message.includes("successfully") && (
              <CheckCircle className="w-4 h-4 inline mr-1" />
            )}
            {message}
          </div>
        )}
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Enter OTP
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
                placeholder="Enter 6-digit code"
              />
            </div>
          </div>
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-orange-500 to-sky-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Verify</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default VerifyAccount;
