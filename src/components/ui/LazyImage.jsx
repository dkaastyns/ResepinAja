import { useState } from 'react'
import { Utensils } from 'lucide-react'

const LazyImage = ({
  src,
  alt = 'Resep Makanan',
  className = '',
  containerClassName = '',
  aspectRatio = 'aspect-video',
  fallbackIcon: FallbackIcon = Utensils,
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(!src)

  return (
    <div className={`relative overflow-hidden bg-cream ${containerClassName}`}>
      {/* Skeleton Shimmer while loading */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 skeleton rounded-none z-10 pointer-events-none" />
      )}

      {/* Fallback when image fails to load or no src */}
      {hasError ? (
        <div className="w-full h-full min-h-[140px] flex flex-col items-center justify-center bg-gradient-to-br from-cream to-cream-light text-text-secondary/50 p-4">
          <div className="w-12 h-12 rounded-2xl bg-surface/80 flex items-center justify-center shadow-sm mb-1.5">
            <FallbackIcon size={24} className="text-green-secondary/70" />
          </div>
          <span className="text-[11px] font-medium text-text-secondary/70 line-clamp-1">{alt}</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover transition-all duration-700 ease-out ${
            isLoaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-105 blur-sm'
          } ${className}`}
        />
      )}
    </div>
  )
}

export default LazyImage
