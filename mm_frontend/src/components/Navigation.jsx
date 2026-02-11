import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, Search, User, Heart, X, LogOut } from 'lucide-react';
import BlurText from './Blur_Text';
import { userApi } from '../api';

const Navigation = ({ cartCount, wishlistCount, openCart, searchTerm, setSearchTerm, user, onNavigate, onSignOut }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [mongoUser, setMongoUser] = useState(null);

  // Fetch user data from MongoDB to get photoURL
  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        try {
          const userData = await userApi.get(user.uid);
          setMongoUser(userData);
        } catch (err) {
          console.error('Failed to fetch user data:', err);
        }
      } else {
        setMongoUser(null);
      }
    };
    fetchUserData();
  }, [user]);

  // Get photo from MongoDB first, fallback to Firebase
  const userPhotoURL = mongoUser?.photoURL || user?.photoURL;

  return (
    <nav className="fixed top-0 w-full bg-gradient-to-r from-[#141E30] to-[#243B55] backdrop-blur-md z-50 border-b border-navy-light/30">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div
              onClick={() => onNavigate('home')}
              className="cursor-pointer group"
            >
              <BlurText
                text="MoMo Pro"
                delay={100}
                animateBy="letters"
                direction="top"
                className="text-2xl font-bold text-navy-light cursor-pointer transition-all duration-300 ease-out group-hover:text-navy-accent group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(100,180,255,0.6)] inline-block"
              />
            </div>
            <div className="hidden md:flex items-center gap-2">
              <button onClick={() => onNavigate('keyboards')} className="text-white hover:text-navy-accent hover:bg-white/10 transition font-medium px-4 py-2 rounded-lg text-base">Keyboards</button>
              <button onClick={() => onNavigate('mice')} className="text-white hover:text-navy-accent hover:bg-white/10 transition font-medium px-4 py-2 rounded-lg text-base">Mice</button>
              <button onClick={() => onNavigate('headsets')} className="text-white hover:text-navy-accent hover:bg-white/10 transition font-medium px-4 py-2 rounded-lg text-base">Headsets</button>
              <button onClick={() => onNavigate('home')} className="text-white hover:text-navy-accent hover:bg-white/10 transition font-medium px-4 py-2 rounded-lg text-base">Deals 🔥</button>
            </div>
          </div>
          <div className="flex items-center gap-5">
            {isSearchOpen ? (
              <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-4 py-2">
                <Search size={20} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search gaming gear..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent text-white outline-none w-64"
                  autoFocus
                />
                <button onClick={() => setIsSearchOpen(false)}>
                  <X size={20} className="text-gray-400 hover:text-white" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-white hover:text-navy-accent transition"
              >
                <Search size={24} />
              </button>
            )}
            {/* User Button with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="text-white hover:text-navy-accent transition flex items-center gap-2"
              >
                {user ? (
                  userPhotoURL ? (
                    <img
                      src={userPhotoURL}
                      alt={user.displayName || 'User'}
                      className="w-8 h-8 rounded-full object-cover border-2 border-navy-light"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-navy-light rounded-full flex items-center justify-center text-sm font-bold">
                      {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </div>
                  )
                ) : (
                  <User size={24} />
                )}
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-12 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-2 w-56 z-50">
                  {user ? (
                    <>
                      {/* Logged In User */}
                      <div className="px-4 py-3 border-b border-gray-700">
                        <div className="flex items-center gap-3">
                          {userPhotoURL ? (
                            <img
                              src={userPhotoURL}
                              alt={user.displayName || 'User'}
                              className="w-10 h-10 rounded-full object-cover border-2 border-navy-light"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-navy-light rounded-full flex items-center justify-center text-lg font-bold">
                              {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate">{user.displayName || 'User'}</p>
                            <p className="text-gray-400 text-sm truncate">{user.email}</p>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          onNavigate('profile');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-gray-300 hover:bg-navy-dark hover:text-navy-accent transition flex items-center gap-2"
                      >
                        <User size={18} />
                        My Profile
                      </button>
                      <button
                        onClick={() => {
                          onSignOut();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-gray-300 hover:bg-navy-dark hover:text-navy-accent transition flex items-center gap-2"
                      >
                        <LogOut size={18} />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Guest User */}
                      <div className="px-4 py-3 border-b border-gray-700">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                            <User size={20} className="text-gray-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium">Guest</p>
                            <p className="text-gray-400 text-xs">Not signed in</p>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 py-3">
                        <p className="text-gray-400 text-sm mb-3">Sign in to access your account and orders</p>
                        <button
                          onClick={() => {
                            onNavigate('signin');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full bg-gradient-to-r from-navy-dark to-navy-light hover:from-navy-light hover:to-navy-accent text-white py-2 rounded-lg font-medium transition transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                          Sign In
                        </button>
                        <button
                          onClick={() => {
                            onNavigate('signup');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full mt-2 border border-gray-600 hover:border-navy-light text-gray-300 hover:text-white py-2 rounded-lg font-medium transition"
                        >
                          Create Account
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={() => onNavigate('wishlist')}
              className="text-white hover:text-navy-accent transition relative"
            >
              <Heart size={24} />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </button>
            <button
              onClick={openCart}
              className="text-white hover:text-navy-accent transition relative"
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
            <button className="md:hidden text-white hover:text-navy-accent transition">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
    </nav >
  );
};

export default Navigation;