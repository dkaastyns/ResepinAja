import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Heart, Users, Sparkles, ChefHat } from 'lucide-react'
import LazyImage from './LazyImage'
import { useToast } from '../../context/ToastContext'
import { formatDuration, getTotalTime, getDifficultyLabel, getDifficultyColor } from '../../utils/helpers'

const RecipeCard = ({ recipe, isFavorite, onToggleFavorite, className = '', style }) => {
  const { showToast } = useToast()
  const [animatingHeart, setAnimatingHeart] = useState(false)
  const totalTime = getTotalTime(recipe)

  const handleFavoriteClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!onToggleFavorite) return

    setAnimatingHeart(true)
    setTimeout(() => setAnimatingHeart(false), 500)

    const nextState = !isFavorite
    onToggleFavorite(recipe.id)

    showToast({
      message: nextState
        ? `"${recipe.title}" ditambahkan ke Favorit ❤️`
        : `"${recipe.title}" dihapus dari Favorit`,
      type: nextState ? 'favorite' : 'unfavorite',
    })
  }

  return (
    <div
      style={style}
      className={`card group relative flex flex-col h-full bg-surface hover:-translate-y-1 hover:shadow-card-hover hover:border-green-secondary/30 active:scale-[0.98] transition-all duration-200 ease-out cursor-pointer ${className}`}
    >
      {/* Top Image area */}
      <Link to={`/resep/${recipe.id}`} className="block relative overflow-hidden rounded-t-2xl">
        <LazyImage
          src={recipe.image}
          alt={recipe.title}
          containerClassName="h-44 sm:h-48 w-full"
          className="group-hover:scale-105 transition-transform duration-500 ease-out will-change-transform"
        />

        {/* Ambient Dark Gradient on bottom of image for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Category badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="glass-badge px-2.5 py-1 rounded-xl text-[11px] font-bold tracking-tight">
            {recipe.category}
          </span>
        </div>

        {/* Resep Saya badge */}
        {recipe.isUserRecipe && (
          <div className="absolute top-3 right-12 z-10">
            <span className="inline-flex items-center gap-1 bg-green-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-sm">
              <ChefHat size={10} />
              Resep Saya
            </span>
          </div>
        )}

        {/* Favorite Button (Floating on image top right) */}
        {onToggleFavorite && (
          <button
            onClick={handleFavoriteClick}
            aria-label={isFavorite ? 'Hapus favorit' : 'Tambah favorit'}
            className={`absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ease-out shadow-md active:scale-90 ${
              isFavorite
                ? 'bg-red-500 text-white shadow-red-500/30'
                : 'glass-badge text-text-secondary hover:text-red-500 hover:scale-110 active:scale-90'
            } ${animatingHeart ? 'animate-heart-pop' : ''}`}
          >
            <Heart
              size={15}
              fill={isFavorite ? 'currentColor' : 'none'}
              strokeWidth={isFavorite ? 0 : 2.2}
            />
          </button>
        )}
      </Link>

      {/* Card Content */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <Link to={`/resep/${recipe.id}`} className="block group/title">
            <h3 className="font-bold text-text-primary text-sm sm:text-base leading-snug line-clamp-2 group-hover/title:text-green-primary transition-colors">
              {recipe.title}
            </h3>
          </Link>
          {recipe.description && (
            <p className="text-text-secondary text-xs mt-1.5 line-clamp-2 leading-relaxed">
              {recipe.description}
            </p>
          )}
        </div>

        {/* Footer Meta Chips */}
        <div className="flex items-center justify-between pt-3 border-t border-border-color/70 text-xs">
          <div className="flex items-center gap-1 text-text-secondary font-medium">
            <Clock size={13} className="text-green-primary" />
            <span>{formatDuration(totalTime)}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className={`badge text-[11px] font-semibold py-0.5 px-2 rounded-lg ${getDifficultyColor(recipe.difficulty)}`}>
              {getDifficultyLabel(recipe.difficulty)}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-text-secondary font-medium pl-1">
              <Users size={12} className="text-text-secondary/70" />
              {recipe.servings}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecipeCard
