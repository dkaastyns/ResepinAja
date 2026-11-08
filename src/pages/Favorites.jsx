import { Heart } from 'lucide-react'
import RecipeCard from '../components/ui/RecipeCard'
import EmptyState from '../components/ui/EmptyState'
import { useRecipes } from '../hooks/useRecipes'
import { useFavorites } from '../hooks/useFavorites'
import { Link } from 'react-router-dom'

const Favorites = () => {
  const { getRecipeById } = useRecipes()
  const { favorites, isFavorite, toggleFavorite } = useFavorites()

  const favoriteRecipes = favorites
    .map(fav => getRecipeById(fav.recipeId))
    .filter(Boolean)
    .reverse()

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <div>
        <h1 className="page-header">Resep Favorit</h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          {favoriteRecipes.length} resep tersimpan yang siap kamu masak kapan saja
        </p>
      </div>

      {favoriteRecipes.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {favoriteRecipes.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isFavorite={isFavorite(recipe.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Heart}
          title="Belum ada resep favorit"
          description="Simpan resep yang kamu sukai dengan menekan ikon hati pada kartu resep."
          action={
            <Link to="/jelajah" className="btn-primary text-xs">
              Jelajahi Resep Sekarang
            </Link>
          }
        />
      )}
    </div>
  )
}

export default Favorites
