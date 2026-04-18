import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

// --- SHARED ---
import Footer from './components/common/Footer';

// --- ADMIN ---
import AdminSidebar from './components/admin/AdminSidebar';
import AdminDashboard from './Pages/admin/AdminDashboard';
import AdminBookings from './Pages/bookings/AdminBookings';

// --- STUDENT ---
import StudentNavbar from './components/student/StudentNavbar';
import HomePage from './Pages/student/HomePage';
import StudentBookings from './Pages/bookings/StudentBookings';

// --- FACILITIES ---
import FacilitiesCatalogue from './Pages/facilities/FacilitiesCatalogue';
import FacilityDetails from './Pages/facilities/FacilityDetails';

// --- INCIDENTS ---
import IncidentList from './Pages/incidents/IncidentList';
import CreateIncident from './Pages/incidents/CreateIncident';
import TicketDetails from './Pages/incidents/TicketDetails';

// --- AUTH ---
import LoginPage from './Pages/auth/LoginPage';
import RegisterPage from './Pages/auth/RegisterPage';

const AppRoutes = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div style={{ padding: '50px', textAlign: 'center', color: '#0d6efd', fontWeight: 'bold', fontFamily: 'sans-serif' }}>Loading Campus Nexus...</div>;
  }

  // ==========================================
  // 1. ADMIN LAYOUT (Sidebar + Dashboard)
  // ==========================================

  // ADMIN
  if (user && user.role === 'ADMIN') {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7f6' }}>
        <AdminSidebar />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <main style={{ flex: 1, padding: '20px' }}>
            <Routes>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />

              <Route path="/facilities" element={<FacilitiesCatalogue />} />
              <Route path="/facilities/:id" element={<FacilityDetails />} />
              <Route path="/admin/bookings" element={<AdminBookings />} />

              <Route path="/incidents" element={<IncidentList />} />
              <Route path="/incidents/new" element={<CreateIncident />} />
              <Route path="/incidents/:id" element={<TicketDetails />} />

              <Route path="*" element={<Navigate to="/admin/dashboard" />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. PUBLIC & STUDENT LAYOUT (Top Navbar + Home)
  // ==========================================
  // STUDENT / PUBLIC
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f4f7f6' }}>
      <StudentNavbar />

      <main style={{ flex: 1, padding: '30px' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/facilities" element={<FacilitiesCatalogue />} />
          <Route path="/facilities/:id" element={<FacilityDetails />} />
          
          {/* Protected Route: Only logged-in students can see their bookings */}
          <Route path="/my-bookings" element={user ? <StudentBookings /> : <Navigate to="/login" />} />
          
          {/* Auth Routes */}

          <Route path="/incidents" element={<IncidentList />} />
          <Route path="/incidents/new" element={<CreateIncident />} />
          <Route path="/incidents/:id" element={<TicketDetails />} />

          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" />} />
          
          {/* Catch-all route */}

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

// ==========================================
// MAIN APP WRAPPER
// ==========================================
function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;