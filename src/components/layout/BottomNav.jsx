import { Link, useLocation } from 'react-router-dom'
import { Home, Compass, Heart, Calendar, ShoppingBag, ChefHat } from 'lucide-react'
import { useFavorites } from '../../hooks/useFavorites'
import { useShoppingList } from '../../hooks/useShoppingList'

const navItems = [
  { path: '/', icon: Home, label: 'Beranda' },
  { path: '/jelajah', icon: Compass, label: 'Jelajah' },
  { path: '/resep-saya', icon: ChefHat, label: 'Resep Saya' },
  { path: '/favorit', icon: Heart, label: 'Favorit', badgeKey: 'fav' },
  { path: '/jadwal', icon: Calendar, label: 'Jadwal' },
  { path: '/belanja', icon: ShoppingBag, label: 'Belanja', badgeKey: 'shop' },
]

const BottomNav = () => {
  const location = useLocation()
  const { favorites } = useFavorites()
  const { totalCount } = useShoppingList()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-lg border-t border-border-color shadow-nav safe-area-bottom">
      <div className="max-w-md mx-auto px-2">
        <div className="flex items-center justify-around">
          {navItems.map(({ path, icon: Icon, label, badgeKey }) => {
            const isActive = location.pathname === path
            const count = badgeKey === 'fav' ? favorites.length : badgeKey === 'shop' ? totalCount : 0

            return (
              <Link
                key={path}
                to={path}
                className={`relative flex flex-col items-center gap-0.5 py-2.5 px-2 min-w-0 flex-1 transition-all duration-200 active:scale-90 ${
                  isActive ? 'text-green-primary' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <div
                  className={`relative w-6 h-6 flex items-center justify-center transition-transform duration-200 ${
                    isActive ? 'scale-110 -translate-y-0.5' : ''
                  }`}
                >
                  <Icon
                    size={20}
                    fill={isActive && badgeKey === 'fav' ? 'currentColor' : 'none'}
                    strokeWidth={isActive ? 2.5 : 1.8}
                  />
                  {count > 0 && (
                    <span className="absolute -top-1 -right-2 min-w-[15px] h-[15px] px-1 bg-accent-orange text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-sm">
                      {count > 99 ? '99+' : count}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] font-bold tracking-tight truncate ${isActive ? 'text-green-primary' : ''}`}>
                  {label}
                </span>
                {isActive && (
                  <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-green-primary animate-scale-in" />
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
