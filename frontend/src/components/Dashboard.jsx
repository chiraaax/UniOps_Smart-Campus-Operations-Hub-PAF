import React from "react";
import { Link } from "react-router-dom";
import { Building2, CalendarCheck2, Package } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Campus Operations Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/facilities"
            className="card hover:shadow-md transition-shadow border-indigo-100"
          >
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="h-6 w-6 text-indigo-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Facilities Module
              </h2>
            </div>
            <p className="text-gray-600">
              Manage facilities with search, filters, pagination, status
              updates, and CRUD flows.
            </p>
          </Link>

          <Link
            to="/booking"
            className="card hover:shadow-md transition-shadow border-blue-100"
          >
            <div className="flex items-center gap-3 mb-2">
              <CalendarCheck2 className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Bookings Module
              </h2>
            </div>
            <p className="text-gray-600">
              Create and track your resource bookings.
            </p>
          </Link>

          <Link
            to="/assets"
            className="card hover:shadow-md transition-shadow border-purple-100"
          >
            <div className="flex items-center gap-3 mb-2">
              <Package className="h-6 w-6 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Assets Module
              </h2>
            </div>
            <p className="text-gray-600">
              Manage campus assets with filtering, status management, and CRUD
              workflows.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
