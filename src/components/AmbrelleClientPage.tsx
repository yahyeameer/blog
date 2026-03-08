"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
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

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-[#2C143B] dark:bg-[#13091B] dark:text-[#F1E3FC] font-['Space_Mono'] selection:bg-[#692484]/40 flex flex-col overflow-hidden transition-colors duration-500">

            {/* Top Kinetic Bar */}
            <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                transition={{ duration: 1, ease: "circOut" }}
                className="w-full bg-[#692484] text-[#13091B] text-xs uppercase tracking-[0.2em] py-2 text-center font-bold overflow-hidden whitespace-nowrap"
            >
                <div className="animate-marquee inline-block">
                    &bull; THE OFFICIAL BLOG OF AMBRELLE FRAGRANCE &bull; INSIGHTS & OLFACTORY ART &bull; THE OFFICIAL BLOG OF AMBRELLE FRAGRANCE &bull;
                </div>
            </motion.div>

            {/* Glass Navigation */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 50, delay: 0.2 }}
                className="sticky top-0 z-50 w-full bg-[#FAFAFA]/70 dark:bg-[#13091B]/70 backdrop-blur-xl border-b border-[#2C143B]/10 dark:border-white/10 grid grid-cols-2 md:grid-cols-3 items-center h-24 px-6 md:px-12 transition-colors duration-500"
            >
                <div className="hidden md:flex gap-8 uppercase text-xs tracking-[0.1em] font-bold items-center">
                    <motion.button whileHover={{ y: -2, color: "#692484" }} whileTap={{ scale: 0.95 }} className="transition-colors mix-blend-difference" onClick={() => window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' })}>
                        Blog
                    </motion.button>
                    <motion.button whileHover={{ y: -2, color: "#692484" }} whileTap={{ scale: 0.95 }} className="transition-colors mix-blend-difference" onClick={() => window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' })}>
                        Our Story
                    </motion.button>
                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link href="/admin" className="hover:text-[#692484] transition-colors">Admin</Link>
                            <Link href="/admin/create-post" className="hover:text-[#692484] transition-colors text-[#692484]/70">+ New Post</Link>
                            <button onClick={() => signout()} className="text-[#2C143B]/40 dark:text-[#F1E3FC]/40 hover:text-red-500 transition-colors">Sign Out</button>
                        </div>
                    ) : (
                        <Link href="/login" className="hover:text-[#692484] transition-colors mix-blend-difference">
                            Sign In / Up
                        </Link>
                    )}
                </div>

                <div className="col-span-1 md:col-span-1 flex justify-start md:justify-center">
                    <motion.div whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }} transition={{ duration: 0.3 }} className="p-2 border border-[#2C143B]/10 dark:border-white/10 rounded-full bg-white shadow-xl">
                        <img src="/logo.jpg" alt="Ambrelle Fragrance" className="h-12 w-12 md:h-14 md:w-14 object-contain " />
                    </motion.div>
                </div>

                <div className="flex justify-end items-center gap-4 md:gap-6 col-span-1 ml-auto">
                    <div className="hidden sm:block"><ThemeToggle /></div>
                    <div className="uppercase text-[10px] md:text-xs tracking-[0.1em] font-bold border border-[#2C143B]/20 dark:border-white/20 rounded-full px-4 md:px-6 py-2 md:py-3 hover:border-[#692484] dark:hover:border-[#692484] transition-colors group">
                        <a href="https://wa.me/97474068029" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#692484] animate-pulse" />
                            <span className="group-hover:text-[#692484] transition-colors hidden sm:inline">WhatsApp Live</span>
                            <span className="group-hover:text-[#692484] transition-colors sm:hidden">Chat</span>
                        </a>
                    </div>
                </div>
            </motion.nav>

            {/* Kinetic Hero Section */}
            <section ref={heroRef} className="relative w-full h-[90vh] md:h-[100vh] overflow-hidden flex items-end justify-start px-6 pb-24 md:px-12 md:pb-32">
                <motion.div style={{ scale: scaleImage }} className="absolute inset-0">
                    {/* Background Image — properly visible in both modes */}
                    <div className="absolute inset-0 bg-[url('/hero_bg.png')] bg-cover bg-[center_top_20%]" style={{ opacity: 1 }} />
                    {/* Light mode overlay — gentle white wash at the bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA]/40 to-transparent dark:from-[#13091B] dark:via-[#13091B]/30 dark:to-transparent transition-colors duration-500" />
                    {/* Purple tint layer for brand identity */}
                    <div className="absolute inset-0 bg-[#692484]/10 dark:bg-[#692484]/20" />
                </motion.div>

                {/* Halo glow blob behind hero text */}
                <div className="absolute bottom-32 left-8 md:left-12 w-[600px] h-[300px] bg-[#692484]/20 dark:bg-[#692484]/40 rounded-full blur-[120px] pointer-events-none" />

                <motion.div style={{ y: yHeroText, opacity: opacityHero }} className="relative z-10 w-full max-w-7xl">
                    <h1 className="font-['Syncopate'] text-[12vw] md:text-[8vw] font-bold leading-[0.9] uppercase tracking-tighter mb-8 flex flex-wrap gap-x-4">
                        <span className="overflow-hidden block">
                            <motion.span
                                custom={0} variants={wordVariants} initial="hidden" animate="visible"
                                whileHover={{ letterSpacing: "0.12em", textShadow: "0 0 40px #692484, 0 0 80px #692484aa" }}
                                transition={{ duration: 0.35 }}
                                className="block text-[#692484] cursor-default"
                                style={{ textShadow: "0 0 20px #69248466" }}
                            >SCENT</motion.span>
                        </span>
                        <span className="overflow-hidden block">
                            <motion.span
                                custom={1} variants={wordVariants} initial="hidden" animate="visible"
                                whileHover={{ letterSpacing: "0.12em", textShadow: "0 0 40px #fff, 0 0 80px #ffffffaa" }}
                                transition={{ duration: 0.35 }}
                                className="block text-[#2C143B] dark:text-[#F1E3FC] cursor-default"
                            >AS</motion.span>
                        </span>
                        <span className="overflow-hidden block w-full">
                            <motion.span
                                custom={2} variants={wordVariants} initial="hidden" animate="visible"
                                whileHover={{ letterSpacing: "0.12em", textShadow: "0 0 40px #692484, 0 0 80px #692484aa" }}
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
                        className="text-sm md:text-base text-[#2C143B]/80 dark:text-[#F1E3FC]/70 font-sans tracking-wide mb-8 max-w-md backdrop-blur-sm"
                        style={{ textShadow: "0 1px 12px rgba(255,255,255,0.8)" }}
                    >
                        Where luxury meets identity. Every fragrance tells a story of elegance and unforgettable moments.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1, type: "spring" }}
                        className="flex flex-col sm:flex-row gap-4 mt-4 items-start"
                    >
                        <motion.button
                            whileHover={{ scale: 1.03, boxShadow: "0 0 30px #69248466" }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' })}
                            className="group relative px-8 py-4 bg-[#692484] text-white uppercase tracking-widest font-bold text-sm overflow-hidden rounded-none"
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
                            className="px-8 py-4 border-2 border-[#692484] text-[#692484] uppercase tracking-widest font-bold text-sm hover:bg-[#692484]/10 transition-colors backdrop-blur-sm"
                        >
                            Contact Us
                        </motion.a>
                    </motion.div>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="absolute bottom-12 right-12 w-px h-24 bg-gradient-to-b from-[#692484] to-transparent hidden md:block"
                />
            </section>

            {/* Asymmetric Story Section */}
            <section className="py-32 px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 border-b border-[#2C143B]/10 dark:border-white/10 relative overflow-hidden transition-colors duration-500">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#692484]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="col-span-1 lg:col-span-5 flex flex-col justify-center relative z-10"
                >
                    <motion.p variants={itemVariants} className="uppercase tracking-[0.2em] text-[#692484] text-xs font-bold mb-6 flex items-center gap-4">
                        <span className="w-12 h-px bg-[#692484]" /> Origin
                    </motion.p>
                    <motion.h2
                        variants={itemVariants}
                        whileHover={{ textShadow: "0 0 40px #692484aa", letterSpacing: "0.02em" }}
                        transition={{ duration: 0.3 }}
                        className="font-['Syncopate'] text-5xl md:text-7xl font-bold uppercase leading-[1.1] mb-12 text-[#2C143B] dark:text-[#F1E3FC] cursor-default"
                    >
                        Systematic<br />Sensory<br />Overload.
                    </motion.h2>
                    <motion.div variants={itemVariants} className="w-full h-64 md:h-96 relative overflow-hidden border border-[#2C143B]/10 dark:border-white/10 group mt-auto shadow-2xl">
                        <img src="/luxury_fragrance.png" alt="Ambrelle Luxury Fragrance" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out" />
                        <div className="absolute inset-0 bg-[#692484] opacity-20 mix-blend-color group-hover:opacity-0 transition-opacity duration-1000" />
                    </motion.div>
                </motion.div>

                <div className="col-span-1 lg:col-span-7 flex flex-col justify-center relative z-10">
                    <motion.div
                        variants={itemVariants}
                        className="bg-[#2C143B]/5 dark:bg-white/5 backdrop-blur-md border border-[#2C143B]/10 dark:border-white/10 p-8 md:p-12 text-[#2C143B]/80 dark:text-[#F1E3FC]/80 leading-relaxed text-lg transition-colors duration-500"
                    >
                        {postContent ? (
                            <div className="space-y-6" dangerouslySetInnerHTML={{ __html: postContent.replace(/\n\n/g, '<br/><br/>').replace(/\*\*(.*?)\*\*/g, '<strong class="text-current">$1</strong>') }} />
                        ) : (
                            <div className="space-y-6">
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
                            className="mt-12 uppercase tracking-widest text-[#692484] text-sm font-bold cursor-pointer inline-flex items-center gap-2"
                        >
                            Read Full Manifesto <span className="text-xl">→</span>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Kinetic Article Grid */}
            <section className="py-32 px-6 md:px-12 bg-[#F0EAF7] dark:bg-[#0D0715] transition-colors duration-500">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8"
                >
                    <div>
                        <h2 className="font-['Syncopate'] text-5xl md:text-8xl font-bold uppercase tracking-tighter text-[#692484]/20 dark:text-[#692484]/30">Archives_</h2>
                    </div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#2C143B]/50 dark:text-[#F1E3FC]/50 font-bold font-['Space_Mono'] max-w-xs text-right">
                        Click any card to explore the full fragrance profile
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts && posts.length > 0 ? posts.map((article, idx) => (
                        <motion.div
                            key={article.id || idx}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.5, delay: idx * 0.08, ease: "easeOut" }}
                            onClick={() => setSelectedPost(article)}
                            className="group relative bg-white dark:bg-[#1A0A24] border border-[#692484]/15 dark:border-[#692484]/25 overflow-hidden cursor-pointer shadow-sm hover:shadow-xl hover:shadow-[#692484]/20 transition-all duration-500 rounded-2xl flex flex-col"
                        >
                            {/* Image Area */}
                            <div className="relative w-full h-56 bg-[#692484]/10 dark:bg-[#692484]/20 overflow-hidden flex items-center justify-center">
                                {/* Subtle glow */}
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
                                            className="w-full h-full object-contain p-6"
                                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="font-['Syncopate'] text-[#692484]/30 text-4xl font-black uppercase">IBRAQ</span>
                                        </div>
                                    )}
                                </motion.div>
                                {/* Topic chip */}
                                {article.topic && (
                                    <div className="absolute top-3 left-3 z-20 px-2.5 py-1 bg-[#692484] text-white text-[9px] uppercase tracking-[0.2em] font-bold rounded-full">
                                        {article.topic}
                                    </div>
                                )}
                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-[#692484] opacity-0 group-hover:opacity-10 z-20 transition-opacity duration-500" />
                            </div>

                            {/* Content Area */}
                            <div className="p-5 flex flex-col flex-1 justify-between">
                                <div>
                                    <span className="text-[9px] uppercase tracking-[0.2em] text-[#692484]/60 dark:text-[#F1E3FC]/40 font-bold font-['Space_Mono']">
                                        {new Date(article.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </span>
                                    <h3 className="font-['Syncopate'] text-base font-bold uppercase leading-tight text-[#2C143B] dark:text-[#F1E3FC] mt-2 mb-3 line-clamp-2 group-hover:text-[#692484] dark:group-hover:text-[#c084fc] transition-colors duration-300">
                                        {article.title}
                                    </h3>
                                    {article.content && (
                                        <p className="text-xs text-[#2C143B]/60 dark:text-[#F1E3FC]/50 font-sans line-clamp-2 leading-relaxed">
                                            {article.content.replace(/\*\*(.*?)\*\*/g, '$1').split('\n')[0]}
                                        </p>
                                    )}
                                </div>
                                {/* CTA row */}
                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#692484]/10 dark:border-[#692484]/20">
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-[#692484] font-['Space_Mono'] flex items-center gap-1.5 group-hover:gap-3 transition-all duration-300">
                                        Explore
                                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                    </span>
                                    <div className="w-6 h-6 rounded-full border border-[#692484]/30 flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-[#692484] animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="col-span-full border border-dashed border-[#692484]/30 p-12 text-center text-[#2C143B]/50 dark:text-white/50 uppercase tracking-widest text-sm font-bold rounded-2xl">
                            NO RECORDS FOUND IN ARCHIVE.
                        </div>
                    )}
                </div>
            </section>

            {/* Fragrance Detail Modal */}
            <FragranceModal post={selectedPost} onClose={() => setSelectedPost(null)} />

            {/* Brutalist Footer & Contact */}
            <section className="bg-[#692484] text-[#13091B] py-32 px-6 md:px-12 relative overflow-hidden">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 40 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto text-center relative z-10"
                >
                    <h2 className="font-['Syncopate'] text-[8vw] md:text-[6vw] font-bold uppercase leading-[0.9] tracking-tighter mb-12 ">
                        <span className="opacity-40">Require</span> Assistance?
                    </h2>

                    <a
                        href="https://wa.me/97474068029"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative inline-flex items-center justify-center gap-4 bg-[#FAFAFA] dark:bg-[#13091B] text-[#2C143B] dark:text-[#F1E3FC] uppercase tracking-[0.2em] font-bold text-sm md:text-lg px-8 md:px-12 py-4 md:py-6 overflow-hidden hover:scale-105 transition-all duration-300"
                    >
                        <span className="relative z-10 flex items-center gap-4">
                            Connect via WhatsApp
                            <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                            </svg>
                        </span>
                        <motion.div
                            className="absolute inset-0 bg-[#F1E3FC] z-0 origin-left"
                            initial={{ scaleX: 0 }}
                            whileHover={{ scaleX: 1 }}
                            transition={{ ease: "circOut", duration: 0.4 }}
                        />
                        <span className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 mix-blend-difference z-20 text-[#13091B] !text-black transition-opacity duration-300">+974 7406 8029</span>
                    </a>
                </motion.div>

                {/* Big Background Element */}
                <h1 className="absolute -bottom-24 -left-12 font-['Syncopate'] text-[25vw] font-black uppercase text-[#13091B]/10 whitespace-nowrap mix-blend-overlay pointer-events-none">
                    AMBRELLE
                </h1>

                <footer className="absolute bottom-6 left-6 right-6 flex justify-between items-center text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold border-t border-[#13091B]/20 pt-6 ">
                    <span>&copy; 2026.</span>
                    <span>Systematic Fragrance Logic.</span>
                </footer>
            </section>
        </div>
    );
}

