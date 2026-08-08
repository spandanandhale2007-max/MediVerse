import { useCallback, useState } from 'react'

const KEY = 'mediverse-admin-overrides'

// Admin edits live as an OVERLAY on top of the shipped data files rather than
// mutating them: src/data/*.js stays the source of truth, and this records the
// admin's diffs against it. Two reasons — the data files are static imports we
// can't write to from the browser, and an overlay makes every change
// reversible, which is what you want for a delete button.
//
// Deletes are SOFT: an id goes into hidden[], the record stops appearing
// everywhere public, and it can be restored from the Hidden view. Nothing is
// destroyed.
//
// Scope: this is localStorage in one browser. It is not shared with other
// users or devices and it is not a CMS. When a backend exists, swap the
// read/write below for API calls and every consumer keeps working.
const EMPTY = {
  hiddenHospitals: [],
  hospitalEdits: {}, // { [id]: { name?, phone?, email?, ... } }
  hiddenDoctors: [],
  doctorEdits: {}, // { [id]: { name?, specialty?, ... } }
  log: [], // newest first
}

function read() {
  if (typeof window === 'undefined') return EMPTY
  try {
    const raw = window.localStorage.getItem(KEY)
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY
  } catch {
    return EMPTY
  }
}

export function useAdminStore() {
  const [state, setState] = useState(read)

  const commit = useCallback((next) => {
    window.localStorage.setItem(KEY, JSON.stringify(next))
    setState(next)
    return next
  }, [])

  // Every mutation writes an audit line: who, what, when. Without it an admin
  // console is just a way to silently change data.
  const withLog = useCallback((next, entry) => {
    const line = { ...entry, at: new Date().toISOString(), id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}` }
    return { ...next, log: [line, ...(next.log ?? [])].slice(0, 200) }
  }, [])

  const hideHospital = useCallback(
    (hospital, actor) =>
      commit(
        withLog(
          { ...state, hiddenHospitals: [...new Set([...state.hiddenHospitals, hospital.id])] },
          { action: 'hospital.hide', target: hospital.id, label: hospital.name, actor },
        ),
      ),
    [state, commit, withLog],
  )

  const restoreHospital = useCallback(
    (hospital, actor) =>
      commit(
        withLog(
          { ...state, hiddenHospitals: state.hiddenHospitals.filter((x) => x !== hospital.id) },
          { action: 'hospital.restore', target: hospital.id, label: hospital.name, actor },
        ),
      ),
    [state, commit, withLog],
  )

  const editHospital = useCallback(
    (hospital, patch, actor) => {
      const changed = Object.keys(patch).filter((k) => patch[k] !== (hospital[k] ?? ''))
      if (changed.length === 0) return state
      return commit(
        withLog(
          { ...state, hospitalEdits: { ...state.hospitalEdits, [hospital.id]: { ...state.hospitalEdits[hospital.id], ...patch } } },
          { action: 'hospital.edit', target: hospital.id, label: hospital.name, fields: changed, actor },
        ),
      )
    },
    [state, commit, withLog],
  )

  const revertHospital = useCallback(
    (hospital, actor) => {
      const next = { ...state.hospitalEdits }
      delete next[hospital.id]
      return commit(
        withLog({ ...state, hospitalEdits: next }, { action: 'hospital.revert', target: hospital.id, label: hospital.name, actor }),
      )
    },
    [state, commit, withLog],
  )

  const hideDoctor = useCallback(
    (doctor, actor) =>
      commit(
        withLog(
          { ...state, hiddenDoctors: [...new Set([...state.hiddenDoctors, doctor.id])] },
          { action: 'doctor.hide', target: doctor.id, label: doctor.name, actor },
        ),
      ),
    [state, commit, withLog],
  )

  const restoreDoctor = useCallback(
    (doctor, actor) =>
      commit(
        withLog(
          { ...state, hiddenDoctors: state.hiddenDoctors.filter((x) => x !== doctor.id) },
          { action: 'doctor.restore', target: doctor.id, label: doctor.name, actor },
        ),
      ),
    [state, commit, withLog],
  )

  const editDoctor = useCallback(
    (doctor, patch, actor) => {
      const changed = Object.keys(patch).filter((k) => String(patch[k]) !== String(doctor[k] ?? ''))
      if (changed.length === 0) return state
      return commit(
        withLog(
          { ...state, doctorEdits: { ...state.doctorEdits, [doctor.id]: { ...state.doctorEdits[doctor.id], ...patch } } },
          { action: 'doctor.edit', target: doctor.id, label: doctor.name, fields: changed, actor },
        ),
      )
    },
    [state, commit, withLog],
  )

  const revertDoctor = useCallback(
    (doctor, actor) => {
      const next = { ...state.doctorEdits }
      delete next[doctor.id]
      return commit(
        withLog({ ...state, doctorEdits: next }, { action: 'doctor.revert', target: doctor.id, label: doctor.name, actor }),
      )
    },
    [state, commit, withLog],
  )

  const resetAll = useCallback(
    (actor) => commit(withLog({ ...EMPTY }, { action: 'overrides.reset', label: 'All admin changes discarded', actor })),
    [commit, withLog],
  )

  const pendingCount =
    state.hiddenHospitals.length +
    state.hiddenDoctors.length +
    Object.keys(state.hospitalEdits).length +
    Object.keys(state.doctorEdits).length

  return {
    ...state,
    pendingCount,
    hideHospital,
    restoreHospital,
    editHospital,
    revertHospital,
    hideDoctor,
    restoreDoctor,
    editDoctor,
    revertDoctor,
    resetAll,
  }
}
