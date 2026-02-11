import { useCallback, useLayoutEffect, useMemo, useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ArrowUpRight, Search, Heart, ShoppingCart, User, X } from 'lucide-react';
import './CardNav.css';

const DEFAULT_HEIGHT = 260;

const CardNav = ({
    logo,
    items = [],
    className = 'sticky top-4 md:top-6 z-[99] flex justify-center px-4 md:px-6',
    ease = 'power3.out',
    baseColor = '#141E30',
    menuColor = '#fff',
    // Video background
    videoSrc,
    videoPoster,
    // Functionality props
    searchTerm = '',
    onSearchChange,
    onNavigate,
    onOpenCart,
    onOpenWishlist,
    wishlistCount = 0,
    cartCount = 0,
    user,
    // Search autocomplete props
    products = [],
    onSelectProduct,
}) => {
    const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showAutocomplete, setShowAutocomplete] = useState(false);
    const [showCartAnimation, setShowCartAnimation] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const prevCartCountRef = useRef(cartCount);
    const navRef = useRef(null);
    const cardsRef = useRef([]);
    const tlRef = useRef(null);
    const searchRef = useRef(null);
    const searchInputRef = useRef(null);

    // Detect cart count increase and trigger animation
    useEffect(() => {
        if (cartCount > prevCartCountRef.current) {
            setShowCartAnimation(true);
            const timer = setTimeout(() => setShowCartAnimation(false), 1200);
            prevCartCountRef.current = cartCount;
            return () => clearTimeout(timer);
        }
        prevCartCountRef.current = cartCount;
    }, [cartCount]);

    // Filter products for autocomplete
    const autocompleteResults = useMemo(() => {
        if (!searchTerm.trim() || !products.length) return [];
        return products
            .filter(p =>
                p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.category?.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .slice(0, 5); // Limit to 5 results
    }, [searchTerm, products]);

    const safeItems = useMemo(() => items.slice(0, 3), [items]);

    const calculateHeight = useCallback(() => {
        const navEl = navRef.current;
        if (!navEl) return DEFAULT_HEIGHT;

        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        if (isMobile) {
            const contentEl = navEl.querySelector('.card-nav-content');
            if (contentEl) {
                const prevVisibility = contentEl.style.visibility;
                const prevPointerEvents = contentEl.style.pointerEvents;
                const prevPosition = contentEl.style.position;
                const prevHeight = contentEl.style.height;

                contentEl.style.visibility = 'visible';
                contentEl.style.pointerEvents = 'auto';
                contentEl.style.position = 'static';
                contentEl.style.height = 'auto';

                const topBar = 60;
                const padding = 20;
                const contentHeight = contentEl.scrollHeight;

                contentEl.style.visibility = prevVisibility;
                contentEl.style.pointerEvents = prevPointerEvents;
                contentEl.style.position = prevPosition;
                contentEl.style.height = prevHeight;

                return topBar + contentHeight + padding;
            }
        }

        return DEFAULT_HEIGHT;
    }, []);

    const createTimeline = useCallback(() => {
        const navEl = navRef.current;
        if (!navEl) return null;

        gsap.set(navEl, { height: 60, overflow: 'visible' });
        gsap.set(cardsRef.current, { y: 40, opacity: 0 });

        const timeline = gsap.timeline({ paused: true });

        timeline.to(navEl, {
            height: calculateHeight,
            duration: 0.4,
            ease,
        });

        timeline.to(
            cardsRef.current,
            {
                y: 0,
                opacity: 1,
                duration: 0.4,
                ease,
                stagger: 0.08,
            },
            '-=0.1'
        );

        return timeline;
    }, [calculateHeight, ease]);

    useLayoutEffect(() => {
        const timeline = createTimeline();
        tlRef.current = timeline;

        return () => {
            timeline?.kill();
            tlRef.current = null;
        };
    }, [createTimeline]);

    useLayoutEffect(() => {
        const handleResize = () => {
            const timeline = tlRef.current;
            if (!timeline) return;

            if (isExpanded) {
                const newHeight = calculateHeight();
                gsap.set(navRef.current, { height: newHeight });
                timeline.kill();
                const newTimeline = createTimeline();
                if (newTimeline) {
                    newTimeline.progress(1);
                    tlRef.current = newTimeline;
                }
            } else {
                timeline.kill();
                const newTimeline = createTimeline();
                if (newTimeline) tlRef.current = newTimeline;
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [calculateHeight, createTimeline, isExpanded]);

    const closeMenu = useCallback(() => {
        const timeline = tlRef.current;
        if (!timeline || !isExpanded) return;

        setIsHamburgerOpen(false);
        timeline.eventCallback('onReverseComplete', () => setIsExpanded(false));
        timeline.reverse();
    }, [isExpanded]);

    const toggleMenu = useCallback(() => {
        const timeline = tlRef.current;
        if (!timeline) return;

        if (!isExpanded) {
            setIsHamburgerOpen(true);
            setIsExpanded(true);
            timeline.play(0);
        } else {
            closeMenu();
        }
    }, [closeMenu, isExpanded]);

    const handleLinkClick = useCallback((onClick) => {
        if (onClick) onClick();
        if (!isExpanded) return;
        if (window.matchMedia('(max-width: 768px)').matches) {
            closeMenu();
        }
    }, [closeMenu, isExpanded]);

    const setCardRef = useCallback((index) => (el) => {
        cardsRef.current[index] = el;
    }, []);

    return (
        <>
            <div className="card-nav-container fixed top-4 left-1/2 -translate-x-1/2 z-[1000] w-[75%] max-w-[1000px] px-4">
                <nav
                    ref={navRef}
                    className={`card-nav ${isExpanded ? 'open' : ''} block h-[60px] w-full p-0 rounded-2xl shadow-lg overflow-visible will-change-[height] transition-colors relative mx-auto`}
                    style={{ backgroundColor: baseColor }}
                >
                    {/* Video Background */}
                    {videoSrc && (
                        <div className="absolute inset-0 overflow-hidden rounded-2xl z-0">
                            <video
                                autoPlay
                                muted
                                loop
                                playsInline
                                poster={videoPoster}
                                className="w-full h-full object-cover"
                            >
                                <source src={videoSrc} type="video/mp4" />
                            </video>
                            <div className="absolute inset-0 bg-black/40"></div>
                        </div>
                    )}

                    {/* Top Bar */}
                    <div className="card-nav-top absolute inset-x-0 top-0 h-[60px] flex items-center px-4 md:px-6 z-[2]">
                        {/* Hamburger Menu */}
                        <button
                            type="button"
                            className={`hamburger-menu ${isHamburgerOpen ? 'open' : ''} group h-full flex flex-col items-center justify-center cursor-pointer gap-[6px]`}
                            onClick={toggleMenu}
                            aria-label={isExpanded ? 'ปิดเมนู' : 'เปิดเมนู'}
                            style={{ color: menuColor }}
                        >
                            <span
                                className={`hamburger-line w-[24px] h-[2px] bg-current transition-[transform,opacity] duration-300 ease-linear ${isHamburgerOpen ? 'translate-y-[4px] rotate-45' : ''
                                    } group-hover:opacity-75`}
                            />
                            <span
                                className={`hamburger-line w-[24px] h-[2px] bg-current transition-[transform,opacity] duration-300 ease-linear ${isHamburgerOpen ? '-translate-y-[4px] -rotate-45' : ''
                                    } group-hover:opacity-75`}
                            />
                        </button>

                        {/* Logo - Always Centered */}
                        <div
                            className="logo-container absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                            onClick={() => onNavigate && onNavigate('home')}
                        >
                            <span className="text-xl font-bold text-white inline-block transition-all duration-300 ease-out group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                                MoMo <span className="text-red-500 group-hover:text-red-400 transition-colors duration-300">Pro</span>
                            </span>
                        </div>

                        {/* Right Section - Search, Wishlist, Cart, Login */}
                        <div className="flex items-center gap-2 md:gap-3 ml-auto">
                            {/* Search Icon / Expandable Search */}
                            <div className="relative" ref={searchRef}>
                                <button
                                    onClick={() => {
                                        setIsSearchOpen(!isSearchOpen);
                                        if (!isSearchOpen) setTimeout(() => searchInputRef.current?.focus(), 100);
                                    }}
                                    className={`text-white hover:text-red-400 transition p-1 ${isSearchOpen ? 'opacity-0 pointer-events-none' : ''
                                        }`}
                                >
                                    <Search size={20} />
                                </button>

                                {/* Search Popover (no layout push, no overlap with logo) */}
                                {isSearchOpen && (
                                    <div className="absolute left-[-90px] top-1/2 -translate-y-1/2 -translate-x-4 z-[120] w-52 md:w-64 ...">
                                        <div className="relative">
                                            <div className="flex w-full items-center bg-white/10 backdrop-blur-md rounded-lg px-2 py-1.5 md:px-3 md:py-2 border border-white/10 animate-fade-in">
                                                <Search size={16} className="text-white/70 flex-shrink-0" />
                                                <input
                                                    ref={searchInputRef}
                                                    type="text"
                                                    placeholder="Search..."
                                                    value={searchTerm}
                                                    onChange={(e) => {
                                                        onSearchChange && onSearchChange(e.target.value);
                                                        setShowAutocomplete(true);
                                                    }}
                                                    onFocus={() => setShowAutocomplete(true)}
                                                    onBlur={() => {
                                                        setTimeout(() => {
                                                            setShowAutocomplete(false);
                                                            if (!searchTerm) setIsSearchOpen(false);
                                                        }, 200);
                                                    }}
                                                    className="bg-transparent text-white text-sm pl-2 w-full outline-none placeholder-white/50"

                                                />
                                                <button
                                                    onClick={() => {
                                                        onSearchChange && onSearchChange('');
                                                        setIsSearchOpen(false);
                                                    }}
                                                    className="text-white/50 hover:text-white ml-1"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>

                                            {showAutocomplete && autocompleteResults.length > 0 && (
                                                <div className="absolute left-0 top-full mt-2 w-full bg-[#1E2A3A] rounded-xl shadow-2xl border border-white/10 overflow-hidden z-[130]">
                                                    {autocompleteResults.map((product) => (
                                                        <div
                                                            key={product._id || product.id}
                                                            className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/10 cursor-pointer transition"
                                                            onClick={() => {
                                                                onSelectProduct && onSelectProduct(product);
                                                                setShowAutocomplete(false);
                                                                onSearchChange && onSearchChange('');
                                                                setIsSearchOpen(false);
                                                            }}
                                                        >
                                                            <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded-lg" />
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-white text-sm font-medium truncate">{product.name}</p>
                                                                <p className="text-gray-400 text-xs capitalize">{product.category}</p>
                                                            </div>
                                                            <span className="text-white font-bold text-sm">฿{product.price?.toLocaleString()}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Wishlist */}
                            <button
                                onClick={() => onOpenWishlist && onOpenWishlist()}
                                className="text-white hover:text-red-400 transition relative p-1"
                            >
                                <Heart size={20} />
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                        {wishlistCount}
                                    </span>
                                )}
                            </button>

                            {/* Cart */}
                            <button
                                onClick={onOpenCart}
                                className="text-white hover:text-red-400 transition relative p-1"
                            >
                                <ShoppingCart size={20} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                        {cartCount}
                                    </span>
                                )}
                            </button>

                            {/* Login/User */}
                            {user ? (
                                <button
                                    onClick={() => onNavigate && onNavigate('profile')}
                                    className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/30 hover:border-white/60 transition"
                                >
                                    {user.photoURL ? (
                                        <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-navy-light flex items-center justify-center">
                                            <User size={14} className="text-white" />
                                        </div>
                                    )}
                                </button>
                            ) : (
                                <div className="relative group">
                                    <button
                                        className="text-white hover:text-red-400 transition p-1"
                                    >
                                        <User size={20} />
                                    </button>
                                    {/* Dropdown Menu */}
                                    <div className="absolute right-0 top-full mt-2 w-40 bg-[#1E2A3A] rounded-lg shadow-xl border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                        <button
                                            onClick={() => onNavigate && onNavigate('signin')}
                                            className="w-full text-left px-4 py-3 text-white hover:bg-white/10 rounded-t-lg transition flex items-center gap-2"
                                        >
                                            <User size={16} />
                                            Sign In
                                        </button>
                                        <button
                                            onClick={() => onNavigate && onNavigate('signup')}
                                            className="w-full text-left px-4 py-3 text-white hover:bg-white/10 rounded-b-lg transition flex items-center gap-2"
                                        >
                                            <ArrowUpRight size={16} />
                                            Sign Up
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Expandable Content */}
                    <div
                        className={`card-nav-content absolute left-0 right-0 top-[60px] bottom-0 p-3 flex flex-col items-stretch gap-3 justify-start z-[1] ${isExpanded ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
                            } md:flex-row md:items-end md:gap-4`}
                        aria-hidden={!isExpanded}
                    >
                        {safeItems.map((item, index) => (
                            <div
                                key={`${item.label}-${index}`}
                                className="nav-card select-none relative flex flex-col gap-3 p-4 rounded-2xl min-w-0 flex-1 min-h-[60px] md:min-h-0"
                                ref={setCardRef(index)}
                                style={{ backgroundColor: item.bgColor, color: item.textColor }}
                            >
                                <div className="nav-card-label font-semibold tracking-tight text-lg md:text-xl">
                                    {item.label}
                                </div>
                                <div className="nav-card-links mt-auto flex flex-col gap-1 text-sm md:text-base">
                                    {item.links?.map((link, linkIndex) => (
                                        <a
                                            key={`${link.label}-${linkIndex}`}
                                            href={link.href ?? '#'}
                                            className="nav-card-link inline-flex items-center gap-2 no-underline cursor-pointer transition-opacity duration-300 hover:opacity-80"
                                            aria-label={link.ariaLabel ?? link.label}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleLinkClick(link.onClick);
                                            }}
                                        >
                                            <ArrowUpRight size={16} aria-hidden="true" />
                                            {link.label}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Close button for mobile */}
                        <div className="md:hidden flex items-center justify-end mt-1">
                            <button
                                type="button"
                                onClick={toggleMenu}
                                className="rounded-xl border border-white/40 bg-white/10 px-3 py-2 text-white backdrop-blur-md text-sm"
                            >
                                ปิดเมนู
                            </button>
                        </div>
                    </div>
                </nav>
            </div>
        </>
    );
};

export default CardNav;
