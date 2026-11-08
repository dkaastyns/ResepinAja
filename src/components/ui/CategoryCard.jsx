import { CATEGORIES } from '../../data/sampleRecipes'

const CategoryCard = ({ category, recipeCount, onClick, isActive = false }) => {
  const cat = CATEGORIES.find(c => c.name === category) || {
    emoji: '🍽️',
    color: 'bg-cream text-text-secondary',
  }

  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center gap-2 p-3 sm:p-4 rounded-2xl border transition-all duration-300 group text-center w-full select-none ${
        isActive
          ? 'bg-green-primary/10 border-green-primary shadow-sm ring-2 ring-green-primary/20'
          : 'bg-surface border-border-color hover:border-green-secondary/50 hover:shadow-card-hover hover:-translate-y-1 active:scale-95'
      }`}
    >
      <div
        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl ${cat.color} group-hover:scale-115 transition-transform duration-300 ease-out shadow-sm`}
      >
        {cat.emoji}
      </div>
      <div className="flex flex-col items-center">
        <span className="text-xs sm:text-sm font-bold text-text-primary group-hover:text-green-primary transition-colors line-clamp-1 leading-tight">
          {category}
        </span>
        {recipeCount !== undefined && (
          <span className="text-[10px] sm:text-xs text-text-secondary mt-0.5">
            {recipeCount} resep
          </span>
        )}
      </div>
    </button>
  )
}

export default CategoryCard
