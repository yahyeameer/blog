"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { reorderPosts } from "./actions";

interface Post {
    id: string;
    title: string;
    slug?: string;
    topic?: string;
    image_url?: string;
    price?: number | null;
    in_stock?: boolean;
    created_at: string;
    sort_order?: number;
}

export function DraggableProductList({ initialPosts }: { initialPosts: Post[] }) {
    const [posts, setPosts] = useState(initialPosts);
    const [isPending, startTransition] = useTransition();
    const [draggedId, setDraggedId] = useState<string | null>(null);

    const handleDragStart = (e: React.DragEvent, id: string) => {
        setDraggedId(id);
        if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = "move";
            // Firefox requires setting data
            e.dataTransfer.setData("text/plain", id);
        }
    };

    const handleDragOver = (e: React.DragEvent, targetId: string) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        if (!draggedId || draggedId === targetId) return;

        const draggedIndex = posts.findIndex(p => p.id === draggedId);
        const targetIndex = posts.findIndex(p => p.id === targetId);

        if (draggedIndex === -1 || targetIndex === -1) return;

        const newPosts = [...posts];
        const [removed] = newPosts.splice(draggedIndex, 1);
        newPosts.splice(targetIndex, 0, removed);
        
        setPosts(newPosts);
    };

    const handleDragEnd = () => {
        setDraggedId(null);
        // Save to DB
        startTransition(async () => {
            const ids = posts.map(p => p.id);
            await reorderPosts(ids);
        });
    };

    if (posts.length === 0) {
        return (
            <div className="text-center py-24 bg-white border border-dashed border-gray-300 rounded-lg">
                <svg className="w-12 h-12 text-gray-200 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <p className="text-sm text-gray-400 mb-6">No products yet</p>
                <Link href="/admin/create-post" className="inline-block px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors text-xs uppercase tracking-wider font-medium rounded-md">
                    Add Your First Product
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-3 relative">
            {isPending && (
                <div className="absolute top-0 right-0 -mt-8 text-xs text-gray-500 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full border-2 border-gray-300 border-t-black animate-spin"></div>
                    Saving order...
                </div>
            )}
            
            {posts.map((post) => (
                <div 
                    key={post.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, post.id)}
                    onDragOver={(e) => handleDragOver(e, post.id)}
                    onDragEnd={handleDragEnd}
                    className={`group bg-white rounded-lg border border-gray-200 hover:border-gray-400 hover:shadow-sm transition-all duration-200 overflow-hidden cursor-grab active:cursor-grabbing ${draggedId === post.id ? 'opacity-50 scale-[0.99] shadow-md border-black' : ''}`}
                >
                    <div className="flex items-center gap-4 md:gap-6 p-4">
                        {/* Drag Handle */}
                        <div className="w-6 flex items-center justify-center text-gray-300 cursor-grab hover:text-black transition-colors">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="12" r="1"></circle>
                                <circle cx="9" cy="5" r="1"></circle>
                                <circle cx="9" cy="19" r="1"></circle>
                                <circle cx="15" cy="12" r="1"></circle>
                                <circle cx="15" cy="5" r="1"></circle>
                                <circle cx="15" cy="19" r="1"></circle>
                            </svg>
                        </div>

                        {/* Thumbnail */}
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-50 flex-shrink-0 rounded-lg overflow-hidden relative pointer-events-none">
                            {post.image_url ? (
                                <Image
                                    src={post.image_url}
                                    alt={post.title}
                                    fill
                                    sizes="80px"
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                    <svg className="w-6 h-6 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V4.5a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v15a1.5 1.5 0 001.5 1.5z" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0 pointer-events-none">
                            <div className="flex items-start gap-2 mb-1">
                                <h3 className="font-semibold text-sm md:text-base truncate text-black leading-tight">
                                    {post.title}
                                </h3>
                                {post.in_stock === false && (
                                    <span className="flex-shrink-0 text-[10px] uppercase tracking-wider bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full font-medium">
                                        Out of stock
                                    </span>
                                )}
                                {post.in_stock !== false && (
                                    <span className="flex-shrink-0 text-[10px] uppercase tracking-wider bg-green-50 text-green-600 border border-green-200 px-2 py-0.5 rounded-full font-medium">
                                        In stock
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 md:gap-3">
                                {post.topic && (
                                    <span className="text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded font-medium">{post.topic}</span>
                                )}
                                {post.price && (
                                    <span className="text-[11px] font-semibold text-black">${Number(post.price).toFixed(2)}</span>
                                )}
                            </div>
                        </div>

                        {/* Edit Button */}
                        <Link href={`/admin/edit-post/${post.id}`}
                            className="flex-shrink-0 px-4 py-2 border border-gray-200 text-gray-600 text-xs uppercase tracking-wider font-medium text-center hover:bg-black hover:text-white hover:border-black transition-all duration-200 rounded-md opacity-0 group-hover:opacity-100 md:opacity-100">
                            Edit
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
}
