const EmptyState = ({ icon: Icon, title, description, action, className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}>
      {Icon && (
        <div className="w-20 h-20 rounded-3xl bg-cream flex items-center justify-center mb-4">
          <Icon size={36} className="text-green-secondary opacity-60" />
        </div>
      )}
      <h3 className="text-lg font-bold text-text-primary mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-text-secondary leading-relaxed max-w-xs">{description}</p>
      )}
      {action && (
        <div className="mt-6">{action}</div>
      )}
    </div>
  )
}

export default EmptyState
