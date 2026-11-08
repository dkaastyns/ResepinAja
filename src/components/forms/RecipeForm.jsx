import { useState } from 'react'
import { Plus, Trash2, Image, ChefHat } from 'lucide-react'
import { CATEGORIES } from '../../data/sampleRecipes'

const emptyIngredient = () => ({ name: '', quantity: '', unit: '' })
const emptyInstruction = () => ''

const RecipeForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    image: '',
    category: 'Makanan Utama',
    preparationTime: '',
    cookingTime: '',
    servings: '',
    difficulty: 'mudah',
    ingredients: [emptyIngredient()],
    instructions: [''],
    ...initialData,
  })

  const [imagePreview, setImagePreview] = useState(initialData?.image || '')

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleImageChange = (url) => {
    setForm(prev => ({ ...prev, image: url }))
    setImagePreview(url)
  }

  // Ingredients
  const updateIngredient = (index, field, value) => {
    const updated = [...form.ingredients]
    updated[index] = { ...updated[index], [field]: value }
    handleChange('ingredients', updated)
  }

  const addIngredient = () => {
    handleChange('ingredients', [...form.ingredients, emptyIngredient()])
  }

  const removeIngredient = (index) => {
    if (form.ingredients.length === 1) return
    handleChange('ingredients', form.ingredients.filter((_, i) => i !== index))
  }

  // Instructions
  const updateInstruction = (index, value) => {
    const updated = [...form.instructions]
    updated[index] = value
    handleChange('instructions', updated)
  }

  const addInstruction = () => {
    handleChange('instructions', [...form.instructions, ''])
  }

  const removeInstruction = (index) => {
    if (form.instructions.length === 1) return
    handleChange('instructions', form.instructions.filter((_, i) => i !== index))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const processed = {
      ...form,
      preparationTime: parseInt(form.preparationTime) || 0,
      cookingTime: parseInt(form.cookingTime) || 0,
      servings: parseInt(form.servings) || 1,
      ingredients: form.ingredients.filter(i => i.name.trim()),
      instructions: form.instructions.filter(i => i.trim()),
    }
    onSubmit(processed)
  }

  const inputClass = "w-full bg-background border border-border-color rounded-xl px-4 py-3 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-transparent"
  const labelClass = "block text-sm font-semibold text-text-primary mb-1.5"

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Image */}
      <div>
        <label className={labelClass}>Foto Masakan</label>
        <div className="relative overflow-hidden rounded-2xl bg-cream border border-border-color h-48 mb-3">
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-text-secondary">
              <Image size={32} className="opacity-40" />
              <span className="text-xs">Masukkan URL gambar</span>
            </div>
          )}
        </div>
        <input
          type="url"
          placeholder="URL foto makanan (opsional)"
          value={form.image}
          onChange={(e) => handleImageChange(e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Title */}
      <div>
        <label className={labelClass}>Nama Resep *</label>
        <input
          type="text"
          required
          placeholder="Contoh: Nasi Goreng Spesial"
          value={form.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>Deskripsi</label>
        <textarea
          rows={3}
          placeholder="Ceritakan sedikit tentang masakan ini..."
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Category + Difficulty */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Kategori</label>
          <select
            value={form.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className={inputClass}
          >
            {CATEGORIES.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Tingkat Kesulitan</label>
          <select
            value={form.difficulty}
            onChange={(e) => handleChange('difficulty', e.target.value)}
            className={inputClass}
          >
            <option value="mudah">Mudah</option>
            <option value="sedang">Sedang</option>
            <option value="sulit">Sulit</option>
          </select>
        </div>
      </div>

      {/* Times + Servings */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Persiapan (menit)</label>
          <input
            type="number"
            min="0"
            placeholder="10"
            value={form.preparationTime}
            onChange={(e) => handleChange('preparationTime', e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Memasak (menit)</label>
          <input
            type="number"
            min="0"
            placeholder="30"
            value={form.cookingTime}
            onChange={(e) => handleChange('cookingTime', e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Porsi</label>
          <input
            type="number"
            min="1"
            placeholder="4"
            value={form.servings}
            onChange={(e) => handleChange('servings', e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* Ingredients */}
      <div>
        <label className={labelClass}>Bahan-bahan *</label>
        <div className="space-y-2">
          {form.ingredients.map((ing, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                placeholder="Nama bahan"
                value={ing.name}
                onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                className={`${inputClass} flex-1`}
              />
              <input
                type="text"
                placeholder="Jml"
                value={ing.quantity}
                onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                className={`${inputClass} w-20`}
              />
              <input
                type="text"
                placeholder="Satuan"
                value={ing.unit}
                onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                className={`${inputClass} w-24`}
              />
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="w-10 h-11 flex-shrink-0 rounded-xl border border-border-color text-text-secondary hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors flex items-center justify-center"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addIngredient}
          className="mt-2 flex items-center gap-2 text-green-primary text-sm font-semibold hover:text-green-secondary transition-colors"
        >
          <Plus size={16} />
          Tambah Bahan
        </button>
      </div>

      {/* Instructions */}
      <div>
        <label className={labelClass}>Langkah Memasak *</label>
        <div className="space-y-2">
          {form.instructions.map((step, index) => (
            <div key={index} className="flex gap-2">
              <div className="w-8 h-11 flex-shrink-0 flex items-center justify-center">
                <span className="w-6 h-6 rounded-full bg-green-primary text-white text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </span>
              </div>
              <textarea
                rows={2}
                placeholder={`Langkah ${index + 1}...`}
                value={step}
                onChange={(e) => updateInstruction(index, e.target.value)}
                className={`${inputClass} flex-1 resize-none`}
              />
              <button
                type="button"
                onClick={() => removeInstruction(index)}
                className="w-10 flex-shrink-0 rounded-xl border border-border-color text-text-secondary hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors flex items-center justify-center self-start h-11"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addInstruction}
          className="mt-2 flex items-center gap-2 text-green-primary text-sm font-semibold hover:text-green-secondary transition-colors"
        >
          <Plus size={16} />
          Tambah Langkah
        </button>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2 pb-safe">
        <button type="button" onClick={onCancel} className="btn-outline flex-1">
          Batal
        </button>
        <button type="submit" disabled={isLoading} className="btn-primary flex-1 flex items-center justify-center gap-2">
          <ChefHat size={16} />
          {isLoading ? 'Menyimpan...' : 'Simpan Resep'}
        </button>
      </div>
    </form>
  )
}

export default RecipeForm
