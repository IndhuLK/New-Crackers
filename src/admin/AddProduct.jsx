import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useProducts } from "../admin/ProductContext";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage"; // Updated storage import
import { db } from "../firebaseConfig";
import {
  doc,
  updateDoc,
  collection,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import {
  ImagePlus,
  ArrowLeft,
  Save,
  Plus,
  X,
  Sparkles,
  DollarSign,
  Tag,
  ChevronRight,
  UploadCloud,
  Globe,
  Search,
  Eye,
  LayoutGrid
} from "lucide-react";

// --- Reusable UI Components ---

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-center gap-5 mb-8">
    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 transform hover:scale-110 transition-transform duration-300">
      <Icon size={24} strokeWidth={1.5} />
    </div>
    <div>
      <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h2>
      <p className="text-sm font-medium text-slate-500">{subtitle}</p>
    </div>
  </div>
);

const InputField = ({ label, name, value, onChange, type = "text", placeholder, required = false, icon: Icon, textarea = false, helpText }) => (
  <div className="space-y-2 group">
    <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-1">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none z-10">
          <Icon size={18} />
        </div>
      )}
      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={4}
          className="w-full bg-slate-50/50 hover:bg-white border border-slate-200 focus:border-indigo-500 p-4 rounded-xl focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-slate-700 font-medium placeholder:text-slate-400 resize-none text-sm shadow-sm backdrop-blur-sm"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full bg-slate-50/50 hover:bg-white border border-slate-200 focus:border-indigo-500 p-3.5 rounded-xl focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-slate-700 font-medium placeholder:text-slate-400 text-sm shadow-sm backdrop-blur-sm ${Icon ? "pl-11" : ""}`}
        />
      )}
    </div>
    {helpText && <p className="text-xs text-slate-400 font-medium ml-1">{helpText}</p>}
  </div>
);

const ToggleSwitch = ({ label, name, checked, onChange, color = "bg-indigo-600" }) => (
  <label className="flex items-center justify-between p-4 rounded-xl border border-transparent hover:bg-white/60 hover:border-indigo-100 transition-all cursor-pointer group active:scale-98">
    <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{label}</span>
    <div className="relative">
      <input type="checkbox" name={name} checked={checked} onChange={onChange} className="sr-only" />
      <div className={`w-12 h-7 rounded-full transition-all duration-500 ease-out ${checked ? color : "bg-slate-200 shadow-inner"}`}></div>
      <div className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-all duration-500 ease-spring shadow-md ${checked ? "translate-x-5" : ""}`}></div>
    </div>
  </label>
);

