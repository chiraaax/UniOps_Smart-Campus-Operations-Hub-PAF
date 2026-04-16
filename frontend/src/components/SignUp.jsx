import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "STUDENT",
    department: ""
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          department: formData.department
        }),
      });

      if (response.ok) {
        alert("Account Created Successfully!");
        navigate("/signin");
      } else {
        const errorData = await response.text();
        alert(errorData || "Failed to create account. Please try again.");
      }
    } catch (error) {
      console.error("Sign-up error:", error);
      alert("An error occurred. Please make sure the backend is running.");
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
              <option value="ADMIN">Admin</option>
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

        <p className="text-xs text-gray-500 mt-6 text-center">
          Already have an account? <Link to="/signin" className="text-blue-600 hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
