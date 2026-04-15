"use client";

import React, { useState, useTransition } from "react";
import { addComment } from "./actions";

interface Comment {
    id: string;
    user_id: string;
    content: string;
    created_at: string;
}

interface User {
    id: string;
    email?: string;
}

export function CommentSection({
    postId,
    postSlug,
    comments,
    user
}: {
    postId: string;
    postSlug: string;
    comments: Comment[];
    user: User | null | undefined;
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
        <section className="mt-24 pt-12 border-t border-gray-200">
            <h3 className="font-['Syncopate'] text-3xl font-bold uppercase tracking-widest mb-12 text-black">Comments</h3>

            {/* Comment Form */}
            {user ? (
                <form onSubmit={handleSubmit} className="mb-16">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Add a comment..."
                        required
                        rows={4}
                        className="w-full bg-white border border-gray-300 p-4 text-black focus:outline-none focus:border-black transition-colors resize-y rounded-none"
                    />
                    {error && <p className="text-red-600 text-xs font-bold mt-2">{error}</p>}
                    <button
                        disabled={isPending || !content.trim()}
                        type="submit"
                        className="mt-4 px-8 py-3 bg-black text-white hover:bg-gray-800 transition-colors uppercase tracking-widest font-bold text-xs disabled:opacity-50 rounded-none border border-black"
                    >
                        {isPending ? "Submitting..." : "Submit Comment"}
                    </button>
                </form>
            ) : (
                <div className="mb-16 p-6 border border-gray-200 bg-gray-50 text-center text-xs uppercase tracking-widest text-gray-500 font-bold rounded-none">
                    Authentication Required to Comment. <a href="/login" className="text-black hover:underline cursor-pointer">Sign In</a>.
                </div>
            )}

            {/* Comments List */}
            <div className="space-y-8">
                {comments.length > 0 ? comments.map((comment) => (
                    <div
                        key={comment.id}
                        className="p-6 bg-white border border-gray-100 shadow-sm rounded-none hover:border-gray-200 transition-colors"
                    >
                        <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-black">User_{comment.user_id.substring(0, 6)}</span>
                            <span className="text-xs font-['Space_Mono'] text-gray-400">[{new Date(comment.created_at).toLocaleDateString()}]</span>
                        </div>
                        <p className="font-sans text-gray-700 leading-relaxed text-sm">
                            {comment.content}
                        </p>
                    </div>
                )) : (
                    <p className="text-gray-400 text-xs uppercase tracking-widest italic border-l-2 border-gray-200 pl-4 py-2">No comments yet.</p>
                )}
            </div>
        </section>
    );
}

