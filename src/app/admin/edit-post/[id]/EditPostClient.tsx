"use client";

import React, { useState, useTransition, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { updatePost, deletePost } from "../../actions";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";

interface Post {
    id: string;
    title: string;
    slug?: string;
    topic?: string;
    content?: string;
    image_url?: string;
}

export default function EditPostClient({ post }: { post: Post }) {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [imageUrl, setImageUrl] = useState(post.image_url || "");
    const [preview, setPreview] = useState<string | null>(post.image_url || null);
    const [uploading, setUploading] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    async function handleImageUpload(file: File) {
        setUploading(true);
        const supabase = createClient();
        const ext = file.name.split(".").pop();
        const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { data, error: upErr } = await supabase.storage
            .from("post-images")
            .upload(filename, file, { cacheControl: "3600", upsert: false });
        if (upErr) { setError("Upload failed: " + upErr.message); setUploading(false); return; }
        const { data: { publicUrl } } = supabase.storage.from("post-images").getPublicUrl(data.path);
        setImageUrl(publicUrl);
        setPreview(publicUrl);
        setUploading(false);
    }

    async function handleSubmit(formData: FormData) {
        setError(null);
        if (imageUrl) formData.set("image_url", imageUrl);
        startTransition(async () => {
            const result = await updatePost(post.id, formData);
            if (result?.error) {
                setError(result.error);
            } else {
                setSuccess(true);
                setTimeout(() => window.location.href = "/admin", 1500);
            }
        });
    }

    async function handleDelete() {
        startTransition(async () => {
            const result = await deletePost(post.id);
            if (result?.error) { setError(result.error); }
            else { window.location.href = "/"; }
        });
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-[#2C143B] dark:bg-[#13091B] dark:text-[#F1E3FC] font-['Space_Mono'] transition-colors duration-500 py-24 px-6 md:px-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#692484]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="max-w-3xl mx-auto relative z-10">
                <div className="flex items-center justify-between mb-12">
                    <button onClick={() => router.push("/admin")} className="uppercase tracking-[0.2em] text-[#692484] text-xs font-bold hover:text-[#2C143B] dark:hover:text-white transition-colors flex items-center gap-2">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6" /></svg>
                        Admin Dashboard
                    </button>
                    <button onClick={() => setConfirmDelete(true)} className="text-xs uppercase tracking-[0.2em] text-red-400 hover:text-red-500 transition-colors border border-red-400/30 hover:border-red-500/50 px-4 py-2 rounded-full">
                        Delete Post
                    </button>
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="font-['Syncopate'] text-3xl md:text-5xl font-bold uppercase tracking-tighter mb-10">
                        Edit <span className="text-[#692484]">Entry.</span>
                    </h1>

                    <form action={handleSubmit} className="space-y-8 bg-[#2C143B]/5 dark:bg-white/5 backdrop-blur-xl border border-[#2C143B]/10 dark:border-white/10 p-8 md:p-12 rounded-2xl">

                        <div>
                            <label className="block text-xs uppercase tracking-[0.1em] font-bold mb-3 text-[#2C143B]/60 dark:text-[#F1E3FC]/60">Title</label>
                            <input type="text" name="title" required defaultValue={post.title}
                                className="w-full bg-transparent border-b border-[#2C143B]/20 dark:border-white/20 py-3 text-xl font-['Syncopate'] uppercase focus:outline-none focus:border-[#692484] transition-colors" />
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-[0.1em] font-bold mb-3 text-[#2C143B]/60 dark:text-[#F1E3FC]/60">Category</label>
                            <input type="text" name="topic" defaultValue={post.topic || ""}
                                className="w-full bg-transparent border-b border-[#2C143B]/20 dark:border-white/20 py-3 text-base focus:outline-none focus:border-[#692484] transition-colors" />
                        </div>

                        {/* Image */}
                        <div>
                            <label className="block text-xs uppercase tracking-[0.1em] font-bold mb-3 text-[#2C143B]/60 dark:text-[#F1E3FC]/60">Fragrance Image</label>
                            <input type="hidden" name="image_url" value={imageUrl} />
                            <div onClick={() => fileRef.current?.click()}
                                className="relative border-2 border-dashed border-[#692484]/30 hover:border-[#692484] rounded-xl p-6 text-center cursor-pointer transition-colors duration-200 group">
                                {preview ? (
                                    <div>
                                        <img src={preview} alt="Preview" className="max-h-44 mx-auto object-contain" />
                                        <p className="text-xs text-[#692484] mt-3 font-bold uppercase tracking-widest">Click to change</p>
                                    </div>
                                ) : (
                                    <p className="text-sm font-bold text-[#692484] uppercase tracking-widest">{uploading ? "Uploading..." : "Upload Image"}</p>
                                )}
                            </div>
                            <input ref={fileRef} type="file" accept="image/*" className="hidden"
                                onChange={(e) => { const f = e.target.files?.[0]; if (f) { setPreview(URL.createObjectURL(f)); handleImageUpload(f); } }} />
                            <input type="url" value={imageUrl} onChange={(e) => { setImageUrl(e.target.value); setPreview(e.target.value); }}
                                placeholder="or paste image URL"
                                className="w-full bg-transparent border-b border-[#2C143B]/10 dark:border-white/10 py-2 text-xs mt-3 focus:outline-none focus:border-[#692484] transition-colors text-[#2C143B]/60 dark:text-[#F1E3FC]/60" />
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-[0.1em] font-bold mb-3 text-[#2C143B]/60 dark:text-[#F1E3FC]/60">Description & Notes</label>
                            <textarea name="content" required rows={12} defaultValue={post.content || ""}
                                className="w-full bg-[#2C143B]/5 dark:bg-[#13091B]/50 border border-[#2C143B]/20 dark:border-white/20 p-4 text-sm focus:outline-none focus:border-[#692484] transition-colors resize-y font-sans rounded-xl leading-relaxed" />
                        </div>

                        {error && <div className="text-red-500 text-xs font-bold bg-red-500/10 p-3 border border-red-500/20 rounded-lg">{error}</div>}
                        <AnimatePresence>{success && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#692484] text-xs font-bold bg-[#692484]/10 p-3 border border-[#692484]/20 rounded-lg text-center uppercase tracking-widest">✓ Updated. Returning...</motion.div>}</AnimatePresence>

                        <button disabled={isPending || uploading} type="submit"
                            className="w-full relative group bg-[#692484] text-white py-5 uppercase tracking-[0.2em] font-bold text-sm overflow-hidden disabled:opacity-50 rounded-xl">
                            <span className="relative z-10">{isPending ? "Saving..." : "Save Changes"}</span>
                            <motion.div className="absolute inset-0 bg-[#8B30A4] z-0 origin-left" initial={{ scaleX: 0 }} whileHover={{ scaleX: 1 }} transition={{ ease: "circOut" }} />
                        </button>
                    </form>
                </motion.div>
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {confirmDelete && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-[#13091B]/90 backdrop-blur-xl flex items-center justify-center p-6">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
                            className="bg-[#1A0A24] border border-red-500/20 rounded-2xl p-8 max-w-sm w-full text-center">
                            <h3 className="font-['Syncopate'] text-lg font-bold uppercase mb-4 text-[#F1E3FC]">Delete This Post?</h3>
                            <p className="text-xs text-[#F1E3FC]/60 mb-8 leading-relaxed">This action is permanent and cannot be undone. The post will be removed from the archives.</p>
                            <div className="flex gap-3">
                                <button onClick={() => setConfirmDelete(false)} className="flex-1 py-3 border border-white/20 text-[#F1E3FC] text-xs uppercase tracking-widest rounded-xl hover:bg-white/5 transition-colors">Cancel</button>
                                <button onClick={handleDelete} className="flex-1 py-3 bg-red-500 text-white text-xs uppercase tracking-widest rounded-xl hover:bg-red-600 transition-colors font-bold">Delete</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
