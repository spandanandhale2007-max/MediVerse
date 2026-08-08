import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LoginGate from './components/LoginGate'
import ProfileGate from './components/ProfileGate'
import { useAuth } from './context/AuthContext'
import Home from './pages/Home'
import Appointments from './pages/Appointments'
import Doctors from './pages/Doctors'
import BedAvailability from './pages/BedAvailability'
import Medications from './pages/Medications'
import Vaccinations from './pages/Vaccinations'
import Campaigns from './pages/Campaigns'
import Support from './pages/Support'
import Emergency from './pages/Emergency'
import Specialists from './pages/Specialists'
import RealHospitals from './pages/RealHospitals'
import Profile from './pages/Profile'
import MyReports from './pages/MyReports'
import WardDashboard from './pages/WardDashboard'
import AdminDashboard from './pages/AdminDashboard'
import NotFound from './pages/NotFound'

export default function App() {
  const { isAuthenticated, hasProfile, isPatient, isStaff, isAdmin } = useAuth()

  if (!isAuthenticated) {
    return <LoginGate />
  }

  // Staff and admin get their own consoles. They never pass through the
  // patient profile gate — name/age/location is a patient concept.
  if (isStaff || isAdmin) {
    return (
      <div className="flex min-h-full flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            {isStaff && <Route path="/ward" element={<WardDashboard />} />}
            {isAdmin && <Route path="/admin" element={<AdminDashboard />} />}
            <Route path="/hospitals" element={<RealHospitals />} />
            <Route path="/support" element={<Support />} />
            <Route path="*" element={<Navigate to={isStaff ? '/ward' : '/admin'} replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    )
  }

  // Patient: ask for details only the first time this number signs in.
  if (isPatient && !hasProfile) {
    return <ProfileGate />
  }

  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/beds" element={<BedAvailability />} />
          <Route path="/medications" element={<Medications />} />
          <Route path="/vaccinations" element={<Vaccinations />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/support" element={<Support />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/specialists" element={<Specialists />} />
          <Route path="/hospitals" element={<RealHospitals />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/reports" element={<MyReports />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
