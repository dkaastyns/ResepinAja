// Generate unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

// Format duration in minutes to readable string
export const formatDuration = (minutes) => {
  if (!minutes || minutes === 0) return '-'
  if (minutes < 60) return `${minutes} menit`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (m === 0) return `${h} jam`
  return `${h} jam ${m} menit`
}

// Get total time (prep + cook)
export const getTotalTime = (recipe) => {
  return (recipe.preparationTime || 0) + (recipe.cookingTime || 0)
}

// Difficulty label
export const getDifficultyLabel = (difficulty) => {
  const labels = {
    mudah: 'Mudah',
    sedang: 'Sedang',
    sulit: 'Sulit',
  }
  return labels[difficulty] || difficulty
}

// Difficulty color
export const getDifficultyColor = (difficulty) => {
  const colors = {
    mudah: 'text-green-primary bg-green-primary/10',
    sedang: 'text-accent-orange bg-accent-orange/10',
    sulit: 'text-red-500 bg-red-50',
  }
  return colors[difficulty] || 'text-text-secondary bg-background'
}

// Category color mapping
export const getCategoryColor = (category) => {
  const colors = {
    'Makanan Utama': 'bg-green-primary/10 text-green-primary',
    'Sarapan': 'bg-accent-orange/10 text-accent-orange',
    'Camilan': 'bg-purple-100 text-purple-700',
    'Minuman': 'bg-blue-100 text-blue-700',
    'Dessert': 'bg-pink-100 text-pink-600',
    'Sup & Soto': 'bg-yellow-100 text-yellow-700',
    'Seafood': 'bg-cyan-100 text-cyan-700',
    'Vegetarian': 'bg-lime-100 text-lime-700',
  }
  return colors[category] || 'bg-cream text-text-secondary'
}

// Format date to Indonesian locale
export const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Get short date string YYYY-MM-DD
export const getDateString = (date = new Date()) => {
  return date.toISOString().split('T')[0]
}

// Get week dates starting from Monday
export const getWeekDates = (startDate = new Date()) => {
  const start = new Date(startDate)
  const day = start.getDay()
  const diff = start.getDate() - day + (day === 0 ? -6 : 1)
  start.setDate(diff)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return getDateString(d)
  })
}

// Meal type labels
export const MEAL_TYPES = [
  { value: 'sarapan', label: 'Sarapan', emoji: '🌅' },
  { value: 'makan_siang', label: 'Makan Siang', emoji: '☀️' },
  { value: 'makan_malam', label: 'Makan Malam', emoji: '🌙' },
  { value: 'camilan', label: 'Camilan', emoji: '🍪' },
]

// Day names in Indonesian
export const DAY_NAMES = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']
export const DAY_NAMES_FULL = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']

// Truncate text
export const truncate = (text, length = 100) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

// Match ingredients
export const matchIngredients = (recipeIngredients, searchIngredients) => {
  if (!searchIngredients.length) return 0
  const recipeIngList = recipeIngredients.map(i =>
    (typeof i === 'string' ? i : i.name).toLowerCase()
  )
  const matched = searchIngredients.filter(si =>
    recipeIngList.some(ri => ri.includes(si.toLowerCase()) || si.toLowerCase().includes(ri))
  )
  return Math.round((matched.length / searchIngredients.length) * 100)
}

// Sort recipes
export const sortRecipes = (recipes, sortBy) => {
  const sorted = [...recipes]
  switch (sortBy) {
    case 'terbaru':
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    case 'terlama':
      return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    case 'waktu_tercepat':
      return sorted.sort((a, b) => getTotalTime(a) - getTotalTime(b))
    case 'nama_az':
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    case 'nama_za':
      return sorted.sort((a, b) => b.title.localeCompare(a.title))
    default:
      return sorted
  }
}
