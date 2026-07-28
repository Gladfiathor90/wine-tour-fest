import { Outlet } from 'react-router-dom'
import { AdminNav } from '../components/layout/AdminNav'

export function AdminLayout() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[480px] bg-stone-100 shadow-soft">
      <AdminNav />
      <main className="px-4 pb-8 pt-5 min-[700px]:px-6">{<Outlet />}</main>
    </div>
  )
}
