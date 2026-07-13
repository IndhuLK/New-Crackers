"use client";

import { useProducts, Category } from '@/context/ProductContext';
import { Plus, Edit2, Trash2, List as ListIcon, Grid as GridIcon, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Loader2, X, CloudUpload } from 'lucide-react';
import { useState, useMemo } from 'react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function AdminCategoryPage() {
  const { products, categories, loading, updateCategoryOrder, deleteCategory, addCategory, updateCategory } = useProducts();
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", slug: "", img: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categoriesWithCounts = useMemo(() => {
    return categories.map(cat => {
      const categoryProducts = products.filter(p => p.category === cat.name);
      const count = categoryProducts.length;
      const displayImage = cat.img || cat.image || categoryProducts.find(p => p.image)?.image || "";
      return { ...cat, count, displayImage };
    });
  }, [categories, products]);

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === categories.length - 1) return;

    const newCats = [...categories];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap
    const temp = newCats[index];
    newCats[index] = newCats[targetIndex];
    newCats[targetIndex] = temp;

    await updateCategoryOrder(newCats);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the category "${name}"? Products in this category will not be deleted but may become orphaned.`)) {
      await deleteCategory(id);
    }
  };

  const openAddModal = () => {
    setEditingCatId(null);
    setFormData({ name: "", slug: "", img: "" });
    setImageFile(null);
    setImagePreview("");
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCatId(cat.id);
    setFormData({ name: cat.name, slug: cat.slug, img: cat.img || cat.image || "" });
    setImageFile(null);
    setImagePreview(cat.img || cat.image || "");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    setIsSubmitting(true);
    // auto-generate slug if missing
    const slug = formData.slug || `/${formData.name.toLowerCase().replace(/\s+/g, '-')}`;

    let finalImageUrl = formData.img;
    
    if (imageFile) {
      try {
        const fileRef = ref(storage, `categories/${Date.now()}_${imageFile.name.replace(/[^a-zA-Z0-9.]/g, '')}`);
        await uploadBytes(fileRef, imageFile);
        finalImageUrl = await getDownloadURL(fileRef);
      } catch (err) {
        console.error("Failed to upload image", err);
      }
    }

    if (editingCatId) {
      await updateCategory(editingCatId, { ...formData, slug, img: finalImageUrl, image: finalImageUrl });
    } else {
      await addCategory({
        name: formData.name,
        slug: slug,
        img: finalImageUrl,
        image: finalImageUrl,
        sortOrder: categories.length // place at end
      });
    }
    
    setIsSubmitting(false);
    setIsModalOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0f172a] tracking-tight">Category Management</h1>
          <p className="text-gray-500 text-[13px] mt-1">Create and manage categories used across user pages.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center border border-gray-200 rounded overflow-hidden bg-white shadow-sm h-[36px]">
            <button 
              onClick={() => setViewMode("list")}
              className={`px-3 h-full flex items-center justify-center transition-colors border-r border-gray-200 ${viewMode === 'list' ? 'bg-gray-50 text-gray-700' : 'bg-white text-gray-400 hover:text-gray-600'}`}
            >
              <ListIcon size={16} />
            </button>
            <button 
              onClick={() => setViewMode("grid")}
              className={`px-3 h-full flex items-center justify-center transition-colors ${viewMode === 'grid' ? 'bg-gray-50 text-gray-700' : 'bg-white text-gray-400 hover:text-gray-600'}`}
            >
              <GridIcon size={16} />
            </button>
          </div>

          <button onClick={openAddModal} className="px-4 py-2 bg-[#0066cc] text-white rounded font-medium text-[13px] hover:bg-[#0052a3] transition-colors flex items-center gap-2 shadow-sm h-[36px]">
            <Plus size={16} /> Add Category
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 bg-white">
          <h2 className="font-bold text-gray-900 text-[14px]">Categories ({categories.length})</h2>
        </div>
        
        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="animate-spin text-[#0066cc]" size={32} />
          </div>
        ) : viewMode === "list" ? (
          <div className="flex flex-col">
            {categoriesWithCounts.map((cat, index) => (
              <div 
                key={cat.id} 
                className={`flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors group ${
                  index !== categories.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Up/Down Arrows */}
                  <div className="flex flex-col gap-1 text-gray-300 px-2">
                    <button 
                      onClick={() => handleMove(index, 'up')}
                      disabled={index === 0}
                      className="hover:text-[#0066cc] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button 
                      onClick={() => handleMove(index, 'down')}
                      disabled={index === categories.length - 1}
                      className="hover:text-[#0066cc] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>
                  
                  {/* Image */}
                  <div className="w-12 h-12 rounded border border-gray-200 bg-white overflow-hidden shrink-0 flex items-center justify-center text-gray-300">
                    {cat.displayImage ? (
                      <img src={cat.displayImage} alt={cat.name} className="w-full h-full object-cover" />
                    ) : (
                      <GridIcon size={20} />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900 text-[14px] leading-tight mb-0.5">{cat.name}</span>
                    <span className="text-gray-400 text-[12px] leading-tight mb-0.5">{cat.slug}</span>
                    <span className="text-gray-500 text-[12px] leading-tight">{cat.count} products</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 px-4">
                  <button onClick={() => openEditModal(cat)} className="text-gray-400 hover:text-[#0066cc] transition-colors p-1" title="Edit">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(cat.id, cat.name)} className="text-gray-400 hover:text-red-600 transition-colors p-1" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            
            {categories.length === 0 && (
              <div className="p-12 text-center text-gray-500 text-[14px]">
                No categories found. Click &quot;Add Category&quot; to create one.
              </div>
            )}
          </div>
        ) : (
          /* Grid View */
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-gray-50/30">
            {categoriesWithCounts.map((cat, index) => (
              <div key={cat.id} className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex flex-col items-center text-center group hover:border-[#0066cc] transition-colors relative">
                
                {/* Horizontal Arrows for Grid View */}
                <div className="absolute top-2 left-2 right-2 flex justify-between opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleMove(index, 'up')} // 'up' means earlier in list (left)
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-[#0066cc] bg-white rounded shadow-sm disabled:opacity-30"
                  >
                    <ArrowLeft size={14} />
                  </button>
                  <button 
                    onClick={() => handleMove(index, 'down')} // 'down' means later in list (right)
                    disabled={index === categories.length - 1}
                    className="p-1 text-gray-400 hover:text-[#0066cc] bg-white rounded shadow-sm disabled:opacity-30"
                  >
                    <ArrowRight size={14} />
                  </button>
                </div>

                <div className="w-16 h-16 rounded-full border border-gray-100 bg-gray-50 overflow-hidden mb-3 mt-4 flex items-center justify-center text-gray-300">
                  {cat.displayImage ? (
                    <img src={cat.displayImage} alt={cat.name} className="w-full h-full object-cover" />
                  ) : (
                    <GridIcon size={24} />
                  )}
                </div>
                <h3 className="font-bold text-gray-900 text-[14px] mb-1">{cat.name}</h3>
                <p className="text-gray-400 text-[11px] mb-2">{cat.slug}</p>
                <span className="text-[11px] font-medium px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                  {cat.count} products
                </span>

                <div className="mt-4 pt-3 border-t border-gray-50 w-full flex justify-center gap-4 opacity-100 transition-opacity">
                  <button onClick={() => openEditModal(cat)} className="text-gray-400 hover:text-[#0066cc] transition-colors p-1" title="Edit">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(cat.id, cat.name)} className="text-gray-400 hover:text-red-600 transition-colors p-1" title="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            {categories.length === 0 && (
              <div className="col-span-full p-12 text-center text-gray-500 text-[14px]">
                No categories found. Click &quot;Add Category&quot; to create one.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-900">
                {editingCatId ? "Edit Category" : "Add New Category"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Category Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder="e.g. Flower Pots"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-[13px] outline-none focus:border-[#0066cc] focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Slug URL</label>
                <input 
                  type="text" 
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  placeholder="e.g. /flower-pots (Auto-generated if empty)"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-[13px] outline-none focus:border-[#0066cc] focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Category Image</label>
                <label className="border border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 hover:border-[#0066cc] transition-colors cursor-pointer text-center group mb-4">
                  <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-[#0066cc] mb-3 shadow-sm">
                    <CloudUpload size={16} />
                  </div>
                  <p className="text-[13px] font-bold text-gray-700 mb-1 group-hover:text-[#0066cc] transition-colors">Click to upload image</p>
                  <p className="text-[11px] text-gray-400">PNG, JPG, JPEG</p>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange} 
                    className="hidden" 
                  />
                </label>
                
                {imagePreview && (
                  <div className="relative w-24 h-24 rounded border border-gray-200 overflow-hidden bg-white shadow-sm mt-2">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview("");
                        setFormData({...formData, img: ""});
                      }}
                      className="absolute top-1 right-1 w-5 h-5 bg-white/90 hover:bg-red-50 hover:text-red-600 text-gray-600 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded font-medium text-[13px] hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#0066cc] text-white rounded font-medium text-[13px] hover:bg-[#0052a3] transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                  {editingCatId ? "Save Changes" : "Add Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
