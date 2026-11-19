import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import BrandGlyph from './components/BrandGlyph'
import Footer from './components/Footer'
import LoginGate from './components/LoginGate'
import ProfileGate from './components/ProfileGate'
import { useAuth } from './context/AuthContext'
import { usePointerFx } from './hooks/usePointerFx'
import EcgBackdrop from './components/EcgBackdrop'
import ChatAssistant from './components/ChatAssistant'
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
  const { isAuthenticated, hasProfile, isPatient, isStaff, isAdmin, restoring } = useAuth()
  // One delegated pointer listener for the whole app; see the hook for why.
  usePointerFx()

  // Backdrop wraps every branch (incl. login/profile gates) so the trace runs
  // from the very first screen.
  return (
    <>
      <EcgBackdrop />
      <Shell {...{ isAuthenticated, hasProfile, isPatient, isStaff, isAdmin, restoring }} />
      {/* Patients only — staff/admin have their own consoles. */}
      {isAuthenticated && isPatient && hasProfile && <ChatAssistant />}
    </>
  )
}

function Shell({ isAuthenticated, hasProfile, isPatient, isStaff, isAdmin, restoring }) {
  // Session restore is async; showing the gate now would flash a login screen
  // at returning users before they get signed back in.
  if (restoring) {
    return <SessionSplash />
  }

  if (!isAuthenticated) {
    return <LoginGate />
  }

  // Staff/admin get their own consoles and skip the patient profile gate.
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

  // Patient: ask for profile details only on this number's first sign-in.
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

// Shown briefly while the stored session loads. A spinner that flashes and
// vanishes reads as a glitch, so use a steady pulse on the brand mark instead.
function SessionSplash() {
  return (
    <div className="flex min-h-full items-center justify-center p-6">
      <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
        <BrandGlyph size={22} className="animate-pulse" style={{ color: 'var(--brand)' }} />
        <span className="text-sm font-medium">Restoring your session…</span>
      </div>
    </div>
  )
}
