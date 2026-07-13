"use client";

import { useState } from 'react';
import { ArrowLeft, Save, Eye, Image as ImageIcon, CloudUpload, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useProducts } from '@/context/ProductContext';
import { useRouter } from 'next/navigation';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function AdminAddProductPage() {
  const { categories, addProduct } = useProducts();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    sku: '',
    mrp: '',
    price: '',
    stock: '',
    unit: '',
    sortOrder: '',
    highlights: '',
    safetyNotes: '',
    additionalInfo: '',
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      if (name === 'name' || name === 'category') {
        const cat = newData.category ? newData.category.substring(0, 3).toUpperCase() : 'CAT';
        const prod = newData.name ? newData.name.replace(/[^a-zA-Z0-9]/g, '').substring(0, 4).toUpperCase() : 'PROD';
        newData.sku = `${cat}-${prod}-${Math.floor(1000 + Math.random() * 9000)}`;
      }
      return newData;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImageFiles(prev => [...prev, ...filesArray]);
      
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => {
      // revoke URL to prevent memory leaks
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.price) {
      alert("Please fill essential fields (Name, Category, Selling Price)");
      return;
    }
    setIsSubmitting(true);
    try {
      let uploadedUrls: string[] = [];
      
      if (imageFiles.length > 0) {
        const uploadPromises = imageFiles.map(async (file) => {
          const fileRef = ref(storage, `products/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`);
          await uploadBytes(fileRef, file);
          return await getDownloadURL(fileRef);
        });
        uploadedUrls = await Promise.all(uploadPromises);
      }

      await addProduct({
        name: formData.name,
        category: formData.category,
        categorySlug: categories.find(c => c.name === formData.category)?.slug || '',
        price: Number(formData.price),
        mrp: formData.mrp ? Number(formData.mrp) : null,
        stock: formData.stock ? Number(formData.stock) : null,
        sortOrder: formData.sortOrder ? Number(formData.sortOrder) : 999,
        image: uploadedUrls.length > 0 ? uploadedUrls[0] : '',
        images: uploadedUrls,
        highlights: formData.highlights,
        safety: formData.safetyNotes,
        description: formData.additionalInfo,
        productCode: formData.sku,
        unit: formData.unit,
      });
      alert("Product added successfully");
      router.push("/admin/products");
    } catch (error) {
      console.error(error);
      alert("Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-6">
        <div className="flex items-start gap-4">
          <Link href="/admin/products" className="w-8 h-8 rounded border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors shrink-0 mt-1">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-[22px] font-bold text-gray-900 tracking-tight leading-none mb-2">New Product</h1>
            <p className="text-gray-400 text-[13px] max-w-2xl leading-relaxed">
              Add clean product information for admin, inventory, and catalog use. Keep the essentials accurate so stock and pricing stay in sync.
            </p>
          </div>
        </div>
        <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="px-5 py-2 bg-[#0066cc] text-white rounded font-medium text-[13px] hover:bg-[#0052a3] transition-colors flex items-center gap-2 shadow-sm shrink-0 disabled:opacity-50">
          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
          {isSubmitting ? "Publishing..." : "Publish"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column - Main Forms */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Essentials */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h2 className="text-[15px] font-bold text-gray-900 leading-none mb-1">Essentials</h2>
            <p className="text-gray-400 text-[13px] mb-6">Core product details & classification.</p>
            
            <div className="space-y-5">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">PRODUCT NAME <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. 1000 Wala Premium" 
                  className="w-full px-4 py-2.5 bg-[#f8fafc] border border-gray-200 rounded-md text-[14px] outline-none focus:border-[#0066cc] focus:bg-white transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">CATEGORY <span className="text-red-500">*</span></label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-[#f8fafc] border border-gray-200 rounded-md text-[14px] outline-none focus:border-[#0066cc] focus:bg-white transition-colors"
                  >
                    <option value="">Select a category...</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">SKU CODE <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    placeholder="Auto-generated" 
                    className="w-full px-4 py-2.5 bg-[#f8fafc] border border-gray-200 rounded-md text-[14px] text-gray-500 outline-none focus:border-[#0066cc] focus:bg-white transition-colors"
                  />
                  <p className="text-[11px] text-gray-400 mt-1.5">Auto-generated using Category + Product Name + Category Series</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">MRP (₹)</label>
                  <input 
                    type="number" 
                    name="mrp"
                    value={formData.mrp}
                    onChange={handleChange}
                    placeholder="0.00" 
                    className="w-full px-4 py-2.5 bg-[#f8fafc] border border-gray-200 rounded-md text-[14px] outline-none focus:border-[#0066cc] focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">SELLING PRICE (₹) <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00" 
                    className="w-full px-4 py-2.5 bg-[#f8fafc] border border-gray-200 rounded-md text-[14px] outline-none focus:border-[#0066cc] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">STOCK QUANTITY</label>
                  <input 
                    type="number" 
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="0" 
                    className="w-full px-4 py-2.5 bg-[#f8fafc] border border-gray-200 rounded-md text-[14px] outline-none focus:border-[#0066cc] focus:bg-white transition-colors"
                  />
                  <p className="text-[11px] text-gray-400 mt-1.5">Initial stock quantity for this product</p>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">PACK / UNIT</label>
                  <input 
                    type="text" 
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    placeholder="Box, Packet, Dozen" 
                    className="w-full px-4 py-2.5 bg-[#f8fafc] border border-gray-200 rounded-md text-[14px] outline-none focus:border-[#0066cc] focus:bg-white transition-colors"
                  />
                  <p className="text-[11px] text-gray-400 mt-1.5">Helpful for product presentation and billing</p>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">SORT ORDER</label>
                <input 
                  type="number" 
                  name="sortOrder"
                  value={formData.sortOrder}
                  onChange={handleChange}
                  placeholder="0" 
                  className="w-full px-4 py-2.5 bg-[#f8fafc] border border-gray-200 rounded-md text-[14px] outline-none focus:border-[#0066cc] focus:bg-white transition-colors"
                />
                <p className="text-[11px] text-gray-400 mt-1.5">Lower numbers appear earlier in lists</p>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h2 className="text-[15px] font-bold text-gray-900 leading-none mb-1">Product Details</h2>
            <p className="text-gray-400 text-[13px] mb-6">Short highlights and operational notes for the team.</p>
            
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">HIGHLIGHTS</label>
                  <textarea 
                    name="highlights"
                    value={formData.highlights}
                    onChange={handleChange}
                    rows={3} 
                    placeholder="Key selling points, bundle details, or features" 
                    className="w-full px-4 py-2.5 bg-[#f8fafc] border border-gray-200 rounded-md text-[14px] outline-none focus:border-[#0066cc] focus:bg-white transition-colors resize-none"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">SAFETY NOTES</label>
                  <textarea 
                    name="safetyNotes"
                    value={formData.safetyNotes}
                    onChange={handleChange}
                    rows={3} 
                    placeholder="Storage, handling, and usage safety notes" 
                    className="w-full px-4 py-2.5 bg-[#f8fafc] border border-gray-200 rounded-md text-[14px] outline-none focus:border-[#0066cc] focus:bg-white transition-colors resize-none"
                  ></textarea>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">ADDITIONAL INFO</label>
                <textarea 
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  rows={2} 
                  placeholder="Any extra notes for staff or customers" 
                  className="w-full px-4 py-2.5 bg-[#f8fafc] border border-gray-200 rounded-md text-[14px] outline-none focus:border-[#0066cc] focus:bg-white transition-colors resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Gallery */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h2 className="text-[15px] font-bold text-gray-900 leading-none mb-1">Gallery</h2>
            <p className="text-gray-400 text-[13px] mb-6">Upload product images. First image will be the cover.</p>
            
            <label className="border border-dashed border-gray-300 rounded-lg p-10 flex flex-col items-center justify-center bg-[#f8fafc] hover:bg-gray-50 hover:border-[#0066cc] transition-colors cursor-pointer text-center group mb-4">
              <div className="w-10 h-10 bg-[#eff4ff] rounded flex items-center justify-center text-[#0066cc] mb-4">
                <CloudUpload size={20} />
              </div>
              <p className="text-[14px] font-bold text-gray-700 mb-1 group-hover:text-[#0066cc] transition-colors">Click to upload images</p>
              <p className="text-[12px] text-gray-400">PNG, JPG, JPEG | You can select multiple files</p>
              <input 
                type="file" 
                multiple 
                accept="image/*"
                onChange={handleFileChange} 
                className="hidden" 
              />
            </label>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative aspect-square rounded border border-gray-200 overflow-hidden bg-gray-50 group">
                    <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                    {index === 0 && (
                      <div className="absolute top-0 left-0 right-0 bg-black/60 text-white text-[9px] font-bold text-center py-0.5">
                        COVER
                      </div>
                    )}
                    <button 
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 w-6 h-6 bg-white/90 hover:bg-red-50 hover:text-red-600 text-gray-600 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm transition-colors opacity-0 group-hover:opacity-100"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Side Panels */}
        <div className="space-y-6">
          
          {/* Live Preview */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center gap-2 text-gray-700">
              <Eye size={16} />
              <h2 className="text-[14px] font-bold">Live Preview</h2>
            </div>
            <div className="p-5">
              <div className="border border-gray-200 rounded-lg p-3 bg-white">
                <div className="aspect-square bg-[#f8fafc] rounded flex items-center justify-center text-gray-300 mb-4 overflow-hidden relative">
                  {imagePreviews.length > 0 ? (
                    <img src={imagePreviews[0]} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon size={48} strokeWidth={1} />
                  )}
                  {imagePreviews.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm">
                      +{imagePreviews.length - 1} Photos
                    </div>
                  )}
                </div>
                <div className="px-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{formData.category || 'CATEGORY'}</p>
                  <p className="text-[14px] font-bold text-gray-900 truncate mb-1">{formData.name || 'Product Name'}</p>
                  <p className="text-[15px] font-bold text-gray-900">₹{formData.price || '0'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visibility */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-[14px] font-bold text-gray-900">Visibility</h2>
            </div>
            <div className="p-2 text-[13px] text-gray-600 font-medium">
              <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded cursor-pointer">
                <span>Best Seller</span>
                <div className="w-9 h-5 bg-gray-200 rounded-full relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm"></div>
                </div>
              </label>
              <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded cursor-pointer">
                <span>Fresh Arrival</span>
                <div className="w-9 h-5 bg-gray-200 rounded-full relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm"></div>
                </div>
              </label>
              <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded cursor-pointer">
                <span>Out of Stock</span>
                <div className="w-9 h-5 bg-gray-200 rounded-full relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm"></div>
                </div>
              </label>
              <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded cursor-pointer">
                <span>Hidden</span>
                <div className="w-9 h-5 bg-gray-200 rounded-full relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm"></div>
                </div>
              </label>
            </div>
          </div>

          {/* Category Management Link */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
            <h2 className="text-[14px] font-bold text-gray-900 mb-2">Category Management</h2>
            <p className="text-[12px] text-gray-500 mb-4">
              Categories are now managed from a dedicated admin tab.
            </p>
            <Link href="/admin/category-management" className="block w-full py-2 border border-[#0066cc] text-[#0066cc] rounded font-medium text-[13px] hover:bg-[#eff4ff] transition-colors text-center">
              Open Category Management
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
