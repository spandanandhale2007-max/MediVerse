import { createContext, useContext, useMemo } from 'react'
import { useAdminStore } from '../hooks/useAdminStore'
import { realHospitals } from '../data/hospitals'
import { doctors as baseDoctors } from '../data/mock'

const AdminContext = createContext(null)

// Wraps the whole app (not just the admin console) because the public pages
// have to respect what the admin hid or edited — otherwise "remove this
// hospital" would only remove it from the admin's own table.
export function AdminProvider({ children }) {
  const store = useAdminStore()

  const value = useMemo(() => {
    const applyHospital = (h) => ({ ...h, ...(store.hospitalEdits[h.id] ?? {}) })
    const applyDoctor = (d) => ({ ...d, ...(store.doctorEdits[d.id] ?? {}) })

    return {
      ...store,
      // What the public site should show.
      hospitals: realHospitals.filter((h) => !store.hiddenHospitals.includes(h.id)).map(applyHospital),
      doctors: baseDoctors.filter((d) => !store.hiddenDoctors.includes(d.id)).map(applyDoctor),
      // Everything, including hidden — the admin tables need this.
      allHospitals: realHospitals.map(applyHospital),
      allDoctors: baseDoctors.map(applyDoctor),
    }
  }, [store])

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export function useDirectory() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useDirectory must be used within an AdminProvider')
  return ctx
}
