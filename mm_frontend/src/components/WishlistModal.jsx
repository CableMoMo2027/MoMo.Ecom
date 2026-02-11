import React, { useState } from 'react';
import { X, Heart, ShoppingCart, Trash2 } from 'lucide-react';

const WishlistModal = ({ isOpen, onClose, wishlistItems, products, onRemoveFromWishlist, onAddToCart }) => {
    const [animatingId, setAnimatingId] = useState(null);

    if (!isOpen) return null;

    // Get wishlist products from products array
    // wishlistItems can be array of IDs or array of product objects
    const wishlistIds = wishlistItems.map(item =>
        typeof item === 'object' ? (item._id || item.id) : item
    );

    const wishlistProducts = products.filter(product => {
        const productId = product._id || product.id;
        return wishlistIds.includes(productId);
    });

    const handleAddToCart = (product) => {
        const productId = product._id || product.id;
        onAddToCart(product);
        setAnimatingId(productId);
        setTimeout(() => setAnimatingId(null), 800);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-b from-navy-dark to-[#1E2A3A] rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Heart size={24} className="text-red-500" />
                        My Wishlist ({wishlistProducts.length})
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-96">
                    {wishlistProducts.length === 0 ? (
                        <div className="text-center py-12">
                            <Heart size={64} className="mx-auto text-gray-600 mb-4" />
                            <p className="text-gray-400 text-lg">Your wishlist is empty</p>
                            <p className="text-gray-500 text-sm mt-2">Add products by clicking the heart icon</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {wishlistProducts.map((product) => {
                                const productId = product._id || product.id;
                                return (
                                    <div key={productId} className="flex gap-4 bg-gray-800 p-4 rounded-lg border-2 border-white/80 shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-24 h-24 object-contain rounded bg-gray-900 p-2"
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-white font-semibold line-clamp-2">{product.name}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-white font-bold">฿{product.price?.toLocaleString()}</span>
                                                {product.oldPrice && (
                                                    <span className="text-gray-500 text-sm line-through">
                                                        ฿{product.oldPrice?.toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                            {/* Add to Cart Button with +1 Animation */}
                                            <div className="relative inline-block">
                                                <button
                                                    onClick={() => handleAddToCart(product)}
                                                    className="mt-3 bg-gradient-to-r from-navy-dark to-navy-light hover:from-navy-light hover:to-navy-accent text-white px-4 py-2 rounded-lg font-medium text-sm transition flex items-center gap-2"
                                                >
                                                    <ShoppingCart size={16} />
                                                    Add to Cart
                                                </button>
                                                {animatingId === productId && (
                                                    <span className="absolute -top-2 -right-4 text-white font-bold text-lg animate-bounce-up pointer-events-none drop-shadow-lg">
                                                        +1
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => onRemoveFromWishlist(product)}
                                            className="text-gray-400 hover:text-red-500 transition self-start"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {wishlistProducts.length > 0 && (
                    <div className="p-6 border-t border-gray-800">
                        <button
                            onClick={onClose}
                            className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition"
                        >
                            Continue Shopping
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishlistModal;
