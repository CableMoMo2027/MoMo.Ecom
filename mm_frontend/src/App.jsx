import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { api, userApi } from './api';
import Navigation from './components/Navigation';
import CardNav from './components/card_nav';
import HeroSection from './components/HeroSection';
import FlashSaleBanner from './components/FlashSaleBanner';
import HorizontalScrollSection from './components/HorizontalScrollSection';
import CartModal from './components/CartModal';
import QuickViewModal from './components/QuickViewModal';
import SearchModal from './components/SearchModal';
import AuthContainer from './components/AuthContainer';
import ProfileSetup from './components/ProfileSetup';
import ProfilePage from './components/ProfilePage';
import WishlistPage from './components/WishlistPage';
import WishlistModal from './components/WishlistModal';
import CheckoutPage from './components/CheckoutPage';
import CategoryPage from './components/CategoryPage';
import FloatingLines from './components/Floating_Lines';
import LoadingScreen from './components/LoadingScreen';

// Page Transition Wrapper Component
const PageTransition = ({ children, pageKey }) => {
  return (
    <div key={pageKey} className="page-enter-transition">
      {children}
    </div>
  );
};

// Route mapping: old page names -> URL paths
const PAGE_ROUTES = {
  home: '/',
  checkout: '/checkout',
  wishlist: '/wishlist',
  profile: '/profile',
  signin: '/signin',
  signup: '/signup',
  profileSetup: '/profile-setup',
  keyboards: '/category/keyboards',
  mice: '/category/mice',
  headsets: '/category/headsets',
  trending: '/category/trending',
};

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);

  // Products from backend API
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);

  // Backward-compatible navigate function (maps old page names to URL paths)
  const handleNavigate = (page) => {
    const path = PAGE_ROUTES[page] || '/';
    navigate(path);
  };

  // Fetch products from backend (runs in background during loading screen)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.get('/product');
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter products by category
  const trendingProducts = products.filter(p => p.category === 'trending');
  const keyboards = products.filter(p => p.category === 'keyboards');
  const mice = products.filter(p => p.category === 'mice');
  const headsets = products.filter(p => p.category === 'headsets');

  // Filter products by search term
  const filteredProducts = searchTerm.trim()
    ? products.filter(p =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : [];

  // Listen for auth state changes and load user's wishlist and cart
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      // Load user's wishlist and cart from backend when logged in
      if (currentUser) {
        try {
          const userData = await userApi.get(currentUser.uid);
          if (userData) {
            // Load wishlist
            if (userData.wishlist && userData.wishlist.length > 0) {
              const wishlistProducts = products.filter(p =>
                userData.wishlist.includes(p._id)
              );
              setWishlist(wishlistProducts);
            }
            // Load cart
            if (userData.cart && userData.cart.items && userData.cart.items.length > 0) {
              const cartProducts = userData.cart.items.map(cartItem => {
                const product = products.find(p => p._id === cartItem.productId);
                return product ? { ...product, quantity: cartItem.quantity } : null;
              }).filter(Boolean);
              setCartItems(cartProducts);
            }
          }
        } catch (error) {
          console.error('Failed to load user data:', error);
        }
      } else {
        // Clear wishlist and cart when logged out
        setWishlist([]);
        setCartItems([]);
      }
    });
    return () => unsubscribe();
  }, [products]); // Re-run when products are loaded

  // Sync cart to backend when cart changes (debounced)
  useEffect(() => {
    if (!user || cartItems.length === 0 && !user) return;

    const syncCart = async () => {
      try {
        const cartData = {
          items: cartItems.map(item => ({
            productId: item._id || item.id,
            quantity: item.quantity
          }))
        };
        await userApi.updateCart(user.uid, cartData);
      } catch (error) {
        console.error('Failed to sync cart:', error);
      }
    };

    // Debounce cart sync
    const timeoutId = setTimeout(syncCart, 1000);
    return () => clearTimeout(timeoutId);
  }, [cartItems, user]);

  // Scroll to top when search term changes
  useEffect(() => {
    if (searchTerm.trim()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [searchTerm]);

  // Keep a ref to the current user so useCallback-wrapped functions can access it
  const userRef = React.useRef(user);
  userRef.current = user;

  const addToCart = useCallback((product) => {
    const productId = product._id || product.id;
    setCartItems(prev => {
      const existing = prev.find(item => (item._id || item.id) === productId);
      if (existing) {
        return prev.map(item =>
          (item._id || item.id) === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => (item._id || item.id) !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    setCartItems(prev =>
      prev.map(item => ((item._id || item.id) === productId ? { ...item, quantity: newQuantity } : item))
    );
  };

  const toggleWishlist = useCallback(async (product) => {
    const productId = product._id || product.id;
    let wasInWishlist = false;

    setWishlist(prev => {
      const exists = prev.find(item => (item._id || item.id) === productId);
      wasInWishlist = !!exists;
      if (exists) {
        return prev.filter(item => (item._id || item.id) !== productId);
      }
      return [...prev, product];
    });

    // Sync with backend if user is logged in
    const currentUser = userRef.current;
    if (currentUser) {
      try {
        if (wasInWishlist) {
          await userApi.removeFromWishlist(currentUser.uid, productId);
        } else {
          await userApi.addToWishlist(currentUser.uid, productId);
        }
      } catch (error) {
        console.error('Failed to sync wishlist:', error);
        // Revert on error
        setWishlist(prev => {
          if (wasInWishlist) {
            return [...prev, product];
          }
          return prev.filter(item => (item._id || item.id) !== productId);
        });
      }
    }
  }, []);

  // Show loading screen (controlled by LoadingScreen component)
  if (showLoadingScreen) {
    return <LoadingScreen onComplete={() => setShowLoadingScreen(false)} />;
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
      setShowLogoutMessage(true);
      // Auto-hide after 3 seconds
      setTimeout(() => {
        setShowLogoutMessage(false);
      }, 3000);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Called when sign in succeeds (go straight to home)
  const handleSignInSuccess = (user) => {
    setUser(user);
    navigate('/');
  };

  // Called when sign up succeeds (go to profile setup if no photo)
  const handleSignUpSuccess = (user) => {
    setUser(user);
    // If user already has a photo (from social login), go home
    // Otherwise, go to profile setup
    if (user.photoURL) {
      navigate('/');
    } else {
      navigate('/profile-setup');
    }
  };

  // Called when profile setup is complete or skipped
  const handleProfileSetupComplete = (updatedUser) => {
    setUser(updatedUser);
    navigate('/');
  };

  const removeFromWishlist = async (product) => {
    const productId = product._id || product.id;

    // Update local state immediately
    setWishlist(prev => prev.filter(item => (item._id || item.id) !== productId));

    // Sync with backend if user is logged in
    if (user) {
      try {
        await userApi.removeFromWishlist(user.uid, productId);
      } catch (error) {
        console.error('Failed to remove from wishlist:', error);
        // Revert on error
        setWishlist(prev => [...prev, product]);
      }
    }
  };

  const handleOrderComplete = () => {
    setCartItems([]); // Clear cart
    navigate('/');
    // Could show success message here
  };


  // Handle product selection from autocomplete
  const handleSelectProduct = (product) => {
    setQuickViewProduct(product);
    setSearchTerm('');
  };

  // CardNav props for reuse in all pages
  const cardNavProps = {
    logo: "/src/assets/logo.png",
    logoAlt: "MoMo Pro",
    baseColor: "#141E30",
    menuColor: "#fff",
    searchTerm: searchTerm,
    onSearchChange: setSearchTerm,
    onNavigate: handleNavigate,
    onOpenCart: () => { setIsWishlistOpen(false); setIsCartOpen(true); },
    onOpenWishlist: () => { setIsCartOpen(false); setIsWishlistOpen(true); },
    wishlistCount: wishlist.length,
    cartCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    user: user,
    // Search autocomplete props
    products: products,
    onSelectProduct: handleSelectProduct,
    items: [
      {
        label: 'Categories',
        bgColor: '#3F5E96',
        textColor: '#fff',
        links: [
          { label: 'Keyboards', href: '#', ariaLabel: 'View Keyboards', onClick: () => handleNavigate('keyboards') },
          { label: 'Mice', href: '#', ariaLabel: 'View Mice', onClick: () => handleNavigate('mice') },
          { label: 'Headsets', href: '#', ariaLabel: 'View Headsets', onClick: () => handleNavigate('headsets') },
        ]
      },
      {
        label: 'Shop',
        bgColor: '#4A6BA8',
        textColor: '#fff',
        links: [
          { label: 'Trending', href: '#', ariaLabel: 'View Trending', onClick: () => handleNavigate('trending') },
          { label: 'New Arrivals', href: '#', ariaLabel: 'View New Arrivals' },
          { label: 'Best Sellers', href: '#', ariaLabel: 'View Best Sellers' },
        ]
      },
      {
        label: 'Support',
        bgColor: '#5C7BB5',
        textColor: '#fff',
        links: [
          { label: 'Contact Us', href: '#', ariaLabel: 'Contact Us' },
          { label: 'FAQ', href: '#', ariaLabel: 'View FAQ' },
          { label: 'Returns', href: '#', ariaLabel: 'View Returns' },
        ]
      }
    ]
  };

  // Category pages configuration
  const categoryConfig = {
    keyboards: { title: 'Gaming Keyboards', icon: '⌨️', products: keyboards },
    mice: { title: 'Gaming Mice', icon: '🖱️', products: mice },
    headsets: { title: 'Gaming Headsets', icon: '🎧', products: headsets },
  };

  // Shared modals (used on multiple pages)
  const sharedModals = (
    <>
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        removeFromCart={removeFromCart}
        updateQuantity={updateQuantity}
        onCheckout={() => handleNavigate('checkout')}
      />
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlist}
        products={products}
        onRemoveFromWishlist={removeFromWishlist}
        onAddToCart={addToCart}
      />
      <QuickViewModal
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        product={quickViewProduct}
        addToCart={addToCart}
        toggleWishlist={toggleWishlist}
        wishlist={wishlist}
      />
    </>
  );

  // Home page content (plain JSX, NOT a component — avoids unmount/remount on re-render)
  const homePageContent = (
    <>
      {showLogoutMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] animate-fade-in">
          <div className="bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <CheckCircle size={20} />
            <span className="font-medium">Logout Success</span>
          </div>
        </div>
      )}

      {/* Search Results */}
      {searchTerm.trim() ? (
        <div className="pt-32 px-6 pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                🔍 Search Results for "{searchTerm}"
                <span className="text-gray-400 text-lg ml-2">({filteredProducts.length} items)</span>
              </h2>
              <button
                onClick={() => setSearchTerm('')}
                className="text-gray-400 hover:text-white transition px-4 py-2 border border-gray-600 rounded-lg hover:border-red-500"
              >
                Clear Search
              </button>
            </div>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredProducts.map((product, index) => {
                  const productId = product._id || product.id;
                  const isInWishlist = wishlist.some(item => (item._id || item.id) === productId);
                  return (
                    <div
                      key={productId}
                      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700 hover:border-red-500/50 transition-all duration-300 group cursor-pointer animate-fade-in-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                      onClick={() => setQuickViewProduct(product)}
                    >
                      <div className="relative mb-3 overflow-hidden rounded-lg">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product);
                          }}
                          className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-sm transition ${isInWishlist ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-red-500'
                            }`}
                        >
                          ❤️
                        </button>
                      </div>
                      <h3 className="text-white font-medium truncate mb-1">{product.name}</h3>
                      <p className="text-gray-400 text-sm mb-2 capitalize">{product.category}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-white font-bold">฿{product.price?.toLocaleString()}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm transition"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-400 text-lg">No products found matching "{searchTerm}"</p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-4 text-red-500 hover:text-red-400 transition"
                >
                  Clear search and browse all products
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <HeroSection onNavigate={handleNavigate} />
          <HorizontalScrollSection
            title="🔥 Trending Now"
            products={trendingProducts}
            addToCart={addToCart}
            toggleWishlist={toggleWishlist}
            wishlist={wishlist}
            openQuickView={setQuickViewProduct}
          />
          <HorizontalScrollSection
            title="⌨️ Gaming Keyboards"
            products={keyboards}
            addToCart={addToCart}
            toggleWishlist={toggleWishlist}
            wishlist={wishlist}
            openQuickView={setQuickViewProduct}
          />
          <HorizontalScrollSection
            title="🖱️ Gaming Mice"
            products={mice}
            addToCart={addToCart}
            toggleWishlist={toggleWishlist}
            wishlist={wishlist}
            openQuickView={setQuickViewProduct}
          />
          <HorizontalScrollSection
            title="🎧 Gaming Headsets"
            products={headsets}
            addToCart={addToCart}
            toggleWishlist={toggleWishlist}
            wishlist={wishlist}
            openQuickView={setQuickViewProduct}
          />
        </>
      )}

      <footer className="bg-navy-dark text-white py-12 px-6 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-navy-light mb-4">MoMo Pro</h3>
              <p className="text-gray-400">Your ultimate destination for premium gaming gear</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button type="button" onClick={() => handleNavigate('keyboards')} className="hover:text-navy-accent transition">Keyboards</button></li>
                <li><button type="button" onClick={() => handleNavigate('mice')} className="hover:text-navy-accent transition">Mice</button></li>
                <li><button type="button" onClick={() => handleNavigate('headsets')} className="hover:text-navy-accent transition">Headsets</button></li>
                <li><button type="button" className="hover:text-navy-accent transition">Monitors</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button type="button" className="hover:text-navy-accent transition">Contact Us</button></li>
                <li><button type="button" className="hover:text-navy-accent transition">Shipping Info</button></li>
                <li><button type="button" className="hover:text-navy-accent transition">Returns</button></li>
                <li><button type="button" className="hover:text-navy-accent transition">FAQ</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <p className="text-gray-400 mb-4">Stay updated with the latest gear</p>
              <div className="flex gap-4">
                <button type="button" className="text-gray-400 hover:text-navy-accent transition">Facebook</button>
                <button type="button" className="text-gray-400 hover:text-navy-accent transition">Twitter</button>
                <button type="button" className="text-gray-400 hover:text-navy-accent transition">Instagram</button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MoMo Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );

  // Category page wrapper (plain JSX, NOT a component)
  const categoryPageContent = (() => {
    // Get category from URL using useParams would be ideal, but since we're inside App
    // we extract it from location
    const pathParts = location.pathname.split('/');
    const category = pathParts[pathParts.length - 1];
    const config = categoryConfig[category];

    if (!config) {
      return homePageContent;
    }

    return (
      <>
        <CategoryPage
          category={category}
          title={config.title}
          icon={config.icon}
          products={config.products}
          loading={loading}
          addToCart={addToCart}
          toggleWishlist={toggleWishlist}
          wishlist={wishlist}
          openQuickView={setQuickViewProduct}
          onNavigate={handleNavigate}
        />
      </>
    );
  })();

  // Auth page wrapper (plain JSX)
  const authPageContent = (() => {
    const currentPath = location.pathname;
    const initialPanel = currentPath === '/signup' ? 'signup' : 'signin';

    return (
      <div className="h-screen bg-gradient-navy relative overflow-hidden">
        <FloatingLines
          linesGradient={['#141E30', '#3F5E96', '#4A6BA8', '#5C7BB5']}
          enabledWaves={['top', 'middle', 'bottom']}
          lineCount={[8, 6, 4]}
          animationSpeed={0.8}
          interactive={true}
          parallax={true}
          parallaxStrength={0.15}
          mixBlendMode="normal"
        />
        <div className="relative z-10 h-full">
          <AuthContainer
            initialPanel={initialPanel}
            onNavigate={handleNavigate}
            onSignInSuccess={handleSignInSuccess}
            onSignUpSuccess={handleSignUpSuccess}
            noBackground={true}
          />
        </div>
      </div>
    );
  })();

  // Profile Setup page wrapper (plain JSX)
  const profileSetupPageContent = (
    <div className="h-screen bg-gradient-navy relative overflow-hidden">
      <FloatingLines
        linesGradient={['#141E30', '#3F5E96', '#4A6BA8', '#5C7BB5']}
        enabledWaves={['top', 'middle', 'bottom']}
        lineCount={[8, 6, 4]}
        animationSpeed={0.8}
        interactive={true}
        parallax={true}
        parallaxStrength={0.15}
        mixBlendMode="normal"
      />
      <div className="relative z-10 h-full">
        <ProfileSetup
          user={user}
          onComplete={handleProfileSetupComplete}
          onSkip={() => navigate('/')}
          noBackground={true}
        />
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-navy min-h-screen">
      <Routes>
        {/* Auth pages (no CardNav) */}
        <Route path="/signin" element={<PageTransition pageKey={location.pathname}>{authPageContent}</PageTransition>} />
        <Route path="/signup" element={<PageTransition pageKey={location.pathname}>{authPageContent}</PageTransition>} />
        <Route path="/profile-setup" element={<PageTransition pageKey={location.pathname}>{profileSetupPageContent}</PageTransition>} />

        {/* Pages with CardNav */}
        <Route path="*" element={
          <>
            <CardNav {...cardNavProps} />
            <PageTransition pageKey={`${location.pathname}${location.search}`}>
              <Routes>
                <Route index element={homePageContent} />
                <Route path="checkout/*" element={
                  <CheckoutPage
                    cartItems={cartItems}
                    user={user}
                    onNavigate={handleNavigate}
                    onOrderComplete={handleOrderComplete}
                    updateQuantity={updateQuantity}
                    removeFromCart={removeFromCart}
                  />
                } />
                <Route path="wishlist" element={
                  <WishlistPage
                    wishlist={wishlist.map(item => item._id || item.id)}
                    products={products}
                    onNavigate={handleNavigate}
                    onRemoveFromWishlist={removeFromWishlist}
                    onAddToCart={addToCart}
                  />
                } />
                <Route path="profile" element={
                  <ProfilePage user={user} onNavigate={handleNavigate} onSignOut={handleSignOut} />
                } />
                <Route path="category/:category" element={categoryPageContent} />
                <Route path="*" element={homePageContent} />
              </Routes>
            </PageTransition>
            {sharedModals}
          </>
        } />
      </Routes>
    </div>
  );
};

export default App;
