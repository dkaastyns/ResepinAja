import { useState, useEffect } from 'react'
import { User, GraduationCap, Users, X, Sparkles, Clock, Check, Copy } from 'lucide-react'

const DeveloperContactPopup = ({ isOpen, onClose }) => {
  const [secondsLeft, setSecondsLeft] = useState(5)
  const [copied, setCopied] = useState(false)

  const developer = {
    name: 'Ahmad Dika Styansah',
    nim: '21120124130052',
    kelompok: 'Kelompok 23',
    email: 'dikatzy@gmail.com',
  }

  // 5-second automatic countdown
  useEffect(() => {
    if (!isOpen) return

    setSecondsLeft(5)

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          onClose()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleCopy = () => {
    const text = `Nama: ${developer.name}\nNIM: ${developer.nim}\nKelompok: ${developer.kelompok}`
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/45 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-surface border border-border-color rounded-3xl shadow-2xl p-6 sm:p-7 overflow-hidden animate-scale-in">
        {/* Top subtle decorative strip with auto-close progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-cream overflow-hidden">
          <div
            className="h-full bg-green-primary transition-all duration-1000 ease-linear"
            style={{ width: `${(secondsLeft / 5) * 100}%` }}
          />
        </div>

        {/* Header with Title and Close Button */}
        <div className="flex items-center justify-between pb-4 border-b border-border-color">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-green-primary/10 text-green-primary flex items-center justify-center font-bold">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-text-primary tracking-tight">
                Informasi Pengembang
              </h3>
              <p className="text-[11px] text-text-secondary">
                Praktikum Pemrograman Perangkat Bergerak
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup pop up"
            className="w-8 h-8 rounded-full bg-background border border-border-color flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-cream transition-colors active:scale-95"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body: Identity Cards */}
        <div className="py-5 space-y-3">
          {/* Nama */}
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-background border border-border-color/80">
            <div className="w-10 h-10 rounded-xl bg-green-primary/10 text-green-primary flex items-center justify-center flex-shrink-0">
              <User size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                Nama Lengkap
              </p>
              <p className="font-bold text-text-primary text-sm sm:text-base truncate">
                {developer.name}
              </p>
            </div>
          </div>

          {/* NIM & Kelompok Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* NIM */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-background border border-border-color/80">
              <div className="w-10 h-10 rounded-xl bg-accent-orange/10 text-accent-orange flex items-center justify-center flex-shrink-0">
                <GraduationCap size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                  NIM
                </p>
                <p className="font-bold text-text-primary text-sm tracking-tight">
                  {developer.nim}
                </p>
              </div>
            </div>

            {/* Kelompok */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-background border border-border-color/80">
              <div className="w-10 h-10 rounded-xl bg-green-primary/10 text-green-primary flex items-center justify-center flex-shrink-0">
                <Users size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                  Kelompok
                </p>
                <p className="font-bold text-text-primary text-sm tracking-tight">
                  {developer.kelompok}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions: Timer hint & Close button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border-color">
          {/* 5-second countdown note */}
          <div className="flex items-center gap-1.5 text-xs text-text-secondary font-medium">
            <Clock size={13} className="text-accent-orange animate-pulse" />
            <span>
              Menutup otomatis dalam{' '}
              <span className="font-bold text-text-primary">{secondsLeft} detik</span>
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-border-color bg-surface hover:bg-cream text-text-secondary transition-all active:scale-95"
            >
              {copied ? <Check size={13} className="text-green-primary" /> : <Copy size={13} />}
              <span>{copied ? 'Tersalin' : 'Salin'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="btn-primary text-xs py-2 px-4 w-full sm:w-auto"
            >
              Tutup Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeveloperContactPopup
