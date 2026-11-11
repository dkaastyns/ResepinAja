const RecipeCardSkeleton = () => {
  return (
    <div className="card flex flex-col h-full bg-surface border border-border-color rounded-2xl overflow-hidden shadow-xs animate-fade-in">
      {/* Image Skeleton */}
      <div className="relative h-44 sm:h-48 w-full skeleton rounded-none">
        {/* Category Pill placeholder */}
        <div className="absolute top-3 left-3 w-16 h-5 rounded-lg skeleton bg-white/70" />
      </div>

      {/* Card Content Skeleton */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-3">
        <div className="space-y-2">
          {/* Title Lines */}
          <div className="h-4 w-4/5 rounded-md skeleton" />
          <div className="h-4 w-3/5 rounded-md skeleton" />

          {/* Description Line */}
          <div className="h-3 w-full rounded-md skeleton mt-2" />
        </div>

        {/* Footer Meta */}
        <div className="flex items-center justify-between pt-3 border-t border-border-color/70">
          <div className="h-3 w-16 rounded-md skeleton" />
          <div className="h-4 w-14 rounded-lg skeleton" />
        </div>
      </div>
    </div>
  )
}

export default RecipeCardSkeleton
