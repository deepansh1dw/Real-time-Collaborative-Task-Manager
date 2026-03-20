export default function TaskSkeleton() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="h-4 bg-slate-700 rounded w-1/2" />
        <div className="h-6 bg-slate-700 rounded-full w-16" />
      </div>
      <div className="h-3 bg-slate-800 rounded w-3/4 mb-2" />
      <div className="h-3 bg-slate-800 rounded w-1/2 mb-4" />
      <div className="flex items-center justify-between">
        <div className="h-3 bg-slate-800 rounded w-24" />
        <div className="flex gap-2">
          <div className="h-7 w-7 bg-slate-700 rounded-lg" />
          <div className="h-7 w-7 bg-slate-700 rounded-lg" />
        </div>
      </div>
    </div>
  )
}