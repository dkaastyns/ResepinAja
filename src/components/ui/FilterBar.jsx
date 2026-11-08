import { ChevronDown } from 'lucide-react'
import { CATEGORIES } from '../../data/sampleRecipes'

const FilterBar = ({ filters, onFilterChange, sortBy, onSortChange }) => {
  const categories = CATEGORIES.map(c => c.name)
  const difficulties = [
    { value: 'mudah', label: 'Mudah' },
    { value: 'sedang', label: 'Sedang' },
    { value: 'sulit', label: 'Sulit' },
  ]
  const sortOptions = [
    { value: 'terbaru', label: 'Terbaru' },
    { value: 'terlama', label: 'Terlama' },
    { value: 'waktu_tercepat', label: 'Waktu Tercepat' },
    { value: 'nama_az', label: 'Nama A-Z' },
    { value: 'nama_za', label: 'Nama Z-A' },
  ]

  const FilterChip = ({ label, value, group }) => {
    const isActive = filters[group] === value
    return (
      <button
        onClick={() => onFilterChange(group, isActive ? '' : value)}
        className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
          isActive
            ? 'bg-green-primary text-white border-green-primary'
            : 'bg-surface text-text-secondary border-border-color hover:border-green-secondary hover:text-green-primary'
        }`}
      >
        {label}
      </button>
    )
  }

  return (
    <div className="space-y-3">
      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        <FilterChip label="Semua" value="" group="category" />
        {categories.map(cat => (
          <FilterChip key={cat} label={cat} value={cat} group="category" />
        ))}
      </div>

      {/* Difficulty + Sort */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {difficulties.map(d => (
          <FilterChip key={d.value} label={d.label} value={d.value} group="difficulty" />
        ))}
        <div className="flex-shrink-0 relative ml-auto">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="appearance-none bg-surface border border-border-color rounded-full px-4 py-1.5 pr-8 text-xs font-semibold text-text-secondary focus:outline-none focus:border-green-primary cursor-pointer"
          >
            {sortOptions.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary" />
        </div>
      </div>
    </div>
  )
}

export default FilterBar
