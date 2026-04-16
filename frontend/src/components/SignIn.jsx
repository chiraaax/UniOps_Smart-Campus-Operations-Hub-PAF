import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const SignIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch("http://localhost:8080/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const userData = await response.json();
        // Store user data in localStorage for persistence
        localStorage.setItem("user", JSON.stringify(userData));
        alert("Sign-in Successful!");
        navigate("/dashboard");
      } else {
        const errorMsg = await response.text();
        alert(errorMsg || "Invalid email or password!");
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      alert("An error occurred. Please make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-200 to-white">
      
      {/* Glass Card */}
      <div className="backdrop-blur-lg bg-white/30 border border-white/40 shadow-xl rounded-2xl p-8 w-[350px] text-center">

        {/* Icon */}
        <div className="w-10 h-10 mx-auto mb-4 flex items-center justify-center rounded-full bg-white/60">
          🔐
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-800">
          Sign in with email
        </h2>
        <p className="text-sm text-gray-600 mt-1 mb-5">
          Access your UniOps Hub account
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-left">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 rounded-md bg-white/70 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-3 py-2 rounded-md bg-white/70 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400"
            required
          />

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? "Signing In..." : "Get Started"}
          </button>
        </form>

        <p className="text-xs text-gray-500 mt-6 text-center">
          Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
