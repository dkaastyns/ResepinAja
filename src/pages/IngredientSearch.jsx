import { useState, useMemo } from 'react'
import { Plus, X, Search, Sparkles, ChefHat } from 'lucide-react'
import RecipeCard from '../components/ui/RecipeCard'
import EmptyState from '../components/ui/EmptyState'
import { useRecipes } from '../hooks/useRecipes'
import { useFavorites } from '../hooks/useFavorites'
import { matchIngredients } from '../utils/helpers'

const IngredientSearch = () => {
  const { allRecipes } = useRecipes()
  const { isFavorite, toggleFavorite } = useFavorites()
  const [inputValue, setInputValue] = useState('')
  const [ingredients, setIngredients] = useState([])

  const addIngredient = (name) => {
    const val = (name || inputValue).trim().toLowerCase()
    if (!val || ingredients.includes(val)) return
    setIngredients(prev => [...prev, val])
    if (!name) setInputValue('')
  }

  const removeIngredient = (ing) => {
    setIngredients(prev => prev.filter(i => i !== ing))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addIngredient()
    }
  }

  const matchedRecipes = useMemo(() => {
    if (!ingredients.length) return []
    return allRecipes
      .map(recipe => ({
        recipe,
        matchPercent: matchIngredients(recipe.ingredients, ingredients),
      }))
      .filter(r => r.matchPercent > 0)
      .sort((a, b) => b.matchPercent - a.matchPercent)
  }, [allRecipes, ingredients])

  const popularIngredients = [
    'Ayam',
    'Telur',
    'Bawang merah',
    'Bawang putih',
    'Nasi',
    'Tahu',
    'Tempe',
    'Cabai',
    'Kecap manis',
    'Udang',
    'Daging sapi',
  ]

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Header */}
      <div>
        <h1 className="page-header">Cari dari Bahan di Dapur</h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Ketik atau pilih bahan yang kamu punya, ResepinAja akan hitung resep yang paling cocok!
        </p>
      </div>

      {/* Input & Tag Section */}
      <div className="bg-surface rounded-2xl sm:rounded-3xl border border-border-color p-5 sm:p-6 shadow-card space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ketik bahan lalu tekan Enter (cth: ayam, telur, bawang)..."
              className="input-field pl-11"
            />
          </div>
          <button
            onClick={() => addIngredient()}
            className="btn-primary text-xs sm:text-sm flex-shrink-0 px-4 sm:px-6"
          >
            <Plus size={16} />
            <span>Tambah</span>
          </button>
        </div>

        {/* Selected Ingredients Pills */}
        {ingredients.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1 animate-fade-in">
            <span className="text-xs font-bold text-text-secondary mr-1">Bahanmu:</span>
            {ingredients.map(ing => (
              <span
                key={ing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-primary/10 border border-green-primary/20 text-green-primary text-xs font-bold animate-scale-in"
              >
                <span>{ing}</span>
                <button
                  onClick={() => removeIngredient(ing)}
                  className="hover:text-red-500 hover:scale-110 transition-colors"
                >
                  <X size={13} />
                </button>
              </span>
            ))}
            <button
              onClick={() => setIngredients([])}
              className="text-xs text-red-500 hover:underline font-bold px-2 py-1 ml-auto"
            >
              Hapus Semua
            </button>
          </div>
        )}

        {/* Quick Suggestion Pills */}
        <div className="pt-2 border-t border-border-color">
          <p className="text-xs text-text-secondary font-semibold mb-2">Pilih cepat bahan umum:</p>
          <div className="flex flex-wrap gap-2">
            {popularIngredients.map(ing => {
              const isSelected = ingredients.includes(ing.toLowerCase())
              return (
                <button
                  key={ing}
                  disabled={isSelected}
                  onClick={() => addIngredient(ing)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-semibold border transition-all ${
                    isSelected
                      ? 'bg-cream text-text-muted border-border-color cursor-not-allowed opacity-60'
                      : 'bg-background hover:bg-cream border-border-color hover:border-green-secondary/50 text-text-primary active:scale-95'
                  }`}
                >
                  + {ing}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Results Section */}
      {ingredients.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs sm:text-sm text-text-secondary">
              Ditemukan <span className="font-extrabold text-text-primary">{matchedRecipes.length}</span> resep dengan bahan yang tersedia:
            </p>
          </div>

          {matchedRecipes.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
              {matchedRecipes.map(({ recipe, matchPercent }) => (
                <div key={recipe.id} className="relative group">
                  <RecipeCard
                    recipe={recipe}
                    isFavorite={isFavorite(recipe.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                  {/* Match percentage pill */}
                  <div className="absolute top-2.5 right-12 z-20">
                    <span
                      className={`badge text-[11px] font-black shadow-md ${
                        matchPercent >= 80
                          ? 'bg-green-primary text-white shadow-green-primary/30'
                          : matchPercent >= 50
                          ? 'bg-accent-orange text-white shadow-accent-orange/30'
                          : 'bg-white/90 text-text-primary backdrop-blur-sm'
                      }`}
                    >
                      {matchPercent}% Cocok
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Search}
              title="Belum ada resep yang pas"
              description="Coba tambahkan bahan dasar seperti bawang, minyak, atau cabai untuk melihat resep yang cocok."
            />
          )}
        </div>
      ) : (
        <div className="text-center py-12 px-4 rounded-3xl bg-surface border border-border-color border-dashed">
          <div className="w-16 h-16 rounded-3xl bg-cream flex items-center justify-center mx-auto mb-3 text-3xl">
            🍳
          </div>
          <h3 className="font-bold text-text-primary text-base sm:text-lg">Kulkas masih penuh bahan?</h3>
          <p className="text-xs sm:text-sm text-text-secondary max-w-sm mx-auto mt-1">
            Pilih bahan di atas untuk langsung melihat inspirasi masakan yang bisa kamu buat saat ini juga tanpa perlu belanja lagi.
          </p>
        </div>
      )}
    </div>
  )
}

export default IngredientSearch
