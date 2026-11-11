import { Link, useLocation } from 'react-router-dom'
import { Home, Compass, Heart, Calendar, ShoppingBag, ChefHat, IdCard } from 'lucide-react'
import { useFavorites } from '../../hooks/useFavorites'
import { useShoppingList } from '../../hooks/useShoppingList'

const navItems = [
  { path: '/', icon: Home, label: 'Beranda' },
  { path: '/jelajah', icon: Compass, label: 'Jelajah' },
  { path: '/resep-saya', icon: ChefHat, label: 'Resep' },
  { path: '/favorit', icon: Heart, label: 'Favorit', badgeKey: 'fav' },
  { path: '/jadwal', icon: Calendar, label: 'Jadwal' },
  { path: '/belanja', icon: ShoppingBag, label: 'Belanja', badgeKey: 'shop' },
  { path: '/kontak', icon: IdCard, label: 'Kontak' },
]

const BottomNav = () => {
  const location = useLocation()
  const { favorites } = useFavorites()
  const { totalCount } = useShoppingList()

  return (
    <nav className="md:hidden fixed bottom-3 left-0 right-0 z-40 px-3 pointer-events-none">
      {/* Floating Capsule with Liquid Glass styling */}
      <div className="max-w-lg mx-auto liquid-glass-capsule rounded-full px-1.5 sm:px-2 py-1.5 shadow-float pointer-events-auto">
        <div className="flex items-center justify-between">
          {navItems.map(({ path, icon: Icon, label, badgeKey }) => {
            const isActive = location.pathname === path
            const count = badgeKey === 'fav' ? favorites.length : badgeKey === 'shop' ? totalCount : 0

            return (
              <Link
                key={path}
                to={path}
                className={`relative flex flex-col items-center justify-center py-1 px-1 rounded-full flex-1 min-w-0 transition-all duration-200 active:scale-90 ${
                  isActive
                    ? 'text-green-primary font-black'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {/* Active Capsule Highlight Pill */}
                {isActive && (
                  <span className="absolute inset-0 rounded-full bg-green-primary/10 -z-10 animate-scale-in" />
                )}

                <div
                  className={`relative w-6 h-5 flex items-center justify-center transition-transform duration-200 ${
                    isActive ? 'scale-110 -translate-y-0.5' : ''
                  }`}
                >
                  <Icon
                    size={18}
                    fill={isActive && badgeKey === 'fav' ? 'currentColor' : 'none'}
                    strokeWidth={isActive ? 2.5 : 1.9}
                  />
                  {count > 0 && (
                    <span className="absolute -top-1 -right-2 min-w-[14px] h-[14px] px-1 bg-accent-orange text-white text-[8px] font-black rounded-full flex items-center justify-center shadow-xs">
                      {count > 99 ? '99+' : count}
                    </span>
                  )}
                </div>

                <span
                  className={`text-[9px] tracking-tight truncate max-w-full leading-tight mt-0.5 ${
                    isActive ? 'font-extrabold text-green-primary' : 'font-medium'
                  }`}
                >
                  {label}
                </span>

                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-green-primary mt-0.5 animate-scale-in" />
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export default BottomNav
