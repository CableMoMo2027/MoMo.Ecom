import React from 'react';
import { Heart, ArrowLeft, ShoppingCart, Trash2, X } from 'lucide-react';
import BlurText from './Blur_Text';

const WishlistPage = ({ wishlist, products, onNavigate, onRemoveFromWishlist, onAddToCart }) => {
    // Get wishlist products from products array
    const wishlistProducts = products.filter(product =>
        wishlist.includes(product._id || product.id)
    );

    return (
        <div className="min-h-screen bg-gradient-navy pt-28 pb-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <button
                        onClick={() => onNavigate('home')}
                        className="text-gray-400 hover:text-white transition"
                    >
                        <ArrowLeft size={22} />
                    </button>
                    <BlurText
                        text="My Wishlist"
                        delay={100}
                        animateBy="letters"
                        direction="top"
                        className="text-2xl font-bold text-white"
                    />
                    <span className="bg-navy-light text-white text-sm px-2 py-0.5 rounded-full">
                        {wishlistProducts.length}
                    </span>
                </div>

                {/* Empty State */}
                {wishlistProducts.length === 0 ? (
                    <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-12 border border-gray-700 text-center">
                        <Heart size={64} className="mx-auto text-gray-600 mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">Your wishlist is empty</h3>
                        <p className="text-gray-400 mb-6">Add products to your wishlist by clicking the heart icon</p>
                        <button
                            onClick={() => onNavigate('home')}
                            className="bg-gradient-to-r from-navy-dark to-navy-light hover:from-navy-light hover:to-navy-accent text-white px-6 py-2 rounded-lg font-medium transition"
                        >
                            Browse Products
                        </button>
                    </div>
                ) : (
                    /* Wishlist Grid */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {wishlistProducts.map(product => (
                            <div
                                key={product._id || product.id}
                                className="bg-gray-800/50 backdrop-blur-md rounded-xl border-2 border-white/80 overflow-hidden group hover:border-white transition shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                            >
                                {/* Product Image */}
                                <div className="relative aspect-square bg-gray-900/50 p-4">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                                    />
                                    {/* Remove Button */}
                                    <button
                                        onClick={() => onRemoveFromWishlist(product)}
                                        className="absolute top-2 right-2 w-8 h-8 bg-navy-light hover:bg-navy-accent rounded-full flex items-center justify-center transition"
                                    >
                                        <X size={16} className="text-white" />
                                    </button>
                                    {/* Badge */}
                                    {product.badge && (
                                        <span className="absolute top-2 left-2 bg-navy-light text-white text-xs px-2 py-1 rounded">
                                            {product.badge}
                                        </span>
                                    )}
                                </div>

                                {/* Product Info */}
                                <div className="p-4">
                                    <h3 className="text-white font-medium text-sm mb-1 line-clamp-2">
                                        {product.name}
                                    </h3>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-white font-bold">
                                            ฿{product.price?.toLocaleString()}
                                        </span>
                                        {product.oldPrice && (
                                            <span className="text-gray-500 text-sm line-through">
                                                ฿{product.oldPrice?.toLocaleString()}
                                            </span>
                                        )}
                                    </div>

                                    {/* Add to Cart Button */}
                                    <button
                                        onClick={() => onAddToCart(product)}
                                        className="w-full bg-gradient-to-r from-navy-dark to-navy-light hover:from-navy-light hover:to-navy-accent text-white py-2 rounded-lg font-medium text-sm transition flex items-center justify-center gap-2"
                                    >
                                        <ShoppingCart size={16} />
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishlistPage;
