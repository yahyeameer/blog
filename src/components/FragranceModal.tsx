"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Post {
    id: string;
    title: string;
    slug?: string;
    topic?: string;
    content?: string;
    image_url?: string;
    created_at: string;
}

function parseContent(content: string) {
    const lines = content.split("\n").filter(Boolean);
    const sections: { heading?: string; lines: string[] }[] = [];
    let current: { heading?: string; lines: string[] } = { lines: [] };

    for (const line of lines) {
        if (line.startsWith("**Aromatic Notes**")) {
            if (current.lines.length) sections.push(current);
            current = { heading: "Aromatic Notes", lines: [] };
        } else if (line.match(/^\*\*(Top|Heart|Base) notes:\*\*/)) {
            current.lines.push(line.replace(/\*\*/g, ""));
        } else {
            current.lines.push(line.replace(/\*\*(.*?)\*\*/g, "$1"));
        }
    }
    if (current.lines.length) sections.push(current);
    return sections;
}

export function FragranceModal({
    post,
    onClose,
}: {
    post: Post | null;
    onClose: () => void;
}) {
    useEffect(() => {
        if (post) {
            document.body.style.overflow = "hidden";
        }
        return () => { document.body.style.overflow = ""; };
    }, [post]);

    useEffect(() => {
        if (!post) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [post, onClose]);

    const sections = post?.content ? parseContent(post.content) : [];
    const aromaticSection = sections.find((s) => s.heading === "Aromatic Notes");
    const descSections = sections.filter((s) => !s.heading);
    const description = descSections.flatMap((s) => s.lines).join(" ");

    return (
        <AnimatePresence>
            {post && (
                <motion.div
                    key="backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6"
                    onClick={onClose}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-[#13091B]/90 backdrop-blur-xl" />

                    {/* Modal Card — swipe-to-close on mobile */}
                    <motion.div
                        key="modal"
                        initial={{ opacity: 0, y: 80, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 80, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 180, damping: 26 }}
                        drag="y"
                        dragConstraints={{ top: 0, bottom: 0 }}
                        dragElastic={0.4}
                        onDragEnd={(_, info) => {
                            if (info.offset.y > 120) onClose();
                        }}
                        className="relative z-10 w-full sm:max-w-2xl md:max-w-4xl max-h-[90vh] sm:max-h-[88vh] overflow-y-auto modal-scroll bg-[#FAFAFA] dark:bg-[#1A0A24] flex flex-col sm:flex-row rounded-t-2xl sm:rounded-2xl overflow-hidden border border-[#692484]/30"
                        style={{ boxShadow: "var(--shadow-xl)" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Swipe indicator — mobile only */}
                        <div className="sm:hidden flex justify-center py-2 flex-shrink-0">
                            <div className="w-10 h-1 rounded-full bg-[#692484]/30" />
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#692484]/10 hover:bg-[#692484]/30 border border-[#692484]/30 flex items-center justify-center text-[#692484] transition-colors duration-200 cursor-pointer"
                            aria-label="Close"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>

                        {/* Left — Image Column */}
                        <div className="relative w-full sm:w-[42%] flex-shrink-0 bg-[#692484]/10 dark:bg-[#692484]/20 flex items-center justify-center overflow-hidden min-h-[200px] sm:min-h-[280px] md:min-h-0">
                            {/* Glow blobs */}
                            <div className="absolute top-0 left-0 w-40 sm:w-64 h-40 sm:h-64 bg-[#692484]/30 rounded-full blur-[60px] sm:blur-[80px] -translate-x-1/2 -translate-y-1/2" />
                            <div className="absolute bottom-0 right-0 w-40 sm:w-64 h-40 sm:h-64 bg-[#9B4FC4]/20 rounded-full blur-[40px] sm:blur-[60px] translate-x-1/3 translate-y-1/3" />

                            {post.image_url ? (
                                <motion.img
                                    initial={{ scale: 1.1, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.15, duration: 0.7, ease: "easeOut" }}
                                    src={post.image_url}
                                    alt={post.title}
                                    className="relative z-10 w-[55%] sm:w-[65%] md:w-[75%] object-contain drop-shadow-2xl"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = "none";
                                    }}
                                />
                            ) : (
                                <div className="relative z-10 text-[#692484]/40 text-4xl sm:text-6xl font-['Syncopate'] font-black uppercase select-none">
                                    IBRAQ
                                </div>
                            )}

                            {/* Topic badge */}
                            {post.topic && (
                                <div className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 z-20 px-2.5 py-0.5 sm:px-3 sm:py-1 bg-[#692484] text-white text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] font-bold rounded-full">
                                    {post.topic}
                                </div>
                            )}
                        </div>

                        {/* Right — Content Column */}
                        <div className="flex-1 p-4 sm:p-6 md:p-10 flex flex-col justify-between overflow-y-auto">
                            {/* Header */}
                            <div>
                                <motion.div
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-5"
                                >
                                    <span className="h-px w-6 sm:w-10 bg-[#692484]" />
                                    <span className="text-[#692484] text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.25em] font-bold font-['Space_Mono']">
                                        Ibrahim Al-Qurashi
                                    </span>
                                </motion.div>

                                <motion.h2
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.18 }}
                                    className="font-['Playfair_Display'] text-xl sm:text-2xl md:text-3xl font-black uppercase leading-[1.15] tracking-tight text-[#2C143B] dark:text-[#F1E3FC] mb-4 sm:mb-6"
                                >
                                    {post.title}
                                </motion.h2>

                                {/* Description */}
                                {description && (
                                    <motion.p
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.25 }}
                                        className="text-[#2C143B]/70 dark:text-[#F1E3FC]/70 text-xs sm:text-sm leading-relaxed font-['Inter'] mb-5 sm:mb-7 line-clamp-4 sm:line-clamp-5"
                                    >
                                        {description}
                                    </motion.p>
                                )}

                                {/* Aromatic Notes */}
                                {aromaticSection && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.32 }}
                                        className="border border-[#692484]/20 dark:border-[#692484]/30 rounded-lg sm:rounded-xl p-3 sm:p-5 mb-5 sm:mb-7 bg-[#692484]/5 dark:bg-[#692484]/10"
                                    >
                                        <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.25em] font-bold text-[#692484] mb-3 sm:mb-4 font-['Space_Mono']">
                                            Aromatic Pyramid
                                        </p>
                                        <div className="space-y-2 sm:space-y-3">
                                            {aromaticSection.lines.map((line, i) => {
                                                const [label, ...rest] = line.split(":");
                                                const value = rest.join(":").trim();
                                                const icons = ["↑", "♦", "↓"];
                                                const colors = ["text-[#c084fc]", "text-[#a855f7]", "text-[#7c3aed]"];
                                                return (
                                                    <div key={i} className="flex items-start gap-2 sm:gap-3">
                                                        <span className={`${colors[i % 3]} font-black text-[10px] sm:text-xs mt-0.5 w-3 sm:w-4 flex-shrink-0`}>{icons[i % 3]}</span>
                                                        <div>
                                                            <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#692484]/60 dark:text-[#F1E3FC]/40 font-bold block mb-0.5">
                                                                {label}
                                                            </span>
                                                            <span className="text-[11px] sm:text-xs text-[#2C143B]/90 dark:text-[#F1E3FC]/90 font-['Inter']">
                                                                {value}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* Footer Actions */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="flex flex-col gap-2 sm:gap-3 mt-2"
                            >
                                <a
                                    href={`https://wa.me/97474068029?text=${encodeURIComponent(`Hello! I'm interested in purchasing: ${post.title}. Can you help me with pricing and availability?`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative w-full text-center py-3 sm:py-3.5 bg-[#692484] text-white text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] font-bold overflow-hidden hover:shadow-lg hover:shadow-[#692484]/30 transition-shadow cursor-pointer rounded-lg sm:rounded-none"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                        Order via WhatsApp
                                    </span>
                                    <motion.div
                                        className="absolute inset-0 bg-[#25D366] z-0 origin-left"
                                        initial={{ scaleX: 0 }}
                                        whileHover={{ scaleX: 1 }}
                                        transition={{ ease: "circOut", duration: 0.35 }}
                                    />
                                </a>
                                <button
                                    onClick={onClose}
                                    className="w-full px-6 py-2.5 sm:py-3.5 border border-[#692484]/30 text-[#692484] text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] font-bold hover:bg-[#692484]/10 transition-colors cursor-pointer rounded-lg sm:rounded-none"
                                >
                                    Close
                                </button>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
