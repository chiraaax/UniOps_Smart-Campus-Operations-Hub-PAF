import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { API_BASE_URL, ENABLE_GOOGLE_AUTH } from "../utils/config";

const apiBaseUrl = API_BASE_URL;

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "STUDENT",
    department: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          department: formData.department
        }),
      });

      if (response.ok) {
        if (formData.role === "TECHNICIAN") {
            alert("Registration Successful! Your technician account is pending administrator approval. You will be able to log in once approved.");
        } else {
            alert("Account Created Successfully!");
        }
        navigate("/signin");
      } else {
        const errorData = await response.text();
        alert(errorData || "Failed to create account. Please try again.");
      }
    } catch (error) {
      console.error("Sign-up error:", error);
      setError("An error occurred. Please make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignupSuccess = async (credentialResponse) => {
    setLoading(true);
    setError("");

    const token = credentialResponse?.credential;
    if (!token) {
      setError("Google Sign Up Failed");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/google-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        if (data.user.role === "ADMIN") {
          navigate("/admin-dashboard");
        } else if (data.user.role === "TECHNICIAN") {
          navigate("/technician-dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        const errorMsg = await response.text();
        setError(errorMsg || "Google sign up failed");
      }
    } catch (err) {
      setError("Connection to backend failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-200 to-white py-12">
      
      <div className="backdrop-blur-lg bg-white/30 border border-white/40 shadow-xl rounded-2xl p-8 w-[420px] text-center">

        <div className="w-10 h-10 mx-auto mb-4 flex items-center justify-center rounded-full bg-white/60">
          ✨
        </div>

        <h2 className="text-lg font-semibold text-gray-800">
          Create your account
        </h2>
        <p className="text-sm text-gray-600 mt-1 mb-5">
          Join and start managing everything in one place
        </p>

        {error && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 text-center text-sm font-medium rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-left">
          
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 rounded-md bg-white/70 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400"
            required
          />

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            className="w-full px-3 py-2 rounded-md bg-white/70 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 rounded-md bg-white/70 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-md bg-white/70 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400"
            >
              <option value="STUDENT">Student</option>
              <option value="TECHNICIAN">Technician</option>
            </select>

            <input
              type="text"
              name="department"
              placeholder="Department"
              value={formData.department}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-md bg-white/70 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-md bg-white/70 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400"
              required
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-md bg-white/70 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? "Creating Account..." : "Get Started"}
          </button>
        </form>

        {ENABLE_GOOGLE_AUTH && (
          <>
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white/70 text-gray-500">Or sign up with</span>
              </div>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSignupSuccess}
                onError={() => setError("Google Sign Up Failed")}
              />
            </div>
          </>
        )}

        <p className="text-xs text-gray-500 mt-6 text-center">
          Already have an account? <Link to="/signin" className="text-blue-600 hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
