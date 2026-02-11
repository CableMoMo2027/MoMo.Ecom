import React, { useState } from 'react';
import { ArrowLeft, Grid3X3, LayoutGrid, SlidersHorizontal } from 'lucide-react';
import ProductCard from './ProductCard';

const CategoryPage = ({
    category,
    title,
    icon,
    products,
    loading,
    addToCart,
    toggleWishlist,
    wishlist,
    openQuickView,
    onNavigate
}) => {
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [sortBy, setSortBy] = useState('default');
    const [priceRange, setPriceRange] = useState('all');

    // Sort products
    const sortedProducts = [...(products || [])].sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'name':
                return a.name.localeCompare(b.name);
            default:
                return 0;
        }
    });

    // Filter by price range
    const filteredProducts = sortedProducts.filter(product => {
        switch (priceRange) {
            case 'under3000':
                return product.price < 3000;
            case '3000-5000':
                return product.price >= 3000 && product.price <= 5000;
            case '5000-8000':
                return product.price >= 5000 && product.price <= 8000;
            case 'over8000':
                return product.price > 8000;
            default:
                return true;
        }
    });

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-navy pt-24 pb-12 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-navy-light border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-navy pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => onNavigate('home')}
                            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                                <span className="text-4xl">{icon}</span>
                                {title}
                            </h1>
                            <p className="text-gray-400 mt-1">
                                {filteredProducts.length} products available
                            </p>
                        </div>
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition ${viewMode === 'grid'
                                ? 'bg-navy-light text-white'
                                : 'bg-gray-800 text-gray-400 hover:text-white'
                                }`}
                        >
                            <Grid3X3 size={20} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition ${viewMode === 'list'
                                ? 'bg-navy-light text-white'
                                : 'bg-gray-800 text-gray-400 hover:text-white'
                                }`}
                        >
                            <LayoutGrid size={20} />
                        </button>
                    </div>
                </div>

                {/* Filters Bar */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 mb-8 flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 text-gray-400">
                        <SlidersHorizontal size={18} />
                        <span className="font-medium">Filters:</span>
                    </div>

                    {/* Sort By */}
                    <div className="flex items-center gap-2">
                        <label className="text-gray-400 text-sm">Sort:</label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-gray-700 text-white rounded-lg px-3 py-2 text-sm border border-gray-600 focus:border-navy-light focus:outline-none"
                        >
                            <option value="default">Default</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="name">Name: A-Z</option>
                        </select>
                    </div>

                    {/* Price Range */}
                    <div className="flex items-center gap-2">
                        <label className="text-gray-400 text-sm">Price:</label>
                        <select
                            value={priceRange}
                            onChange={(e) => setPriceRange(e.target.value)}
                            className="bg-gray-700 text-white rounded-lg px-3 py-2 text-sm border border-gray-600 focus:border-navy-light focus:outline-none"
                        >
                            <option value="all">All Prices</option>
                            <option value="under3000">Under ฿3,000</option>
                            <option value="3000-5000">฿3,000 - ฿5,000</option>
                            <option value="5000-8000">฿5,000 - ฿8,000</option>
                            <option value="over8000">Over ฿8,000</option>
                        </select>
                    </div>

                    {/* Clear Filters */}
                    {(sortBy !== 'default' || priceRange !== 'all') && (
                        <button
                            onClick={() => {
                                setSortBy('default');
                                setPriceRange('all');
                            }}
                            className="text-navy-light hover:text-navy-accent text-sm font-medium transition"
                        >
                            Clear All
                        </button>
                    )}
                </div>

                {/* Products Grid */}
                {filteredProducts.length > 0 ? (
                    <div
                        className={`grid gap-6 ${viewMode === 'grid'
                            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                            : 'grid-cols-1 lg:grid-cols-2'
                            }`}
                    >
                        {filteredProducts.map((product) => (
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
                ) : (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">😢</div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                            No products found
                        </h3>
                        <p className="text-gray-400">
                            Try adjusting your filters to find what you're looking for.
                        </p>
                        <button
                            onClick={() => {
                                setSortBy('default');
                                setPriceRange('all');
                            }}
                            className="mt-4 px-6 py-2 bg-gradient-to-r from-navy-dark to-navy-light hover:from-navy-light hover:to-navy-accent text-white rounded-lg font-medium transition"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryPage;
