import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import BottomNav from './BottomNav'
import InstallPrompt from '../ui/InstallPrompt'

const Layout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-green-primary/20 selection:text-green-dark">
      <Navbar />
      <main className="flex-1 pb-24 md:pb-12 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <Outlet />
      </main>
      <InstallPrompt />
      <BottomNav />
    </div>
  )
}

export default Layout
