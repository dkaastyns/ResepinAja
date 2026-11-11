import { useState } from 'react'
import {
  Edit2,
  Save,
  X,
  ChefHat,
  Heart,
  Calendar,
  ShoppingBag,
  GraduationCap,
  Users,
  IdCard,
  Mail,
  Camera,
} from 'lucide-react'
import { useProfile } from '../hooks/useProfile'
import { useRecipes } from '../hooks/useRecipes'
import { useFavorites } from '../hooks/useFavorites'
import { useMealPlanner } from '../hooks/useMealPlanner'
import { useShoppingList } from '../hooks/useShoppingList'
import { useToast } from '../context/ToastContext'
import { Link } from 'react-router-dom'

const Profile = () => {
  const { profile, updateProfile, getInitials } = useProfile()
  const { userRecipes } = useRecipes()
  const { favorites } = useFavorites()
  const { mealPlans } = useMealPlanner()
  const { totalCount } = useShoppingList()
  const { showToast } = useToast()

  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(profile.name)
  const [editNim, setEditNim] = useState(profile.nim || '')
  const [editKelompok, setEditKelompok] = useState(profile.kelompok || '')
  const [editEmail, setEditEmail] = useState(profile.email || '')
  const [editAvatar, setEditAvatar] = useState(profile.avatar || '')

  const handleStartEdit = () => {
    setEditName(profile.name)
    setEditNim(profile.nim || '')
    setEditKelompok(profile.kelompok || '')
    setEditEmail(profile.email || '')
    setEditAvatar(profile.avatar || '')
    setEditing(true)
  }

  const handleSave = (e) => {
    e.preventDefault()
    updateProfile({
      name: editName,
      nim: editNim,
      kelompok: editKelompok,
      email: editEmail,
      avatar: editAvatar,
    })
    setEditing(false)
    showToast({
      message: 'Data profil berhasil diperbarui! ✨',
      type: 'success',
    })
  }

  const stats = [
    {
      icon: ChefHat,
      label: 'Resep Dibuat',
      value: userRecipes.length,
      to: '/resep-saya',
      color: 'text-green-primary bg-green-primary/10',
    },
    {
      icon: Heart,
      label: 'Resep Favorit',
      value: favorites.length,
      to: '/favorit',
      color: 'text-red-500 bg-red-50',
    },
    {
      icon: Calendar,
      label: 'Jadwal Menu',
      value: mealPlans.length,
      to: '/jadwal',
      color: 'text-blue-600 bg-blue-50',
    },
    {
      icon: ShoppingBag,
      label: 'Item Belanja',
      value: totalCount,
      to: '/belanja',
      color: 'text-accent-orange bg-accent-orange/10',
    },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-8">
      {/* Profile Header Card */}
      <div className="bg-surface border border-border-color rounded-3xl p-6 sm:p-8 shadow-card">
        {!editing ? (
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 text-center sm:text-left">
            {/* Avatar */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-green-primary/20 to-accent-orange/20 border-2 border-green-primary/30 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-md">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-green-primary text-3xl sm:text-4xl font-black">
                  {getInitials()}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="font-black text-text-primary text-2xl sm:text-3xl tracking-tight">
                  {profile.name}
                </h2>
                <span className="badge badge-green text-[10px] font-bold">
                  {profile.nim ? 'Mahasiswa' : 'Koki Rumahan'}
                </span>
              </div>

              {/* NIM & Kelompok Badges */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-0.5">
                {profile.nim ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-green-primary/10 border border-green-primary/20 text-green-primary text-xs font-bold shadow-sm">
                    <IdCard size={14} />
                    <span>NIM: {profile.nim}</span>
                  </span>
                ) : (
                  <button
                    onClick={handleStartEdit}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-background border border-dashed border-border-color text-text-secondary text-xs hover:border-green-primary hover:text-green-primary transition-colors"
                  >
                    + Tambah NIM
                  </button>
                )}

                {profile.kelompok ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-accent-orange/10 border border-accent-orange/20 text-accent-orange font-bold text-xs shadow-sm">
                    <Users size={14} />
                    <span>{profile.kelompok}</span>
                  </span>
                ) : (
                  <button
                    onClick={handleStartEdit}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-background border border-dashed border-border-color text-text-secondary text-xs hover:border-accent-orange hover:text-accent-orange transition-colors"
                  >
                    + Tambah Kelompok
                  </button>
                )}
              </div>

              {/* Email & Joined info */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-text-secondary pt-1">
                {profile.email && (
                  <span className="flex items-center gap-1.5 font-medium">
                    <Mail size={13} className="text-text-secondary/70" />
                    <span>{profile.email}</span>
                  </span>
                )}
                <span className="text-text-muted">
                  Bergabung {new Date(profile.joinedAt).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>

            {/* Edit Button */}
            <button
              onClick={handleStartEdit}
              className="btn-outline text-xs py-2 px-4 shadow-sm self-center sm:self-start"
            >
              <Edit2 size={14} />
              <span>Edit Profil</span>
            </button>
          </div>
        ) : (
          /* Edit Form */
          <form onSubmit={handleSave} className="space-y-4 max-w-lg mx-auto animate-fade-in">
            <div className="flex items-center justify-between border-b border-border-color pb-3">
              <div>
                <h3 className="font-extrabold text-base text-text-primary">Perbarui Profil Anda</h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  Lengkapi data Nama, NIM, dan Kelompok untuk identitas proyek
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="w-8 h-8 rounded-xl bg-background flex items-center justify-center text-text-secondary hover:text-text-primary"
              >
                <X size={16} />
              </button>
            </div>

            {/* Nama */}
            <div>
              <label className="text-xs font-bold text-text-primary block mb-1.5">
                Nama Lengkap / Mahasiswa *
              </label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="input-field"
                placeholder="Contoh: Budi Santoso"
              />
            </div>

            {/* NIM & Kelompok (Grid 2 Kolom) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-text-primary block mb-1.5 flex items-center gap-1">
                  <IdCard size={13} className="text-green-primary" />
                  <span>NIM (Nomor Induk Mahasiswa)</span>
                </label>
                <input
                  type="text"
                  value={editNim}
                  onChange={(e) => setEditNim(e.target.value)}
                  className="input-field"
                  placeholder="Contoh: 21120120140123"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-text-primary block mb-1.5 flex items-center gap-1">
                  <Users size={13} className="text-accent-orange" />
                  <span>Nama / Nomor Kelompok</span>
                </label>
                <input
                  type="text"
                  value={editKelompok}
                  onChange={(e) => setEditKelompok(e.target.value)}
                  className="input-field"
                  placeholder="Contoh: Kelompok 12"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-bold text-text-primary block mb-1.5">Email</label>
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="input-field"
                placeholder="email@mahasiswa.ac.id"
              />
            </div>

            {/* URL Foto Avatar */}
            <div>
              <label className="text-xs font-bold text-text-primary block mb-1.5">URL Foto Avatar</label>
              <input
                type="url"
                value={editAvatar}
                onChange={(e) => setEditAvatar(e.target.value)}
                className="input-field"
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="btn-outline text-xs flex-1"
              >
                Batal
              </button>
              <button type="submit" className="btn-primary text-xs flex-1 font-bold">
                <Save size={15} />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {stats.map(({ icon: Icon, label, value, to, color }) => (
          <Link
            key={label}
            to={to}
            className="card p-4 sm:p-5 hover:-translate-y-1 hover:shadow-card-hover transition-all text-center sm:text-left flex flex-col justify-between"
          >
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 mx-auto sm:mx-0 ${color} shadow-sm`}>
              <Icon size={18} />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
                {value}
              </div>
              <div className="text-xs text-text-secondary font-medium mt-0.5">{label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Menu Links */}
      <div className="bg-surface rounded-3xl border border-border-color divide-y divide-border-color shadow-card overflow-hidden">
        {[
          { label: 'Info Kontak Pengembang (Kelompok 23)', to: '/kontak', desc: 'Identitas Ahmad Dika Styansah & Tim', emoji: '📇' },
          { label: 'Jelajah Resep Nusantara', to: '/jelajah', desc: 'Cari inspirasi masakan harian', emoji: '🍲' },
          { label: 'Cari dari Bahan di Kulkas', to: '/cari-bahan', desc: 'Rekomendasi masakan otomatis', emoji: '🥦' },
          { label: 'Pengaturan & Backup Data', to: '/pengaturan', desc: 'Ekspor, impor, dan preferensi lokal', emoji: '⚙️' },
        ].map(({ label, to, desc, emoji }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center gap-4 p-4 sm:p-5 hover:bg-background transition-colors group"
          >
            <span className="text-2xl">{emoji}</span>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm text-text-primary group-hover:text-green-primary transition-colors">
                {label}
              </h4>
              <p className="text-xs text-text-secondary mt-0.5">{desc}</p>
            </div>
            <span className="text-text-muted group-hover:text-green-primary group-hover:translate-x-1 transition-all">
              ›
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Profile
