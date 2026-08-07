import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Appointments from './pages/Appointments'
import Doctors from './pages/Doctors'
import BedAvailability from './pages/BedAvailability'
import Medications from './pages/Medications'
import Vaccinations from './pages/Vaccinations'
import Campaigns from './pages/Campaigns'
import NotFound from './pages/NotFound'

export default function App() {
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
