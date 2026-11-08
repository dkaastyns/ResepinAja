import { useState, useEffect, useCallback } from 'react'
import { storage, STORAGE_KEYS } from '../utils/localStorage'
import { generateId } from '../utils/helpers'

export const useShoppingList = () => {
  const [items, setItems] = useState([])

  useEffect(() => {
    const stored = storage.get(STORAGE_KEYS.SHOPPING_LIST, [])
    setItems(stored)
  }, [])

  const saveItems = useCallback((newItems) => {
    storage.set(STORAGE_KEYS.SHOPPING_LIST, newItems)
    setItems(newItems)
  }, [])

  const addItem = useCallback((name, quantity = '', unit = '') => {
    const newItem = {
      id: generateId(),
      name,
      quantity,
      unit,
      isChecked: false,
      createdAt: new Date().toISOString(),
    }
    saveItems([...items, newItem])
  }, [items, saveItems])

  const addItemsFromRecipe = useCallback((ingredients) => {
    const newItems = ingredients
      .filter(ing => {
        const name = typeof ing === 'string' ? ing : ing.name
        return !items.some(i => i.name.toLowerCase() === name.toLowerCase())
      })
      .map(ing => ({
        id: generateId(),
        name: typeof ing === 'string' ? ing : ing.name,
        quantity: typeof ing === 'string' ? '' : (ing.quantity || ''),
        unit: typeof ing === 'string' ? '' : (ing.unit || ''),
        isChecked: false,
        createdAt: new Date().toISOString(),
      }))
    saveItems([...items, ...newItems])
    return newItems.length
  }, [items, saveItems])

  const toggleItem = useCallback((id) => {
    saveItems(items.map(i => i.id === id ? { ...i, isChecked: !i.isChecked } : i))
  }, [items, saveItems])

  const removeItem = useCallback((id) => {
    saveItems(items.filter(i => i.id !== id))
  }, [items, saveItems])

  const removeChecked = useCallback(() => {
    saveItems(items.filter(i => !i.isChecked))
  }, [items, saveItems])

  const clearAll = useCallback(() => {
    saveItems([])
  }, [saveItems])

  const updateItem = useCallback((id, updates) => {
    saveItems(items.map(i => i.id === id ? { ...i, ...updates } : i))
  }, [items, saveItems])

  return {
    items,
    addItem,
    addItemsFromRecipe,
    toggleItem,
    removeItem,
    removeChecked,
    clearAll,
    updateItem,
    checkedCount: items.filter(i => i.isChecked).length,
    totalCount: items.length,
  }
}
