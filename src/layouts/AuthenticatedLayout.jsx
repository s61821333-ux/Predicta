import { Outlet } from 'react-router-dom'
import { UserProvider } from '../context/UserContext'

export default function AuthenticatedLayout() {
  return (
    <UserProvider>
      <Outlet />
    </UserProvider>
  )
}
