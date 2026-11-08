// LocalStorage utility functions

export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return defaultValue
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Error writing localStorage key "${key}":`, error)
      return false
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
      return false
    }
  },

  clear: () => {
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error('Error clearing localStorage:', error)
      return false
    }
  },

  exportAll: () => {
    const data = {}
    const keys = [
      'resepinaja_recipes',
      'resepinaja_favorites',
      'resepinaja_mealplans',
      'resepinaja_shoppinglist',
      'resepinaja_profile',
    ]
    keys.forEach(key => {
      const val = localStorage.getItem(key)
      if (val) data[key] = JSON.parse(val)
    })
    return data
  },

  importAll: (data) => {
    try {
      Object.entries(data).forEach(([key, value]) => {
        localStorage.setItem(key, JSON.stringify(value))
      })
      return true
    } catch (error) {
      console.error('Error importing data:', error)
      return false
    }
  },

  getStorageUsage: () => {
    try {
      let totalBytes = 0
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('resepinaja_')) {
          const val = localStorage.getItem(key) || ''
          totalBytes += (key.length + val.length) * 2 // UTF-16 representation
        }
      }
      const kb = (totalBytes / 1024).toFixed(1)
      return { bytes: totalBytes, kb }
    } catch (e) {
      return { bytes: 0, kb: '0.0' }
    }
  },
}

export const STORAGE_KEYS = {
  RECIPES: 'resepinaja_recipes',
  FAVORITES: 'resepinaja_favorites',
  MEAL_PLANS: 'resepinaja_mealplans',
  SHOPPING_LIST: 'resepinaja_shoppinglist',
  PROFILE: 'resepinaja_profile',
  SETTINGS: 'resepinaja_settings',
}
