import { Outlet } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ToastContainer } from '@/components/ui/Toast'

export function Root() {
  return (
    <AppShell>
      <Outlet />
      <ToastContainer />
    </AppShell>
  )
}
