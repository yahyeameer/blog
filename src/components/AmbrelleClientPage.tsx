"use client";

import React, { useState, useMemo } from "react";
import { signout } from "@/app/login/actions";
import { FragranceModal } from "./FragranceModal";
import Link from "next/link";
import Image from "next/image";
import { Post, User } from "@/types";

import { createClient } from "@/lib/supabase-client";
import { Menu, Search, Heart, ShoppingBag, X, ChevronRight, ChevronUp } from "lucide-react";

export function AmbrelleClientPage({
    postContent,
    posts,
}: {
    postContent?: string;
    posts?: Post[];
}) {
    const [user, setUser] = useState<User | null>(null);
    const supabase = createClient();
    
    React.useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user || null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        return () => subscription.unsubscribe();
    }, [supabase.auth]);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Extract unique categories (topics)
    const categories = useMemo(() => {
        const cats = new Set((posts || []).map(p => p.topic).filter(Boolean));
        return ["All", ...Array.from(cats)];
    }, [posts]);

    const [activeCategory, setActiveCategory] = useState("All");

    // Local Storage Wishlist state
    const [wishlist, setWishlist] = useState<string[]>([]);
    const [hasLoadedWishlist, setHasLoadedWishlist] = useState(false);

    // Filter products based on search query AND active category
    const filteredPosts = useMemo(() => {
        let p = posts || [];
        if (activeCategory !== "All") {
            p = p.filter(x => x.topic === activeCategory);
        }
        if (!searchQuery.trim()) return p;
        const q = searchQuery.toLowerCase();
        return p.filter(
            x => x.title.toLowerCase().includes(q) ||
                 x.topic?.toLowerCase().includes(q) ||
                 x.content?.toLowerCase().includes(q)
        );
    }, [posts, searchQuery, activeCategory]);

    // Load wishlist from local storage on mount
    React.useEffect(() => {
        try {
            const stored = localStorage.getItem("ambrelle_wishlist");
            if (stored) setWishlist(JSON.parse(stored));
        } catch (e) {
            console.error("Failed to load wishlist", e);
        }
        setHasLoadedWishlist(true);
    }, []);

    // Save wishlist to local storage when changed
    React.useEffect(() => {
        if (!hasLoadedWishlist) return;
        try {
            localStorage.setItem("ambrelle_wishlist", JSON.stringify(wishlist));
        } catch (e) {
            console.error("Failed to save wishlist", e);
        }
    }, [wishlist, hasLoadedWishlist]);

    const toggleWishlist = (e: React.MouseEvent, postId: string) => {
        e.stopPropagation();
        setWishlist(prev => 
            prev.includes(postId) 
                ? prev.filter(id => id !== postId) 
                : [...prev, postId]
        );
    };

    // Scroll to collections section
    const scrollToCollections = () => {
        document.getElementById("collections")?.scrollIntoView({ behavior: "smooth" });
    };

    // Check if post is considered "New" (created within last 7 days)
    const isNewArrival = (createdAtStr: string) => {
        const createdAt = new Date(createdAtStr);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return createdAt >= sevenDaysAgo;
    };

    // Smooth scroll to top
    const [showTopButton, setShowTopButton] = useState(false);
    React.useEffect(() => {
        const handleScroll = () => setShowTopButton(window.scrollY > 400);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    return (
        <div className="bg-white text-black font-['Inter'] selection:bg-black selection:text-white min-h-screen">
            {/* Top Black Banner */}
            <div className="w-full bg-[#1c1c1c] text-white text-center py-3 text-[13px] md:text-[14px] font-medium tracking-wide">
                Welcome to AMBRELLE
            </div>

            {/* Header Area */}
            <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-40">
                <div className="flex justify-between items-center px-4 py-4 md:py-5 max-w-7xl mx-auto">
                    
                    {/* Left: Menu & Desktop Navigation */}
                    <div className="flex-1 flex justify-start items-center gap-6">
                        <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-black hover:opacity-60 transition-opacity" aria-label="Menu">
                            <Menu size={24} strokeWidth={1.25} />
                        </button>
                        
                        {/* Desktop Links */}
                        <div className="hidden md:flex gap-6 uppercase text-xs tracking-widest text-black">
                            <button onClick={scrollToCollections} className="hover:opacity-60 transition-opacity">Shop</button>
                            <button onClick={scrollToCollections} className="hover:opacity-60 transition-opacity">Collections</button>
                        </div>
                    </div>

                    {/* Center: Logo */}
                    <div className="flex-2 flex justify-center text-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                        <h1 className="text-xl md:text-3xl font-light tracking-[0.3em] text-black uppercase font-['Playfair_Display']">
                            AMBRELLE
                        </h1>
                    </div>
                    
                    {/* Right: Icons and Auth */}
                    <div className="flex-1 flex justify-end items-center gap-1 md:gap-4">
                        <div className="hidden md:flex gap-4 uppercase text-xs tracking-widest text-[#555]">
                            {user ? (
                                <>
                                    <Link href="/admin" className="hover:text-black transition-colors">Admin</Link>
                                    <button onClick={() => signout()} className="hover:text-black transition-colors">Sign Out</button>
                                </>
                            ) : (
                                <Link href="/login" className="hover:text-black transition-colors">Sign In</Link>
                            )}
                        </div>
                        {/* Search Button */}
                        <button onClick={() => setSearchOpen(true)} aria-label="Search" className="p-2 hover:opacity-60 transition-opacity">
                            <Search size={22} strokeWidth={1.25} />
                        </button>
                        {/* Wishlist Button */}
                        <button onClick={scrollToCollections} aria-label="Wishlist" className="p-2 hover:opacity-60 transition-opacity relative">
                            <Heart size={22} strokeWidth={1.25} />
                            {wishlist.length > 0 && (
                                <span className="absolute top-1 right-0 bg-black text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                    {wishlist.length}
                                </span>
                            )}
                        </button>
                        {/* Cart Button */}
                        <button onClick={scrollToCollections} aria-label="Cart" className="p-2 hover:opacity-60 transition-opacity">
                            <ShoppingBag size={22} strokeWidth={1.25} />
                        </button>
                    </div>
                </div>
            </header>

            {/* ─── Search Overlay ─── */}
            {searchOpen && (
                <div className="fixed inset-0 z-[100] bg-white flex flex-col">
                    {/* Search Header */}
                    <div className="flex items-center gap-4 px-4 md:px-8 py-4 border-b border-gray-100 max-w-4xl mx-auto w-full">
                        <Search size={20} strokeWidth={1.25} color="#999" className="flex-shrink-0" />
                        <input
                            type="text"
                            autoFocus
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search fragrances..."
                            className="flex-1 text-lg bg-transparent outline-none placeholder:text-gray-300"
                        />
                        <button onClick={() => { setSearchOpen(false); setSearchQuery(""); }} className="p-2 hover:opacity-60 transition-opacity">
                            <X size={20} strokeWidth={1.25} />
                        </button>
                    </div>

                    {/* Search Results */}
                    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 max-w-4xl mx-auto w-full">
                        {searchQuery.trim() ? (
                            <>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-6">
                                    {filteredPosts.length} result{filteredPosts.length !== 1 ? 's' : ''} for &ldquo;{searchQuery}&rdquo;
                                </p>
                                {filteredPosts.length > 0 ? (
                                    <div className="space-y-3">
                                        {filteredPosts.map(post => (
                                            <button
                                                key={post.id}
                                                onClick={() => { setSearchOpen(false); setSearchQuery(""); setSelectedPost(post); }}
                                                className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                                            >
                                                <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden relative flex-shrink-0">
                                                    {post.image_url && (
                                                        <Image src={post.image_url} alt={post.title} fill sizes="56px" className="object-cover" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm truncate">{post.title}</p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        {post.topic && <span className="text-xs text-gray-500">{post.topic}</span>}
                                                        {post.price && (
                                                            <div className="flex items-center gap-2">
                                                                {post.compare_at_price && (
                                                                    <span className="text-[10px] text-gray-500 line-through">${Number(post.compare_at_price).toFixed(2)}</span>
                                                                )}
                                                                <span className="text-xs font-medium text-red-600">${Number(post.price).toFixed(2)}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <ChevronRight size={16} strokeWidth={1.25} color="#999" className="flex-shrink-0" />
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-16">
                                        <p className="text-gray-500 text-sm">No products match your search</p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-16">
                                <p className="text-gray-500 text-sm">Start typing to search fragrances</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ─── Mobile Menu Drawer ─── */}
            {mobileMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 z-50 bg-black/30" onClick={() => setMobileMenuOpen(false)}></div>
                    {/* Drawer */}
                    <div className="fixed inset-y-0 left-0 z-50 bg-white w-[280px] max-w-[80vw] shadow-2xl flex flex-col">
                        <div className="flex items-center justify-between p-5 border-b border-gray-100">
                            <span className="text-sm font-light tracking-[0.2em] uppercase font-['Playfair_Display']">Menu</span>
                            <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:opacity-60 transition-opacity" aria-label="Close menu">
                                <X size={20} strokeWidth={1.25} />
                            </button>
                        </div>
                        <nav className="flex-1 p-5">
                            <div className="flex flex-col gap-1">
                                <button onClick={() => { setMobileMenuOpen(false); scrollToCollections(); }} className="text-left py-3 px-2 text-sm uppercase tracking-widest hover:bg-gray-50 rounded-md transition-colors">Shop</button>
                                <button onClick={() => { setMobileMenuOpen(false); scrollToCollections(); }} className="text-left py-3 px-2 text-sm uppercase tracking-widest hover:bg-gray-50 rounded-md transition-colors">Collections</button>
                                <button onClick={() => { setMobileMenuOpen(false); setSearchOpen(true); }} className="text-left py-3 px-2 text-sm uppercase tracking-widest hover:bg-gray-50 rounded-md transition-colors flex items-center gap-3">
                                    <Search size={16} strokeWidth={1.25} />
                                    Search
                                </button>
                            </div>
                            <div className="border-t border-gray-100 mt-4 pt-4 flex flex-col gap-1">
                                {user ? (
                                    <>
                                        <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="py-3 px-2 text-sm uppercase tracking-widest hover:bg-gray-50 rounded-md transition-colors">Admin</Link>
                                        <button onClick={() => { signout(); setMobileMenuOpen(false); }} className="text-left py-3 px-2 text-sm uppercase tracking-widest text-red-500 hover:bg-red-50 rounded-md transition-colors">Sign Out</button>
                                    </>
                                ) : (
                                    <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="py-3 px-2 text-sm uppercase tracking-widest hover:bg-gray-50 rounded-md transition-colors">Sign In</Link>
                                )}
                            </div>
                        </nav>
                        {/* Drawer Footer */}
                        <div className="p-5 border-t border-gray-100">
                            <p className="text-[10px] text-gray-300 uppercase tracking-widest">&copy; {new Date().getFullYear()} Ambrelle</p>
                        </div>
                    </div>
                </>
            )}

            <main>
                {/* Hero Banner */}
                <section className="relative w-full h-[50vh] md:h-[75vh] bg-[#050505] overflow-hidden flex items-center justify-center">
                    <Image src="/hero-grid.jpg.jpeg" priority alt="Ambrelle Collection Banner" fill className="object-cover md:object-contain object-center opacity-80 mix-blend-screen transition-opacity duration-1000"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent pointer-events-none z-10 w-full h-full"></div>
                    <div className="absolute inset-0 flex flex-col justify-center items-end pe-8 md:pe-24 pointer-events-none z-20">
                        <div className="text-right pointer-events-auto">
                            <h2 className="text-5xl md:text-7xl text-[#fafafa] font-['Playfair_Display'] italic mb-4 drop-shadow-2xl tracking-tighter">Collection</h2>
                            <button onClick={scrollToCollections} className="bg-white/5 text-[#d4af37] border border-[#d4af37]/50 uppercase tracking-widest px-8 py-3 text-sm font-medium shadow-[0_0_30px_-5px_rgba(212,175,55,0.2)] hover:bg-[#d4af37] hover:text-black hover:shadow-[0_0_40px_0_rgba(212,175,55,0.4)] transition-all duration-500 backdrop-blur-xl rounded-sm">
                                Shop Now
                            </button>
                        </div>
                    </div>
                </section>

                {/* Collections Grid */}
                <section id="collections" className="max-w-7xl mx-auto py-16 px-4 md:px-8">
                    <h2 className="text-3xl md:text-4xl font-semibold text-center text-[#fafafa] mb-6 tracking-tight">
                        Collections
                    </h2>

                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-5 py-2 text-xs uppercase tracking-widest rounded-sm transition-all duration-500 border backdrop-blur-md ${
                                    activeCategory === cat 
                                        ? "bg-[#d4af37]/10 text-[#d4af37] border-[#d4af37]/50 shadow-[0_0_20px_-5px_rgba(212,175,55,0.3)]" 
                                        : "bg-white/5 text-gray-400 border-white/5 hover:border-white/20 hover:text-white"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 gap-y-12">
                        {filteredPosts && filteredPosts.length > 0 ? filteredPosts.map((post) => (
                            <div key={post.id} className="group cursor-pointer flex flex-col items-center text-center relative p-3 bg-white/[0.02] border border-white/5 hover:border-[#d4af37]/30 hover:bg-white/5 rounded-sm transition-all duration-700 hover:shadow-[0_4px_30px_-5px_rgba(212,175,55,0.1)]" onClick={() => setSelectedPost(post)}>
                                {/* Wishlist Toggle Button */}
                                <button 
                                    onClick={(e) => toggleWishlist(e, post.id)}
                                    className="absolute top-6 right-6 z-10 p-2 bg-black/40 border border-white/10 backdrop-blur-xl rounded-full shadow-lg hover:bg-black/60 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                >
                                    <svg 
                                        width="16" height="16" viewBox="0 0 24 24" 
                                        fill={wishlist.includes(post.id) ? "#d4af37" : "none"} 
                                        stroke={wishlist.includes(post.id) ? "#d4af37" : "#fafafa"} 
                                        strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"
                                        className="transition-colors duration-500"
                                    >
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                    </svg>
                                </button>

                                <div className="relative w-full aspect-square bg-transparent mb-5 overflow-hidden rounded-sm">
                                    <Image src={post.image_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuCrVKRAySR7o_Hmi3ebvw6EJzpMPi1f_gMxnG5sgzOTyhV7uCDQ9qOAl5QQA8XRqen7QqayvAhthNSId4ccWPLaFjvbQcGQGSWq8SA9p81xTggGOzn9z0uE4L_Kx_tNYO51PvZF13C5qd0RG07ZCyAPZkPsBYYzgCKkS4PTjrbNm0SmCJEDZSJ6wI-Z9XsG_ywxXeKD04QnyXwS7lIDk6ediQcG6ORkRAmsO0Hc0XMv5eJoLns7b-PqxJ-JmjBFlUkJqfNniL5ED3Ky"} alt={post.title} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-[3000ms] ease-out group-hover:scale-110 opacity-90 group-hover:opacity-100" />
                                    
                                    {/* Badges Container */}
                                    <div className="absolute top-3 left-3 flex flex-col gap-2 items-start">
                                        {post.in_stock === false && (
                                            <div className="bg-red-950/80 backdrop-blur-md text-red-200 border border-red-500/30 text-[9px] uppercase tracking-[0.2em] px-2 py-1 rounded-sm shadow-xl">
                                                Sold Out
                                            </div>
                                        )}
                                        {post.in_stock !== false && isNewArrival(post.created_at) && (
                                            <div className="bg-[#d4af37]/20 backdrop-blur-md text-[#d4af37] border border-[#d4af37]/30 text-[9px] uppercase tracking-[0.2em] px-2 py-1 rounded-sm shadow-xl">
                                                New
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <h3 className="font-['Playfair_Display'] italic text-lg md:text-xl text-[#fafafa] tracking-wide mb-1 leading-tight group-hover:text-[#d4af37] transition-colors duration-500">
                                    {post.title}
                                </h3>
                                {post.price && (
                                    <p className="text-xs tracking-widest text-gray-400 font-light mt-1">${parseFloat(post.price.toString()).toFixed(2)}</p>
                                )}
                            </div>
                        )) : (
                            <div className="col-span-full py-24 text-center border-t border-b border-gray-200">
                                <p className="text-gray-500 uppercase tracking-widest">No products match this category</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Back to top button */}
                <button 
                    onClick={scrollToTop}
                    className={`fixed bottom-8 right-8 z-50 p-3 bg-black text-white rounded-full shadow-xl transition-all duration-300 ${showTopButton ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}`}
                    aria-label="Scroll to top"
                >
                    <ChevronUp size={24} strokeWidth={1.25} />
                </button>


                <FragranceModal post={selectedPost} onClose={() => setSelectedPost(null)} />
            </main>

            <footer className="bg-[#111] text-white pt-16 pb-8 px-6 border-t border-gray-800">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div>
                        <h3 className="font-['Playfair_Display'] text-sm font-light tracking-[0.3em] mb-4">AMBRELLE</h3>
                        <p className="text-xs text-gray-500 leading-relaxed">Luxury fragrances curated for those who appreciate the art of scent.</p>
                    </div>
                    <div>
                        <h4 className="text-xs uppercase tracking-wider text-gray-400 mb-4">Quick Links</h4>
                        <div className="flex flex-col gap-2">
                            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-xs text-gray-500 hover:text-white transition-colors text-left">Home</button>
                            <button onClick={scrollToCollections} className="text-xs text-gray-500 hover:text-white transition-colors text-left">Collections</button>
                            <Link href="/login" className="text-xs text-gray-500 hover:text-white transition-colors">Account</Link>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-xs uppercase tracking-wider text-gray-400 mb-4">Contact</h4>
                        <a href="https://wa.me/97474068029" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-white transition-colors">WhatsApp</a>
                    </div>
                </div>
                <div className="border-t border-gray-800 pt-6 text-center">
                    <p className="text-[10px] uppercase tracking-widest text-gray-600">
                        &copy; {new Date().getFullYear()} AMBRELLE. ALL RIGHTS RESERVED.
                    </p>
                </div>
            </footer>
        </div>
    );
}
