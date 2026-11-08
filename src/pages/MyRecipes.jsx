import { useState } from 'react'
import { Plus, Edit2, Trash2, ChefHat } from 'lucide-react'
import RecipeCard from '../components/ui/RecipeCard'
import Modal from '../components/ui/Modal'
import EmptyState from '../components/ui/EmptyState'
import RecipeForm from '../components/forms/RecipeForm'
import { useRecipes } from '../hooks/useRecipes'
import { useFavorites } from '../hooks/useFavorites'
import { useToast } from '../context/ToastContext'

const MyRecipes = () => {
  const { userRecipes, addRecipe, updateRecipe, deleteRecipe } = useRecipes()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { showToast } = useToast()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingRecipe, setEditingRecipe] = useState(null)
  const [deletingRecipe, setDeletingRecipe] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleAdd = (data) => {
    setIsLoading(true)
    setTimeout(() => {
      addRecipe(data)
      setIsAddModalOpen(false)
      setIsLoading(false)
      showToast({
        message: `Resep "${data.title}" berhasil dibuat! 🍳`,
        type: 'success',
      })
    }, 300)
  }

  const handleEdit = (data) => {
    setIsLoading(true)
    setTimeout(() => {
      updateRecipe(editingRecipe.id, data)
      setEditingRecipe(null)
      setIsLoading(false)
      showToast({
        message: `Perubahan "${data.title}" berhasil disimpan! ✨`,
        type: 'success',
      })
    }, 300)
  }

  const handleDelete = () => {
    const title = deletingRecipe.title
    deleteRecipe(deletingRecipe.id)
    setDeletingRecipe(null)
    showToast({
      message: `Resep "${title}" berhasil dihapus`,
      type: 'error',
    })
  }

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="page-header">Koleksi Resep Saya</h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            {userRecipes.length} resep kreasi pribadimu
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary text-xs sm:text-sm py-2.5 px-4 shadow-sm"
        >
          <Plus size={16} />
          <span>Tambah Resep Baru</span>
        </button>
      </div>

      {/* Grid */}
      {userRecipes.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {userRecipes.map(recipe => (
            <div key={recipe.id} className="relative group">
              <RecipeCard
                recipe={recipe}
                isFavorite={isFavorite(recipe.id)}
                onToggleFavorite={toggleFavorite}
              />
              {/* Overlay edit & delete buttons */}
              <div className="absolute top-2.5 right-12 z-20 flex gap-1 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setEditingRecipe(recipe)
                  }}
                  aria-label="Edit resep"
                  className="w-8 h-8 bg-surface/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-md hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setDeletingRecipe(recipe)
                  }}
                  aria-label="Hapus resep"
                  className="w-8 h-8 bg-surface/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-md hover:bg-red-50 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={ChefHat}
          title="Belum ada resep pribadi"
          description="Yuk tulis dan abadikan resep rahasia masakanmu agar tersimpan rapi dan mudah diakses!"
          action={
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn-primary text-xs inline-flex items-center gap-1.5"
            >
              <Plus size={15} />
              Tulis Resep Pertama
            </button>
          }
        />
      )}

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Tulis Resep Baru"
        size="lg"
      >
        <RecipeForm
          onSubmit={handleAdd}
          onCancel={() => setIsAddModalOpen(false)}
          isLoading={isLoading}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingRecipe}
        onClose={() => setEditingRecipe(null)}
        title="Perbarui Resep"
        size="lg"
      >
        <RecipeForm
          initialData={editingRecipe}
          onSubmit={handleEdit}
          onCancel={() => setEditingRecipe(null)}
          isLoading={isLoading}
        />
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={!!deletingRecipe}
        onClose={() => setDeletingRecipe(null)}
        title="Hapus Resep"
        size="sm"
      >
        <div className="text-center py-2 space-y-3">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto text-red-500">
            <Trash2 size={24} />
          </div>
          <div>
            <h4 className="font-extrabold text-text-primary text-base">
              Hapus "{deletingRecipe?.title}"?
            </h4>
            <p className="text-xs text-text-secondary mt-1">
              Resep ini akan dihapus secara permanen dari perangkat Anda.
            </p>
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={() => setDeletingRecipe(null)} className="btn-outline text-xs flex-1">
              Batal
            </button>
            <button onClick={handleDelete} className="btn-danger text-xs flex-1">
              Hapus
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default MyRecipes
