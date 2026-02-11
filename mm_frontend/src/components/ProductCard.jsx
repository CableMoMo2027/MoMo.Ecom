import React, { useState } from 'react';
import { ShoppingCart, Heart, Star } from 'lucide-react';

const ProductCard = ({ product, addToCart, toggleWishlist, wishlist, openQuickView }) => {
  const productId = product._id || product.id;
  const isInWishlist = wishlist.some(item => (item._id || item.id) === productId);
  const [showPlusOne, setShowPlusOne] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setShowPlusOne(true);
    setTimeout(() => setShowPlusOne(false), 800);
  };

  return (
    <div className="min-w-[280px] bg-gray-800 rounded-lg overflow-hidden hover:shadow-2xl hover:shadow-navy-light/20 transition-all duration-300 group">
      <div className="relative h-64 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {product.badge && (
          <span className="absolute top-4 left-4 bg-navy-light text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
            {product.badge}
          </span>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-4 right-4 p-2 rounded-full transition-all z-10 ${isInWishlist ? 'bg-red-600 text-white' : 'bg-black/50 text-white hover:bg-red-600'
            }`}
        >
          <Heart size={20} fill={isInWishlist ? "currentColor" : "none"} />
        </button>
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={() => openQuickView(product)}
            className="bg-white text-black px-6 py-2 rounded-lg font-semibold hover:bg-navy-light hover:text-white transition transform scale-90 group-hover:scale-100"
          >
            Quick View
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} className="text-yellow-500" fill={i < 4 ? "currentColor" : "none"} />
          ))}
          <span className="text-gray-400 text-sm ml-1">(4.0)</span>
        </div>
        <h3 className="text-white font-semibold text-lg mb-2">{product.name}</h3>
        <p className="text-gray-400 text-sm mb-3">{product.description}</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-white font-bold text-xl">฿{product.price?.toLocaleString()}</span>
            {product.oldPrice && (
              <span className="text-gray-500 line-through ml-2">฿{product.oldPrice?.toLocaleString()}</span>
            )}
          </div>
          <div className="relative">
            <button
              onClick={handleAddToCart}
              className="bg-gradient-to-r from-navy-dark to-navy-light hover:from-navy-light hover:to-navy-accent text-white px-4 py-2 rounded-lg transition transform hover:scale-105"
            >
              <ShoppingCart size={20} />
            </button>
            {/* +1 Animation */}
            {showPlusOne && (
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-white font-bold text-lg animate-bounce-up-center pointer-events-none drop-shadow-lg">
                +1
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;