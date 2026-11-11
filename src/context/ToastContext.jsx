import { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle2, Heart, ShoppingBag, AlertCircle, X, Sparkles } from 'lucide-react'

const ToastContext = createContext(null)

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback(({ message, type = 'success', duration = 3000, icon: CustomIcon }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6)
    setToasts(prev => [...prev, { id, message, type, icon: CustomIcon }])

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duration)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const getIcon = (type, CustomIcon) => {
    if (CustomIcon) return <CustomIcon size={18} />
    switch (type) {
      case 'favorite':
        return <Heart size={18} className="text-red-500 fill-red-500 animate-heart-pop" />
      case 'unfavorite':
        return <Heart size={18} className="text-text-secondary" />
      case 'cart':
        return <ShoppingBag size={18} className="text-green-primary" />
      case 'error':
        return <AlertCircle size={18} className="text-red-500" />
      default:
        return <CheckCircle2 size={18} className="text-green-primary" />
    }
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none w-full max-w-sm px-4">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center gap-3 px-4 py-3 bg-surface/95 backdrop-blur-md border border-border-color/80 shadow-card-hover rounded-2xl animate-slide-down transition-all duration-300"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-background flex items-center justify-center">
              {getIcon(toast.type, toast.icon)}
            </div>
            <p className="text-sm font-semibold text-text-primary flex-1 leading-snug">
              {toast.message}
            </p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-text-secondary hover:text-text-primary p-1 rounded-lg transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    return {
      showToast: () => {},
    }
  }
  return context
}
