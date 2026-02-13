import React, { useRef, memo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';

const HorizontalScrollSection = ({ title, products, addToCart, toggleWishlist, wishlist, openQuickView }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white">{title}</h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="bg-gray-800 hover:bg-red-600 text-white p-2 rounded-lg transition"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="bg-gray-800 hover:bg-red-600 text-white p-2 rounded-lg transition"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <ProductCard
              key={product._id || product.id}
              product={product}
              addToCart={addToCart}
              toggleWishlist={toggleWishlist}
              wishlist={wishlist}
              openQuickView={openQuickView}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(HorizontalScrollSection);