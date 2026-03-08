"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, Variants, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { signout } from "@/app/login/actions";
import { FragranceModal } from "./FragranceModal";
import Link from "next/link";

export function AmbrelleClientPage({
    postContent,
    posts,
    user
}: {
    postContent?: string;
    posts?: any[];
    user?: any;
}) {
    const [selectedPost, setSelectedPost] = useState<any | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const heroRef = useRef<HTMLElement>(null);
    const { scrollYProgress: heroScroll } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const yHeroText = useTransform(heroScroll, [0, 1], [0, 200]);
    const opacityHero = useTransform(heroScroll, [0, 1], [1, 0]);
    const scaleImage = useTransform(heroScroll, [0, 1], [1, 1.15]);

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 50, filter: "blur(10px)" },
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { type: "spring", stiffness: 50, damping: 20 }
        }
    };

    const wordVariants: Variants = {
        hidden: { y: "100%", opacity: 0 },
        visible: { y: "0%", opacity: 1, transition: { type: "spring", damping: 12, stiffness: 100 } }
    };

    const mobileMenuVariants: Variants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
    };

    const mobileItemVariants: Variants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-[#2C143B] dark:bg-[#13091B] dark:text-[#F1E3FC] font-['Inter'] selection:bg-[#692484]/40 flex flex-col overflow-hidden transition-colors duration-500">

            {/* Top Kinetic Bar */}
            <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                transition={{ duration: 1, ease: "circOut" }}
                className="w-full bg-[#692484] text-white text-[9px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] py-1.5 sm:py-2 text-center font-bold overflow-hidden whitespace-nowrap"
            >
                <div className="animate-marquee inline-block">
                    &bull; THE OFFICIAL BLOG OF AMBRELLE FRAGRANCE &bull; INSIGHTS &amp; OLFACTORY ART &bull; THE OFFICIAL BLOG OF AMBRELLE FRAGRANCE &bull; INSIGHTS &amp; OLFACTORY ART &bull;
                </div>
            </motion.div>

            {/* Glass Navigation */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 50, delay: 0.2 }}
                className="sticky top-0 z-50 w-full bg-[#FAFAFA]/80 dark:bg-[#13091B]/80 backdrop-blur-xl border-b border-[#2C143B]/10 dark:border-white/10 flex items-center justify-between h-16 sm:h-20 md:h-24 px-4 sm:px-6 md:px-12 transition-colors duration-300"
            >
                {/* Desktop Left Nav */}
                <div className="hidden md:flex gap-6 lg:gap-8 uppercase text-xs tracking-[0.1em] font-bold items-center">
                    <motion.button whileHover={{ y: -2, color: "#692484" }} whileTap={{ scale: 0.95 }} className="transition-colors cursor-pointer" onClick={() => window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' })}>
                        Blog
                    </motion.button>
                    <motion.button whileHover={{ y: -2, color: "#692484" }} whileTap={{ scale: 0.95 }} className="transition-colors cursor-pointer" onClick={() => window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' })}>
                        Our Story
                    </motion.button>
                    {user ? (
                        <div className="flex items-center gap-3">
                            <Link href="/admin" className="hover:text-[#692484] transition-colors cursor-pointer">Admin</Link>
                            <Link href="/admin/create-post" className="hover:text-[#692484] transition-colors text-[#692484]/70 cursor-pointer">+ New</Link>
                            <button onClick={() => signout()} className="text-[#2C143B]/40 dark:text-[#F1E3FC]/40 hover:text-red-500 transition-colors cursor-pointer">Sign Out</button>
                        </div>
                    ) : (
                        <Link href="/login" className="hover:text-[#692484] transition-colors cursor-pointer">
                            Sign In
                        </Link>
                    )}
                </div>

                {/* Mobile Hamburger Button */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 cursor-pointer z-50"
                    aria-label="Toggle menu"
                >
                    <motion.span
                        animate={mobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                        className="block w-5 h-[2px] bg-[#2C143B] dark:bg-[#F1E3FC] origin-center transition-colors"
                    />
                    <motion.span
                        animate={mobileMenuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                        className="block w-5 h-[2px] bg-[#2C143B] dark:bg-[#F1E3FC] transition-colors"
                    />
                    <motion.span
                        animate={mobileMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                        className="block w-5 h-[2px] bg-[#2C143B] dark:bg-[#F1E3FC] origin-center transition-colors"
                    />
                </button>

                {/* Logo */}
                <div className="flex justify-center">
                    <motion.div whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }} transition={{ duration: 0.3 }} className="p-1.5 sm:p-2 border border-[#2C143B]/10 dark:border-white/10 rounded-full bg-white shadow-lg cursor-pointer">
                        <img src="/logo.jpg" alt="Ambrelle Fragrance" className="h-9 w-9 sm:h-11 sm:w-11 md:h-14 md:w-14 object-contain" />
                    </motion.div>
                </div>

                {/* Right Side */}
                <div className="flex justify-end items-center gap-2 sm:gap-4 md:gap-6">
                    <div className="hidden sm:block"><ThemeToggle /></div>
                    <div className="uppercase text-[8px] sm:text-[10px] md:text-xs tracking-[0.1em] font-bold border border-[#2C143B]/20 dark:border-white/20 rounded-full px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3 hover:border-[#692484] dark:hover:border-[#692484] transition-colors group cursor-pointer">
                        <a href="https://wa.me/97474068029" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 sm:gap-2">
                            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#692484] animate-pulse" />
                            <span className="group-hover:text-[#692484] transition-colors hidden sm:inline">WhatsApp</span>
                            <span className="group-hover:text-[#692484] transition-colors sm:hidden">Chat</span>
                        </a>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        key="mobile-menu"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={mobileMenuVariants}
                        className="fixed inset-0 z-40 bg-[#FAFAFA]/98 dark:bg-[#13091B]/98 backdrop-blur-2xl flex flex-col items-center justify-center gap-6 md:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <motion.button
                            variants={mobileItemVariants}
                            whileTap={{ scale: 0.95 }}
                            className="font-['Playfair_Display'] text-3xl font-bold text-[#2C143B] dark:text-[#F1E3FC] cursor-pointer hover:text-[#692484] transition-colors"
                            onClick={() => { setMobileMenuOpen(false); window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' }); }}
                        >
                            Blog
                        </motion.button>
                        <motion.button
                            variants={mobileItemVariants}
                            whileTap={{ scale: 0.95 }}
                            className="font-['Playfair_Display'] text-3xl font-bold text-[#2C143B] dark:text-[#F1E3FC] cursor-pointer hover:text-[#692484] transition-colors"
                            onClick={() => { setMobileMenuOpen(false); window.scrollTo({ top: window.innerHeight * 1.5, behavior: 'smooth' }); }}
                        >
                            Our Story
                        </motion.button>
                        {user ? (
                            <>
                                <motion.div variants={mobileItemVariants}>
                                    <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="font-['Playfair_Display'] text-3xl font-bold text-[#692484] cursor-pointer">Admin</Link>
                                </motion.div>
                                <motion.div variants={mobileItemVariants}>
                                    <Link href="/admin/create-post" onClick={() => setMobileMenuOpen(false)} className="font-['Playfair_Display'] text-2xl text-[#692484]/60 cursor-pointer">+ New Post</Link>
                                </motion.div>
                                <motion.button
                                    variants={mobileItemVariants}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => { setMobileMenuOpen(false); signout(); }}
                                    className="text-lg text-red-400 hover:text-red-500 transition-colors cursor-pointer"
                                >
                                    Sign Out
                                </motion.button>
                            </>
                        ) : (
                            <motion.div variants={mobileItemVariants}>
                                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="font-['Playfair_Display'] text-3xl font-bold text-[#692484] cursor-pointer">Sign In</Link>
                            </motion.div>
                        )}
                        <motion.div variants={mobileItemVariants} className="mt-4">
                            <ThemeToggle />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Kinetic Hero Section */}
            <section ref={heroRef} className="relative w-full h-[85vh] sm:h-[90vh] md:h-[100vh] overflow-hidden flex items-end justify-start px-4 pb-16 sm:px-6 sm:pb-20 md:px-12 md:pb-32">
                <motion.div style={{ scale: scaleImage }} className="absolute inset-0">
                    <div className="absolute inset-0 bg-[url('/hero_bg.png')] bg-cover bg-[center_top_20%]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA]/40 to-transparent dark:from-[#13091B] dark:via-[#13091B]/30 dark:to-transparent transition-colors duration-500" />
                    <div className="absolute inset-0 bg-[#692484]/10 dark:bg-[#692484]/20" />
                </motion.div>

                {/* Halo glow — responsive */}
                <div className="absolute bottom-20 sm:bottom-32 left-4 sm:left-8 md:left-12 w-[250px] sm:w-[400px] md:w-[600px] h-[150px] sm:h-[200px] md:h-[300px] bg-[#692484]/20 dark:bg-[#692484]/40 rounded-full blur-[80px] sm:blur-[100px] md:blur-[120px] pointer-events-none" />

                <motion.div style={{ y: yHeroText, opacity: opacityHero }} className="relative z-10 w-full max-w-7xl">
                    <h1 className="font-['Syncopate'] text-[10vw] sm:text-[11vw] md:text-[8vw] font-bold leading-[0.9] uppercase tracking-tighter mb-4 sm:mb-6 md:mb-8 flex flex-wrap gap-x-2 sm:gap-x-4">
                        <span className="overflow-hidden block">
                            <motion.span
                                custom={0} variants={wordVariants} initial="hidden" animate="visible"
                                whileHover={{ letterSpacing: "0.08em", textShadow: "0 0 40px #692484, 0 0 80px #692484aa" }}
                                whileTap={{ textShadow: "0 0 60px #692484, 0 0 100px #692484" }}
                                transition={{ duration: 0.35 }}
                                className="block text-[#692484] cursor-default text-glow-purple"
                            >SCENT</motion.span>
                        </span>
                        <span className="overflow-hidden block">
                            <motion.span
                                custom={1} variants={wordVariants} initial="hidden" animate="visible"
                                whileHover={{ letterSpacing: "0.08em" }}
                                whileTap={{ textShadow: "0 0 40px #692484" }}
                                transition={{ duration: 0.35 }}
                                className="block text-[#2C143B] dark:text-[#F1E3FC] cursor-default"
                            >AS</motion.span>
                        </span>
                        <span className="overflow-hidden block w-full">
                            <motion.span
                                custom={2} variants={wordVariants} initial="hidden" animate="visible"
                                whileHover={{ letterSpacing: "0.08em", textShadow: "0 0 40px #692484, 0 0 80px #692484aa" }}
                                whileTap={{ textShadow: "0 0 60px #692484, 0 0 100px #692484" }}
                                transition={{ duration: 0.35 }}
                                className="block text-right text-[#2C143B] dark:text-[#F1E3FC] cursor-default"
                            >VELOCITY.</motion.span>
                        </span>
                    </h1>

                    {/* Tagline */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, type: "spring" }}
                        className="text-xs sm:text-sm md:text-base text-[#2C143B]/80 dark:text-[#F1E3FC]/70 font-['Inter'] tracking-wide mb-6 sm:mb-8 max-w-xs sm:max-w-md backdrop-blur-sm animate-float"
                        style={{ textShadow: "0 1px 12px rgba(255,255,255,0.8)" }}
                    >
                        Where luxury meets identity. Every fragrance tells a story of elegance and unforgettable moments.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1, type: "spring" }}
                        className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2 sm:mt-4 items-stretch sm:items-start"
                    >
                        <motion.button
                            whileHover={{ scale: 1.03, boxShadow: "0 0 30px #69248466" }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' })}
                            className="group relative w-full sm:w-auto px-5 sm:px-8 py-3.5 sm:py-4 bg-[#692484] text-white uppercase tracking-widest font-bold text-xs sm:text-sm overflow-hidden cursor-pointer text-center"
                        >
                            <span className="relative z-10">Enter The Journal</span>
                            <motion.div
                                className="absolute inset-0 bg-[#8B30A4] z-0 origin-left"
                                initial={{ scaleX: 0 }}
                                whileHover={{ scaleX: 1 }}
                                transition={{ ease: "circOut" }}
                            />
                        </motion.button>
                        <motion.a
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            href="https://wa.me/97474068029"
                            target="_blank"
                            className="w-full sm:w-auto px-5 sm:px-8 py-3.5 sm:py-4 border-2 border-[#692484] text-[#692484] uppercase tracking-widest font-bold text-xs sm:text-sm hover:bg-[#692484]/10 transition-colors backdrop-blur-sm cursor-pointer text-center"
                        >
                            Contact Us
                        </motion.a>
                    </motion.div>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="absolute bottom-8 sm:bottom-12 right-6 sm:right-12 w-px h-16 sm:h-24 bg-gradient-to-b from-[#692484] to-transparent hidden sm:block"
                />
            </section>

            {/* Asymmetric Story Section */}
            <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 md:gap-16 border-b border-[#2C143B]/10 dark:border-white/10 relative overflow-hidden transition-colors duration-500">
                <div className="absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[#692484]/5 rounded-full blur-[80px] sm:blur-[100px] -translate-y-1/2 translate-x-1/2" />

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    className="col-span-1 lg:col-span-5 flex flex-col justify-center relative z-10"
                >
                    <motion.p variants={itemVariants} className="uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#692484] text-[10px] sm:text-xs font-bold mb-4 sm:mb-6 flex items-center gap-3 sm:gap-4">
                        <span className="w-8 sm:w-12 h-px bg-[#692484]" /> Origin
                    </motion.p>
                    <motion.h2
                        variants={itemVariants}
                        whileHover={{ textShadow: "0 0 40px #692484aa", letterSpacing: "0.02em" }}
                        whileTap={{ textShadow: "0 0 30px #692484aa" }}
                        transition={{ duration: 0.3 }}
                        className="font-['Playfair_Display'] text-3xl sm:text-5xl md:text-7xl font-bold uppercase leading-[1.1] mb-8 sm:mb-12 text-[#2C143B] dark:text-[#F1E3FC] cursor-default"
                    >
                        Systematic<br />Sensory<br />Overload.
                    </motion.h2>
                    <motion.div variants={itemVariants} className="w-full h-48 sm:h-64 md:h-96 relative overflow-hidden border border-[#2C143B]/10 dark:border-white/10 group mt-auto" style={{ boxShadow: "var(--shadow-xl)" }}>
                        <img src="/luxury_fragrance.png" alt="Ambrelle Luxury Fragrance" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out" />
                        <div className="absolute inset-0 bg-[#692484] opacity-20 mix-blend-color group-hover:opacity-0 transition-opacity duration-1000" />
                    </motion.div>
                </motion.div>

                <div className="col-span-1 lg:col-span-7 flex flex-col justify-center relative z-10">
                    <motion.div
                        variants={itemVariants}
                        className="bg-[#2C143B]/5 dark:bg-white/5 backdrop-blur-md border border-[#2C143B]/10 dark:border-white/10 p-5 sm:p-8 md:p-12 text-[#2C143B]/80 dark:text-[#F1E3FC]/80 leading-relaxed text-sm sm:text-base md:text-lg font-['Inter'] transition-colors duration-500"
                    >
                        {postContent ? (
                            <div className="space-y-4 sm:space-y-6" dangerouslySetInnerHTML={{ __html: postContent.replace(/\n\n/g, '<br/><br/>').replace(/\*\*(.*?)\*\*/g, '<strong class="text-current">$1</strong>') }} />
                        ) : (
                            <div className="space-y-4 sm:space-y-6">
                                <p>
                                    Ambrelle Fragrance operates on a different frequency. Born from a profound, lifelong passion for high-end scents, we construct olfactory experiences designed to shatter expectations.
                                </p>
                                <p>
                                    We created Ambrelle to bring powerful, elegant, and unforgettable fragrances to individuals who refuse to blend in—those who demand high-velocity impact.
                                </p>
                            </div>
                        )}
                        <motion.div
                            whileHover={{ x: 10 }}
                            whileTap={{ x: 5 }}
                            className="mt-8 sm:mt-12 uppercase tracking-widest text-[#692484] text-xs sm:text-sm font-bold cursor-pointer inline-flex items-center gap-2"
                        >
                            Read Full Manifesto <span className="text-lg sm:text-xl">→</span>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Kinetic Article Grid */}
            <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 bg-[#F0EAF7] dark:bg-[#0D0715] transition-colors duration-500">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 sm:mb-16 md:mb-20 gap-4 sm:gap-8"
                >
                    <div>
                        <h2 className="font-['Syncopate'] text-3xl sm:text-5xl md:text-8xl font-bold uppercase tracking-tighter text-[#692484]/20 dark:text-[#692484]/30">Archives_</h2>
                    </div>
                    <p className="text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#2C143B]/50 dark:text-[#F1E3FC]/50 font-bold font-['Space_Mono'] max-w-xs sm:text-right">
                        Tap any card to explore the full fragrance profile
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {posts && posts.length > 0 ? posts.map((article, idx) => (
                        <motion.div
                            key={article.id || idx}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.5, delay: idx * 0.08, ease: "easeOut" }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedPost(article)}
                            className="group relative bg-white dark:bg-[#1A0A24] border border-[#692484]/15 dark:border-[#692484]/25 overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-[#692484]/20 transition-all duration-300 rounded-xl sm:rounded-2xl flex flex-col"
                            style={{ boxShadow: "var(--shadow-md)" }}
                        >
                            {/* Image Area */}
                            <div className="relative w-full h-40 sm:h-56 bg-[#692484]/10 dark:bg-[#692484]/20 overflow-hidden flex items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#692484]/10 z-10" />
                                <motion.div
                                    whileHover={{ scale: 1.08 }}
                                    transition={{ duration: 0.7, ease: "easeOut" }}
                                    className="w-full h-full"
                                >
                                    {article.image_url ? (
                                        <img
                                            src={article.image_url}
                                            alt={article.title}
                                            className="w-full h-full object-contain p-4 sm:p-6"
                                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="font-['Syncopate'] text-[#692484]/30 text-2xl sm:text-4xl font-black uppercase">IBRAQ</span>
                                        </div>
                                    )}
                                </motion.div>
                                {article.topic && (
                                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-20 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-[#692484] text-white text-[8px] sm:text-[9px] uppercase tracking-[0.15em] sm:tracking-[0.2em] font-bold rounded-full">
                                        {article.topic}
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-[#692484] opacity-0 group-hover:opacity-10 z-20 transition-opacity duration-500" />
                            </div>

                            {/* Content Area */}
                            <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
                                <div>
                                    <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#692484]/60 dark:text-[#F1E3FC]/40 font-bold font-['Space_Mono']">
                                        {new Date(article.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </span>
                                    <h3 className="font-['Playfair_Display'] text-sm sm:text-base font-bold uppercase leading-tight text-[#2C143B] dark:text-[#F1E3FC] mt-1.5 sm:mt-2 mb-2 sm:mb-3 line-clamp-2 group-hover:text-[#692484] dark:group-hover:text-[#c084fc] transition-colors duration-300">
                                        {article.title}
                                    </h3>
                                    {article.content && (
                                        <p className="text-[11px] sm:text-xs text-[#2C143B]/60 dark:text-[#F1E3FC]/50 font-['Inter'] line-clamp-2 leading-relaxed">
                                            {article.content.replace(/\*\*(.*?)\*\*/g, '$1').split('\n')[0]}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-[#692484]/10 dark:border-[#692484]/20">
                                    <span className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-[#692484] font-['Space_Mono'] flex items-center gap-1 sm:gap-1.5 group-hover:gap-2 sm:group-hover:gap-3 transition-all duration-300">
                                        Explore
                                        <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                    </span>
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-[#692484]/30 flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#692484] animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="col-span-full border border-dashed border-[#692484]/30 p-8 sm:p-12 text-center text-[#2C143B]/50 dark:text-white/50 uppercase tracking-widest text-xs sm:text-sm font-bold rounded-xl sm:rounded-2xl">
                            NO RECORDS FOUND IN ARCHIVE.
                        </div>
                    )}
                </div>
            </section>

            {/* Fragrance Detail Modal */}
            <FragranceModal post={selectedPost} onClose={() => setSelectedPost(null)} />

            {/* Footer & Contact */}
            <section className="bg-[#692484] text-[#13091B] py-20 sm:py-24 md:py-32 pb-36 sm:pb-32 px-4 sm:px-6 md:px-12 relative overflow-hidden">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 40 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto text-center relative z-10"
                >
                    <h2 className="font-['Playfair_Display'] text-[10vw] sm:text-[8vw] md:text-[6vw] font-bold uppercase leading-[0.9] tracking-tight mb-8 sm:mb-12">
                        <span className="opacity-40">Require</span> Assistance?
                    </h2>

                    <a
                        href="https://wa.me/97474068029"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative inline-flex items-center justify-center gap-3 sm:gap-4 bg-[#FAFAFA] dark:bg-[#13091B] text-[#2C143B] dark:text-[#F1E3FC] uppercase tracking-[0.15em] sm:tracking-[0.2em] font-bold text-xs sm:text-sm md:text-lg px-6 sm:px-8 md:px-12 py-3.5 sm:py-4 md:py-6 overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer w-full sm:w-auto"
                    >
                        <span className="relative z-10 flex items-center gap-3 sm:gap-4">
                            Connect via WhatsApp
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-2 transition-transform" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                            </svg>
                        </span>
                        <motion.div
                            className="absolute inset-0 bg-[#F1E3FC] z-0 origin-left"
                            initial={{ scaleX: 0 }}
                            whileHover={{ scaleX: 1 }}
                            transition={{ ease: "circOut", duration: 0.4 }}
                        />
                    </a>
                </motion.div>

                {/* Big Background Element */}
                <h1 className="absolute -bottom-16 sm:-bottom-24 -left-8 sm:-left-12 font-['Syncopate'] text-[20vw] sm:text-[25vw] font-black uppercase text-[#13091B]/10 whitespace-nowrap mix-blend-overlay pointer-events-none">
                    AMBRELLE
                </h1>

                <footer className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex justify-between items-center text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] font-bold border-t border-[#13091B]/20 pt-4 sm:pt-6">
                    <span>&copy; 2026.</span>
                    <span className="hidden sm:inline">Systematic Fragrance Logic.</span>
                    <span className="sm:hidden">Ambrelle.</span>
                </footer>
            </section>
        </div>
    );
}
