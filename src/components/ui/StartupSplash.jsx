import { useState, useEffect } from 'react'
import { ChefHat, Sparkles } from 'lucide-react'

const StartupSplash = ({ onFinish }) => {
  const [stage, setStage] = useState('entering') // entering -> active -> exiting -> done
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Animate progress bar smoothly
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 5
      })
    }, 45)

    // Stage 1: Active display
    const timerActive = setTimeout(() => {
      setStage('exiting')
    }, 1600)

    // Stage 2: Finish and unmount
    const timerDone = setTimeout(() => {
      setStage('done')
      if (onFinish) onFinish()
    }, 2200)

    return () => {
      clearInterval(interval)
      clearTimeout(timerActive)
      clearTimeout(timerDone)
    }
  }, [onFinish])

  if (stage === 'done') return null

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-all duration-700 ease-out ${
        stage === 'exiting' ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-green-primary/10 blur-3xl pointer-events-none animate-pulse-subtle" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-accent-orange/15 blur-3xl pointer-events-none animate-pulse-subtle" />

      {/* Center Branding Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-xs animate-scale-in">
        {/* Animated Icon Badge */}
        <div className="relative mb-6">
          {/* Glowing pulse rings */}
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-green-primary/20 via-accent-orange/20 to-green-secondary/20 blur-xl animate-pulse" />

          {/* Main Logo Container */}
          <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-green-primary via-green-dark to-green-secondary flex items-center justify-center shadow-float border border-white/40 group">
            <span className="text-white text-5xl font-black tracking-tight select-none drop-shadow-md">
              R
            </span>
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent-orange text-white flex items-center justify-center shadow-md animate-bounce">
              <ChefHat size={16} />
            </div>
          </div>
        </div>

        {/* Brand Name */}
        <div className="flex items-center justify-center gap-1">
          <span className="text-3xl font-black text-green-primary tracking-tight">Resepin</span>
          <span className="text-3xl font-black text-accent-orange tracking-tight">Aja</span>
        </div>

        {/* Tagline */}
        <p className="text-xs font-semibold text-text-secondary mt-1.5 tracking-wider uppercase flex items-center gap-1.5">
          <Sparkles size={12} className="text-accent-orange" />
          <span>Find Recipes. Cook with Ease.</span>
        </p>

        {/* Minimalist Progress Bar */}
        <div className="w-48 mt-8 space-y-2">
          <div className="h-1.5 w-full bg-cream rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-primary to-accent-orange rounded-full transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[10px] font-bold text-text-secondary/70 tracking-widest uppercase">
            Menyiapkan Dapur... {progress}%
          </p>
        </div>
      </div>

      {/* Bottom Footer Note */}
      <div className="absolute bottom-8 text-center">
        <p className="text-[11px] font-semibold text-text-secondary/50">
          PWA & Offline Recipe Discovery
        </p>
      </div>
    </div>
  )
}

export default StartupSplash
