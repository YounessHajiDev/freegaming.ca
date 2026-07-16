export default function GameCardSkeleton({ count = 5 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl overflow-hidden bg-[var(--bg-surface)] border border-[var(--line-subtle)]">
          <div className="game-card-image skeleton" />
          <div className="p-3">
            <div className="skeleton h-4 w-4/5 mb-2" />
            <div className="skeleton h-3 w-1/2" />
          </div>
        </div>
      ))}
    </>
  )
}
