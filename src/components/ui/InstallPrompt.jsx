import { useState, useEffect } from 'react'
import { Download, X, Smartphone, Sparkles, Check } from 'lucide-react'

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    ) {
      setIsInstalled(true)
      return
    }

    // Check if user previously dismissed in this session
    const hasDismissed = sessionStorage.getItem('resepinaja_pwa_dismissed')

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      if (!hasDismissed) {
        // Small delay so it appears smoothly after page settles
        setTimeout(() => setShowPrompt(true), 1200)
      }
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowPrompt(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    // For testing/preview if browser hasn't fired beforeinstallprompt yet (or user dismissed)
    const checkStandalone = setTimeout(() => {
      if (!hasDismissed && !isInstalled && !window.matchMedia('(display-mode: standalone)').matches) {
        setShowPrompt(true)
      }
    }, 2500)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      clearTimeout(checkStandalone)
    }
  }, [isInstalled])

  const handleInstallYes = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setShowPrompt(false)
      }
      setDeferredPrompt(null)
    } else {
      // Fallback instruction for iOS / browsers without beforeinstallprompt
      setShowPrompt(false)
      alert(
        'Untuk memasang ResepinAja:\n1. Buka menu browser (ikon titik tiga atau tombol Share di Safari/Chrome)\n2. Pilih "Tambahkan ke Layar Utama" / "Install App".'
      )
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    sessionStorage.setItem('resepinaja_pwa_dismissed', 'true')
  }

  if (!showPrompt || isInstalled) return null

  return (
    <aside
      aria-label="Pemberitahuan Pasang Aplikasi"
      className="fixed bottom-24 md:bottom-6 right-4 md:right-6 z-40 max-w-sm w-[calc(100%-2rem)] sm:w-88 animate-slide-up"
    >
      <div className="relative bg-surface/95 backdrop-blur-xl border border-border-color/90 rounded-3xl p-4 sm:p-5 shadow-2xl ring-1 ring-black/5">
        {/* Tombol Silang (X) di pojok kanan atas */}
        <button
          onClick={handleDismiss}
          aria-label="Tutup notifikasi"
          className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-background hover:bg-cream flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
        >
          <X size={15} />
        </button>

        {/* Content Body */}
        <div className="flex items-start gap-3.5 pr-6">
          {/* Logo App Icon */}
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-green-primary to-green-secondary text-white flex items-center justify-center font-black text-xl shadow-md flex-shrink-0">
            R
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h4 className="font-extrabold text-sm text-text-primary leading-tight">
                Pasang ResepinAja?
              </h4>
              <span className="badge badge-green text-[9px] font-black uppercase py-0.2 px-1.5">
                PWA
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-1 leading-relaxed">
              Bisa diakses langsung dari layar utama & resep tetap bisa dibuka saat offline tanpa kuota.
            </p>
          </div>
        </div>

        {/* Action Buttons: Pilihan "Ya" dan "Tidak" */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border-color">
          {/* Pilihan Tidak */}
          <button
            onClick={handleDismiss}
            className="flex-1 py-2 px-3 rounded-xl border border-border-color hover:bg-background text-xs font-bold text-text-secondary hover:text-text-primary transition-all text-center"
          >
            Tidak, Nanti
          </button>

          {/* Pilihan Ya */}
          <button
            onClick={handleInstallYes}
            className="flex-1 py-2 px-3.5 rounded-xl bg-green-primary hover:bg-green-dark text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Download size={13} />
            <span>Ya, Pasang</span>
          </button>
        </div>
      </div>
    </aside>
  )
}

export default InstallPrompt
