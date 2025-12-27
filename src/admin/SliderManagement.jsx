import { useState, useEffect } from "react";
import { Plus, UploadCloud, Eye, Pencil, Trash, X, Layout } from "lucide-react";
import { db, storage } from "../firebaseConfig";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

const SliderManagement = () => {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  
  // Edit Mode Tracking
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);

  // Form States
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [oldImageUrl, setOldImageUrl] = useState("");

  // Other Modal States
  const [previewSlide, setPreviewSlide] = useState(null);
  const [deleteSlide, setDeleteSlide] = useState(null);

  // Fetch Data
  useEffect(() => {
    const q = query(collection(db, "Sliders"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSliders(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // --- EDIT BUTTON CLICK (Prefill Logic) ---
  const openEditModal = (item) => {
    setIsEditing(true);
    setCurrentEditId(item.id);
    setTitle(item.title);
    setSubTitle(item.subTitle);
    setDesc(item.desc);
    setImagePreview(item.imageUrl); // UI-la image-ai kaata
    setOldImageUrl(item.imageUrl); // Database update-ukku
    setOpenModal(true);
  };

  const resetForm = () => {
    setTitle("");
    setSubTitle("");
    setDesc("");
    setImagePreview(null);
    setImageFile(null);
    setIsEditing(false);
    setCurrentEditId(null);
    setOldImageUrl("");
    setOpenModal(false);
  };

  // --- SUBMIT (Add or Update) ---
  const handleSaveSlider = async () => {
    if (!title || !desc) return alert("Please fill Title and Description!");
    
    setLoading(true);
    try {
      let finalImageUrl = oldImageUrl;

      // Pudhu image upload panna mattum storage process nadakkum
      if (imageFile) {
        // Edit-il image maathunidha palaiya image-ai delete seiyum
        if (isEditing && oldImageUrl) {
          const oldRef = ref(storage, oldImageUrl);
          await deleteObject(oldRef).catch(() => null);
        }

        const imgRef = ref(storage, `Sliders/${Date.now()}-${imageFile.name}`);
        await uploadBytes(imgRef, imageFile);
        finalImageUrl = await getDownloadURL(imgRef);
      }

      if (isEditing) {
        // UPDATE Logic
        await updateDoc(doc(db, "Sliders", currentEditId), {
          title,
          subTitle,
          desc,
          imageUrl: finalImageUrl,
        });
      } else {
        // ADD Logic
        if (!imageFile) {
          setLoading(false);
          return alert("Please upload an image!");
        }
        await addDoc(collection(db, "Sliders"), {
          title,
          subTitle,
          desc,
          imageUrl: finalImageUrl,
          createdAt: Date.now(),
        });
      }

      resetForm();
    } catch (error) {
      console.error(error);
      alert("Error saving data!");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 lg:p-10 bg-[#f8fafc] min-h-screen font-sans text-black">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3 tracking-tighter">
            <Layout className="text-blue-600" size={36} /> Slider Admin
          </h1>
          <p className="text-slate-500 font-medium mt-1">Easily update your website banners.</p>
        </div>

        <button
          onClick={() => { setIsEditing(false); setOpenModal(true); }}
          className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-red-200 transition-all active:scale-95"
        >
          <Plus size={20} /> Add New Slide
        </button>
      </div>

      {/* Grid Layout */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sliders.map((item, index) => (
          <div key={item.id} className="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="relative h-48 overflow-hidden">
              <img src={item.imageUrl} className="w-full h-full object-cover" alt="" />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-slate-900 px-3 py-1 rounded-full text-[10px] font-black uppercase">Slide {index + 1}</div>
            </div>
            
            <div className="p-6">
              <h3 className="text-lg font-black text-slate-800 line-clamp-1 italic">{item.title}</h3>
              <p className="text-slate-500 text-sm mt-3 line-clamp-2 font-medium leading-relaxed">{item.desc}</p>
              
              <div className="flex gap-2 mt-6 pt-4 border-t border-slate-50">
                <button onClick={() => setPreviewSlide(item)} className="flex-1 flex justify-center py-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-blue-50 transition-all"><Eye size={18}/></button>
                <button onClick={() => openEditModal(item)} className="flex-1 flex justify-center py-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-amber-50 transition-all"><Pencil size={18}/></button>
                <button onClick={() => setDeleteSlide(item)} className="flex-1 flex justify-center py-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-red-50 transition-all"><Trash size={18}/></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL - Compact & Attractive Version */}
      {openModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden animate-in fade-in zoom-in duration-300 border border-white/20">
            
            {/* Compact Header */}
            <div className={`relative p-6 text-white ${isEditing ? 'bg-gradient-to-r from-amber-500 to-orange-600' : 'bg-gradient-to-r from-red-600 to-red-700'}`}>
              <div className="relative z-10 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/70 block mb-1">Banner Editor</span>
                  <h3 className="text-xl font-black italic tracking-tighter uppercase">
                    {isEditing ? 'Modify Slide' : 'New Creation'}
                  </h3>
                </div>
                <button onClick={resetForm} className="p-2 bg-black/10 hover:bg-black/20 rounded-xl transition-all">
                  <X size={20}/>
                </button>
              </div>
            </div>
            
            <div className="p-6 bg-slate-50/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-sm font-black text-slate-700 uppercase tracking-widest ml-1">Main Title</label>
                  <input 
                    type="text" 
                    className="w-full bg-white border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-bold text-slate-700 text-sm transition-all shadow-sm" 
                    value={title} 
                    onChange={(e)=>setTitle(e.target.value)} 
                  />
                </div>

                {/* Subtitle */}
                <div className="space-y-1">
                  <label className="text-sm  font-black text-slate-700 uppercase tracking-widest ml-1">Badge Text</label>
                  <input 
                    type="text" 
                    className="w-full bg-white border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-bold text-slate-700 text-sm transition-all shadow-sm" 
                    value={subTitle} 
                    onChange={(e)=>setSubTitle(e.target.value)} 
                  />
                </div>
              </div>

              {/* Compact Description */}
              <div className="space-y-1 mb-4">
                <label className="text-sm  font-black text-slate-700 uppercase tracking-widest ml-1">Description</label>
                <textarea 
                  className="w-full bg-white border border-slate-200 p-3 rounded-xl h-20 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-medium text-slate-600 text-sm transition-all shadow-sm resize-none" 
                  value={desc} 
                  onChange={(e)=>setDesc(e.target.value)} 
                />
              </div>

              {/* Small Image Preview Area */}
              <div className="space-y-1">
                <label className="text-sm  font-black text-slate-700 uppercase tracking-widest ml-1 mb-1 block">Banner Visual</label>
                <label className="relative group w-full h-32 bg-white border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50/50 hover:border-blue-400 transition-all overflow-hidden">
                  {imagePreview ? (
                    <div className="w-full h-full relative">
                      <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                        <p className="text-white font-black text-[10px] uppercase">Change Image</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <UploadCloud size={24} className="text-slate-400 mb-1"/>
                      <p className="text-[10px] font-black text-slate-700 uppercase">Upload Banner</p>
                    </div>
                  )}
                  <input type="file" className="hidden" onChange={handleImage} />
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={resetForm} 
                  className="flex-1 py-3 bg-slate-200 text-slate-600 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-slate-300 transition-all active:scale-95"
                >
                  Discard
                </button>
                <button 
                  onClick={handleSaveSlider} 
                  disabled={loading} 
                  className={`flex-[2] py-3 text-white rounded-xl font-black uppercase tracking-widest text-sm
                     shadow-lg transition-all active:scale-95 disabled:opacity-50  ${
                    isEditing ? 'bg-amber-600 shadow-amber-100 cursor-pointer' : 'cursor-pointer bg-blue-600 shadow-blue-100'
                  }`}
                >
                  {loading ? 'Processing...' : isEditing ? 'Save Changes' : 'Publish Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {previewSlide && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex justify-center items-center z-50 p-4">
           <div className="bg-white w-full max-w-sm rounded-[3rem] overflow-hidden shadow-2xl relative border-[8px] border-slate-900 animate-in zoom-in duration-300">
              <div className="h-[500px] relative">
                  <img src={previewSlide.imageUrl} className="w-full h-full object-cover" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                  <div className="absolute bottom-10 left-6 right-6 text-white">
                      <span className="bg-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-3 inline-block">{previewSlide.subTitle}</span>
                      <h2 className="text-3xl font-black leading-tight mb-3 italic tracking-tighter">{previewSlide.title}</h2>
                      <p className="text-white/70 text-sm font-medium leading-relaxed">{previewSlide.desc}</p>
                  </div>
              </div>
              <button onClick={()=>setPreviewSlide(null)} className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/40"><X/></button>
           </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteSlide && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-sm p-8 rounded-[2.5rem] text-center shadow-2xl animate-in zoom-in duration-200">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Remove Slide?</h3>
            <p className="text-slate-500 mt-2 font-medium text-sm">This banner will be permanently deleted from the database.</p>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setDeleteSlide(null)} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs uppercase">Cancel</button>
              <button onClick={async () => {
                const fileRef = ref(storage, deleteSlide.imageUrl);
                await deleteObject(fileRef).catch(() => null);
                await deleteDoc(doc(db, "Sliders", deleteSlide.id));
                setDeleteSlide(null);
              }} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-100 text-xs uppercase">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SliderManagement;