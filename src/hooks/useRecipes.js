import { useState, useEffect, useCallback } from 'react'
import { storage, STORAGE_KEYS } from '../utils/localStorage'
import { sampleRecipes } from '../data/sampleRecipes'
import { generateId } from '../utils/helpers'

export const useRecipes = () => {
  const [userRecipes, setUserRecipes] = useState([])

  useEffect(() => {
    const stored = storage.get(STORAGE_KEYS.RECIPES, [])
    setUserRecipes(stored)
  }, [])

  const saveRecipes = useCallback((recipes) => {
    storage.set(STORAGE_KEYS.RECIPES, recipes)
    setUserRecipes(recipes)
  }, [])

  const addRecipe = useCallback((recipeData) => {
    const newRecipe = {
      ...recipeData,
      id: generateId(),
      isUserRecipe: true,
      createdAt: new Date().toISOString(),
    }
    const updated = [...userRecipes, newRecipe]
    saveRecipes(updated)
    return newRecipe
  }, [userRecipes, saveRecipes])

  const updateRecipe = useCallback((id, recipeData) => {
    const updated = userRecipes.map(r =>
      r.id === id ? { ...r, ...recipeData, updatedAt: new Date().toISOString() } : r
    )
    saveRecipes(updated)
  }, [userRecipes, saveRecipes])

  const deleteRecipe = useCallback((id) => {
    const updated = userRecipes.filter(r => r.id !== id)
    saveRecipes(updated)
  }, [userRecipes, saveRecipes])

  const getAllRecipes = useCallback(() => {
    return [...sampleRecipes, ...userRecipes]
  }, [userRecipes])

  const getRecipeById = useCallback((id) => {
    return getAllRecipes().find(r => r.id === id) || null
  }, [getAllRecipes])

  return {
    userRecipes,
    allRecipes: getAllRecipes(),
    sampleRecipes,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    getRecipeById,
  }
}
