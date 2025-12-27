import ProductCard from "./ProductCard";
import { Sparkles, Flame, Zap, BoomBox, Star } from "lucide-react";

const ProductSection = ({ title, products, onQuickView }) => {
  // Different title variant styles based on section title
  const getTitleVariant = (title) => {
    // Normalize string to lowercase for easier matching if needed
    const lowerTitle = title.toLowerCase();

    // Default config
    let variant = {
      icon: <Sparkles className="text-orange-500" size={28} />,
      gradient: "from-orange-500 to-amber-500",
      bgGradient: "from-orange-500/5 to-amber-500/5",
      borderColor: "border-orange-200",
      emoji: "✨",
    };

    if (lowerTitle.includes("1000") || lowerTitle.includes("wala")) {
      variant = {
        icon: <BoomBox className="text-purple-600" size={28} />,
        gradient: "from-purple-600 to-indigo-600",
        bgGradient: "from-purple-600/5 to-indigo-600/5",
        borderColor: "border-purple-200",
        emoji: "💥",
      }
    } else if (lowerTitle.includes("night") || lowerTitle.includes("sky")) {
      variant = {
        icon: <Star className="text-blue-600" size={28} />,
        gradient: "from-blue-600 to-cyan-600",
        bgGradient: "from-blue-600/5 to-cyan-600/5",
        borderColor: "border-blue-200",
        emoji: "🌌",
      }
    } else if (lowerTitle.includes("bomb") || lowerTitle.includes("sound")) {
      variant = {
        icon: <Flame className="text-red-600" size={28} />,
        gradient: "from-red-600 to-orange-600",
        bgGradient: "from-red-600/5 to-orange-600/5",
        borderColor: "border-red-200",
        emoji: "🧨",
      }
    }

    return variant;
  };

  const variant = getTitleVariant(title);

  return (
    <div className="mb-16 last:mb-0">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white shadow-sm border ${variant.borderColor}`}>
            {variant.icon}
          </div>
          <div>
            <h2 className={`text-2xl font-bold bg-gradient-to-r ${variant.gradient} bg-clip-text text-transparent`}>
              {title}
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              {products.length} Products
            </p>
          </div>
        </div>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {products.map((product) => (
          <div key={product.id} className="h-full">
            <ProductCard product={product} onQuickView={onQuickView} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSection;
