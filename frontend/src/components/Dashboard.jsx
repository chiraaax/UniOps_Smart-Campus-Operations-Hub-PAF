import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.role === 'ADMIN') {
        navigate('/admin-dashboard');
      } else if (user.role === 'TECHNICIAN') {
        navigate('/technician-dashboard');
      }
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-24 text-center">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 italic">
          Welcome to <span className="text-blue-600">UniOps Hub</span>
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto italic">
          Your centralized platform for smart campus operations, resource management, and facility support.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-2xl">
              📅
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800 italic">Smart Reservation</h3>
            <p className="text-gray-600 italic">Effortlessly book lecture halls, laboratories, and specialized equipment with real-time availability tracking.</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6 text-2xl">
              🏢
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800 italic">Facility Insights</h3>
            <p className="text-gray-600 italic">Access detailed live status updates and utilization metrics for all campus infrastructure from a single dashboard.</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6 text-2xl">
              🛠️
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800 italic">Unified Support</h3>
            <p className="text-gray-600 italic">Report maintenance issues, request technical assistance, and track the progress of your service tickets seamlessly.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
