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
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl sm:rounded-4xl bg-gradient-to-br from-green-primary via-green-dark to-green-secondary p-6 sm:p-8 lg:p-10 shadow-lg text-white">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-accent-orange/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-green-secondary/30 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Greeting, Title, Search Bar */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold text-white/90">
              <Sparkles size={13} className="text-accent-orange" />
              <span>Inspirasi Menu Harian Praktis</span>
            </div>

            <div>
              <p className="text-white/80 text-sm font-medium">
                {getGreeting()}, <span className="text-white font-bold">{profile.name.split(' ')[0]}</span> 👋
              </p>
              <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-black mt-1 leading-tight tracking-tight">
                Mau masak lezat <br className="hidden sm:inline" />
                apa hari ini?
              </h1>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-xl">
              <div className="relative flex items-center">
                <Search
                  size={18}
                  className="absolute left-4 text-text-secondary pointer-events-none"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nasi goreng, ayam bakar, bumbu..."
                  className="w-full bg-white rounded-2xl pl-11 pr-24 py-3.5 sm:py-4 text-text-primary text-sm placeholder-text-secondary focus:outline-none focus:ring-4 focus:ring-white/30 shadow-card transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-4 py-2 bg-green-primary hover:bg-green-dark text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95"
                >
                  Cari
                </button>
              </div>
            </form>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-white/70 font-medium">Saran:</span>
              {[
                { label: 'Cari dari Bahan', to: '/cari-bahan', emoji: '🥦' },
                { label: 'Rencana Menu', to: '/jadwal', emoji: '📅' },
                { label: 'Makanan Cepat ≤20m', to: '/jelajah', emoji: '⚡' },
              ].map(({ label, to, emoji }) => (
                <Link
                  key={label}
                  to={to}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-sm border border-white/10 transition-all hover:scale-105"
                >
                  <span>{emoji}</span>
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Column (Desktop): Featured Floating Recipe Card */}
          {featuredRecipe && (
            <div className="hidden lg:block lg:col-span-5">
              <div className="relative group">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-accent-orange/40 to-green-secondary/40 blur-xl opacity-75 group-hover:opacity-100 transition duration-700" />
                <div className="relative rounded-3xl overflow-hidden bg-surface/90 backdrop-blur-md p-4 text-text-primary border border-white/50 shadow-2xl">
                  <div className="relative h-48 rounded-2xl overflow-hidden mb-3">
                    <LazyImage
                      src={featuredRecipe.image}
                      alt={featuredRecipe.title}
                      containerClassName="h-full w-full"
                      className="group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="glass-badge px-3 py-1 rounded-xl text-xs font-bold text-green-primary">
                        ⭐ Rekomendasi Hari Ini
                      </span>
                    </div>
                  </div>
                  <h3 className="font-extrabold text-lg text-text-primary group-hover:text-green-primary transition-colors line-clamp-1">
                    {featuredRecipe.title}
                  </h3>
                  <p className="text-xs text-text-secondary line-clamp-2 mt-1">
                    {featuredRecipe.description}
                  </p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-color">
                    <div className="flex items-center gap-2 text-xs text-text-secondary font-medium">
                      <Clock size={14} className="text-green-primary" />
                      <span>{getTotalTime(featuredRecipe)} menit</span>
                    </div>
                    <Link
                      to={`/resep/${featuredRecipe.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-green-primary hover:text-green-dark group-hover:translate-x-0.5 transition-all"
                    >
                      Masak Sekarang <ArrowRight size={13} />
                    </Link>
                  </div>
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
          className="group relative block overflow-hidden rounded-3xl bg-gradient-to-r from-cream via-surface to-cream-light border border-border-color p-6 sm:p-8 hover:shadow-card-hover transition-all duration-300"
        >
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-green-primary to-green-secondary text-white flex items-center justify-center text-3xl shadow-md group-hover:scale-110 transition-transform duration-300">
                🥦
              </div>
              <div>
                <span className="badge badge-green text-[10px] font-bold uppercase mb-1">
                  Fitur Unggulan
                </span>
                <h3 className="font-extrabold text-lg sm:text-xl text-text-primary group-hover:text-green-primary transition-colors">
                  Bingung mau masak apa dengan bahan di kulkas?
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
                  Masukkan bahan yang ada, ResepinAja akan hitung persentase kecocokan resepnya!
                </p>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 btn-primary text-xs py-2.5 px-5 group-hover:translate-x-1 transition-transform self-end sm:self-center">
              <span>Coba Sekarang</span>
              <ArrowRight size={15} />
            </div>
          </div>
        </Link>
      </section>
    </div>
  )
}

export default Home
