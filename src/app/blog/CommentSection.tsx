"use client";

import React, { useState, useTransition } from "react";
import { addComment } from "./actions";
import { motion } from "framer-motion";

export function CommentSection({
    postId,
    postSlug,
    comments,
    user
}: {
    postId: string;
    postSlug: string;
    comments: any[];
    user: any;
}) {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [content, setContent] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        if (!content.trim()) return;

        const formData = new FormData();
        formData.append("post_id", postId);
        formData.append("post_slug", postSlug);
        formData.append("content", content);

        startTransition(async () => {
            const result = await addComment(formData);
            if (result?.error) {
                setError(result.error);
            } else {
                setContent(""); // Clear form on success
            }
        });
    }

    return (
        <section className="mt-24 pt-12 border-t border-[#2C143B]/20 dark:border-white/20">
            <h3 className="font-['Syncopate'] text-3xl font-bold uppercase tracking-tighter mb-12">Discourse_</h3>

            {/* Comment Form */}
            {user ? (
                <form onSubmit={handleSubmit} className="mb-16">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Add to the archive..."
                        required
                        rows={4}
                        className="w-full bg-[#2C143B]/5 dark:bg-white/5 border border-[#2C143B]/10 dark:border-white/10 p-4 text-[#2C143B] dark:text-[#F1E3FC] font-sans focus:outline-none focus:border-[#692484] transition-colors resize-y shadow-inner"
                    />
                    {error && <p className="text-[#692484] text-xs font-bold mt-2">{error}</p>}
                    <button
                        disabled={isPending || !content.trim()}
                        type="submit"
                        className="mt-4 px-8 py-3 bg-[#2C143B] dark:bg-[#F1E3FC] text-[#FAFAFA] dark:text-[#13091B] uppercase tracking-widest font-bold text-xs disabled:opacity-50 hover:bg-[#692484] dark:hover:bg-[#692484] hover:text-[#13091B] transition-colors"
                    >
                        {isPending ? "Transmitting..." : "Submit Entry"}
                    </button>
                </form>
            ) : (
                <div className="mb-16 p-6 border border-dashed border-[#2C143B]/30 dark:border-white/30 text-center text-xs uppercase tracking-widest text-[#2C143B]/50 dark:text-[#F1E3FC]/50 font-bold">
                    Authentication Required to Contribute. <a href="/login" className="text-[#692484] hover:underline">Sign In.</a>
                </div>
            )}

            {/* Comments List */}
            <div className="space-y-8">
                {comments.length > 0 ? comments.map((comment, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={comment.id}
                        className="p-6 bg-[#2C143B]/5 dark:bg-[#13091B]/80 border-l-2 border-[#2C143B]/20 dark:border-white/20 hover:border-[#692484] transition-colors"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#692484]">User_{comment.user_id.substring(0, 6)}</span>
                            <span className="text-xs font-['Space_Mono'] text-[#2C143B]/40 dark:text-[#F1E3FC]/40">[{new Date(comment.created_at).toLocaleDateString()}]</span>
                        </div>
                        <p className="font-sans text-[#2C143B]/80 dark:text-[#F1E3FC]/80 leading-relaxed text-sm">
                            {comment.content}
                        </p>
                    </motion.div>
                )) : (
                    <p className="text-[#2C143B]/40 dark:text-[#F1E3FC]/40 text-xs uppercase tracking-widest italic">No entries in this sector yet.</p>
                )}
            </div>
        </section>
    );
}

