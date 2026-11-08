import { ChefHat } from 'lucide-react'

const PageLoader = () => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center py-16 animate-fade-in">
      <div className="relative">
        {/* Glowing pulse rings */}
        <div className="w-16 h-16 rounded-3xl bg-green-primary/10 flex items-center justify-center animate-pulse">
          <ChefHat size={32} className="text-green-primary animate-bounce" />
        </div>
        <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-green-primary/20 to-accent-orange/20 blur-sm -z-10 animate-pulse-subtle" />
      </div>
      <div className="flex items-center gap-1.5 mt-4">
        <span className="w-2 h-2 rounded-full bg-green-primary animate-ping" />
        <p className="text-xs font-semibold text-text-secondary tracking-wide uppercase">Memuat Kelezatan...</p>
      </div>
    </div>
  )
}

export default PageLoader
