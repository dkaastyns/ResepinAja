import { useState } from 'react'
import {
  IdCard,
  Users,
  Mail,
  Github,
  GraduationCap,
  Copy,
  Check,
  MapPin,
  Send,
  ExternalLink,
  Code2,
} from 'lucide-react'
import { useProfile } from '../hooks/useProfile'
import { useToast } from '../context/ToastContext'

const Contact = () => {
  const { profile } = useProfile()
  const { showToast } = useToast()

  const [copiedField, setCopiedField] = useState(null)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const contactInfo = {
    name: 'Ahmad Dika Styansah',
    nim: '21120124130052',
    kelompok: '23',
    kelompokLabel: 'Kelompok 23',
    prodi: 'Teknik Komputer',
    universitas: 'Universitas Diponegoro',
    matkul: 'Praktikum Pemrograman Perangkat Bergerak',
    email: 'dikatzy@gmail.com',
    githubUrl: 'https://github.com/dkaastyns',
    githubHandle: 'dkaastyns',
    repoUrl: 'https://github.com/dkaastyns/ResepinAja',
    location: 'Semarang, Indonesia',
  }

  const copyToClipboard = (text, fieldName, label) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
      setCopiedField(fieldName)
      showToast({
        message: `${label} berhasil disalin`,
        type: 'success',
      })
      setTimeout(() => setCopiedField(null), 2000)
    }
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.message.trim()) {
      showToast({
        message: 'Mohon lengkapi nama dan pesan',
        type: 'error',
      })
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setFormData({ name: '', email: '', message: '' })
      showToast({
        message: 'Pesan Anda berhasil terkirim',
        type: 'success',
      })
    }, 500)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
          Kontak Pengembang
        </h1>
        <p className="text-sm text-text-secondary">
          Identitas pengembang dan informasi proyek aplikasi ResepinAja.
        </p>
      </div>

      {/* Main Profile Card - Clean, Human, Anti-Slop Bento */}
      <div className="bg-surface border border-border-color rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
          {/* Avatar Monogram */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-cream border border-border-color flex items-center justify-center flex-shrink-0">
            <span className="text-xl sm:text-2xl font-black text-green-dark tracking-tight">
              AD
            </span>
          </div>

          {/* Identity Info */}
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
                {contactInfo.name}
              </h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-primary/10 text-green-dark border border-green-primary/20">
                Kelompok {contactInfo.kelompok}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-text-secondary flex items-center gap-1.5">
              <GraduationCap size={15} className="text-text-muted flex-shrink-0" />
              <span>
                {contactInfo.prodi} · {contactInfo.universitas}
              </span>
            </p>

            <p className="text-xs text-text-muted flex items-center gap-1.5">
              <MapPin size={13} className="text-text-muted flex-shrink-0" />
              <span>{contactInfo.location}</span>
            </p>
          </div>
        </div>

        {/* Credentials Grid with Quick Copy */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 pt-6 border-t border-border-color">
          {/* NIM */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-background border border-border-color">
            <div className="space-y-0.5">
              <span className="text-[11px] font-medium text-text-muted uppercase tracking-wider">
                NIM
              </span>
              <p className="text-sm font-bold text-text-primary font-mono tracking-tight">
                {contactInfo.nim}
              </p>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(contactInfo.nim, 'nim', 'NIM')}
              className="p-2 rounded-lg bg-surface hover:bg-cream border border-border-color text-text-secondary hover:text-text-primary transition-colors text-xs inline-flex items-center gap-1 font-semibold"
              title="Salin NIM"
            >
              {copiedField === 'nim' ? (
                <>
                  <Check size={14} className="text-green-primary" />
                  <span className="text-green-primary">Disalin</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Salin</span>
                </>
              )}
            </button>
          </div>

          {/* Kelompok */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-background border border-border-color">
            <div className="space-y-0.5">
              <span className="text-[11px] font-medium text-text-muted uppercase tracking-wider">
                Kelompok Praktikum
              </span>
              <p className="text-sm font-bold text-text-primary">
                {contactInfo.kelompokLabel}
              </p>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(contactInfo.kelompokLabel, 'kelompok', 'Kelompok')}
              className="p-2 rounded-lg bg-surface hover:bg-cream border border-border-color text-text-secondary hover:text-text-primary transition-colors text-xs inline-flex items-center gap-1 font-semibold"
              title="Salin Kelompok"
            >
              {copiedField === 'kelompok' ? (
                <>
                  <Check size={14} className="text-green-primary" />
                  <span className="text-green-primary">Disalin</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Salin</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Channels: Email & GitHub */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          {/* Email */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-background border border-border-color">
            <div className="flex items-center gap-2.5 min-w-0">
              <Mail size={16} className="text-text-muted flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-[11px] font-medium text-text-muted block uppercase tracking-wider">
                  Email
                </span>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="text-xs sm:text-sm font-semibold text-text-primary hover:text-green-primary truncate block transition-colors"
                >
                  {contactInfo.email}
                </a>
              </div>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(contactInfo.email, 'email', 'Email')}
              className="p-2 rounded-lg bg-surface hover:bg-cream border border-border-color text-text-secondary hover:text-text-primary transition-colors"
              title="Salin Email"
            >
              {copiedField === 'email' ? <Check size={14} className="text-green-primary" /> : <Copy size={14} />}
            </button>
          </div>

          {/* GitHub */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-background border border-border-color">
            <div className="flex items-center gap-2.5 min-w-0">
              <Github size={16} className="text-text-muted flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-[11px] font-medium text-text-muted block uppercase tracking-wider">
                  GitHub
                </span>
                <a
                  href={contactInfo.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs sm:text-sm font-semibold text-text-primary hover:text-green-primary truncate block transition-colors"
                >
                  {contactInfo.githubHandle}
                </a>
              </div>
            </div>
            <a
              href={contactInfo.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-surface hover:bg-cream border border-border-color text-text-secondary hover:text-text-primary transition-colors"
              title="Buka GitHub"
            >
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* Two Columns: Project Overview & Direct Message */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Project Card */}
        <div className="bg-surface border border-border-color rounded-2xl p-5 space-y-3.5 shadow-xs">
          <div className="flex items-center gap-2 text-text-primary">
            <Code2 size={16} className="text-green-primary" />
            <h3 className="text-sm font-bold">Tentang Aplikasi</h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-border-color">
              <span className="text-text-secondary">Aplikasi</span>
              <span className="font-semibold text-text-primary">ResepinAja</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border-color">
              <span className="text-text-secondary">Platform</span>
              <span className="font-semibold text-text-primary">Progressive Web App (PWA)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border-color">
              <span className="text-text-secondary">Mata Kuliah</span>
              <span className="font-semibold text-text-primary text-right">{contactInfo.matkul}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border-color">
              <span className="text-text-secondary">Status Offline</span>
              <span className="font-semibold text-green-primary">Mendukung (Workbox SW)</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-text-secondary">Repositori</span>
              <a
                href={contactInfo.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-green-primary hover:underline flex items-center gap-1"
              >
                <span>ResepinAja</span>
                <ExternalLink size={11} />
              </a>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const text = `Nama: ${contactInfo.name}\nNIM: ${contactInfo.nim}\nKelompok: ${contactInfo.kelompokLabel}\nEmail: ${contactInfo.email}`
              copyToClipboard(text, 'all', 'Data identitas')
            }}
            className="w-full btn-secondary text-xs py-2 rounded-xl font-semibold mt-2"
          >
            {copiedField === 'all' ? 'Data Berhasil Disalin' : 'Salin Biodata Singkat'}
          </button>
        </div>

        {/* Message / Feedback Form */}
        <div className="bg-surface border border-border-color rounded-2xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-text-primary">
            <Mail size={16} className="text-accent-orange" />
            <h3 className="text-sm font-bold">Kirim Pesan ke Pengembang</h3>
          </div>

          <form onSubmit={handleSendMessage} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-text-secondary mb-1">
                Nama Anda
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nama Anda"
                className="input-field py-2 text-xs rounded-xl"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-text-secondary mb-1">
                Pesan
              </label>
              <textarea
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tulis pesan atau masukan..."
                className="input-field py-2 text-xs rounded-xl resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary text-xs py-2.5 rounded-xl font-semibold flex items-center justify-center gap-1.5"
            >
              <Send size={13} />
              <span>{isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Contact
