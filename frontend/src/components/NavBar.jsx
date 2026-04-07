import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🏫</span>
          <span className="text-xl font-bold text-gray-800 hover:text-blue-600 transition">
            UniOps Smart Campus
          </span>
        </Link>

        <div className="flex gap-2">
          <Link
            to="/"
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              location.pathname === '/'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            📅 Book Resource
          </Link>
          <Link
            to="/status"
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              location.pathname === '/status'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            📋 My Bookings
          </Link>
          <Link
            to="/calendar"
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              location.pathname === '/calendar'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            📈 Calendar
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;