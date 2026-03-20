import type { TaskStatus } from '../../types'

const config: Record<TaskStatus, { label: string; className: string }> = {
  TODO: {
    label: 'To Do',
    className: 'bg-slate-700 text-slate-300',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    className: 'bg-brand-600/20 text-brand-400 border border-brand-600/30',
  },
  DONE: {
    label: 'Done',
    className: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  },
}

export default function Badge({ status }: { status: TaskStatus }) {
  const { label, className } = config[status]
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${className}`}>
      {label}
    </span>
  )
}