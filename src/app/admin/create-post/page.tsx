"use client";

import React, { useState, useTransition, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPost } from "../actions";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";

export default function CreatePostPage() {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [imageUrl, setImageUrl] = useState("");
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
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

        if (upErr) {
            setError("Image upload failed: " + upErr.message);
            setUploading(false);
            return;
        }
        const { data: { publicUrl } } = supabase.storage.from("post-images").getPublicUrl(data.path);
        setImageUrl(publicUrl);
        setPreview(publicUrl);
        setUploading(false);
    }

    async function handleSubmit(formData: FormData) {
        setError(null);
        if (imageUrl) formData.set("image_url", imageUrl);
        startTransition(async () => {
            const result = await createPost(formData);
            if (result?.error) {
                setError(result.error);
            } else {
                setSuccess(true);
                setTimeout(() => window.location.href = "/", 1500);
            }
        });
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-[#2C143B] dark:bg-[#13091B] dark:text-[#F1E3FC] font-['Space_Mono'] transition-colors duration-500 py-24 px-6 md:px-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#692484]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#692484]/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

            <div className="max-w-3xl mx-auto relative z-10 w-full">
                <div className="flex items-center justify-between mb-12">
                    <button onClick={() => router.push("/")} className="uppercase tracking-[0.2em] text-[#692484] text-xs font-bold hover:text-[#2C143B] dark:hover:text-white transition-colors flex items-center gap-2">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6" /></svg>
                        Return to Archives
                    </button>
                    <a href="/admin" className="text-xs uppercase tracking-[0.2em] text-[#692484]/60 hover:text-[#692484] transition-colors">Admin Home</a>
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring" }}>
                    <h1 className="font-['Syncopate'] text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-12">
                        Draft <br /><span className="text-[#692484]">Masterpiece.</span>
                    </h1>

                    <form action={handleSubmit} className="space-y-8 bg-[#2C143B]/5 dark:bg-white/5 backdrop-blur-xl border border-[#2C143B]/10 dark:border-white/10 p-8 md:p-12 rounded-2xl">

                        {/* Title */}
                        <div>
                            <label className="block text-xs uppercase tracking-[0.1em] font-bold mb-3 text-[#2C143B]/60 dark:text-[#F1E3FC]/60">Fragrance Title</label>
                            <input type="text" name="title" required
                                placeholder="e.g. Brazilian Tobacco — The Dance of Bergamot"
                                className="w-full bg-transparent border-b border-[#2C143B]/20 dark:border-white/20 py-3 text-xl font-['Syncopate'] uppercase focus:outline-none focus:border-[#692484] transition-colors" />
                        </div>

                        {/* Topic */}
                        <div>
                            <label className="block text-xs uppercase tracking-[0.1em] font-bold mb-3 text-[#2C143B]/60 dark:text-[#F1E3FC]/60">Category</label>
                            <input type="text" name="topic"
                                placeholder="e.g. Scent Review · Oud Collection · Musk Collection"
                                className="w-full bg-transparent border-b border-[#2C143B]/20 dark:border-white/20 py-3 text-base focus:outline-none focus:border-[#692484] transition-colors" />
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-xs uppercase tracking-[0.1em] font-bold mb-3 text-[#2C143B]/60 dark:text-[#F1E3FC]/60">Fragrance Image</label>
                            <input type="hidden" name="image_url" value={imageUrl} />

                            {/* Upload Zone */}
                            <div
                                onClick={() => fileRef.current?.click()}
                                className="relative border-2 border-dashed border-[#692484]/30 hover:border-[#692484] rounded-xl p-8 text-center cursor-pointer transition-colors duration-200 group"
                            >
                                {preview ? (
                                    <div className="relative">
                                        <img src={preview} alt="Preview" className="max-h-48 mx-auto object-contain" />
                                        <p className="text-xs text-[#692484] mt-3 font-bold uppercase tracking-widest">Click to change image</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-[#692484]/10 flex items-center justify-center group-hover:bg-[#692484]/20 transition-colors">
                                            <svg className="w-6 h-6 text-[#692484]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                <path d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-[#692484] uppercase tracking-widest">
                                                {uploading ? "Uploading..." : "Upload Fragrance Photo"}
                                            </p>
                                            <p className="text-xs text-[#2C143B]/40 dark:text-[#F1E3FC]/40 mt-1">or paste URL below · JPG, PNG, WEBP</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <input ref={fileRef} type="file" accept="image/*" className="hidden"
                                onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (f) {
                                        setPreview(URL.createObjectURL(f));
                                        handleImageUpload(f);
                                    }
                                }}
                            />

                            {/* OR: paste URL */}
                            <div className="mt-3">
                                <input type="url" value={imageUrl} onChange={(e) => { setImageUrl(e.target.value); setPreview(e.target.value); }}
                                    placeholder="or paste image URL: https://..."
                                    className="w-full bg-transparent border-b border-[#2C143B]/10 dark:border-white/10 py-2 text-xs focus:outline-none focus:border-[#692484] transition-colors text-[#2C143B]/60 dark:text-[#F1E3FC]/60" />
                            </div>
                        </div>

                        {/* Content */}
                        <div>
                            <label className="block text-xs uppercase tracking-[0.1em] font-bold mb-3 text-[#2C143B]/60 dark:text-[#F1E3FC]/60">Fragrance Description & Notes</label>
                            <p className="text-[10px] text-[#692484]/50 mb-3 tracking-widest">Use **bold** for labels. Start aromatic notes section with "**Aromatic Notes**" on its own line.</p>
                            <textarea name="content" required rows={12}
                                placeholder={`The scent opens with sparkling bergamot and soft lavender...\n\n**Aromatic Notes**\n**Top notes:** Bergamot · Lavender · Pink Peppercorn\n**Heart notes:** Tobacco · Oud · Cherry\n**Base notes:** Leather · Patchouli · Vetiver`}
                                className="w-full bg-[#2C143B]/5 dark:bg-[#13091B]/50 border border-[#2C143B]/20 dark:border-white/20 p-4 text-sm focus:outline-none focus:border-[#692484] transition-colors resize-y font-sans rounded-xl leading-relaxed" />
                        </div>

                        {error && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs font-bold bg-red-500/10 p-3 border border-red-500/20 rounded-lg">
                                {error}
                            </motion.div>
                        )}

                        <AnimatePresence>
                            {success && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                    className="text-[#692484] text-xs font-bold bg-[#692484]/10 p-3 border border-[#692484]/20 rounded-lg text-center uppercase tracking-widest">
                                    ✓ Published to Archives. Redirecting...
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button disabled={isPending || uploading} type="submit"
                            className="w-full relative group bg-[#692484] text-white py-5 uppercase tracking-[0.2em] font-bold text-sm overflow-hidden disabled:opacity-50 rounded-xl">
                            <span className="relative z-10 group-hover:tracking-widest transition-all duration-300">
                                {isPending ? "Publishing..." : uploading ? "Uploading Image..." : "Publish to Archives"}
                            </span>
                            <motion.div className="absolute inset-0 bg-[#8B30A4] z-0 origin-left" initial={{ scaleX: 0 }} whileHover={{ scaleX: 1 }} transition={{ ease: "circOut" }} />
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
