import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

// Only show the page when signed in. Otherwise send to the login screen.
export default function ProtectedRoute({ children }) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  return children
}
