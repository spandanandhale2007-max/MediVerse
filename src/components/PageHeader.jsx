export default function PageHeader({ eyebrow, title, description }) {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-8 pt-10 text-center sm:pt-14">
      {eyebrow && (
        <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--brand)' }}>
          {eyebrow}
        </span>
      )}
      <h1 className="mt-2 text-3xl font-semibold sm:text-4xl" style={{ color: 'var(--text-primary)' }}>
        {title}
      </h1>
      {description && (
        <p className="mx-auto mt-3 max-w-xl text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
          {description}
        </p>
      )}
    </div>
  )
}
