import React from 'react';
import { X, Heart, Star, Zap, TrendingUp, Package } from 'lucide-react';

const QuickViewModal = ({ isOpen, onClose, product, addToCart, toggleWishlist, wishlist }) => {
  if (!isOpen || !product) return null;

  const productId = product._id || product.id;
  const isInWishlist = wishlist.some(item => (item._id || item.id) === productId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-navy-dark to-[#1E2A3A] rounded-xl max-w-4xl w-full overflow-hidden">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Quick View</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 grid md:grid-cols-2 gap-6">
          <div className="relative">
            <img src={product.image} alt={product.name} className="w-full h-96 object-cover rounded-lg" />
            {product.badge && (
              <span className="absolute top-4 right-4 bg-navy-light text-white px-3 py-1 rounded-full text-sm font-semibold">
                {product.badge}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-3xl font-bold text-white mb-2">{product.name}</h3>
            <p className="text-gray-400 mb-4">{product.description}</p>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} fill={i < 4 ? "currentColor" : "none"} />
                ))}
              </div>
              <span className="text-gray-400">(128 reviews)</span>
            </div>
            <div className="text-4xl font-bold text-white mb-6">฿{product.price?.toLocaleString()}</div>
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2 text-gray-300">
                <Zap size={20} className="text-yellow-500" />
                <span>Fast & Free Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Package size={20} className="text-green-500" />
                <span>In Stock - Ships Today</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <TrendingUp size={20} className="text-blue-500" />
                <span>30-Day Money Back Guarantee</span>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  addToCart(product);
                  onClose();
                }}
                className="flex-1 bg-gradient-to-r from-navy-dark to-navy-light hover:from-navy-light hover:to-navy-accent text-white py-3 rounded-lg font-semibold transition"
              >
                Add to Cart
              </button>
              <button
                onClick={() => toggleWishlist(product)}
                className={`px-6 py-3 rounded-lg font-semibold transition ${isInWishlist
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-white hover:bg-red-600'
                  }`}
              >
                <Heart size={24} fill={isInWishlist ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;