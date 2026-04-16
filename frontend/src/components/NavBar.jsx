import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, ClipboardList, LogIn, UserPlus, UserCircle } from 'lucide-react';

const NavBar = () => {
  const location = useLocation();

  const isAuthPage = location.pathname === '/signin' || location.pathname === '/signup';

  if (isAuthPage) return null;

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm fixed top-0 w-full z-50 border-b border-gray-100 italic">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="bg-blue-600 p-2 rounded-lg group-hover:rotate-12 transition-transform duration-300">
            <span className="text-xl text-white">🏫</span>
          </div>
          <span className="text-xl font-bold text-gray-800 tracking-tight">
            UniOps <span className="text-blue-600">Hub</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/dashboard"
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all font-medium ${
              location.pathname === '/dashboard'
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
            }`}
          >
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link
            to="/booking"
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all font-medium ${
              location.pathname === '/booking'
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
            }`}
          >
            <BookOpen size={18} /> Book Resource
          </Link>
          <Link
            to="/status"
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all font-medium ${
              location.pathname === '/status'
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
            }`}
          >
            <ClipboardList size={18} /> My Bookings
          </Link>
          <Link
            to="/profile"
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all font-medium ${
              location.pathname === '/profile'
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
            }`}
          >
            <UserCircle size={18} /> Profile
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3 border-l border-gray-100 pl-6 ml-2">
          <Link
            to="/signin"
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-gray-700 hover:bg-gray-100 transition-all"
          >
            <LogIn size={18} /> Sign In
          </Link>
          <Link
            to="/signup"
            className="flex items-center gap-2 px-5 py-2 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-100"
          >
            <UserPlus size={18} /> Sign Up
          </Link>
          <Link
            to="/admin"
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              location.pathname === '/admin'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            🛠️ Admin
          </Link>
          <Link
            to="/admin/verify"
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              location.pathname === '/admin/verify'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            🔍 Verify
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;