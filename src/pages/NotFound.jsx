import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <p className="text-sm font-semibold" style={{ color: 'var(--brand)' }}>
        404
      </p>
      <h1 className="mt-2 text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
        Page not found
      </h1>
      <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
        The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-full px-5 py-2.5 text-sm font-semibold text-white"
        style={{ background: 'var(--brand)' }}
      >
        Back to home
      </Link>
    </div>
  )
}
