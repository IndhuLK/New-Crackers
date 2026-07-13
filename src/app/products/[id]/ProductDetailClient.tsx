"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useCart } from '@/context/CartContext';
import { ChevronRight, Star, Truck, ShieldCheck, Minus, Plus, ShoppingCart, Loader2 } from 'lucide-react';
import { useProducts, Product } from '@/context/ProductContext';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function ProductDetailClient() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { products } = useProducts();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const decodedId = decodeURIComponent(id as string);
        const docRef = doc(db, 'products', decodedId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        } else {
          const q = query(collection(db, 'products'), where('slug', '==', decodedId), limit(1));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
             setProduct({ id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as Product);
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#ea580c]" size={40} /></div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center text-xl font-bold">Product not found</div>;

  const isOutOfStock = product.stock !== undefined && product.stock !== null ? product.stock <= 0 : !!product.outOfStock;
  const discount = product.mrp && product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 6);

  const handleAdd = () => {
    addToCart({ ...product, qty });
    toast.success("Added to cart");
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24 md:pb-12">
      <div className="bg-white border-b border-gray-100 py-3 px-4 md:px-8">
        <div className="max-w-[1400px] mx-auto flex items-center gap-2 text-[11px] md:text-xs font-medium text-gray-500 uppercase tracking-widest overflow-x-auto whitespace-nowrap hide-scrollbar">
          <Link href="/" className="hover:text-[#0066cc] transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href={`/products?category=${product.category}`} className="hover:text-[#0066cc] transition-colors">{product.category}</Link>
          <ChevronRight size={12} />
          <span className="text-gray-900 truncate max-w-[150px] md:max-w-none">{product.name}</span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-6 md:py-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
          
          {/* Image */}
          <div className="w-full md:w-1/2 p-6 md:p-12 border-b md:border-b-0 md:border-r border-gray-100 flex items-center justify-center relative">
            <div className="w-full aspect-square relative flex items-center justify-center">
              <img src={product.image || 'https://via.placeholder.com/500'} alt={product.name} className="max-w-full max-h-full object-contain" />
            </div>
            {discount > 0 && (
              <div className="absolute top-6 left-6 bg-[#ea580c] text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-md">
                {discount}% OFF
              </div>
            )}
          </div>

          {/* Content */}
          <div className="w-full md:w-1/2 p-6 md:p-12">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-gray-500 text-sm md:text-base mb-6 font-medium tracking-wide uppercase">
              Category: <span className="text-[#0066cc]">{product.category}</span>
            </p>

            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-4xl font-extrabold text-[#ea580c]">₹{product.price}</span>
              {product.mrp && <span className="text-xl text-gray-400 font-bold line-through">₹{product.mrp}</span>}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
              <div className="flex items-center justify-between w-full sm:w-32 h-14 bg-gray-50 rounded-xl border border-gray-200 px-4">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="text-gray-400 hover:text-[#0066cc]"><Minus size={18} /></button>
                <span className="font-bold text-gray-900">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="text-gray-400 hover:text-[#0066cc]"><Plus size={18} /></button>
              </div>
              <button 
                onClick={handleAdd}
                disabled={isOutOfStock}
                className={`w-full h-14 rounded-xl flex items-center justify-center gap-2 font-bold text-lg shadow-sm ${
                  isOutOfStock ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-[#ea580c] text-white hover:bg-[#c2410c] hover:shadow-md'
                } transition-all`}
              >
                <ShoppingCart size={20} />
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6 gap-6">
              {['description', 'highlights'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 font-bold text-sm uppercase tracking-wider relative transition-colors ${
                    activeTab === tab ? 'text-[#0066cc]' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab}
                  {activeTab === tab && <span className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-[#0066cc]"></span>}
                </button>
              ))}
            </div>
            
            <div className="text-gray-600 text-[15px] leading-relaxed min-h-[100px]">
              {activeTab === 'description' && (
                <p>{product.description || 'No description available for this product.'}</p>
              )}
              {activeTab === 'highlights' && (
                <p>{product.highlights || 'Premium quality crackers.'}</p>
              )}
            </div>

            {/* Youtube Video Accordion */}
            {product.videoUrl && (
              <div className="mt-8">
                <h3 className="font-bold text-gray-900 mb-4">Product Video</h3>
                <div className="aspect-video w-full rounded-xl overflow-hidden border border-gray-200">
                  <iframe 
                    src={product.videoUrl.replace('watch?v=', 'embed/')} 
                    title="Product Video" 
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {related.map(p => (
                <Link key={p.id} href={`/products/${p.slug || p.id}`} className="bg-white rounded-xl border border-gray-100 p-3 hover:border-[#0066cc] hover:shadow-md transition-all group">
                  <div className="aspect-square mb-3 flex items-center justify-center p-2">
                    <img src={p.image} alt={p.name} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform" />
                  </div>
                  <h3 className="font-bold text-[13px] text-gray-900 mb-1 truncate group-hover:text-[#0066cc]">{p.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-[#ea580c] text-sm">₹{p.price}</span>
                    {p.mrp && <span className="text-[10px] text-gray-400 line-through">₹{p.mrp}</span>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
