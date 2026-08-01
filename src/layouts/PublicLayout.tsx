import { Outlet } from 'react-router-dom'
import { ScrollDownHint } from '../components/common/ScrollDownHint'
import { PublicNav } from '../components/layout/PublicNav'

export function PublicLayout() {
  return (
    <div className="wtf-public-app mx-auto min-h-screen w-full max-w-[480px] bg-[#f6f2e8] text-stone-900 shadow-soft">
      <main className="px-4 pb-32 pt-0 min-[700px]:px-6">{<Outlet />}</main>
      <ScrollDownHint />
      <PublicNav />
    </div>
  )
}
