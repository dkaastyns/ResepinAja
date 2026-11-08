import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Plus, X, Calendar, ChefHat } from 'lucide-react'
import Modal from '../components/ui/Modal'
import RecipeCard from '../components/ui/RecipeCard'
import SearchBar from '../components/ui/SearchBar'
import { useMealPlanner } from '../hooks/useMealPlanner'
import { useRecipes } from '../hooks/useRecipes'
import { useFavorites } from '../hooks/useFavorites'
import { useToast } from '../context/ToastContext'
import {
  getWeekDates,
  getDateString,
  DAY_NAMES,
  DAY_NAMES_FULL,
  MEAL_TYPES,
  formatDuration,
  getTotalTime,
} from '../utils/helpers'

const MealPlanner = () => {
  const { mealPlans, addMealPlan, removeMealPlan, getMealBySlot } = useMealPlanner()
  const { allRecipes, getRecipeById } = useRecipes()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { showToast } = useToast()

  const [currentWeekStart, setCurrentWeekStart] = useState(new Date())
  const [addingSlot, setAddingSlot] = useState(null)
  const [recipeSearch, setRecipeSearch] = useState('')

  const weekDates = useMemo(() => getWeekDates(currentWeekStart), [currentWeekStart])

  const prevWeek = () => {
    const d = new Date(currentWeekStart)
    d.setDate(d.getDate() - 7)
    setCurrentWeekStart(d)
  }

  const nextWeek = () => {
    const d = new Date(currentWeekStart)
    d.setDate(d.getDate() + 7)
    setCurrentWeekStart(d)
  }

  const today = getDateString()

  const filteredRecipes = useMemo(() => {
    if (!recipeSearch.trim()) return allRecipes
    const q = recipeSearch.toLowerCase()
    return allRecipes.filter(
      r => r.title.toLowerCase().includes(q) || r.category.toLowerCase().includes(q)
    )
  }, [allRecipes, recipeSearch])

  const handleSelectRecipe = (recipe) => {
    if (!addingSlot) return
    addMealPlan(addingSlot.date, addingSlot.mealType, recipe.id)
    showToast({
      message: `"${recipe.title}" dijadwalkan! 📅`,
      type: 'success',
    })
    setAddingSlot(null)
    setRecipeSearch('')
  }

  const handleRemoveMeal = (planId, title) => {
    removeMealPlan(planId)
    showToast({
      message: `Menu ${title ? `"${title}"` : ''} dihapus dari jadwal`,
      type: 'info',
    })
  }

  const getMonthYear = () => {
    const start = new Date(weekDates[0])
    const end = new Date(weekDates[6])
    if (start.getMonth() === end.getMonth()) {
      return start.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
    }
    return `${start.toLocaleDateString('id-ID', { month: 'short' })} – ${end.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}`
  }

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Top Header & Week Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-header">Rencana Menu Mingguan</h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Atur jadwal sarapan, makan siang, dan makan malam secara terorganisir
          </p>
        </div>

        {/* Week Navigator */}
        <div className="flex items-center gap-2 bg-surface border border-border-color rounded-2xl p-1.5 shadow-sm self-start sm:self-auto">
          <button
            onClick={prevWeek}
            aria-label="Minggu sebelumnya"
            className="w-8 h-8 rounded-xl hover:bg-background flex items-center justify-center transition-colors text-text-secondary"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-xs font-bold text-text-primary px-3">{getMonthYear()}</span>
          <button
            onClick={nextWeek}
            aria-label="Minggu berikutnya"
            className="w-8 h-8 rounded-xl hover:bg-background flex items-center justify-center transition-colors text-text-secondary"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Responsive Days Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {weekDates.map((date, dayIndex) => {
          const isToday = date === today

          return (
            <div
              key={date}
              className={`card flex flex-col justify-between ${
                isToday ? 'ring-2 ring-green-primary shadow-glow-green/20' : ''
              }`}
            >
              {/* Day Header */}
              <div
                className={`px-4 py-3 border-b border-border-color flex items-center justify-between ${
                  isToday ? 'bg-green-primary/10' : 'bg-background/80'
                }`}
              >
                <div>
                  <span className="font-extrabold text-sm text-text-primary">
                    {DAY_NAMES_FULL[dayIndex]}
                  </span>
                  <span className="text-xs text-text-secondary ml-2 font-medium">
                    {new Date(date + 'T00:00:00').toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>
                {isToday && (
                  <span className="badge badge-green text-[10px] font-extrabold uppercase">
                    Hari Ini
                  </span>
                )}
              </div>

              {/* Meal Slots */}
              <div className="p-3.5 space-y-2.5 flex-1">
                {MEAL_TYPES.map(mealType => {
                  const plan = getMealBySlot(date, mealType.value)
                  const recipe = plan ? getRecipeById(plan.recipeId) : null

                  return (
                    <div key={mealType.value} className="flex items-center gap-2.5">
                      <div className="w-10 text-center flex-shrink-0">
                        <div className="text-base leading-none">{mealType.emoji}</div>
                        <div className="text-[9px] text-text-secondary font-bold uppercase mt-1">
                          {mealType.label.split(' ')[0]}
                        </div>
                      </div>

                      {recipe ? (
                        <div className="flex-1 min-w-0 flex items-center justify-between gap-2 bg-background/80 rounded-xl px-2.5 py-1.5 border border-border-color hover:border-green-secondary transition-colors">
                          <div className="flex items-center gap-2 min-w-0">
                            {recipe.image && (
                              <img
                                src={recipe.image}
                                alt={recipe.title}
                                className="w-7 h-7 rounded-lg object-cover flex-shrink-0"
                              />
                            )}
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-text-primary truncate">
                                {recipe.title}
                              </p>
                              <p className="text-[10px] text-text-secondary">
                                {formatDuration(getTotalTime(recipe))}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveMeal(plan.id, recipe.title)}
                            className="w-6 h-6 rounded-lg hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors text-text-secondary flex-shrink-0"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setAddingSlot({ date, mealType: mealType.value })}
                          className="flex-1 flex items-center gap-2 border border-dashed border-border-color rounded-xl px-2.5 py-2 hover:border-green-primary hover:bg-green-primary/5 transition-all text-left group"
                        >
                          <Plus
                            size={13}
                            className="text-text-secondary group-hover:text-green-primary"
                          />
                          <span className="text-xs text-text-secondary group-hover:text-green-primary font-medium">
                            Pilih menu
                          </span>
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Select Recipe Modal */}
      <Modal
        isOpen={!!addingSlot}
        onClose={() => {
          setAddingSlot(null)
          setRecipeSearch('')
        }}
        title={
          addingSlot
            ? `Pilih Menu ${MEAL_TYPES.find(m => m.value === addingSlot.mealType)?.label}`
            : ''
        }
        size="lg"
      >
        <div className="space-y-4">
          <SearchBar
            value={recipeSearch}
            onChange={setRecipeSearch}
            onClear={() => setRecipeSearch('')}
            placeholder="Cari resep untuk dijadwalkan..."
          />
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-1">
            {filteredRecipes.map(recipe => (
              <button
                key={recipe.id}
                onClick={() => handleSelectRecipe(recipe)}
                className="text-left hover:scale-[0.98] transition-transform"
              >
                <RecipeCard recipe={recipe} isFavorite={isFavorite(recipe.id)} />
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default MealPlanner
