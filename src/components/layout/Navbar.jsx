import { Link, useLocation } from 'react-router-dom'
import {
  Search,
  Plus,
  Home,
  Compass,
  Heart,
  Calendar,
  ShoppingBag,
  ChefHat,
  Sparkles,
  Settings,
  IdCard,
} from 'lucide-react'
import { useProfile } from '../../hooks/useProfile'
import { useFavorites } from '../../hooks/useFavorites'
import { useShoppingList } from '../../hooks/useShoppingList'

const navLinks = [
  { path: '/', label: 'Beranda', icon: Home },
  { path: '/jelajah', label: 'Jelajah', icon: Compass },
  { path: '/cari-bahan', label: 'Dari Bahan', icon: Sparkles },
  { path: '/resep-saya', label: 'Resep Saya', icon: ChefHat },
  { path: '/favorit', label: 'Favorit', icon: Heart },
  { path: '/jadwal', label: 'Jadwal', icon: Calendar },
  { path: '/belanja', label: 'Belanja', icon: ShoppingBag },
  { path: '/kontak', label: 'Kontak', icon: IdCard },
]

const Navbar = () => {
  const location = useLocation()
  const { profile, getInitials } = useProfile()
  const { favorites } = useFavorites()
  const { totalCount } = useShoppingList()

  const getPageTitle = () => {
    const titles = {
      '/': null,
      '/jelajah': 'Jelajah Resep',
      '/cari-bahan': 'Cari dari Bahan',
      '/resep-saya': 'Resep Saya',
      '/favorit': 'Resep Favorit',
      '/jadwal': 'Rencana Menu',
      '/belanja': 'Daftar Belanja',
      '/profil': 'Profil Saya',
      '/pengaturan': 'Pengaturan',
      '/kontak': 'Info Kontak',
    }
    return titles[location.pathname]
  }

  const isHome = location.pathname === '/'
  const pageTitle = getPageTitle()

  return (
    <header className="fixed top-3 left-0 right-0 z-40 px-3 sm:px-6 pointer-events-none transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Floating Liquid Glass Capsule Container */}
        <div className="w-full liquid-glass-capsule rounded-full px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-4 shadow-float pointer-events-auto">
          {/* Left: Brand Logo & Title */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
            <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-green-primary to-green-secondary flex items-center justify-center shadow-sm shadow-green-primary/30 group-hover:scale-105 transition-transform duration-200">
                <span className="text-white text-sm sm:text-base font-black tracking-tight">R</span>
              </div>
              <div className="flex items-center">
                <span className="font-black text-green-primary text-base sm:text-lg tracking-tight">
                  Resepin
                </span>
                <span className="font-black text-accent-orange text-base sm:text-lg tracking-tight">
                  Aja
                </span>
              </div>
            </Link>

            {/* Mobile Page Title if not Home */}
            {!isHome && pageTitle && (
              <div className="md:hidden flex items-center pl-2 border-l border-black/10">
                <span className="text-xs font-bold text-text-primary truncate max-w-[120px]">
                  {pageTitle}
                </span>
              </div>
            )}
          </div>

          {/* Center: Desktop Navigation Bar Pills */}
          <nav className="hidden lg:flex items-center gap-1 bg-surface/50 p-1 rounded-full border border-white/50 shadow-inner">
            {navLinks.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path
              const badgeCount =
                path === '/favorit' ? favorites.length : path === '/belanja' ? totalCount : 0

              return (
                <Link
                  key={path}
                  to={path}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-green-primary text-white shadow-sm shadow-green-primary/30'
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/70'
                  }`}
                >
                  <Icon
                    size={13}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={isActive ? 'text-white' : ''}
                  />
                  <span>{label}</span>
                  {badgeCount > 0 && (
                    <span
                      className={`ml-0.5 text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-white/25 text-white' : 'bg-cream text-text-secondary'
                      }`}
                    >
                      {badgeCount}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {/* Quick Create Recipe (Desktop) */}
            <Link
              to="/resep-saya"
              className="hidden sm:inline-flex items-center gap-1.5 btn-primary text-xs py-2 px-3.5 rounded-full shadow-sm"
            >
              <Plus size={14} />
              <span>Tulis Resep</span>
            </Link>

            {/* Quick Search Button */}
            <Link
              to="/jelajah"
              aria-label="Cari resep"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/70 hover:bg-white border border-white/80 flex items-center justify-center text-text-secondary hover:text-green-primary shadow-xs transition-all"
            >
              <Search size={16} />
            </Link>

            {/* Settings Shortcut (Desktop) */}
            <Link
              to="/pengaturan"
              aria-label="Pengaturan"
              className="hidden sm:flex w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/70 hover:bg-white border border-white/80 items-center justify-center text-text-secondary hover:text-green-primary shadow-xs transition-all"
            >
              <Settings size={16} />
            </Link>

            {/* Profile Avatar */}
            <Link
              to="/profil"
              aria-label="Profil"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-green-primary/10 border-2 border-white/90 shadow-xs flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-green-primary/40 transition-all flex-shrink-0"
            >
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-green-primary text-xs font-black">{getInitials()}</span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
