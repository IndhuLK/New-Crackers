import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Navigation-ku mukkiyam
import { db } from "../../firebaseConfig";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

import "swiper/css";
import "swiper/css/pagination";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const qCat = query(collection(db, "categories"), orderBy("createdAt", "desc"));
    const unsubCat = onSnapshot(qCat, (snapshot) => {
      setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qProd = collection(db, "products");
    const unsubProd = onSnapshot(qProd, (snapshot) => {
      setProducts(snapshot.docs.map(doc => doc.data()));
      setLoading(false);
    });

    return () => { unsubCat(); unsubProd(); };
  }, []);

  const getProductCount = (categoryName) => {
    const count = products.filter(p => p.category === categoryName).length;
    return `${count} ${count === 1 ? "Style" : "Styles"}`;
  };

  // Category card click panna intha function run aagum
  const handleCategoryClick = (categoryName) => {
    // Unga route /products nu sonnathala inga mathiruken
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <section className="py-16 bg-white font-body relative">
      <div className="container-custom mx-auto px-6 relative z-10">
        
        <div className="flex flex-col items-center text-center mb-12">
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles className="text-orange-500 w-3 h-3" />
            <span className="text-[10px] font-bold tracking-[0.25em] text-slate-400 uppercase">Collections</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-2 font-heading">Shop by Category</h2>
          <div className="w-12 h-0.5 bg-orange-500 rounded-full opacity-50"></div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20"><Loader2 className="w-8 h-8 text-orange-500 animate-spin" /></div>
        ) : (
          isMobile ? (
            <Swiper
              modules={[Autoplay, Pagination]}
              autoplay={{ delay: 3000 }}
              loop={categories.length > 2}
              spaceBetween={16}
              slidesPerView={1.5}
              centeredSlides={true}
              pagination={{ clickable: true }}
              className="pb-12"
            >
              {categories.map((cat) => (
                <SwiperSlide key={cat.id}>
                  <CategoryCard cat={cat} countText={getProductCount(cat.name)} onClick={() => handleCategoryClick(cat.name)} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-6 gap-6 justify-items-center">
              {categories.map((cat) => (
                <CategoryCard key={cat.id} cat={cat} countText={getProductCount(cat.name)} onClick={() => handleCategoryClick(cat.name)} />
              ))}
            </div>
          )
        )}
      </div>
    </section>
  );
}

const CategoryCard = ({ cat, countText, onClick }) => (
  <div onClick={onClick} className="group cursor-pointer flex flex-col items-center text-center w-full max-w-[180px]">
    <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mb-5 bg-slate-50 border-[3px] border-slate-100 transition-all group-hover:border-orange-400 group-hover:-translate-y-2">
      <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
    </div>
    <h3 className="text-base md:text-lg font-bold text-slate-800 group-hover:text-orange-600 transition-colors">{cat.name}</h3>
    <p className="text-[10px] md:text-[11px] font-medium text-slate-400 uppercase tracking-wide bg-slate-50 px-2.5 py-1 rounded-full border group-hover:border-orange-200">
      {countText}
    </p>
  </div>
);