import { useState, useEffect, useCallback } from 'react'
import { storage, STORAGE_KEYS } from '../utils/localStorage'
import { generateId } from '../utils/helpers'

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    const stored = storage.get(STORAGE_KEYS.FAVORITES, [])
    setFavorites(stored)
  }, [])

  const saveFavorites = useCallback((favs) => {
    storage.set(STORAGE_KEYS.FAVORITES, favs)
    setFavorites(favs)
  }, [])

  const addFavorite = useCallback((recipeId) => {
    if (favorites.some(f => f.recipeId === recipeId)) return
    const newFav = {
      id: generateId(),
      recipeId,
      createdAt: new Date().toISOString(),
    }
    saveFavorites([...favorites, newFav])
  }, [favorites, saveFavorites])

  const removeFavorite = useCallback((recipeId) => {
    saveFavorites(favorites.filter(f => f.recipeId !== recipeId))
  }, [favorites, saveFavorites])

  const isFavorite = useCallback((recipeId) => {
    return favorites.some(f => f.recipeId === recipeId)
  }, [favorites])

  const toggleFavorite = useCallback((recipeId) => {
    if (isFavorite(recipeId)) {
      removeFavorite(recipeId)
    } else {
      addFavorite(recipeId)
    }
  }, [isFavorite, addFavorite, removeFavorite])

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
  }
}
