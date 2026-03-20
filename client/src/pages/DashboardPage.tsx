import { useAuth, useUser } from '@clerk/react'
import { useEffect } from 'react'
import { setAuthToken } from '../lib/api'

export default function DashboardPage() {
  const { getToken, signOut } = useAuth()
  const { user } = useUser()

  useEffect(() => {
    // Attach Clerk JWT to every API call automatically
    const attachToken = async () => {
      const token = await getToken()
      setAuthToken(token)
    }
    attachToken()
  }, [getToken])

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome back, {user?.firstName} 👋
            </h1>
            <p className="text-slate-400 text-sm mt-1">Here are your tasks</p>
          </div>
          <button
            onClick={() => signOut()}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300
                       rounded-lg text-sm transition-colors border border-slate-700"
          >
            Sign out
          </button>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
          <p className="text-slate-400">Tasks will appear here — backend coming next!</p>
        </div>
      </div>
    </div>
  )
}