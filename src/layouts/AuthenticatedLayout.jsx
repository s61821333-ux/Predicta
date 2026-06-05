import { Outlet } from 'react-router-dom'
import { UserProvider } from '../context/UserContext'
import { AppStateProvider } from '../context/AppStateContext'

export default function AuthenticatedLayout() {
  return (
    <UserProvider>
      <AppStateProvider>
        <Outlet />
      </AppStateProvider>
    </UserProvider>
  )
}
