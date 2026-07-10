export default function GameCardSkeleton() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-card-img" />
      <div style={{ padding: '0.75rem' }}>
        <div className="skeleton-line" style={{ height: '1rem', marginBottom: '0.5rem' }} />
        <div className="skeleton-line" style={{ height: '0.75rem', marginBottom: '0.75rem', width: '60%' }} />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <div className="skeleton-line" style={{ height: '0.75rem', flex: 1 }} />
          <div className="skeleton-line" style={{ height: '0.75rem', width: '50px' }} />
        </div>
      </div>
    </div>
  )
}
