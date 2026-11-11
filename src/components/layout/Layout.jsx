import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import BottomNav from './BottomNav'
import InstallPrompt from '../ui/InstallPrompt'

const Layout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-green-primary/20 selection:text-green-dark">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-28 md:pb-14">
        <Outlet />
      </main>
      <InstallPrompt />
      <BottomNav />
    </div>
  )
}

export default Layout
