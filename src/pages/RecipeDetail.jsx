import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Clock,
  Users,
  ChefHat,
  Share2,
  CheckCircle2,
  Plus,
  Minus,
  Sparkles,
  Flame,
  Printer,
} from 'lucide-react'
import LazyImage from '../components/ui/LazyImage'
import { useRecipes } from '../hooks/useRecipes'
import { useFavorites } from '../hooks/useFavorites'
import { useShoppingList } from '../hooks/useShoppingList'
import { useToast } from '../context/ToastContext'
import { formatDuration, getDifficultyLabel, getDifficultyColor, getTotalTime } from '../utils/helpers'

const RecipeDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getRecipeById } = useRecipes()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { addItemsFromRecipe } = useShoppingList()
  const { showToast } = useToast()

  const [addedToList, setAddedToList] = useState(false)
  const [checkedSteps, setCheckedSteps] = useState(new Set())

  const recipe = getRecipeById(id)

  // Servings multiplier state
  const baseServings = recipe?.servings || 2
  const [servings, setServings] = useState(baseServings)

  if (!recipe) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 px-4 text-center">
        <div className="w-16 h-16 rounded-3xl bg-cream flex items-center justify-center">
          <ChefHat size={36} className="text-green-secondary opacity-60" />
        </div>
        <h2 className="text-lg font-bold text-text-primary">Resep tidak ditemukan</h2>
        <p className="text-text-secondary text-sm max-w-xs">
          Resep yang Anda cari mungkin telah dihapus atau tautan tidak valid.
        </p>
        <button onClick={() => navigate(-1)} className="btn-primary text-xs mt-2">
          Kembali
        </button>
      </div>
    )
  }

  const handleAddToShoppingList = () => {
    const count = addItemsFromRecipe(recipe.ingredients)
    setAddedToList(true)
    showToast({
      message: `${count || recipe.ingredients.length} bahan dimasukkan ke Daftar Belanja! 🛒`,
      type: 'cart',
    })
    setTimeout(() => setAddedToList(false), 3000)
  }

  const handleToggleFavorite = () => {
    const next = !isFavorite(recipe.id)
    toggleFavorite(recipe.id)
    showToast({
      message: next ? 'Resep disimpan ke Favorit! ❤️' : 'Resep dihapus dari Favorit',
      type: next ? 'favorite' : 'unfavorite',
    })
  }

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      showToast({
        message: 'Tautan resep disalin ke clipboard! 📋',
        type: 'success',
      })
    }
  }

  const toggleStep = (index) => {
    const newSet = new Set(checkedSteps)
    if (newSet.has(index)) {
      newSet.delete(index)
    } else {
      newSet.add(index)
      if (newSet.size === recipe.instructions.length) {
        showToast({
          message: 'Luar biasa! Semua langkah memasak selesai! 🎉',
          type: 'success',
        })
      }
    }
    setCheckedSteps(newSet)
  }

  const fav = isFavorite(recipe.id)
  const totalTime = getTotalTime(recipe)
  const cookingProgress =
    recipe.instructions.length > 0
      ? Math.round((checkedSteps.size / recipe.instructions.length) * 100)
      : 0

  // Calculate scaled quantity
  const scaleQuantity = (qtyStr) => {
    if (!qtyStr) return ''
    const num = parseFloat(qtyStr.replace(',', '.'))
    if (isNaN(num)) return qtyStr
    const scaled = (num * (servings / baseServings))
    // Round to 1 decimal if needed
    return Number.isInteger(scaled) ? scaled : scaled.toFixed(1)
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface border border-border-color text-text-primary text-xs font-bold hover:bg-background transition-colors shadow-sm"
        >
          <ArrowLeft size={16} />
          <span>Kembali</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            aria-label="Bagikan resep"
            className="w-9 h-9 rounded-xl bg-surface border border-border-color flex items-center justify-center text-text-secondary hover:text-green-primary hover:border-green-secondary/40 transition-colors shadow-sm"
          >
            <Share2 size={16} />
          </button>
          <button
            onClick={handleToggleFavorite}
            aria-label="Favorit"
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shadow-sm ${
              fav
                ? 'bg-red-500 text-white shadow-red-500/30'
                : 'bg-surface border border-border-color text-text-secondary hover:text-red-500 hover:border-red-200'
            }`}
          >
            <Heart size={16} fill={fav ? 'currentColor' : 'none'} strokeWidth={fav ? 0 : 2} />
          </button>
        </div>
      </div>

      {/* Main Grid: Dual Column on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Hero Image & Meta Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-cream border border-border-color shadow-card group">
            <LazyImage
              src={recipe.image}
              alt={recipe.title}
              containerClassName="h-72 sm:h-96 w-full"
              className="group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

            {/* Badges Overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center gap-2">
              <span className="glass-badge px-3 py-1 rounded-xl text-xs font-bold text-text-primary">
                {recipe.category}
              </span>
              <span className={`badge backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-bold ${getDifficultyColor(recipe.difficulty)}`}>
                {getDifficultyLabel(recipe.difficulty)}
              </span>
              {recipe.isUserRecipe && (
                <span className="badge bg-green-primary text-white text-xs font-bold">
                  Resep Saya
                </span>
              )}
            </div>
          </div>

          {/* Quick Meta Stats Grid */}
          <div className="grid grid-cols-4 gap-2 bg-surface border border-border-color rounded-2xl p-3 shadow-card">
            {[
              { icon: Clock, label: 'Persiapan', value: formatDuration(recipe.preparationTime) },
              { icon: Flame, label: 'Memasak', value: formatDuration(recipe.cookingTime) },
              { icon: Sparkles, label: 'Total', value: formatDuration(totalTime) },
              { icon: Users, label: 'Porsi Dasar', value: `${recipe.servings} org` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="text-center p-2 rounded-xl bg-background">
                <Icon size={16} className="text-green-primary mx-auto mb-1" />
                <div className="text-xs font-bold text-text-primary truncate">{value}</div>
                <div className="text-[10px] text-text-secondary mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {/* Add to Shopping List CTA (Quick Left Button on Desktop) */}
          <button
            onClick={handleAddToShoppingList}
            className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-sm ${
              addedToList
                ? 'bg-green-primary text-white'
                : 'bg-green-primary/10 hover:bg-green-primary text-green-primary hover:text-white border border-green-primary/30'
            }`}
          >
            <ShoppingCart size={18} />
            <span>{addedToList ? 'Semua Bahan Masuk Belanja!' : 'Tambahkan Bahan ke Belanja'}</span>
          </button>
        </div>

        {/* Right Column: Title, Ingredients Scaler & Instructions */}
        <div className="lg:col-span-7 space-y-6">
          {/* Title & Description */}
          <div>
            <h1 className="page-header text-2xl sm:text-3xl lg:text-4xl leading-tight">
              {recipe.title}
            </h1>
            {recipe.description && (
              <p className="text-text-secondary text-sm sm:text-base mt-2.5 leading-relaxed">
                {recipe.description}
              </p>
            )}
          </div>

          {/* Ingredients Section with Servings Adjuster */}
          <div className="bg-surface rounded-2xl sm:rounded-3xl border border-border-color p-5 sm:p-6 shadow-card space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-color pb-4">
              <div>
                <h2 className="text-lg font-extrabold text-text-primary">Daftar Bahan</h2>
                <p className="text-xs text-text-secondary mt-0.5">
                  {recipe.ingredients.length} bahan yang dibutuhkan
                </p>
              </div>

              {/* Dynamic Servings Scaler */}
              <div className="flex items-center gap-2 bg-cream-light p-1 rounded-xl border border-border-color">
                <span className="text-xs font-bold text-text-secondary px-2">Porsi:</span>
                <button
                  onClick={() => setServings(prev => Math.max(1, prev - 1))}
                  className="w-7 h-7 rounded-lg bg-surface flex items-center justify-center hover:bg-white text-text-primary border border-border-color transition-colors"
                >
                  <Minus size={13} />
                </button>
                <span className="text-xs font-extrabold text-green-primary min-w-[20px] text-center">
                  {servings}
                </span>
                <button
                  onClick={() => setServings(prev => prev + 1)}
                  className="w-7 h-7 rounded-lg bg-surface flex items-center justify-center hover:bg-white text-text-primary border border-border-color transition-colors"
                >
                  <Plus size={13} />
                </button>
              </div>
            </div>

            {/* Ingredients List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {recipe.ingredients.map((ing, idx) => {
                const name = typeof ing === 'string' ? ing : ing.name
                const rawQty = typeof ing === 'string' ? '' : ing.quantity
                const unit = typeof ing === 'string' ? '' : ing.unit
                const scaledQty = scaleQuantity(rawQty)

                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-background border border-border-color/60 hover:border-green-secondary/40 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-green-primary flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-semibold text-text-primary truncate">
                        {name}
                      </span>
                    </div>
                    {(scaledQty || unit) && (
                      <span className="text-xs font-bold text-accent-orange pl-2 flex-shrink-0">
                        {scaledQty} {unit}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Interactive Cooking Steps */}
          <div className="bg-surface rounded-2xl sm:rounded-3xl border border-border-color p-5 sm:p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-text-primary">Langkah Memasak</h2>
                <p className="text-xs text-text-secondary mt-0.5">
                  Centang setiap langkah yang telah selesai dilakukan
                </p>
              </div>
              <span className="badge badge-green text-xs font-bold">
                {checkedSteps.size} / {recipe.instructions.length} Selesai
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-cream rounded-full h-2 overflow-hidden">
              <div
                className="bg-green-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${cookingProgress}%` }}
              />
            </div>

            {/* Steps list */}
            <div className="space-y-3 pt-2">
              {recipe.instructions.map((step, idx) => {
                const isDone = checkedSteps.has(idx)
                return (
                  <div
                    key={idx}
                    onClick={() => toggleStep(idx)}
                    className={`flex items-start gap-3.5 p-4 rounded-2xl border transition-all duration-200 cursor-pointer select-none ${
                      isDone
                        ? 'bg-green-primary/5 border-green-primary/30 opacity-75'
                        : 'bg-background border-border-color hover:border-green-secondary hover:shadow-sm'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 transition-all ${
                        isDone
                          ? 'bg-green-primary text-white scale-105'
                          : 'bg-cream text-text-secondary'
                      }`}
                    >
                      {isDone ? <CheckCircle2 size={16} /> : idx + 1}
                    </div>
                    <p
                      className={`text-xs sm:text-sm leading-relaxed ${
                        isDone ? 'line-through text-text-secondary' : 'text-text-primary font-medium'
                      }`}
                    >
                      {step}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* Completion Celebration Message */}
            {checkedSteps.size === recipe.instructions.length && recipe.instructions.length > 0 && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-green-primary/10 to-accent-orange/10 border border-green-primary/30 text-center animate-scale-in">
                <span className="text-3xl">🎉</span>
                <h4 className="font-extrabold text-text-primary text-sm sm:text-base mt-1">
                  Selamat! Hidangan Siap Disajikan
                </h4>
                <p className="text-xs text-text-secondary mt-0.5">
                  Nikmati hasil masakan lezat buatanmu bersama keluarga tercinta!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecipeDetail
