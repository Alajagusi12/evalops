export default function Loading() {
  return (
    <div className="space-y-8 max-w-6xl animate-pulse">
      <div>
        <div className="h-8 bg-surface rounded w-48 mb-2"></div>
        <div className="h-4 bg-surface rounded w-64"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 rounded border border-border bg-surface h-32"></div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-5 rounded border border-border bg-surface h-80"></div>
        <div className="p-5 rounded border border-border bg-surface h-80"></div>
      </div>
    </div>
  );
}