import { useState } from 'react'
import { Plus, Trash2, CheckSquare, Square, ShoppingBag, X, CheckCircle2 } from 'lucide-react'
import EmptyState from '../components/ui/EmptyState'
import { useShoppingList } from '../hooks/useShoppingList'
import { useToast } from '../context/ToastContext'

const ShoppingList = () => {
  const {
    items,
    addItem,
    toggleItem,
    removeItem,
    removeChecked,
    clearAll,
    checkedCount,
    totalCount,
  } = useShoppingList()
  const { showToast } = useToast()

  const [inputName, setInputName] = useState('')
  const [inputQty, setInputQty] = useState('')
  const [inputUnit, setInputUnit] = useState('')

  const handleAdd = (e) => {
    e.preventDefault()
    if (!inputName.trim()) return
    addItem(inputName.trim(), inputQty.trim(), inputUnit.trim())
    showToast({
      message: `"${inputName.trim()}" ditambahkan ke daftar! 🛒`,
      type: 'cart',
    })
    setInputName('')
    setInputQty('')
    setInputUnit('')
  }

  const handleToggle = (item) => {
    toggleItem(item.id)
    if (!item.isChecked) {
      showToast({
        message: `Bahan "${item.name}" sudah dibeli! ✓`,
        type: 'success',
      })
    }
  }

  const uncheckedItems = items.filter(i => !i.isChecked)
  const checkedItems = items.filter(i => i.isChecked)
  const progress = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="page-header">Daftar Belanja Bahan</h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            {checkedCount} dari {totalCount} bahan sudah berhasil dibeli
          </p>
        </div>

        {totalCount > 0 && (
          <div className="flex items-center gap-2">
            {checkedCount > 0 && (
              <button
                onClick={() => {
                  removeChecked()
                  showToast({ message: 'Bahan yang sudah selesai dibersihkan', type: 'info' })
                }}
                className="btn-outline text-xs py-1.5 px-3"
              >
                Hapus Selesai
              </button>
            )}
            <button
              onClick={() => {
                clearAll()
                showToast({ message: 'Daftar belanja dikosongkan', type: 'error' })
              }}
              className="text-xs text-red-500 hover:text-red-600 font-bold px-3 py-1.5"
            >
              Hapus Semua
            </button>
          </div>
        )}
      </div>

      {/* Main Grid: Responsive 2 Columns on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Input Form & Progress */}
        <div className="lg:col-span-5 space-y-4">
          {/* Progress Card */}
          {totalCount > 0 && (
            <div className="bg-surface rounded-2xl sm:rounded-3xl border border-border-color p-5 shadow-card space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-text-secondary">
                <span>Kelengkapan Belanja</span>
                <span className="text-green-primary text-sm font-extrabold">{Math.round(progress)}%</span>
              </div>
              <div className="h-2.5 bg-cream rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-secondary to-green-primary rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {progress === 100 && (
                <div className="p-3 bg-green-primary/10 border border-green-primary/20 rounded-xl text-center text-xs font-bold text-green-primary animate-scale-in">
                  🎉 Semua bahan sudah terbeli! Siap masak hidangan istimewa.
                </div>
              )}
            </div>
          )}

          {/* Quick Add Form */}
          <form onSubmit={handleAdd} className="bg-surface rounded-2xl sm:rounded-3xl border border-border-color p-5 shadow-card space-y-3">
            <h3 className="font-extrabold text-sm sm:text-base text-text-primary">
              Tambah Catatan Bahan
            </h3>
            <input
              type="text"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              placeholder="Nama bahan (cth: Daging Sapi, Santan)... *"
              className="input-field"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={inputQty}
                onChange={(e) => setInputQty(e.target.value)}
                placeholder="Jumlah (cth: 500)"
                className="input-field"
              />
              <input
                type="text"
                value={inputUnit}
                onChange={(e) => setInputUnit(e.target.value)}
                placeholder="Satuan (cth: gr, ikat)"
                className="input-field"
              />
            </div>
            <button
              type="submit"
              className="btn-primary w-full text-xs sm:text-sm py-3 font-bold"
            >
              <Plus size={16} />
              <span>Tambahkan ke Daftar</span>
            </button>
          </form>
        </div>

        {/* Right Column: Shopping Checklist Items */}
        <div className="lg:col-span-7 space-y-4">
          {totalCount > 0 ? (
            <div className="space-y-4">
              {/* Unchecked */}
              {uncheckedItems.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold text-text-secondary uppercase tracking-wider px-1">
                    Belum Dibeli ({uncheckedItems.length})
                  </h4>
                  <div className="bg-surface rounded-2xl border border-border-color divide-y divide-border-color shadow-card overflow-hidden">
                    {uncheckedItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3.5 hover:bg-background/80 transition-colors"
                      >
                        <button
                          onClick={() => handleToggle(item)}
                          className="text-text-secondary hover:text-green-primary transition-colors flex-shrink-0"
                        >
                          <Square size={20} />
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-text-primary truncate">
                            {item.name}
                          </p>
                          {(item.quantity || item.unit) && (
                            <p className="text-xs text-text-secondary mt-0.5">
                              {item.quantity} {item.unit}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="w-8 h-8 rounded-xl hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors text-text-secondary"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Checked */}
              {checkedItems.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-extrabold text-green-primary uppercase tracking-wider px-1">
                    Sudah Dibeli ({checkedItems.length})
                  </h4>
                  <div className="bg-green-primary/5 rounded-2xl border border-green-primary/20 divide-y divide-green-primary/10 shadow-sm overflow-hidden">
                    {checkedItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3.5 opacity-80 hover:opacity-100 transition-opacity"
                      >
                        <button
                          onClick={() => handleToggle(item)}
                          className="text-green-primary transition-colors flex-shrink-0"
                        >
                          <CheckSquare size={20} />
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-text-secondary line-through truncate">
                            {item.name}
                          </p>
                          {(item.quantity || item.unit) && (
                            <p className="text-xs text-text-secondary/70">
                              {item.quantity} {item.unit}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="w-8 h-8 rounded-xl hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors text-text-secondary"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <EmptyState
              icon={ShoppingBag}
              title="Daftar belanja masih kosong"
              description="Kamu bisa mencatat bahan secara manual atau langsung menekan tombol 'Ke Daftar Belanja' dari halaman resep."
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default ShoppingList
