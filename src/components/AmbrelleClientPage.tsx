"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { signout } from "@/app/login/actions";
import { FragranceModal } from "./FragranceModal";
import Link from "next/link";
import Image from "next/image";
import { Post, User } from "@/types";

export function AmbrelleClientPage({
    postContent,
    posts,
    user
}: {
    postContent?: string;
    posts?: Post[];
    user?: User | null;
}) {
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="bg-background text-foreground font-['Inter'] selection:bg-primary selection:text-primary-foreground overflow-x-hidden min-h-[max(884px,100dvh)]">
            
            {/* TopAppBar */}
            <header className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-3xl" style={{ boxShadow: "0 20px 40px rgba(105,36,132,0.08)" }}>
                <div className="flex justify-between items-center w-full px-6 py-4 max-w-none bg-gradient-to-b from-surface-container-lowest to-transparent">
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-primary hover:opacity-80 transition-opacity duration-300 md:hidden" aria-label="Toggle mobile menu">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>menu</span>
                    </button>
                    {/* Desktop Left Nav */}
                    <div className="hidden md:flex gap-6 lg:gap-8 uppercase text-[10px] tracking-[0.15em] font-bold items-center font-['Space_Mono'] text-primary">
                        <button className="transition-colors hover:text-white" onClick={() => window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' })}>Our Story</button>
                        <button className="transition-colors hover:text-white" onClick={() => window.scrollTo({ top: window.innerHeight * 1.8, behavior: 'smooth' })}>The Collection</button>
                    </div>

                    <h1 className="text-2xl font-bold tracking-[0.2em] text-primary font-['Syncopate'] uppercase text-center md:flex-1 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>AMBRELLE</h1>
                    
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex gap-6 lg:gap-8 uppercase text-[10px] tracking-[0.15em] font-bold items-center font-['Space_Mono'] text-primary">
                            {user ? (
                                <>
                                    <Link href="/admin" className="hover:text-white transition-colors">Admin</Link>
                                    <button onClick={() => signout()} className="text-primary/50 hover:text-red-400 transition-colors">Sign Out</button>
                                </>
                            ) : (
                                <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
                            )}
                        </div>
                        <div className="hidden md:block"><ThemeToggle /></div>
                    </div>
                </div>
            </header>

            {/* Mobile Nav Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 glass-panel flex flex-col items-center justify-center gap-8 md:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <button className="font-['Space_Grotesk'] text-3xl font-bold text-foreground hover:text-primary transition-colors" onClick={() => { setMobileMenuOpen(false); window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' }); }}>Our Story</button>
                        <button className="font-['Space_Grotesk'] text-3xl font-bold text-foreground hover:text-primary transition-colors" onClick={() => { setMobileMenuOpen(false); window.scrollTo({ top: window.innerHeight * 1.8, behavior: 'smooth' }); }}>The Collection</button>
                        {user ? (
                            <>
                                <Link href="/admin" className="font-['Space_Grotesk'] text-3xl font-bold text-primary">Admin</Link>
                                <button onClick={() => { setMobileMenuOpen(false); signout(); }} className="font-['Space_Grotesk'] text-xl text-red-400 hover:text-red-500 transition-colors">Sign Out</button>
                            </>
                        ) : (
                            <Link href="/login" className="font-['Space_Grotesk'] text-3xl font-bold text-primary">Sign In</Link>
                        )}
                        <div className="mt-4"><ThemeToggle /></div>
                    </motion.div>
                )}
            </AnimatePresence>

            <main>
                {/* Immersive Hero */}
                <section className="relative min-h-[90vh] md:min-h-screen flex flex-col justify-end px-6 pb-32 pt-24 overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <Image alt="Ambrelle Atmospheric Profile" fill priority sizes="100vw" quality={85} className="object-cover opacity-60 scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDztF3q06VmuTt2v6jxYOfnXDQLcBBn9gLPethq16BzebyfsIS6i49jqNcgayBDtDqtkeDGUPJy8HVogDiY6G8UjuFUDi-84RGmBbI9Km2x3nEafXTYBAE00LCXYdxg1Wx6SPz5wPtn2elnZTQKbwGJxpWkp_gwBGRno7_PPq7hrO_0Pg1Qv_LBW0FlnXHkj50J6y_4J8jGNcBIRvSAc5B-QxhS6-NZU92lNLBdTbh9_r1ZPcivP5WthTwnYZvVgz4VN77zKfKhSeV3"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-surface-container-lowest/40"></div>
                    </div>
                    <div className="relative z-10 space-y-6 max-w-2xl">
                        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="font-['Space_Mono'] text-primary tracking-[0.3em] text-[10px] uppercase">Haute Parfumerie 2026</motion.p>
                        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, type: "spring" }} className="font-['Syncopate'] font-bold text-4xl sm:text-5xl md:text-7xl leading-tight tracking-tighter text-foreground">
                            SCENT AS <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#edb1ff] to-[#692484]">VELOCITY.</span>
                        </motion.h2>
                        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, type: "spring" }} className="text-muted-foreground max-w-md leading-relaxed text-sm md:text-lg font-light">
                            Where luxury meets identity. Every fragrance tells a story of elegance, captured in a moment of atmospheric movement.
                        </motion.p>
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8, type: "spring" }} className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button onClick={() => window.scrollTo({ top: window.innerHeight * 1.8, behavior: 'smooth' })} className="w-full sm:w-auto px-8 py-4 primary-gradient-cta text-white font-['Space_Mono'] text-[10px] tracking-widest uppercase hover:opacity-90 viscous-transition rounded-sm shadow-lg shadow-[#692484]/20 cursor-pointer">
                                Enter The Archives
                            </button>
                            <a href="https://wa.me/97474068029" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-8 py-4 glass-panel ghost-border text-foreground font-['Space_Mono'] text-[10px] tracking-widest uppercase hover:bg-muted/40 transition-all rounded-sm text-center">
                                Contact Us
                            </a>
                        </motion.div>
                    </div>
                </section>

                {/* The Origin (Storytelling Section) */}
                <section className="py-24 md:py-32 px-6 bg-surface-container-low relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary-container/10 blur-[120px] rounded-full -mr-48 -mt-48"></div>
                    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 md:gap-16 items-center">
                        <div className="w-full md:w-1/2 order-2 md:order-1 relative z-10">
                            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="space-y-6 md:space-y-8">
                                <div>
                                    <span className="font-['Space_Mono'] text-[#fbbb53] text-[10px] tracking-widest uppercase block mb-4">Manifesto</span>
                                    <h3 className="font-['Space_Grotesk'] text-3xl md:text-5xl font-bold leading-tight uppercase">
                                        SYSTEMATIC <br/> SENSORY <br/> OVERLOAD.
                                    </h3>
                                </div>
                                <div className="text-muted-foreground leading-relaxed text-sm md:text-lg font-light">
                                     {postContent ? (
                                         <div dangerouslySetInnerHTML={{ __html: postContent.replace(/\n\n/g, '<br/><br/>').replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>') }} />
                                     ) : (
                                        <p>We don&apos;t just craft scents; we engineer emotional trajectories. Our process begins where traditional perfumery ends—at the intersection of raw botanical power and high-velocity modern impact.</p>
                                     )}
                                </div>
                                <div className="pt-4">
                                    <span className="font-['Space_Mono'] text-primary text-xs uppercase tracking-[0.2em] border-b border-primary pb-2 hover:text-white transition-colors inline-block cursor-pointer">
                                        Read our philosophy
                                    </span>
                                </div>
                            </motion.div>
                        </div>
                        <div className="w-full md:w-1/2 order-1 md:order-2">
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }} className="relative group">
                                <div className="absolute -inset-4 bg-primary-container/20 blur-2xl rounded-full group-hover:bg-primary-container/30 transition-all duration-700"></div>
                                <Image alt="Luxury Perfume" width={600} height={750} sizes="(max-width: 768px) 100vw, 50vw" className="relative rounded-lg shadow-2xl w-full aspect-[4/5] object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-_EZ7zywb98-O1bTu5cno5z0EVI-BP83Ip0cffd-1fz0PHZQF-FV-yyHJPhNa8yrn7qtVHXZsgDRJjyuraiNJbqpIiMyfIoQX9TP5bQsFogX_HDB7fDOWU_Xsdu5l9d1fF8ZU4g7uji40csZY8VgP1JLrapjQfBBux8Oepuo7tCbA_KFzY5qk9BWXJLg7FS_fboCpCr5cR9YLC0B-33bwGpL383G5L_dMdDzbncwVRtiyWz3JZnYuKkd4HyMB3mVYfBCntRagzYIt"/>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* The Archives (Product Showcase) */}
                <section className="py-24 md:py-32 bg-background relative z-10 transition-colors duration-500">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} className="px-6 mb-12 flex flex-col items-start gap-4">
                        <span className="font-['Space_Mono'] text-primary text-[10px] tracking-[0.4em] uppercase">The Collection</span>
                        <h3 className="font-['Syncopate'] text-3xl md:text-4xl font-bold tracking-tight uppercase">THE ARCHIVES</h3>
                    </motion.div>
                    
                    <div className="flex overflow-x-auto gap-6 md:gap-8 px-6 pb-12 overflow-y-hidden snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {posts && posts.length > 0 ? posts.map((post, idx) => (
                             <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ delay: idx * 0.1, duration: 0.5 }} key={post.id} onClick={() => setSelectedPost(post)} className="min-w-[85vw] md:min-w-[400px] snap-center relative aspect-[3/4] overflow-hidden group cursor-pointer rounded-sm">
                                <Image alt={post.title} fill sizes="(max-width: 768px) 85vw, 400px" className="object-cover transition-transform duration-700 group-hover:scale-110" src={post.image_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuCrVKRAySR7o_Hmi3ebvw6EJzpMPi1f_gMxnG5sgzOTyhV7uCDQ9qOAl5QQA8XRqen7QqayvAhthNSId4ccWPLaFjvbQcGQGSWq8SA9p81xTggGOzn9z0uE4L_Kx_tNYO51PvZF13C5qd0RG07ZCyAPZkPsBYYzgCKkS4PTjrbNm0SmCJEDZSJ6wI-Z9XsG_ywxXeKD04QnyXwS7lIDk6ediQcG6ORkRAmsO0Hc0XMv5eJoLns7b-PqxJ-JmjBFlUkJqfNniL5ED3Ky"} />
                                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/90 via-transparent to-transparent"></div>
                                <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 space-y-4 shadow-[0_-20px_40px_rgba(20,10,28,0.8)_inset]">
                                    <div className="glass-panel p-5 md:p-6 rounded-lg ghost-border">
                                        <h4 className="font-['Space_Grotesk'] text-xl md:text-2xl font-bold mb-3 uppercase leading-tight line-clamp-2">{post.title}</h4>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {post.topic && <span className="px-3 py-1 bg-[#be8621]/20 text-[#fbbb53] text-[10px] font-['Space_Mono'] rounded-full uppercase">{post.topic}</span>}
                                            <span className="px-3 py-1 bg-[#be8621]/20 text-[#fbbb53]/80 text-[10px] font-['Space_Mono'] rounded-full">{new Date(post.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                            <span className="font-['Space_Mono'] text-[10px] tracking-widest uppercase">Tap to explore</span>
                                            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>arrow_right_alt</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )) : (
                            <div className="min-w-full border border-dashed border-[#692484]/30 p-12 text-center text-muted-foreground uppercase tracking-widest text-sm font-bold rounded-xl">
                                NO RECORDS FOUND IN ARCHIVE.
                            </div>
                        )}
                    </div>
                </section>

                <FragranceModal post={selectedPost} onClose={() => setSelectedPost(null)} />
            </main>

            {/* Sticky Action Button */}
            <a href="https://wa.me/97474068029" target="_blank" rel="noopener noreferrer" className="fixed bottom-[104px] md:bottom-24 right-6 z-40 w-14 h-14 bg-primary-container rounded-full flex items-center justify-center text-white shadow-[0_0_30px_rgba(105,36,132,0.6)] border border-primary/30 transition-transform active:scale-95 hover:scale-105">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>chat_bubble</span>
            </a>

            {/* Footer */}
            <footer className="bg-surface-container-lowest pt-20 pb-36 md:pb-28 px-6 relative z-10 transition-colors duration-500">
                <div className="max-w-6xl mx-auto flex flex-col items-center gap-12 text-center">
                    <h2 className="font-['Syncopate'] text-2xl md:text-3xl font-bold tracking-[0.4em] text-primary">AMBRELLE</h2>
                    <div className="w-full h-px bg-border"></div>
                    <div className="flex flex-col md:flex-row justify-between w-full items-center gap-8">
                        <p className="font-['Space_Mono'] text-[10px] text-muted-foreground uppercase tracking-widest">
                            SYSTEMATIC FRAGRANCE LOGIC.
                        </p>
                        <div className="flex gap-6">
                            <a className="text-muted-foreground hover:text-primary transition-colors" href="#">
                                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>camera</span>
                            </a>
                            <a className="text-muted-foreground hover:text-primary transition-colors" href="#">
                                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>alternate_email</span>
                            </a>
                        </div>
                        <p className="font-['Space_Mono'] text-[10px] text-muted-foreground uppercase tracking-widest">
                            &copy; 2026 AMBRELLE. ALL RIGHTS RESERVED.
                        </p>
                    </div>
                </div>
            </footer>

            {/* BottomNavBar */}
            <nav className="fixed bottom-0 left-0 w-full h-20 flex justify-around items-center px-4 sm:px-8 z-50 bg-background/80 backdrop-blur-2xl shadow-[0_-10px_30px_rgba(20,10,28,0.5)] md:hidden pointer-events-auto">
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex flex-col items-center justify-center text-primary font-bold scale-110 ring-1 ring-primary/20 rounded-full p-2 bg-background">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>auto_stories</span>
                    <span className="font-['Space_Mono'] uppercase text-[10px] tracking-tighter mt-1">JOURNAL</span>
                </button>
                <button onClick={() => window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' })} className="flex flex-col items-center justify-center text-muted-foreground/80 hover:text-primary transition-all p-2">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>history_edu</span>
                    <span className="font-['Space_Mono'] uppercase text-[10px] tracking-tighter mt-1">STORY</span>
                </button>
                <button onClick={() => window.scrollTo({ top: window.innerHeight * 1.8, behavior: 'smooth' })} className="flex flex-col items-center justify-center text-muted-foreground/80 hover:text-primary transition-all p-2">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>temp_preferences_custom</span>
                    <span className="font-['Space_Mono'] uppercase text-[10px] tracking-tighter mt-1">VAULT</span>
                </button>
            </nav>
        </div>
    );
}
