import { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-[220px_1fr] bg-gray-50">
      <aside className="border-r bg-white p-4">
        <div className="mb-6 text-lg font-bold">Admin</div>
        <nav className="flex flex-col gap-1">
          <NavLink to="/" className="rounded-xl px-3 py-2 hover:bg-gray-100">대시보드</NavLink>
          <NavLink to="/users" className="rounded-xl px-3 py-2 hover:bg-gray-100">회원</NavLink>
          <NavLink to="/posts" className="rounded-xl px-3 py-2 hover:bg-gray-100">게시물</NavLink>
        </nav>
      </aside>
      <main className="p-6">
        {children}
      </main>
    </div>
  )
}
