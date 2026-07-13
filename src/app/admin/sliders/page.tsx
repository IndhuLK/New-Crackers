"use client";

import { Plus, Eye, Edit2, Trash2, Loader2, UploadCloud } from 'lucide-react';
import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import toast from 'react-hot-toast';

interface Slider {
  id: string;
  title: string;
  desc: string;
  imageUrl: string;
}

export default function AdminSlidersPage() {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'Sliders'), (snapshot) => {
      const fetched = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Slider));
      setSliders(fetched);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setDesc('');
    setImageUrl('');
    setImageFile(null);
    setIsFormOpen(false);
  };

  const handleEdit = (slider: Slider) => {
    setEditingId(slider.id);
    setTitle(slider.title || '');
    setDesc(slider.desc || '');
    setImageUrl(slider.imageUrl || '');
    setImageFile(null);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this slider?")) return;
    try {
      await deleteDoc(doc(db, 'Sliders', id));
      toast.success("Slider deleted");
    } catch (e) {
      toast.error("Failed to delete slider");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      toast.error("Title is required");
      return;
    }
    if (!imageFile && !imageUrl) {
      toast.error("Image is required");
      return;
    }

    setUploading(true);
    try {
      let finalImageUrl = imageUrl;

      if (imageFile) {
        const storageRef = ref(storage, `sliders/${Date.now()}_${imageFile.name}`);
        const uploadTask = await uploadBytesResumable(storageRef, imageFile);
        finalImageUrl = await getDownloadURL(uploadTask.ref);
      }

      const sliderData = { title, desc, imageUrl: finalImageUrl };

      if (editingId) {
        await updateDoc(doc(db, 'Sliders', editingId), sliderData);
        toast.success("Slider updated");
      } else {
        const newDocRef = doc(collection(db, 'Sliders'));
        await setDoc(newDocRef, sliderData);
        toast.success("Slider created");
      }
      resetForm();
    } catch (err) {
      toast.error("Failed to save slider");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0f172a] tracking-tight leading-none mb-2">Sliders</h1>
          <p className="text-gray-400 text-[13px]">{sliders.length} banner slides</p>
        </div>
        {!isFormOpen && (
          <button 
            onClick={() => setIsFormOpen(true)}
            className="px-4 py-2 bg-[#0066cc] text-white rounded font-medium text-[13px] hover:bg-[#0052a3] transition-colors flex items-center gap-2 shadow-sm shrink-0"
          >
            <Plus size={16} /> Add Slide
          </button>
        )}
      </div>

      {isFormOpen ? (
        <div className="bg-white rounded border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-bold mb-4">{editingId ? "Edit Slide" : "New Slide"}</h2>
          <form onSubmit={handleSave} className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-1">Title</label>
              <input 
                type="text" 
                value={title} 
                onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded text-[13px] outline-none focus:border-[#0066cc]"
                placeholder="Enter slide title"
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-1">Description</label>
              <textarea 
                value={desc} 
                onChange={e => setDesc(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded text-[13px] outline-none focus:border-[#0066cc]"
                placeholder="Enter slide description"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-1">Image</label>
              <div className="flex items-center gap-4">
                {(imageUrl || imageFile) && (
                  <div className="w-32 h-20 bg-gray-100 rounded overflow-hidden relative border border-gray-200 shrink-0">
                    <img 
                      src={imageFile ? URL.createObjectURL(imageFile) : imageUrl} 
                      alt="Preview" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                )}
                <label className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded text-[13px] font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors">
                  <UploadCloud size={16} />
                  {imageFile || imageUrl ? "Change Image" : "Upload Image"}
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        setImageFile(e.target.files[0]);
                      }
                    }} 
                  />
                </label>
              </div>
            </div>
            
            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
              <button 
                type="button" 
                onClick={resetForm}
                className="px-6 py-2 border border-gray-200 text-gray-600 rounded text-[13px] font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={uploading}
                className="px-6 py-2 bg-[#0066cc] text-white rounded text-[13px] font-medium hover:bg-[#0052a3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {uploading && <Loader2 size={14} className="animate-spin" />}
                {uploading ? "Saving..." : "Save Slide"}
              </button>
            </div>
          </form>
        </div>
      ) : loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="animate-spin text-[#0066cc]" size={32} />
        </div>
      ) : sliders.length === 0 ? (
        <div className="bg-white p-12 rounded border border-gray-200 text-center text-gray-500 text-[13px]">
          No sliders found. Create your first slide!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {sliders.map((slide, index) => (
            <div key={slide.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
              {/* Image Container */}
              <div className="relative aspect-[16/9] w-full bg-gray-100 overflow-hidden">
                <img 
                  src={slide.imageUrl} 
                  alt={slide.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white text-gray-900 font-bold px-3 py-1.5 rounded-sm shadow-sm text-[11px] tracking-wide">
                  Slide {index + 1}
                </div>
              </div>

              {/* Content Container */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-bold text-[#0f172a] text-[15px] mb-2 leading-tight">
                  {slide.title}
                </h3>
                <p className="text-gray-500 text-[13px] leading-relaxed line-clamp-3">
                  {slide.desc}
                </p>
              </div>

              {/* Action Footer */}
              <div className="border-t border-gray-100 grid grid-cols-2 divide-x divide-gray-100">
                <button 
                  onClick={() => handleEdit(slide)}
                  className="flex items-center justify-center py-4 text-gray-400 hover:text-[#0066cc] hover:bg-gray-50 transition-colors" 
                  title="Edit"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(slide.id)}
                  className="flex items-center justify-center py-4 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" 
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
