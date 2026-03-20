import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@clerk/react'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return isSignedIn ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded) return null

  return (
    <Routes>
      <Route
        path="/login"
        element={isSignedIn ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to={isSignedIn ? '/dashboard' : '/login'} replace />} />
    </Routes>
  )
}