// Loading placeholders for data fetched from Supabase.
//
// Key rule: each placeholder must take up the same space as its real content,
// or the page jumps when data arrives. So every skeleton below mirrors the
// real component's padding, gaps and text sizes.
//
// Accessibility: the bones are aria-hidden; the wrapper carries aria-busy plus
// a polite live message so screen readers say "Loading hospitals" once.

export function Skeleton({ className = '', rounded = 'rounded-md', style }) {
  return <span aria-hidden="true" className={`sk ${rounded} block ${className}`} style={style} />
}

// Wraps skeletons so screen readers get one clear message, not silence.
export function SkeletonRegion({ label = 'Loading', children }) {
  return (
    <div aria-busy="true" aria-live="polite" aria-label={label}>
      {children}
    </div>
  )
}

// ---------------------------------------------------------------- hospitals
// Mirrors the card in RealHospitals.jsx: title, meta, badge, address, pills.
export function HospitalCardSkeleton() {
  return (
    <div className="card p-5">
      <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="mt-2 h-3 w-1/2" />
        </div>
        <Skeleton className="h-6 w-28" rounded="rounded-full" />
      </div>
      <Skeleton className="mt-3 h-3 w-full" />
      <Skeleton className="mt-1.5 h-3 w-4/5" />
      <div className="mt-3 flex flex-wrap gap-2">
        <Skeleton className="h-7 w-36" rounded="rounded-full" />
        <Skeleton className="h-7 w-28" rounded="rounded-full" />
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <Skeleton className="h-7 w-32" rounded="rounded-full" />
        <Skeleton className="h-7 w-24" rounded="rounded-full" />
      </div>
    </div>
  )
}

export function HospitalListSkeleton({ count = 6 }) {
  return (
    <SkeletonRegion label="Loading hospitals">
      <div className="space-y-4">
        {Array.from({ length: count }, (_, i) => (
          <HospitalCardSkeleton key={i} />
        ))}
      </div>
    </SkeletonRegion>
  )
}

// ------------------------------------------------------------------ doctors
export function DoctorCardSkeleton() {
  return (
    <div className="card flex flex-col gap-3 p-5">
      <div className="flex items-start justify-between gap-2">
        <Skeleton className="h-11 w-11" rounded="rounded-full" />
        <Skeleton className="h-6 w-24" rounded="rounded-full" />
      </div>
      <div>
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="mt-2 h-3 w-1/2" />
        <Skeleton className="mt-1.5 h-3 w-1/3" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  )
}

export function DoctorGridSkeleton({ count = 6 }) {
  return (
    <SkeletonRegion label="Loading doctors">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }, (_, i) => (
          <DoctorCardSkeleton key={i} />
        ))}
      </div>
    </SkeletonRegion>
  )
}

// -------------------------------------------------------------------- rails
// For the horizontal scrollers on the home page.
export function RailSkeleton({ count = 6, width = 'w-64' }) {
  return (
    <SkeletonRegion label="Loading">
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className={`card shrink-0 ${width} p-4`}>
            <Skeleton className="h-10 w-10" rounded="rounded-xl" />
            <Skeleton className="mt-3 h-4 w-3/4" />
            <Skeleton className="mt-2 h-3 w-1/2" />
            <div className="mt-3 flex gap-1.5">
              <Skeleton className="h-7 flex-1" rounded="rounded-lg" />
              <Skeleton className="h-7 flex-1" rounded="rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </SkeletonRegion>
  )
}

// --------------------------------------------------------------- stat tiles
export function StatRowSkeleton({ count = 4 }) {
  return (
    <SkeletonRegion label="Loading statistics">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="card p-4">
            <Skeleton className="h-9 w-9" rounded="rounded-lg" />
            <Skeleton className="mt-3 h-6 w-16" />
            <Skeleton className="mt-2 h-3 w-20" />
          </div>
        ))}
      </div>
    </SkeletonRegion>
  )
}

// ------------------------------------------------------------- generic rows
export function TextBlockSkeleton({ lines = 3 }) {
  return (
    <SkeletonRegion>
      <div className="space-y-2">
        {Array.from({ length: lines }, (_, i) => (
          // Short last line, like real wrapped text (equal bars read as a table).
          <Skeleton key={i} className={`h-3 ${i === lines - 1 ? 'w-2/5' : 'w-full'}`} />
        ))}
      </div>
    </SkeletonRegion>
  )
}
