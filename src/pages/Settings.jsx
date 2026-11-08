import { useState, useEffect } from 'react'
import {
  Download,
  Upload,
  Trash2,
  Info,
  Database,
  Check,
  ChefHat,
  Users,
  IdCard,
  Sparkles,
  Smartphone,
  Copy,
  ArrowRight,
  Code2,
  Layers,
} from 'lucide-react'
import { storage } from '../utils/localStorage'
import Modal from '../components/ui/Modal'
import { useProfile } from '../hooks/useProfile'
import { useToast } from '../context/ToastContext'
import { Link } from 'react-router-dom'

const Settings = () => {
  const { profile } = useProfile()
  const { showToast } = useToast()

  const [isExportDone, setIsExportDone] = useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [isClearModalOpen, setIsClearModalOpen] = useState(false)
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false)
  const [importJson, setImportJson] = useState('')
  const [importError, setImportError] = useState('')
  const [storageUsage, setStorageUsage] = useState({ kb: '0.0' })

  useEffect(() => {
    setStorageUsage(storage.getStorageUsage())
  }, [])

  const handleExport = () => {
    const data = storage.exportAll()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `resepinaja-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    setIsExportDone(true)
    showToast({
      message: 'File cadangan JSON berhasil diunduh! 📁',
      type: 'success',
    })
    setTimeout(() => setIsExportDone(false), 3000)
  }

  const handleImport = () => {
    setImportError('')
    try {
      const data = JSON.parse(importJson)
      storage.importAll(data)
      setIsImportModalOpen(false)
      setImportJson('')
      showToast({
        message: 'Data berhasil dipulihkan! Memuat ulang...',
        type: 'success',
      })
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (e) {
      setImportError('Format JSON tidak valid. Pastikan file cadangan yang Anda tempel benar.')
    }
  }

  const handleClearAll = () => {
    storage.clear()
    setIsClearModalOpen(false)
    showToast({
      message: 'Semua data telah dibersihkan',
      type: 'error',
    })
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }

  const handleCopyProjectSummary = () => {
    const summary = `
PROYEK: ResepinAja – Recipe Discovery & Meal Planner
TAGLINE: Find Recipes. Cook with Ease.
PLATFORM: Progressive Web App (PWA) Offline-First

PENGEMBANG:
- Nama: ${profile.name || '-'}
- NIM: ${profile.nim || '-'}
- Kelompok: ${profile.kelompok || '-'}

FITUR UTAMA:
1. Home / Dashboard (Rekomendasi, Populer, Masak Cepat)
2. Recipe Explorer (Pencarian & Multi-Filter)
3. Recipe Detail (Servings Scaler & Checklist Memasak)
4. Ingredient Search (Kalkulasi % Kecocokan Bahan Kulkas)
5. My Recipes (CRUD Resep Kreasi Pribadi)
6. Favorites (Koleksi Resep Kesukaan)
7. Meal Planner (Jadwal Menu Mingguan 4 Waktu Makan)
8. Shopping List (Daftar Belanja Bahan Otomatis & Manual)
9. Profil Mahasiswa (Identitas Akademik & Statistik)
10. Settings & Backup (Ekspor & Impor File JSON Offline)

TECH STACK:
React 18, Vite 5, Tailwind CSS v3, vite-plugin-pwa, React Router v6, Supabase PostgreSQL, LocalStorage.
    `.trim()

    if (navigator.clipboard) {
      navigator.clipboard.writeText(summary)
      showToast({
        message: 'Ringkasan laporan proyek disalin ke clipboard! 📋',
        type: 'success',
      })
    }
  }

  const Section = ({ title, children }) => (
    <div className="space-y-2.5">
      <h2 className="text-xs font-black text-text-secondary uppercase tracking-wider px-1">
        {title}
      </h2>
      <div className="bg-surface border border-border-color rounded-3xl divide-y divide-border-color shadow-card overflow-hidden">
        {children}
      </div>
    </div>
  )

  const SettingItem = ({ icon: Icon, label, description, action, onClick, danger }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 sm:p-5 text-left transition-colors ${
        danger ? 'hover:bg-red-50/50' : 'hover:bg-background/80'
      }`}
    >
      <div
        className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${
          danger ? 'bg-red-50 text-red-500' : 'bg-green-primary/10 text-green-primary'
        }`}
      >
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-bold ${danger ? 'text-red-500' : 'text-text-primary'}`}>
          {label}
        </p>
        {description && (
          <p className="text-xs text-text-secondary mt-0.5">{description}</p>
        )}
      </div>
      {action && <div className="text-text-secondary text-sm flex-shrink-0">{action}</div>}
    </button>
  )

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-8">
      <div>
        <h1 className="page-header">Pengaturan Aplikasi</h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Kelola cadangan data, penyimpanan lokal, dan informasi proyek
        </p>
      </div>

      <Section title="Informasi & Dokumentasi Proyek">
        <SettingItem
          icon={Info}
          label="Tentang Proyek ResepinAja"
          description="Lihat deskripsi produk, identitas tim, NIM, kelompok, dan arsitektur sistem"
          action={<span className="text-text-muted font-bold">Detail ›</span>}
          onClick={() => setIsAboutModalOpen(true)}
        />
        <SettingItem
          icon={Smartphone}
          label="Status Progressive Web App (PWA)"
          description="Service worker aktif dengan dukungan instalasi perangkat dan akses penuh tanpa internet"
          action={<span className="badge badge-green text-xs font-bold">PWA Siap</span>}
        />
      </Section>

      <Section title="Manajemen Data & Penyimpanan">
        <SettingItem
          icon={Database}
          label="Penyimpanan Offline (LocalStorage)"
          description={`Data aplikasi disimpan di peramban lokal (${storageUsage.kb} KB terpakai)`}
          action={<span className="badge badge-green text-xs font-bold">{storageUsage.kb} KB</span>}
        />
        <SettingItem
          icon={Download}
          label="Ekspor Data Cadangan"
          description="Unduh seluruh resep, favorit, jadwal, dan daftar belanja ke file JSON"
          action={
            isExportDone ? (
              <span className="badge badge-green text-xs font-bold inline-flex items-center gap-1">
                <Check size={12} /> Terunduh
              </span>
            ) : (
              <span className="text-text-muted">›</span>
            )
          }
          onClick={handleExport}
        />
        <SettingItem
          icon={Upload}
          label="Impor Data Cadangan"
          description="Pulihkan data aplikasi dari file cadangan JSON yang pernah Anda simpan"
          action={<span className="text-text-muted">›</span>}
          onClick={() => setIsImportModalOpen(true)}
        />
      </Section>

      <Section title="Zona Berbahaya">
        <SettingItem
          icon={Trash2}
          label="Hapus Semua Data Lokal"
          description="Hapus seluruh resep pribadi, favorit, jadwal menu, dan daftar belanja secara permanen"
          danger
          onClick={() => setIsClearModalOpen(true)}
        />
      </Section>

      {/* Modal: Tentang Proyek Lengkap */}
      <Modal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
        title="Tentang Proyek ResepinAja"
        size="lg"
      >
        <div className="space-y-6 text-left py-1 max-h-[75vh] overflow-y-auto pr-1">
          {/* Header Banner */}
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-gradient-to-br from-green-primary/10 via-cream-light to-accent-orange/10 border border-green-primary/20">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-primary to-green-secondary text-white font-black text-2xl flex items-center justify-center shadow-md flex-shrink-0">
              R
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-text-primary">ResepinAja</h3>
                <span className="badge badge-green text-[10px] font-black uppercase">v1.2.0</span>
              </div>
              <p className="text-xs font-semibold text-text-secondary mt-0.5">
                Recipe Discovery & Meal Planning Progressive Web App (PWA)
              </p>
              <p className="text-[11px] text-accent-orange font-bold italic mt-0.5">
                "Find Recipes. Cook with Ease."
              </p>
            </div>
          </div>

          {/* Identitas Mahasiswa & Kelompok */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <Users size={14} className="text-green-primary" />
                <span>Identitas Pengembang & Kelompok</span>
              </h4>
              <Link
                to="/profil"
                onClick={() => setIsAboutModalOpen(false)}
                className="text-xs text-green-primary hover:underline font-bold flex items-center gap-1"
              >
                Ubah di Profil <ArrowRight size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-background border border-border-color rounded-2xl p-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-text-secondary uppercase">Nama Pengembang</span>
                <p className="text-xs sm:text-sm font-extrabold text-text-primary">
                  {profile.name || 'Belum diisi'}
                </p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-text-secondary uppercase">NIM</span>
                <p className="text-xs sm:text-sm font-extrabold text-green-primary font-mono">
                  {profile.nim || 'Belum diisi'}
                </p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-text-secondary uppercase">Kelompok</span>
                <p className="text-xs sm:text-sm font-extrabold text-accent-orange">
                  {profile.kelompok || 'Belum diisi'}
                </p>
              </div>
            </div>
          </div>

          {/* Deskripsi Produk */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
              <ChefHat size={14} className="text-accent-orange" />
              <span>Deskripsi & Tujuan Produk</span>
            </h4>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed bg-surface border border-border-color rounded-2xl p-4">
              ResepinAja merupakan platform aplikasi web berbasis <strong>Progressive Web App (PWA)</strong> yang dirancang untuk memudahkan mahasiswa, pekerja, dan keluarga dalam menemukan inspirasi masakan harian, mencari resep berdasarkan bahan makanan yang tersedia di dapur, mengelola resep pribadi, menyusun jadwal menu mingguan, serta mencatat daftar belanja bahan makanan. Aplikasi dirancang dengan prinsip <em>Offline-First</em>, sehingga seluruh fitur inti dapat berjalan lancar tanpa koneksi internet.
            </p>
          </div>

          {/* Fitur Utama */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
              <Layers size={14} className="text-green-primary" />
              <span>10 Fitur Utama (Sesuai PRD)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                { title: 'Home / Dashboard', desc: 'Rekomendasi resep, kategori masakan, resep cepat & populer' },
                { title: 'Recipe Explorer', desc: 'Pencarian nama resep, filter kategori & tingkat kesulitan' },
                { title: 'Recipe Detail', desc: 'Foto HD, takaran bahan dinamis, checklist langkah memasak' },
                { title: 'Ingredient Search', desc: 'Kalkulasi persentase kecocokan resep dari bahan kulkas' },
                { title: 'My Recipes (CRUD)', desc: 'Tambah, edit, dan hapus resep kreasi pribadi' },
                { title: 'Favorites', desc: 'Simpan dan kelola resep favorit dengan satu sentuhan' },
                { title: 'Meal Planner', desc: 'Jadwal mingguan sarapan, makan siang, malam, dan camilan' },
                { title: 'Shopping List', desc: 'Daftar belanja bahan otomatis dari resep dengan progress' },
                { title: 'Profil Mahasiswa', desc: 'Identitas lengkap nama, NIM, kelompok, dan statistik' },
                { title: 'Settings & Data Backup', desc: 'Ekspor/impor file JSON & manajemen data offline' },
              ].map((fitur, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-background border border-border-color">
                  <span className="font-bold text-text-primary block">{i + 1}. {fitur.title}</span>
                  <span className="text-[11px] text-text-secondary mt-0.5 block">{fitur.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Teknologi */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
              <Code2 size={14} className="text-blue-500" />
              <span>Spesifikasi Teknologi (Tech Stack)</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {[
                'React 18',
                'Vite 5',
                'Tailwind CSS v3',
                'vite-plugin-pwa (Workbox)',
                'React Router v6',
                'Supabase PostgreSQL',
                'Lucide React Icons',
                'HTML5 LocalStorage',
                'Vercel Deployment',
              ].map(tech => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded-lg bg-surface border border-border-color text-[11px] font-semibold text-text-primary shadow-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons in Modal */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              onClick={handleCopyProjectSummary}
              className="btn-outline text-xs flex-1 font-bold flex items-center justify-center gap-1.5 py-2.5"
            >
              <Copy size={14} />
              <span>Salin Ringkasan Laporan</span>
            </button>
            <button
              onClick={() => setIsAboutModalOpen(false)}
              className="btn-primary text-xs flex-1 font-bold py-2.5"
            >
              Tutup Informasi
            </button>
          </div>
        </div>
      </Modal>

      {/* Import Modal */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => {
          setIsImportModalOpen(false)
          setImportJson('')
          setImportError('')
        }}
        title="Impor Data Cadangan"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-text-secondary">
            Buka file JSON cadangan Anda dengan teks editor, lalu tempel seluruh isinya di bawah ini:
          </p>
          <textarea
            rows={8}
            value={importJson}
            onChange={(e) => setImportJson(e.target.value)}
            placeholder='{ "resepinaja_recipes": [...], ... }'
            className="input-field resize-none font-mono text-xs"
          />
          {importError && <p className="text-red-500 text-xs font-bold">{importError}</p>}
          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsImportModalOpen(false)
                setImportJson('')
                setImportError('')
              }}
              className="btn-outline text-xs flex-1"
            >
              Batal
            </button>
            <button onClick={handleImport} className="btn-primary text-xs flex-1 font-bold">
              Impor & Pulihkan
            </button>
          </div>
        </div>
      </Modal>

      {/* Clear Confirm Modal */}
      <Modal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        title="Hapus Semua Data"
        size="sm"
      >
        <div className="text-center py-2 space-y-3">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto text-red-500">
            <Trash2 size={24} />
          </div>
          <div>
            <h4 className="font-extrabold text-text-primary text-base">Hapus Seluruh Data?</h4>
            <p className="text-xs text-text-secondary mt-1">
              Tindakan ini tidak dapat dibatalkan. Semua resep dan jadwal yang tersimpan akan hilang.
            </p>
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={() => setIsClearModalOpen(false)} className="btn-outline text-xs flex-1">
              Batal
            </button>
            <button onClick={handleClearAll} className="btn-danger text-xs flex-1 font-bold">
              Ya, Hapus Semua
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Settings
