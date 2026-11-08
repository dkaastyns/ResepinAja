import { useState, useEffect, useCallback } from 'react'
import { storage, STORAGE_KEYS } from '../utils/localStorage'
import { generateId } from '../utils/helpers'

export const useMealPlanner = () => {
  const [mealPlans, setMealPlans] = useState([])

  useEffect(() => {
    const stored = storage.get(STORAGE_KEYS.MEAL_PLANS, [])
    setMealPlans(stored)
  }, [])

  const savePlans = useCallback((plans) => {
    storage.set(STORAGE_KEYS.MEAL_PLANS, plans)
    setMealPlans(plans)
  }, [])

  const addMealPlan = useCallback((date, mealType, recipeId) => {
    // Remove existing same slot
    const filtered = mealPlans.filter(
      p => !(p.date === date && p.mealType === mealType)
    )
    const newPlan = {
      id: generateId(),
      date,
      mealType,
      recipeId,
      createdAt: new Date().toISOString(),
    }
    savePlans([...filtered, newPlan])
  }, [mealPlans, savePlans])

  const removeMealPlan = useCallback((id) => {
    savePlans(mealPlans.filter(p => p.id !== id))
  }, [mealPlans, savePlans])

  const getMealsByDate = useCallback((date) => {
    return mealPlans.filter(p => p.date === date)
  }, [mealPlans])

  const getMealsByDateRange = useCallback((dates) => {
    return mealPlans.filter(p => dates.includes(p.date))
  }, [mealPlans])

  const getMealBySlot = useCallback((date, mealType) => {
    return mealPlans.find(p => p.date === date && p.mealType === mealType) || null
  }, [mealPlans])

  return {
    mealPlans,
    addMealPlan,
    removeMealPlan,
    getMealsByDate,
    getMealsByDateRange,
    getMealBySlot,
  }
}
