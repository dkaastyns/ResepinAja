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
    }
    return titles[location.pathname]
  }

  const isHome = location.pathname === '/'
  const pageTitle = getPageTitle()

  return (
    <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-border-color transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-green-primary to-green-secondary flex items-center justify-center shadow-sm shadow-green-primary/30 group-hover:scale-105 transition-transform duration-200">
              <span className="text-white text-base font-black tracking-tight">R</span>
            </div>
            <div className="hidden xs:block sm:block">
              <span className="font-extrabold text-green-primary text-lg tracking-tight">Resepin</span>
              <span className="font-extrabold text-accent-orange text-lg tracking-tight">Aja</span>
            </div>
          </Link>

          {/* Mobile Page Title if not Home */}
          {!isHome && pageTitle && (
            <div className="md:hidden flex items-center pl-2 border-l border-border-color">
              <h1 className="text-sm font-bold text-text-primary truncate">{pageTitle}</h1>
            </div>
          )}
        </div>

        {/* Center: Desktop Navigation Bar */}
        <nav className="hidden md:flex items-center gap-1 bg-cream-light/80 p-1 rounded-2xl border border-border-color/80">
          {navLinks.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path
            const badgeCount =
              path === '/favorit' ? favorites.length : path === '/belanja' ? totalCount : 0

            return (
              <Link
                key={path}
                to={path}
                className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-surface text-green-primary shadow-sm ring-1 ring-border-color'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface/50'
                }`}
              >
                <Icon size={14} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-green-primary' : ''} />
                <span>{label}</span>
                {badgeCount > 0 && (
                  <span
                    className={`ml-0.5 text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-green-primary/10 text-green-primary' : 'bg-border-color text-text-secondary'
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
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Quick Create Recipe (Desktop) */}
          <Link
            to="/resep-saya"
            className="hidden sm:inline-flex items-center gap-1.5 btn-primary text-xs py-2 px-3.5 shadow-sm"
          >
            <Plus size={15} />
            <span>Tulis Resep</span>
          </Link>

          {/* Quick Search Button */}
          <Link
            to="/jelajah"
            aria-label="Cari resep"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-surface border border-border-color flex items-center justify-center text-text-secondary hover:text-green-primary hover:border-green-secondary/50 hover:shadow-sm transition-all"
          >
            <Search size={18} />
          </Link>

          {/* Settings Shortcut (Desktop) */}
          <Link
            to="/pengaturan"
            aria-label="Pengaturan"
            className="hidden sm:flex w-10 h-10 rounded-xl bg-surface border border-border-color items-center justify-center text-text-secondary hover:text-green-primary hover:border-green-secondary/50 hover:shadow-sm transition-all"
          >
            <Settings size={18} />
          </Link>

          {/* Profile Avatar */}
          <Link
            to="/profil"
            aria-label="Profil"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-green-primary/10 border border-green-primary/20 flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-green-primary/40 transition-all flex-shrink-0"
          >
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-green-primary text-xs font-black">{getInitials()}</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Navbar