const AddProduct = () => {
  const { addProduct } = useProducts();
  const location = useLocation();
  const navigate = useNavigate();
  const storage = getStorage();

  const editingProduct = location.state?.editingProduct || null;

  // States
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [previews, setPreviews] = useState([]);
  
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [catImage, setCatImage] = useState(null);
  const [catPreview, setCatPreview] = useState(null);

  const [product, setProduct] = useState({
    category: "",
    productCode: "",
    name: "",
    per: "",
    mrp: "",
    price: "",
    sortOrder: "",
    image: "",
    images: [],
    videos: [],
    highlights: "",
    safety: "",
    description: "",
    moreInfo: "",
    isBestSeller: false,
  isFreshArrival: false,

  outOfStock: false,
  hideProduct: false,
    
    metaTitle: "",
    metaDescription: "",
    slug: "",
    keywords: ""
  });

  // Effects
  useEffect(() => {
    if (editingProduct) {
      setProduct(editingProduct);
      if (editingProduct.image) setPreviews([editingProduct.image]);
    }
  }, [editingProduct]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "categories"), (snap) => {
      setCategories(snap.docs.map(d => ({ id: d.id, name: d.data().name })));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (images.length === 0) return;
    const objectUrls = images.map(img => URL.createObjectURL(img));
    setPreviews(objectUrls);
    return () => objectUrls.forEach(url => URL.revokeObjectURL(url));
  }, [images]);

  useEffect(() => {
    if (!editingProduct && product.name) {
      const slug = product.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      setProduct(prev => ({
        ...prev,
        slug: prev.slug || slug,
        metaTitle: prev.metaTitle || product.name
      }));
    }
  }, [product.name, editingProduct]);

  // Handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct({ ...product, [name]: type === "checkbox" ? checked : value });
  };

  const handleCatImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCatImage(file);
      setCatPreview(URL.createObjectURL(file));
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim() || !catImage) return alert("Please add both name and image for the category.");
    
    setUploading(true);
    try {
      const fileName = `categories/${Date.now()}-${catImage.name}`;
      const fileRef = storageRef(storage, fileName);
      
      await uploadBytes(fileRef, catImage);
      const downloadURL = await getDownloadURL(fileRef);

      await addDoc(collection(db, "categories"), { 
        name: newCategory.trim(),
        img: downloadURL,
        count: "0 Styles",
        createdAt: new Date()
      });

      setNewCategory("");
      setCatImage(null);
      setCatPreview(null);
      alert("Category added successfully!");
    } catch (err) {
      console.error(err);
      alert("Error adding category.");
    } finally {
      setUploading(false);
    }
  };

  const uploadAllMedia = async () => {
    const uploadFiles = async (files, folder) => {
      const uploads = files.map(async (file, i) => {
        const ext = file.name.split(".").pop();
        const fileName = `${product.productCode}-${Date.now()}-${i}.${ext}`;
        const mediaRef = storageRef(storage, `products/${product.productCode}/${folder}/${fileName}`);
        await uploadBytes(mediaRef, file);
        return await getDownloadURL(mediaRef);
      });
      return Promise.all(uploads);
    };

    const imageURLs = images.length ? await uploadFiles(images, "images") : product.images;
    const videoURLs = videos.length ? await uploadFiles(videos, "videos") : product.videos;

    return {
      image: imageURLs[0] || product.image,
      images: imageURLs,
      videos: videoURLs,
    };
  };

  const handleSaveProduct = async () => {
    if (!product.category || !product.productCode || !product.name || !product.price)
      return alert("Please fill all required fields.");

    setUploading(true);
    try {
      const uploaded = await uploadAllMedia();
      const finalData = { ...product, ...uploaded, updatedAt: new Date() };

      if (editingProduct) {
        await updateDoc(doc(db, "products", editingProduct.id), finalData);
      } else {
        await addProduct(finalData);
      }
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      alert("Error saving product.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen pb-32 font-sans text-slate-800 animate-in fade-in duration-500 bg-[#F8FAFC]">
      {/* Background blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/20 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-200/20 rounded-full blur-3xl opacity-60"></div>
      </div>

      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200 py-4 px-6 md:px-10 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
              <ArrowLeft size={18} className="text-slate-600" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{editingProduct ? "Edit Product" : "Create Product"}</h1>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Inventory</p>
            </div>
          </div>

          <button
            disabled={uploading}
            onClick={handleSaveProduct}
            className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-slate-200 active:scale-95 disabled:opacity-50 hover:-translate-y-0.5"
          >
            {uploading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
            <span>{editingProduct ? "Save Changes" : "Publish Product"}</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-10 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Content (Left) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Essentials Section */}
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/60 shadow-xl shadow-slate-200/50 relative overflow-hidden">
            <SectionHeader icon={LayoutGrid} title="Essentials" subtitle="Core product details & classification." />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <InputField label="Product Name" name="name" value={product.name} onChange={handleChange} required placeholder="e.g. 1000 Wala Premium" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Category <span className="text-rose-500">*</span></label>
                <div className="relative group/select">
                  <select
                    name="category"
                    value={product.category}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl appearance-none outline-none font-bold text-sm text-slate-700 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-colors cursor-pointer shadow-sm"
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                  <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none group-hover/select:text-indigo-600 transition-colors" size={16} />
                </div>
              </div>

              <InputField label="SKU Code" name="productCode" value={product.productCode} onChange={handleChange} required icon={Tag} placeholder="SKU-123" />
              <div className="md:col-span-2 border-t border-slate-100 my-2"></div>
              <InputField label="MRP (₹)" name="mrp" type="number" value={product.mrp} onChange={handleChange} icon={DollarSign} placeholder="0.00" />
              <InputField label="Selling Price (₹)" name="price" type="number" value={product.price} onChange={handleChange} required icon={DollarSign} placeholder="0.00" />
            </div>
          </div>

          {/* Media Section */}
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/60 shadow-xl shadow-slate-200/50">
            <SectionHeader icon={ImagePlus} title="Gallery" subtitle="Visual assets for the product." />
            <div className="border-3 border-dashed border-slate-300/60 rounded-[1.5rem] bg-slate-50/30 hover:bg-indigo-50/30 hover:border-indigo-400 transition-all p-12 text-center cursor-pointer relative group overflow-hidden">
              <input multiple type="file" accept="image/*" onChange={(e) => setImages(Array.from(e.target.files))} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
              <div className="w-20 h-20 bg-white rounded-3xl shadow-lg border border-indigo-50 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:shadow-indigo-200/50 transition-all duration-300 delay-75">
                <UploadCloud size={32} className="text-indigo-400 group-hover:text-indigo-600 transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-900 transition-colors mb-2">Click to upload assets</h3>
              <p className="text-sm text-slate-400 font-medium group-hover:text-indigo-400/80 transition-colors">SVG, PNG, JPG (Max 800x800px)</p>
            </div>

            {previews.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-4 mt-8">
                {previews.map((url, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden group shadow-sm ring-1 ring-slate-100 hover:ring-indigo-200 transition-all">
                    <img src={url} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                      className="absolute top-1 right-1 w-7 h-7 bg-white/90 text-rose-500 rounded-lg flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-50"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SEO Section */}
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/60 shadow-xl shadow-slate-200/50">
            <SectionHeader icon={Globe} title="Content & SEO" subtitle="Description and search optimization." />
            <div className="space-y-6">
              <InputField name="description" value={product.description} onChange={handleChange} textarea placeholder="Write a compelling description..." />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                <div className="md:col-span-2">
                  <InputField label="Meta Title" name="metaTitle" value={product.metaTitle} onChange={handleChange} icon={Search} placeholder="SEO Title" helpText="Recom: 50-60 chars" />
                </div>
                <InputField label="URL Slug" name="slug" value={product.slug} onChange={handleChange} placeholder="product-slug" helpText="Auto-generated" />
                <InputField label="Keywords" name="keywords" value={product.keywords} onChange={handleChange} placeholder="tags, keys" helpText="Comma separated" />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar (Right) */}
        <div className="lg:col-span-4 relative">
          <div className="lg:sticky lg:top-28 space-y-6">
            
            {/* Live Preview */}
            <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/60 shadow-xl shadow-slate-200/50 z-20">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                <Eye size={18} className="text-slate-400" />
                <h3 className="font-bold text-slate-900">Live Preview</h3>
              </div>
              <div className="group bg-white rounded-[1.5rem] p-4 border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden">
                <div className="aspect-square bg-slate-50 rounded-xl overflow-hidden mb-3 relative">
                  {previews[0] ? (
                    <img src={previews[0]} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <ImagePlus size={32} strokeWidth={1.5} />
                    </div>
                  )}
                </div>
                <div className="px-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{product.category || "Category"}</p>
                  <h4 className="font-bold text-slate-900 text-lg mt-1 mb-3">{product.name || "Product Name"}</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-black text-slate-900">₹{Number(product.price || 0).toLocaleString()}</span>
                    <button className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg">
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Toggles */}
            <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/60 shadow-xl shadow-slate-200/50">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Sparkles size={16} className="text-yellow-500 fill-yellow-500" /> Visibility Status
              </h3>
              <div className="space-y-2">
                <ToggleSwitch
      label="Best Sellers"
      name="isBestSeller"
      checked={product.isBestSeller}
      onChange={handleChange}
      color="bg-orange-500"
    />

    <ToggleSwitch
      label="Fresh Arrivals"
      name="isFreshArrival"
      checked={product.isFreshArrival}
      onChange={handleChange}
      color="bg-red-500"
    />
                <div className="my-3 h-px bg-slate-100"></div>
                <ToggleSwitch label="Out of Stock" name="outOfStock" checked={product.outOfStock} onChange={handleChange} color="bg-slate-800" />
                <ToggleSwitch label="Hidden" name="hideProduct" checked={product.hideProduct} onChange={handleChange} color="bg-slate-400" />
              </div>
            </div>

            {/* NEW: Quick Category Section with Image */}
            <div className="bg-slate-900 rounded-[2.5rem] p-6 shadow-2xl shadow-indigo-900/20 relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-white font-bold text-lg mb-1">New Category</h3>
                <p className="text-slate-400 text-xs mb-4">Add instantly with image.</p>
                <div className="space-y-3">
                  <input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:bg-white/20 transition-colors"
                    placeholder="Category Name..."
                  />
                  <div className="relative h-24 w-full border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 transition-all overflow-hidden">
                    {catPreview ? (
                      <img src={catPreview} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <>
                        <ImagePlus size={20} className="text-white/40 mb-1" />
                        <span className="text-[10px] text-white/40">Select Image</span>
                      </>
                    )}
                    <input type="file" accept="image/*" onChange={handleCatImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                  <button 
                    onClick={handleAddCategory} 
                    disabled={uploading}
                    className="w-full bg-white text-black py-2.5 rounded-xl hover:bg-indigo-50 transition-colors font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {uploading ? "Processing..." : <><Plus size={16} /> Add Category</>}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;