import { useState } from 'react'
import {
  IdCard,
  Users,
  Mail,
  Github,
  Globe,
  GraduationCap,
  Copy,
  Check,
  Sparkles,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  ShieldCheck,
  HeartHandshake,
  ExternalLink,
} from 'lucide-react'
import { useProfile } from '../hooks/useProfile'
import { useToast } from '../context/ToastContext'

const Contact = () => {
  const { profile } = useProfile()
  const { showToast } = useToast()

  const [copiedField, setCopiedField] = useState(null)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Explicit requirements:
  // Nama: Ahmad Dika Styansah
  // NIM: 21120124130052
  // Kelompok: 23
  const contactInfo = {
    name: 'Ahmad Dika Styansah',
    nim: '21120124130052',
    kelompok: '23',
    kelompokFull: 'Kelompok 23',
    role: 'Lead Developer & Mahasiswa',
    prodi: 'Teknik Komputer',
    universitas: 'Universitas Diponegoro',
    matkul: 'Praktikum Pemrograman Perangkat Bergerak',
    email: 'ahmad.dika@students.undip.ac.id',
    github: 'https://github.com/dkaastyns',
    repo: 'https://github.com/dkaastyns/ResepinAja',
    location: 'Semarang, Jawa Tengah, Indonesia',
  }

  const copyToClipboard = (text, fieldName, label) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
      setCopiedField(fieldName)
      showToast({
        message: `${label} berhasil disalin ke clipboard! 📋`,
        type: 'success',
      })
      setTimeout(() => setCopiedField(null), 2500)
    }
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.message) {
      showToast({
        message: 'Mohon isi nama dan pesan Anda terlebih dahulu.',
        type: 'error',
      })
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setFormData({ name: '', email: '', message: '' })
      showToast({
        message: `Terima kasih ${formData.name}! Pesan Anda telah terkirim ke pengembang. ✨`,
        type: 'success',
      })
    }, 600)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header section with liquid glass badge */}
      <div className="text-center space-y-3 pt-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass-capsule shadow-sm">
          <Sparkles size={14} className="text-green-primary animate-pulse" />
          <span className="text-xs font-extrabold text-green-primary tracking-wide uppercase">
            Informasi Resmi Pengembang
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">
          Info Kontak & Tim
        </h1>
        <p className="text-text-secondary text-sm sm:text-base max-w-xl mx-auto">
          Informasi identitas pengembang dan kontak proyek aplikasi resep makanan modern{' '}
          <span className="font-bold text-green-primary">Resepin</span>
          <span className="font-bold text-accent-orange">Aja</span>.
        </p>
      </div>

      {/* Main Developer Liquid Glass Card */}
      <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-white/80 shadow-card">
        {/* Decorative glass glow blobs */}
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-green-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-accent-orange/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
          {/* Avatar with iOS-style gradient border */}
          <div className="relative group flex-shrink-0">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-green-primary via-green-secondary to-accent-orange p-1 shadow-lg shadow-green-primary/20">
              <div className="w-full h-full rounded-[22px] bg-surface flex flex-col items-center justify-center text-center p-2 overflow-hidden">
                <span className="text-3xl sm:text-4xl font-black text-green-primary tracking-tighter">
                  AD
                </span>
                <span className="text-[10px] font-bold text-text-muted mt-1 uppercase tracking-wider">
                  Kelompok 23
                </span>
              </div>
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-green-primary text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1 whitespace-nowrap">
              <ShieldCheck size={11} />
              <span>Verified Dev</span>
            </div>
          </div>

          {/* Profile Details */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1.5">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                  {contactInfo.name}
                </h2>
                <span className="px-3 py-1 rounded-full bg-green-primary/15 text-green-dark text-xs font-black border border-green-primary/20">
                  {contactInfo.role}
                </span>
              </div>
              <p className="text-text-secondary text-xs sm:text-sm flex items-center justify-center md:justify-start gap-1.5">
                <GraduationCap size={15} className="text-green-primary" />
                <span>
                  {contactInfo.prodi} • {contactInfo.universitas}
                </span>
              </p>
            </div>

            {/* Key Information Badges: NIM & Kelompok (Required) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* NIM Card with Copy Button */}
              <div className="liquid-glass-pill p-3.5 rounded-2xl flex items-center justify-between gap-3 border border-border-color/80 shadow-sm">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-green-primary/15 text-green-primary flex items-center justify-center flex-shrink-0">
                    <IdCard size={20} />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                      Nomor Induk Mahasiswa (NIM)
                    </p>
                    <p className="text-base font-black text-text-primary tracking-tight truncate">
                      {contactInfo.nim}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(contactInfo.nim, 'nim', 'NIM')}
                  className="p-2 rounded-xl bg-surface hover:bg-cream border border-border-color text-text-secondary hover:text-green-primary transition-all active:scale-95 shadow-xs"
                  title="Salin NIM"
                >
                  {copiedField === 'nim' ? (
                    <Check size={16} className="text-green-primary" />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
              </div>

              {/* Kelompok Card with Copy Button */}
              <div className="liquid-glass-pill p-3.5 rounded-2xl flex items-center justify-between gap-3 border border-border-color/80 shadow-sm">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-accent-orange/15 text-accent-orange flex items-center justify-center flex-shrink-0">
                    <Users size={20} />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                      Kelompok Praktikum
                    </p>
                    <p className="text-base font-black text-text-primary tracking-tight">
                      Kelompok {contactInfo.kelompok}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(`Kelompok ${contactInfo.kelompok}`, 'kelompok', 'Kelompok')
                  }
                  className="p-2 rounded-xl bg-surface hover:bg-cream border border-border-color text-text-secondary hover:text-accent-orange transition-all active:scale-95 shadow-xs"
                  title="Salin Kelompok"
                >
                  {copiedField === 'kelompok' ? (
                    <Check size={16} className="text-accent-orange" />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
              </div>
            </div>

            {/* Quick contact / social pills */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
              <a
                href={`mailto:${contactInfo.email}`}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-surface hover:bg-cream border border-border-color text-text-primary transition-colors shadow-xs"
              >
                <Mail size={13} className="text-green-primary" />
                <span>{contactInfo.email}</span>
              </a>

              <a
                href={contactInfo.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-surface hover:bg-cream border border-border-color text-text-primary transition-colors shadow-xs"
              >
                <Github size={13} className="text-text-primary" />
                <span>github.com/dkaastyns</span>
                <ExternalLink size={11} className="text-text-muted" />
              </a>

              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-surface/70 border border-border-color text-text-secondary">
                <MapPin size={13} className="text-accent-orange" />
                <span>Semarang, Indonesia</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two columns: Project Specification & Quick Contact Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Project & Academic Specifications */}
        <div className="space-y-4">
          <h2 className="text-base font-black text-text-primary tracking-tight flex items-center gap-2 px-1">
            <GraduationCap size={18} className="text-green-primary" />
            <span>Spesifikasi Akademik & Proyek</span>
          </h2>

          <div className="liquid-glass-card rounded-3xl p-5 space-y-3.5 border border-white/70 shadow-card">
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-border-color">
                <span className="text-text-secondary font-medium">Nama Mahasiswa</span>
                <span className="font-bold text-text-primary">{contactInfo.name}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border-color">
                <span className="text-text-secondary font-medium">NIM</span>
                <span className="font-extrabold text-green-primary font-mono text-sm">
                  {contactInfo.nim}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border-color">
                <span className="text-text-secondary font-medium">Nomor Kelompok</span>
                <span className="font-extrabold text-accent-orange">
                  Kelompok {contactInfo.kelompok}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border-color">
                <span className="text-text-secondary font-medium">Program Studi</span>
                <span className="font-bold text-text-primary">{contactInfo.prodi}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border-color">
                <span className="text-text-secondary font-medium">Mata Kuliah</span>
                <span className="font-bold text-text-primary text-right">{contactInfo.matkul}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border-color">
                <span className="text-text-secondary font-medium">Nama Aplikasi</span>
                <span className="font-bold text-text-primary">ResepinAja (PWA)</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-text-secondary font-medium">Status Aplikasi</span>
                <span className="badge badge-green text-[10px] font-black">
                  Production Ready v1.0.0
                </span>
              </div>
            </div>

            {/* Quick Copy All Details Button */}
            <button
              type="button"
              onClick={() => {
                const fullText = `Nama: ${contactInfo.name}\nNIM: ${contactInfo.nim}\nKelompok: Kelompok ${contactInfo.kelompok}\nProgram Studi: ${contactInfo.prodi}\nUniversitas: ${contactInfo.universitas}`
                copyToClipboard(fullText, 'all', 'Data Mahasiswa')
              }}
              className="w-full btn-secondary text-xs py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 mt-2"
            >
              {copiedField === 'all' ? (
                <>
                  <Check size={14} className="text-green-primary" />
                  <span>Data Lengkap Disalin!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Salin Lengkap Data Identitas</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Send Message / Feedback to Developer */}
        <div className="space-y-4">
          <h2 className="text-base font-black text-text-primary tracking-tight flex items-center gap-2 px-1">
            <MessageSquare size={18} className="text-accent-orange" />
            <span>Kirim Pesan / Feedback</span>
          </h2>

          <form
            onSubmit={handleSendMessage}
            className="liquid-glass-card rounded-3xl p-5 space-y-3.5 border border-white/70 shadow-card"
          >
            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">Nama Lengkap</label>
              <input
                type="text"
                placeholder="Masukkan nama Anda..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field py-2.5 text-xs rounded-xl"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">
                Alamat Email (Opsional)
              </label>
              <input
                type="email"
                placeholder="nama@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field py-2.5 text-xs rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">Pesan / Saran</label>
              <textarea
                rows={3}
                placeholder="Tulis kritik, saran, atau masukan untuk ResepinAja..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="input-field py-2.5 text-xs rounded-xl resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary text-xs py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm"
            >
              {isSubmitting ? (
                <span>Mengirim pesan...</span>
              ) : (
                <>
                  <Send size={14} />
                  <span>Kirim Pesan ke Ahmad Dika</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Contact
