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
import { storeLockPassword } from '../applock.js'

const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  // unlocked = has the app lock been passed this session? It starts locked, so
  // opening the app (even with a remembered login) asks for the password.
  const [unlocked, setUnlocked] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setItems(currentUser ? loadItems(currentUser.uid) : [])
      setLoading(false)
      // Note: we do NOT unlock here. A restored session still has to pass the
      // lock screen. Only an explicit login/signup unlocks (below).
    })
    return unsubscribe
  }, [])

  // --- Authentication (online, credentials only) ---
  const signup = async (email, password) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await storeLockPassword(cred.user.uid, password)
    setUnlocked(true)
    return cred
  }

  const login = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    // Refresh the local lock hash so unlocking works offline (and after a reset).
    await storeLockPassword(cred.user.uid, password)
    setUnlocked(true)
    return cred
  }

  const logout = async () => {
    setUnlocked(false)
    await signOut(auth)
  }

  const resetPassword = (email) => sendPasswordResetEmail(auth, email)

  // --- App lock controls ---
  const unlockApp = () => setUnlocked(true)
  const lockApp = () => setUnlocked(false)

  // --- Items (stored on device only) ---
  const addItem = async (item) => {
    const newItem = { id: crypto.randomUUID(), createdAt: Date.now(), ...item }
    const next = [...items, newItem]
    setItems(next)
    saveItems(user.uid, next)
    return newItem
  }

  const updateItem = async (id, updates) => {
    const next = items.map((item) =>
      item.id === id ? { ...item, ...updates } : item,
    )
    setItems(next)
    saveItems(user.uid, next)
  }

  const deleteItem = async (id) => {
    const next = items.filter((item) => item.id !== id)
    setItems(next)
    saveItems(user.uid, next)
  }

  const value = {
    user,
    loading,
    unlocked,
    items,
    signup,
    login,
    logout,
    resetPassword,
    unlockApp,
    lockApp,
    addItem,
    updateItem,
    deleteItem,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
