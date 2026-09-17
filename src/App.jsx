import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import BiometricGate from './components/BiometricGate.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import Home from './pages/Home.jsx'
import AddItem from './pages/AddItem.jsx'
import FindItem from './pages/FindItem.jsx'

export default function App() {
  const { loading } = useAuth()

  return (
    <BiometricGate>
      <AppRoutes loading={loading} />
    </BiometricGate>
  )
}

function AppRoutes({ loading }) {
  // While Firebase checks if the user is already signed in, show a spinner
  // to avoid briefly flashing the login screen.
  if (loading) {
    return (
      <div className="center-screen">
        <div className="spinner" />
      </div>
    )
  }

  return (
    <Routes>
      {/* Public routes (login / account creation / recovery) */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected routes (only when signed in) */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add"
        element={
          <ProtectedRoute>
            <AddItem />
          </ProtectedRoute>
        }
      />
      <Route
        path="/find"
        element={
          <ProtectedRoute>
            <FindItem />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
