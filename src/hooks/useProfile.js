import { useState, useEffect, useCallback } from 'react'
import { storage, STORAGE_KEYS } from '../utils/localStorage'

const defaultProfile = {
  id: 'user_001',
  name: 'Ahmad Dika Styansah',
  nim: '21120124130052',
  kelompok: 'Kelompok 23',
  email: 'dikatzy@gmail.com',
  avatar: null,
  role: 'Pengembang & Mahasiswa',
  joinedAt: '2024-08-15T00:00:00.000Z',
}

export const useProfile = () => {
  const [profile, setProfile] = useState(defaultProfile)

  useEffect(() => {
    const stored = storage.get(STORAGE_KEYS.PROFILE, null)
    const merged = { ...defaultProfile, ...(stored || {}) }
    // Clean campus email or placeholder to requested personal email
    if (!stored?.email || stored.email.includes('undip.ac.id') || stored.email === 'email@contoh.com') {
      merged.email = defaultProfile.email
    }
    if (!stored?.nim) merged.nim = defaultProfile.nim
    if (!stored?.kelompok) merged.kelompok = defaultProfile.kelompok
    if (!stored?.name || stored.name === 'Pengguna ResepinAja') merged.name = defaultProfile.name
    
    storage.set(STORAGE_KEYS.PROFILE, merged)
    setProfile(merged)
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
