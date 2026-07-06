export default function GameCardSkeleton({ count = 5 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ borderRadius: '12px', overflow: 'hidden', background: 'var(--bg-surface)', border: '1px solid var(--line-subtle)' }}>
          <div className="skeleton" style={{ width: '100%', height: '160px' }} />
          <div style={{ padding: '12px' }}>
            <div className="skeleton" style={{ height: '16px', width: '80%', marginBottom: '8px' }} />
            <div className="skeleton" style={{ height: '12px', width: '50%' }} />
          </div>
        </div>
      ))}
    </>
  )
}
