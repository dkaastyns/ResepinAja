import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Flame,
  Sparkles,
  Clock,
  ChefHat,
  Search,
  Heart,
  BookOpen,
  Tag,
  TrendingUp,
  Zap,
  Calendar,
} from 'lucide-react'
import RecipeCard from '../components/ui/RecipeCard'
import CategoryCard from '../components/ui/CategoryCard'
import LazyImage from '../components/ui/LazyImage'
import { useRecipes } from '../hooks/useRecipes'
import { useFavorites } from '../hooks/useFavorites'
import { useProfile } from '../hooks/useProfile'
import { CATEGORIES } from '../data/sampleRecipes'
import { getTotalTime } from '../utils/helpers'

const Home = () => {
  const navigate = useNavigate()
  const { allRecipes } = useRecipes()
  const { favorites, isFavorite, toggleFavorite } = useFavorites()
  const { profile } = useProfile()
  const [searchQuery, setSearchQuery] = useState('')

  const popularRecipes = useMemo(() => allRecipes.slice(0, 8), [allRecipes])
  const latestRecipes = useMemo(
    () =>
      [...allRecipes]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 8),
    [allRecipes]
  )
  const quickRecipes = useMemo(
    () => allRecipes.filter(r => getTotalTime(r) <= 20).slice(0, 6),
    [allRecipes]
  )

  const featuredRecipe = allRecipes[0]

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 11) return 'Selamat Pagi'
    if (hour < 15) return 'Selamat Siang'
    if (hour < 18) return 'Selamat Sore'
    return 'Selamat Malam'
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/jelajah?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const categoryRecipeCounts = useMemo(() => {
    const counts = {}
    allRecipes.forEach(r => {
      counts[r.category] = (counts[r.category] || 0) + 1
    })
    return counts
  }, [allRecipes])

  return (
    <div className="space-y-8 sm:space-y-10 animate-fade-in pb-6">
      {/* Hero Section - Clean, Editorial, Anti-Slop */}
      <div className="relative overflow-hidden rounded-3xl bg-[#1E301B] p-6 sm:p-8 lg:p-10 shadow-lg text-white border border-[#2B4327]">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Greeting, Title, Search Bar */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-white/90">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-orange" />
              <span>Resep Masakan Rumahan</span>
            </div>

            <div>
              <p className="text-white/70 text-sm font-medium">
                {getGreeting()}, <span className="text-white font-bold">{profile.name.split(' ')[0]}</span>
              </p>
              <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-black mt-1 leading-tight tracking-tight">
                Mau masak apa hari ini?
              </h1>
              <p className="text-white/70 text-xs sm:text-sm mt-2 max-w-lg leading-relaxed">
                Temukan inspirasi masakan harian, cari berdasarkan sisa bahan di kulkas, atau kelola jadwal menu mingguan.
              </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-xl pt-1">
              <div className="relative flex items-center">
                <Search
                  size={18}
                  className="absolute left-4 text-text-secondary pointer-events-none"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nasi goreng, soto ayam, balado..."
                  className="w-full bg-white rounded-2xl pl-11 pr-24 py-3.5 sm:py-4 text-text-primary text-sm placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-green-secondary shadow-sm transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-4 py-2 bg-green-primary hover:bg-green-dark text-white text-xs font-bold rounded-xl transition-all shadow-xs active:scale-95"
                >
                  Cari
                </button>
              </div>
            </form>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-white/60 font-medium">Pilihan cepat:</span>
              {[
                { label: 'Cari dari Bahan', to: '/cari-bahan', icon: Sparkles },
                { label: 'Rencana Menu', to: '/jadwal', icon: Calendar },
                { label: 'Masak Cepat ≤20m', to: '/jelajah', icon: Zap },
              ].map(({ label, to, icon: IconComponent }) => (
                <Link
                  key={label}
                  to={to}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/10 transition-colors"
                >
                  <IconComponent size={12} className="text-white/80" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Column (Desktop): Featured Recipe Card */}
          {featuredRecipe && (
            <div className="hidden lg:block lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden bg-surface p-4 text-text-primary border border-white/20 shadow-xl">
                <div className="relative h-48 rounded-xl overflow-hidden mb-3">
                  <LazyImage
                    src={featuredRecipe.image}
                    alt={featuredRecipe.title}
                    containerClassName="h-full w-full"
                    className="hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="backdrop-blur-md bg-black/60 text-white px-3 py-1 rounded-lg text-xs font-semibold">
                      Pilihan Hari Ini
                    </span>
                  </div>
                </div>
                <h3 className="font-bold text-lg text-text-primary hover:text-green-primary transition-colors line-clamp-1">
                  {featuredRecipe.title}
                </h3>
                <p className="text-xs text-text-secondary line-clamp-2 mt-1">
                  {featuredRecipe.description}
                </p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-color">
                  <div className="flex items-center gap-1.5 text-xs text-text-secondary font-medium">
                    <Clock size={13} className="text-green-primary" />
                    <span>{getTotalTime(featuredRecipe)} menit</span>
                  </div>
                  <Link
                    to={`/resep/${featuredRecipe.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-green-primary hover:text-green-dark transition-colors"
                  >
                    Masak Sekarang <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Counter Bar (Connected to Live State) */}
      <div className="bg-surface rounded-2xl sm:rounded-3xl shadow-card border border-border-color p-4 sm:p-5 grid grid-cols-3 gap-3 sm:gap-6 divide-x divide-border-color">
        {[
          { label: 'Koleksi Resep', value: allRecipes.length, icon: BookOpen, color: 'text-green-primary bg-green-primary/10' },
          { label: 'Kategori Ragam', value: CATEGORIES.length, icon: Tag, color: 'text-accent-orange bg-accent-orange/10' },
          { label: 'Resep Favorit', value: favorites.length, icon: Heart, color: 'text-red-500 bg-red-50' },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col sm:flex-row items-center sm:items-center justify-center gap-2 sm:gap-3 text-center sm:text-left">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center ${stat.color} shadow-sm`}>
              <stat.icon size={20} />
            </div>
            <div>
              <div className="font-black text-text-primary text-xl sm:text-2xl leading-none tracking-tight">
                {stat.value}
              </div>
              <div className="text-text-secondary text-[11px] sm:text-xs font-medium mt-1">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Kategori Masakan (Responsive Grid) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="section-title">Kategori Masakan</h2>
            <p className="text-xs text-text-secondary mt-0.5">Pilih kategori sesuai seleramu</p>
          </div>
          <Link
            to="/jelajah"
            className="text-green-primary hover:text-green-dark text-xs sm:text-sm font-bold flex items-center gap-1 transition-colors"
          >
            Lihat Semua <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3">
          {CATEGORIES.map(cat => (
            <CategoryCard
              key={cat.id}
              category={cat.name}
              recipeCount={categoryRecipeCounts[cat.name] || 0}
              onClick={() => navigate(`/jelajah?kategori=${encodeURIComponent(cat.name)}`)}
            />
          ))}
        </div>
      </section>

      {/* Resep Populer */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-accent-orange/10 flex items-center justify-center text-accent-orange">
              <Flame size={18} />
            </div>
            <div>
              <h2 className="section-title">Resep Pilihan Populer</h2>
              <p className="text-xs text-text-secondary">Paling sering dimasak minggu ini</p>
            </div>
          </div>
          <Link
            to="/jelajah"
            className="text-green-primary hover:text-green-dark text-xs sm:text-sm font-bold flex items-center gap-1 transition-colors"
          >
            Semua <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {popularRecipes.slice(0, 4).map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isFavorite={isFavorite(recipe.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      </section>

      {/* Masak Cepat ≤ 20 Menit */}
      {quickRecipes.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-green-primary/10 flex items-center justify-center text-green-primary">
                <Clock size={18} />
              </div>
              <div>
                <h2 className="section-title">Masak Cepat ≤ 20 Menit</h2>
                <p className="text-xs text-text-secondary">Cocok untuk jadwal sibuk dan sarapan kilat</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
            {quickRecipes.slice(0, 4).map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isFavorite={isFavorite(recipe.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        </section>
      )}

      {/* Resep Terbaru */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-green-secondary/15 flex items-center justify-center text-green-primary">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="section-title">Kreasi Terbaru</h2>
              <p className="text-xs text-text-secondary">Eksplorasi hidangan baru setiap hari</p>
            </div>
          </div>
          <Link
            to="/jelajah"
            className="text-green-primary hover:text-green-dark text-xs sm:text-sm font-bold flex items-center gap-1 transition-colors"
          >
            Lihat Semua <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {latestRecipes.slice(0, 4).map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isFavorite={isFavorite(recipe.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      </section>

      {/* Interactive Ingredient CTA Banner */}
      <section>
        <Link
          to="/cari-bahan"
          className="group relative block overflow-hidden rounded-2xl bg-surface border border-border-color p-5 sm:p-7 hover:border-green-secondary transition-all duration-200 shadow-xs"
        >
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-cream border border-border-color text-green-primary flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                <ChefHat size={26} />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg text-text-primary group-hover:text-green-primary transition-colors">
                  Punya sisa bahan makanan di kulkas?
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary mt-0.5 max-w-xl">
                  Masukkan bahan yang tersedia, ResepinAja akan mencarikan resep masakan yang sesuai tanpa perlu belanja bahan baru.
                </p>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 btn-primary text-xs py-2 px-4 rounded-xl group-hover:translate-x-0.5 transition-transform self-end sm:self-center flex-shrink-0">
              <span>Coba Sekarang</span>
              <ArrowRight size={14} />
            </div>
          </div>
        </Link>
      </section>
    </div>
  )
}

export default Home
