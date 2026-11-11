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
          {/* Main Logo Container */}
          <div className="relative w-20 h-20 rounded-3xl bg-[#233820] flex items-center justify-center shadow-md border border-[#365231] group">
            <span className="text-white text-4xl font-black tracking-tight select-none">
              R
            </span>
            <div className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full bg-accent-orange text-white flex items-center justify-center shadow-sm">
              <ChefHat size={14} />
            </div>
          </div>
        </div>

        {/* Brand Name */}
        <div className="flex items-center justify-center gap-1">
          <span className="text-2xl font-black text-text-primary tracking-tight">Resepin</span>
          <span className="text-2xl font-black text-accent-orange tracking-tight">Aja</span>
        </div>

        {/* Tagline */}
        <p className="text-xs font-medium text-text-secondary mt-1">
          Resep masakan rumahan praktis
        </p>

        {/* Minimalist Progress Bar */}
        <div className="w-40 mt-7 space-y-2">
          <div className="h-1 w-full bg-cream rounded-full overflow-hidden">
            <div
              className="h-full bg-green-primary rounded-full transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Footer Note */}
      <div className="absolute bottom-6 text-center">
        <p className="text-[11px] font-medium text-text-muted">
          v1.0.0 · Progressive Web App
        </p>
      </div>
    </div>
  )
}

export default StartupSplash
