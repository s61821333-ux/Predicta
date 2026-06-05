import { createContext, useContext, useState, useCallback } from 'react'

const AppStateContext = createContext(null)

export function AppStateProvider({ children }) {
  const [toast, setToastMsg] = useState(null)

  const showToast = useCallback((msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 2400)
  }, [])

  return (
    <AppStateContext.Provider value={{ toast, showToast }}>
      {children}
    </AppStateContext.Provider>
  )
}

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider')
  return ctx
}
