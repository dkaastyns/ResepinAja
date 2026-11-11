import RecipeGridSkeleton from './RecipeGridSkeleton'

const PageLoader = () => {
  return (
    <div className="space-y-6 animate-fade-in py-2 max-w-7xl mx-auto">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-48 rounded-xl skeleton" />
        <div className="h-4 w-72 rounded-lg skeleton" />
      </div>

      {/* Filter / Search placeholder */}
      <div className="h-16 w-full rounded-2xl skeleton" />

      {/* Grid of Skeleton Cards */}
      <RecipeGridSkeleton count={8} />
    </div>
  )
}

export default PageLoader
