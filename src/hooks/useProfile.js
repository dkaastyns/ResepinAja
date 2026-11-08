import { useState, useEffect, useCallback } from 'react'
import { storage, STORAGE_KEYS } from '../utils/localStorage'

const defaultProfile = {
  id: 'user_001',
  name: 'Pengguna ResepinAja',
  nim: '',
  kelompok: '',
  email: '',
  avatar: null,
  joinedAt: new Date().toISOString(),
}

export const useProfile = () => {
  const [profile, setProfile] = useState(defaultProfile)

  useEffect(() => {
    const stored = storage.get(STORAGE_KEYS.PROFILE, defaultProfile)
    setProfile(prev => ({ ...defaultProfile, ...stored }))
  }, [])

  const updateProfile = useCallback((updates) => {
    const updated = { ...profile, ...updates, updatedAt: new Date().toISOString() }
    storage.set(STORAGE_KEYS.PROFILE, updated)
    setProfile(updated)
  }, [profile])

  const getInitials = useCallback(() => {
    if (!profile.name) return 'U'
    return profile.name
      .split(' ')
      .slice(0, 2)
      .map(n => n[0]?.toUpperCase())
      .join('')
  }, [profile.name])

  return {
    profile,
    updateProfile,
    getInitials,
  }
}
