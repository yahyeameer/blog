"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { Post } from "@/types";

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

    if (!post) return null;

    const sections = parseContent(post.content || "");
    const aromaticSection = sections.find((s) => s.heading === "Aromatic Notes");
    const descSections = sections.filter((s) => !s.heading);
    const description = descSections.flatMap((s) => s.lines).join(" ");

    return (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/60"
            onClick={onClose}
        >
            <div 
                className="relative z-10 w-full sm:max-w-2xl md:max-w-4xl max-h-[90vh] overflow-y-auto bg-white flex flex-col md:flex-row border border-gray-200 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 w-8 h-8 md:w-10 md:h-10 border border-gray-300 bg-white hover:bg-gray-100 flex items-center justify-center text-black cursor-pointer transition-colors"
                    aria-label="Close"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                {/* Left — Image Column */}
                <div className="relative w-full md:w-1/2 flex-shrink-0 bg-[#f9f9f9] flex items-center justify-center overflow-hidden min-h-[300px] border-b md:border-b-0 md:border-r border-gray-200 p-8">
                    {post.image_url ? (
                        <Image
                            src={post.image_url}
                            alt={post.title}
                            fill
                            className="object-contain p-8"
                        />
                    ) : (
                        <div className="text-gray-300 text-4xl sm:text-6xl font-black uppercase tracking-tighter">
                            IMAGE
                        </div>
                    )}
                </div>

                {/* Right — Content Column */}
                <div className="flex-1 p-6 md:p-12 flex flex-col justify-between overflow-y-auto">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-gray-500 text-xs uppercase tracking-widest font-medium">
                                {post.topic || "Product"}
                            </span>
                            {post.in_stock === false ? (
                                <span className="text-[10px] uppercase tracking-wider bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full font-medium">Sold Out</span>
                            ) : (
                                <span className="text-[10px] uppercase tracking-wider bg-green-50 text-green-600 border border-green-200 px-2 py-0.5 rounded-full font-medium">In Stock</span>
                            )}
                        </div>

                        <h2 className="text-2xl md:text-3xl font-semibold leading-tight text-black mb-3">
                            {post.title}
                        </h2>

                        {post.price && (
                            <div className="flex items-center gap-3 mb-6">
                                <p className="text-xl font-semibold text-black">${Number(post.price).toFixed(2)}</p>
                                {post.compare_at_price && post.compare_at_price > post.price && (
                                    <p className="text-sm font-medium text-gray-400 line-through">${Number(post.compare_at_price).toFixed(2)}</p>
                                )}
                            </div>
                        )}

                        {/* Description */}
                        {description && (
                            <p className="text-gray-700 text-sm leading-relaxed mb-8">
                                {description}
                            </p>
                        )}

                        {/* Aromatic Notes */}
                        {aromaticSection && (
                            <div className="p-5 mb-8 border border-gray-200 bg-[#fafafa]">
                                <p className="text-xs uppercase tracking-widest font-bold text-black mb-4">
                                    Aromatic Details
                                </p>
                                <div className="space-y-4">
                                    {aromaticSection.lines.map((line, i) => {
                                        const [label, ...rest] = line.split(":");
                                        const value = rest.join(":").trim();
                                        return (
                                            <div key={i} className="flex flex-col">
                                                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">
                                                    {label}
                                                </span>
                                                <span className="text-sm text-black font-semibold">
                                                    {value}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="flex flex-col gap-3 mt-4">
                        <a
                            href={`https://wa.me/97474068029?text=${encodeURIComponent(`Hello! I'm interested in purchasing: ${post.title}. Can you help me with pricing and availability?`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full text-center py-4 bg-black text-white hover:bg-gray-800 transition-colors text-xs uppercase tracking-[0.2em] font-bold"
                        >
                            Order via WhatsApp
                        </a>
                        <button
                            onClick={onClose}
                            className="w-full text-center py-4 border border-gray-300 text-black hover:bg-gray-50 transition-colors text-xs uppercase tracking-[0.2em] font-bold"
                        >
                            Close Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
