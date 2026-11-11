import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, ChefHat, Sparkles, X, ChevronLeft, ChevronRight } from 'lucide-react'
import SearchBar from '../components/ui/SearchBar'
import FilterBar from '../components/ui/FilterBar'
import RecipeCard from '../components/ui/RecipeCard'
import EmptyState from '../components/ui/EmptyState'
import { useRecipes } from '../hooks/useRecipes'
import { useFavorites } from '../hooks/useFavorites'
import { sortRecipes } from '../utils/helpers'

const ITEMS_PER_PAGE = 8

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
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    setQuery(searchParams.get('q') || '')
    setFilters(prev => ({ ...prev, category: searchParams.get('kategori') || '' }))
  }, [searchParams])

  // Reset to page 1 whenever search, filter, or sorting changes
  useEffect(() => {
    setCurrentPage(1)
  }, [query, filters.category, filters.difficulty, sortBy])

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

  // Pagination calculation (Max 8 items per page)
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)
  const paginatedRecipes = useMemo(
    () => filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE),
    [filtered, startIndex]
  )

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return
    setCurrentPage(page)
    const gridEl = document.getElementById('recipe-grid-anchor')
    if (gridEl) {
      gridEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      window.scrollTo({ top: 120, behavior: 'smooth' })
    }
  }

  const activeFiltersCount = (filters.category ? 1 : 0) + (filters.difficulty ? 1 : 0)

  return (
    <div className="space-y-5 animate-fade-in pb-10">
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
      <div id="recipe-grid-anchor" className="flex flex-wrap items-center justify-between gap-2 px-1 pt-1">
        <p className="text-xs sm:text-sm text-text-secondary">
          {filtered.length > 0 ? (
            <>
              Menampilkan{' '}
              <span className="font-extrabold text-text-primary">
                {startIndex + 1}–{endIndex}
              </span>{' '}
              dari <span className="font-extrabold text-text-primary">{filtered.length}</span> resep lezat
            </>
          ) : (
            '0 resep ditemukan'
          )}
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

      {/* Responsive Recipe Grid (Paginated max 8 items per page) */}
      {paginatedRecipes.length > 0 ? (
        <div
          key={currentPage}
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 animate-fade-in"
        >
          {paginatedRecipes.map((recipe, idx) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isFavorite={isFavorite(recipe.id)}
              onToggleFavorite={toggleFavorite}
              className="animate-card-enter"
              style={{ animationDelay: `${idx * 35}ms` }}
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

      {/* Elegant Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-border-color">
          <p className="text-xs text-text-muted font-medium order-2 sm:order-1">
            Halaman <span className="font-bold text-text-primary">{currentPage}</span> dari{' '}
            <span className="font-bold text-text-primary">{totalPages}</span>
          </p>

          <div className="flex items-center gap-1.5 order-1 sm:order-2">
            {/* Prev button */}
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-150 ${
                currentPage === 1
                  ? 'opacity-40 cursor-not-allowed bg-background border-border-color text-text-muted'
                  : 'bg-surface hover:bg-cream border-border-color text-text-secondary hover:text-text-primary active:scale-95'
              }`}
            >
              <ChevronLeft size={14} />
              <span className="hidden xs:inline">Sebelumnya</span>
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                const isActive = page === currentPage
                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => handlePageChange(page)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition-all duration-150 flex items-center justify-center ${
                      isActive
                        ? 'bg-green-primary text-white shadow-xs scale-105 ring-2 ring-green-primary/20'
                        : 'bg-surface hover:bg-cream border border-border-color text-text-secondary hover:text-text-primary active:scale-95'
                    }`}
                  >
                    {page}
                  </button>
                )
              })}
            </div>

            {/* Next button */}
            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-150 ${
                currentPage === totalPages
                  ? 'opacity-40 cursor-not-allowed bg-background border-border-color text-text-muted'
                  : 'bg-surface hover:bg-cream border-border-color text-text-secondary hover:text-text-primary active:scale-95'
              }`}
            >
              <span className="hidden xs:inline">Selanjutnya</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Explore
