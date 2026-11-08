import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, ChefHat, Sparkles, X } from 'lucide-react'
import SearchBar from '../components/ui/SearchBar'
import FilterBar from '../components/ui/FilterBar'
import RecipeCard from '../components/ui/RecipeCard'
import EmptyState from '../components/ui/EmptyState'
import { useRecipes } from '../hooks/useRecipes'
import { useFavorites } from '../hooks/useFavorites'
import { sortRecipes } from '../utils/helpers'

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { allRecipes } = useRecipes()
  const { isFavorite, toggleFavorite } = useFavorites()

  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [filters, setFilters] = useState({
    category: searchParams.get('kategori') || '',
    difficulty: '',
  })
  const [sortBy, setSortBy] = useState('terbaru')

  useEffect(() => {
    setQuery(searchParams.get('q') || '')
    setFilters(prev => ({ ...prev, category: searchParams.get('kategori') || '' }))
  }, [searchParams])

  const handleFilterChange = (group, value) => {
    setFilters(prev => {
      const updated = { ...prev, [group]: value }
      if (group === 'category') {
        if (value) {
          searchParams.set('kategori', value)
        } else {
          searchParams.delete('kategori')
        }
        setSearchParams(searchParams)
      }
      return updated
    })
  }

  const filtered = useMemo(() => {
    let result = allRecipes

    // Search
    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q) ||
        r.category?.toLowerCase().includes(q) ||
        r.ingredients?.some(i => (typeof i === 'string' ? i : i.name).toLowerCase().includes(q))
      )
    }

    // Category filter
    if (filters.category) {
      result = result.filter(r => r.category === filters.category)
    }

    // Difficulty filter
    if (filters.difficulty) {
      result = result.filter(r => r.difficulty === filters.difficulty)
    }

    return sortRecipes(result, sortBy)
  }, [allRecipes, query, filters, sortBy])

  const activeFiltersCount = (filters.category ? 1 : 0) + (filters.difficulty ? 1 : 0)

  return (
    <div className="space-y-5 animate-fade-in pb-8">
      {/* Top Header */}
      <div>
        <h1 className="page-header">Jelajahi Resep</h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Temukan ratusan inspirasi hidangan nusantara dan mancanegara
        </p>
      </div>

      {/* Search Input & Controls */}
      <div className="bg-surface rounded-2xl sm:rounded-3xl border border-border-color p-4 sm:p-5 shadow-card space-y-4">
        <SearchBar
          value={query}
          onChange={setQuery}
          onClear={() => setQuery('')}
          placeholder="Cari berdasarkan nama resep, bumbu, atau kategori..."
        />

        {/* Filters & Sorting */}
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      </div>

      {/* Result Status & Reset Chips */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <p className="text-xs sm:text-sm text-text-secondary">
          Menampilkan <span className="font-extrabold text-text-primary">{filtered.length}</span> resep lezat
        </p>

        {(query || activeFiltersCount > 0) && (
          <button
            onClick={() => {
              setQuery('')
              setFilters({ category: '', difficulty: '' })
              setSearchParams({})
            }}
            className="inline-flex items-center gap-1 text-xs font-bold text-accent-orange hover:text-accent-orange-dark transition-colors"
          >
            <X size={13} />
            <span>Reset Semua Filter</span>
          </button>
        )}
      </div>

      {/* Responsive Recipe Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {filtered.map(recipe => (
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
          icon={ChefHat}
          title="Resep tidak ditemukan"
          description="Coba gunakan kata kunci bumbu yang lebih umum atau reset filter yang sedang aktif."
          action={
            <button
              onClick={() => {
                setQuery('')
                setFilters({ category: '', difficulty: '' })
                setSearchParams({})
              }}
              className="btn-primary text-xs"
            >
              Reset Pencarian
            </button>
          }
        />
      )}
    </div>
  )
}

export default Explore
