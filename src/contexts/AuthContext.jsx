import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth } from '../firebase.js'
import { loadItems, saveItems } from '../localItems.js'

const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  // Items are kept in memory during the session and mirrored to localStorage.
  const [items, setItems] = useState([])

  // Firebase tells us when the user logs in / out (and remembers the session).
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      // Load this user's items from the device (not from any server).
      setItems(currentUser ? loadItems(currentUser.uid) : [])
      setLoading(false)
    })
    return unsubscribe
  }, [])

  // --- Authentication (online, credentials only) ---
  const signup = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password)

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password)

  const logout = () => signOut(auth)

  const resetPassword = (email) => sendPasswordResetEmail(auth, email)

  // --- Items (stored on device only) ---
  const addItem = async (item) => {
    const newItem = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      ...item,
    }
    const next = [...items, newItem]
    setItems(next)
    saveItems(user.uid, next)
    return newItem
  }

  const deleteItem = async (id) => {
    const next = items.filter((item) => item.id !== id)
    setItems(next)
    saveItems(user.uid, next)
  }

  const value = {
    user,
    loading,
    items,
    signup,
    login,
    logout,
    resetPassword,
    addItem,
    deleteItem,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
