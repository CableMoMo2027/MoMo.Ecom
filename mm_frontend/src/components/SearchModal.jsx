import React, { useState, useRef, useEffect } from 'react';
import { X, Search, ShoppingCart } from 'lucide-react';

const SearchModal = ({ isOpen, onClose, products, onAddToCart, onSelectProduct }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            setSearchTerm('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const filteredProducts = products.filter(p =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-start justify-center pt-20 p-4">
            <div className="bg-gradient-to-b from-navy-dark to-[#1E2A3A] rounded-xl max-w-2xl w-full max-h-[70vh] overflow-hidden animate-fade-in">
                {/* Header with Search Input */}
                <div className="p-6 border-b border-gray-800">
                    <div className="flex items-center gap-4">
                        <div className="flex-1 flex items-center bg-white/10 rounded-lg px-4 py-3 border border-white/20">
                            <Search size={20} className="text-white/70 flex-shrink-0" />
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-transparent text-white text-lg pl-3 w-full outline-none placeholder-white/50"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="text-white/50 hover:text-white"
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-white transition p-2">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Results */}
                <div className="p-6 overflow-y-auto max-h-96">
                    {searchTerm.length === 0 ? (
                        <div className="text-center py-8">
                            <Search size={48} className="mx-auto text-gray-600 mb-4" />
                            <p className="text-gray-400">Start typing to search products</p>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-400">No products found for "{searchTerm}"</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <p className="text-gray-400 text-sm mb-4">{filteredProducts.length} results</p>
                            {filteredProducts.slice(0, 10).map((product) => (
                                <div
                                    key={product._id || product.id}
                                    className="flex items-center gap-4 bg-gray-800/50 p-4 rounded-lg hover:bg-gray-800 transition cursor-pointer"
                                    onClick={() => {
                                        onSelectProduct && onSelectProduct(product);
                                        onClose();
                                    }}
                                >
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-16 h-16 object-cover rounded-lg"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-white font-semibold truncate">{product.name}</h3>
                                        <p className="text-gray-400 text-sm capitalize">{product.category}</p>
                                        <span className="text-white font-bold">฿{product.price?.toLocaleString()}</span>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onAddToCart(product);
                                        }}
                                        className="bg-gradient-to-r from-navy-dark to-navy-light hover:from-navy-light hover:to-navy-accent text-white p-3 rounded-lg transition"
                                    >
                                        <ShoppingCart size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchModal;
