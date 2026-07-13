"use client";
import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Eye, Image as ImageIcon, CloudUpload, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useProducts } from '@/context/ProductContext';
import { useRouter, useParams } from 'next/navigation';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import toast from 'react-hot-toast';

export default function EditProductClient() {
  const { categories, updateProduct } = useProducts();
  const router = useRouter();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [existingImages, setExistingImages] = useState<string[]>([]);

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
    videoUrl: '',
    isBestSeller: false,
    isFreshArrival: false,
    outOfStock: false,
    isHidden: false,
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const decodedId = decodeURIComponent(id as string);
        const docRef = doc(db, 'products', decodedId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            name: data.name || '',
            category: data.category || '',
            sku: data.productCode || '',
            mrp: data.mrp ? String(data.mrp) : '',
            price: data.price ? String(data.price) : '',
            stock: data.stock !== undefined && data.stock !== null ? String(data.stock) : '',
            unit: data.unit || '',
            sortOrder: data.sortOrder ? String(data.sortOrder) : '',
            highlights: data.highlights || '',
            safetyNotes: data.safety || '',
            additionalInfo: data.description || '',
            videoUrl: data.videoUrl || '',
            isBestSeller: !!data.isBestSeller,
            isFreshArrival: !!data.isFreshArrival,
            outOfStock: !!data.outOfStock,
            isHidden: !!data.isHidden,
          });
          if (data.image) setExistingImages([data.image, ...(data.images || []).slice(1)]);
        } else {
          toast.error("Product not found");
          router.push('/admin/products');
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
      return;
    }

    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      if ((name === 'name' || name === 'category') && !newData.sku) {
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

  const removeNewImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.price) {
      alert("Please fill essential fields (Name, Category, Selling Price)");
      return;
    }
    setIsSubmitting(true);
    try {
      let uploadedUrls: string[] = [...existingImages];
      
      if (imageFiles.length > 0) {
        const uploadPromises = imageFiles.map(async (file) => {
          const fileRef = ref(storage, `products/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`);
          await uploadBytes(fileRef, file);
          return await getDownloadURL(fileRef);
        });
        const newUrls = await Promise.all(uploadPromises);
        uploadedUrls = [...uploadedUrls, ...newUrls];
      }

      await updateProduct(decodeURIComponent(id as string), {
        name: formData.name,
        category: formData.category,
        categorySlug: categories.find(c => c.name === formData.category)?.slug || formData.category.toLowerCase().replace(/\s+/g, '-'),
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
        videoUrl: formData.videoUrl,
        isBestSeller: formData.isBestSeller,
        isFreshArrival: formData.isFreshArrival,
        outOfStock: formData.outOfStock,
        isHidden: formData.isHidden,
      });
      toast.success("Product updated successfully");
      router.back();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#0066cc]" size={40} /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-6">
        <div className="flex items-start gap-4">
          <button onClick={() => router.back()} className="w-8 h-8 rounded border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors shrink-0 mt-1">
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-[22px] font-bold text-gray-900 tracking-tight leading-none mb-2">Edit Product</h1>
            <p className="text-gray-400 text-[13px] max-w-2xl leading-relaxed">
              Modify product details, manage stock, and update images.
            </p>
          </div>
        </div>
        <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="px-5 py-2 bg-[#0066cc] text-white rounded font-medium text-[13px] hover:bg-[#0052a3] transition-colors flex items-center gap-2 shadow-sm shrink-0 disabled:opacity-50">
          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h2 className="text-[15px] font-bold text-gray-900 leading-none mb-1">Essentials</h2>
            <div className="space-y-5 mt-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">PRODUCT NAME <span className="text-red-500">*</span></label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2.5 bg-[#f8fafc] border border-gray-200 rounded-md text-[14px] outline-none focus:border-[#0066cc]" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">CATEGORY <span className="text-red-500">*</span></label>
                  <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2.5 bg-[#f8fafc] border border-gray-200 rounded-md text-[14px] outline-none focus:border-[#0066cc]">
                    <option value="">Select a category...</option>
                    {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">SKU CODE <span className="text-red-500">*</span></label>
                  <input type="text" name="sku" value={formData.sku} onChange={handleChange} className="w-full px-4 py-2.5 bg-[#f8fafc] border border-gray-200 rounded-md text-[14px] outline-none focus:border-[#0066cc]" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">MRP (₹)</label>
                  <input type="number" name="mrp" value={formData.mrp} onChange={handleChange} className="w-full px-4 py-2.5 bg-[#f8fafc] border border-gray-200 rounded-md text-[14px] outline-none focus:border-[#0066cc]" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">SELLING PRICE (₹) <span className="text-red-500">*</span></label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full px-4 py-2.5 bg-[#f8fafc] border border-gray-200 rounded-md text-[14px] outline-none focus:border-[#0066cc]" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">STOCK QUANTITY</label>
                  <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full px-4 py-2.5 bg-[#f8fafc] border border-gray-200 rounded-md text-[14px] outline-none focus:border-[#0066cc]" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">PACK / UNIT</label>
                  <input type="text" name="unit" value={formData.unit} onChange={handleChange} className="w-full px-4 py-2.5 bg-[#f8fafc] border border-gray-200 rounded-md text-[14px] outline-none focus:border-[#0066cc]" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h2 className="text-[15px] font-bold text-gray-900 leading-none mb-4">Product Details & Media</h2>
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">HIGHLIGHTS</label>
                  <textarea name="highlights" value={formData.highlights} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 bg-[#f8fafc] border border-gray-200 rounded-md text-[14px] outline-none focus:border-[#0066cc] resize-none"></textarea>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">SAFETY NOTES</label>
                  <textarea name="safetyNotes" value={formData.safetyNotes} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 bg-[#f8fafc] border border-gray-200 rounded-md text-[14px] outline-none focus:border-[#0066cc] resize-none"></textarea>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">ADDITIONAL INFO</label>
                <textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} rows={2} className="w-full px-4 py-2.5 bg-[#f8fafc] border border-gray-200 rounded-md text-[14px] outline-none focus:border-[#0066cc] resize-none"></textarea>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">YOUTUBE VIDEO URL</label>
                <input type="url" name="videoUrl" value={formData.videoUrl} onChange={handleChange} placeholder="https://youtube.com/watch?v=..." className="w-full px-4 py-2.5 bg-[#f8fafc] border border-gray-200 rounded-md text-[14px] outline-none focus:border-[#0066cc]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h2 className="text-[15px] font-bold text-gray-900 leading-none mb-4">Gallery</h2>
            <label className="border border-dashed border-gray-300 rounded-lg p-10 flex flex-col items-center justify-center bg-[#f8fafc] hover:bg-gray-50 hover:border-[#0066cc] cursor-pointer text-center group mb-4">
              <CloudUpload size={24} className="text-[#0066cc] mb-2" />
              <p className="text-[14px] font-bold text-gray-700">Upload new images</p>
              <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {existingImages.map((img, index) => (
                <div key={`exist-${index}`} className="relative aspect-square rounded border border-gray-200 overflow-hidden bg-gray-50 group">
                  <img src={img} alt="Existing" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeExistingImage(index)} className="absolute top-1 right-1 w-6 h-6 bg-white/90 hover:bg-red-50 text-red-600 rounded-full flex items-center justify-center text-[10px] font-bold opacity-0 group-hover:opacity-100 shadow-sm">✕</button>
                </div>
              ))}
              {imagePreviews.map((preview, index) => (
                <div key={`new-${index}`} className="relative aspect-square rounded border border-[#0066cc] overflow-hidden bg-gray-50 group">
                  <img src={preview} alt="New" className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 w-full bg-[#0066cc] text-white text-[9px] text-center font-bold">NEW</div>
                  <button type="button" onClick={() => removeNewImage(index)} className="absolute top-1 right-1 w-6 h-6 bg-white/90 hover:bg-red-50 text-red-600 rounded-full flex items-center justify-center text-[10px] font-bold opacity-0 group-hover:opacity-100 shadow-sm">✕</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <h2 className="text-[14px] font-bold text-gray-900 mb-4">Visibility & Status</h2>
            <div className="space-y-3 text-[13px] font-medium text-gray-700">
              <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer border border-transparent hover:border-gray-200">
                <input type="checkbox" name="isBestSeller" checked={formData.isBestSeller} onChange={handleChange} className="w-4 h-4 text-[#0066cc] rounded focus:ring-0" />
                Best Seller
              </label>
              <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer border border-transparent hover:border-gray-200">
                <input type="checkbox" name="isFreshArrival" checked={formData.isFreshArrival} onChange={handleChange} className="w-4 h-4 text-[#0066cc] rounded focus:ring-0" />
                Fresh Arrival
              </label>
              <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer border border-transparent hover:border-gray-200">
                <input type="checkbox" name="outOfStock" checked={formData.outOfStock} onChange={handleChange} className="w-4 h-4 text-red-500 rounded focus:ring-0" />
                Mark Out of Stock
              </label>
              <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer border border-transparent hover:border-gray-200">
                <input type="checkbox" name="isHidden" checked={formData.isHidden} onChange={handleChange} className="w-4 h-4 text-gray-500 rounded focus:ring-0" />
                Hide from Public Store
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
