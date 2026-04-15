"use client";

import React, { useState, useTransition, useRef } from "react";
import { updatePost, deletePost } from "../../actions";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import { MarkdownEditor } from "@/components/MarkdownEditor";

interface Post {
    id: string;
    title: string;
    slug?: string;
    topic?: string;
    content?: string;
    image_url?: string;
    price?: number | null;
    in_stock?: boolean;
    compare_at_price?: number | null;
    stock_quantity?: number;
    tags?: string[];
}

export default function EditPostClient({ post }: { post: Post }) {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [imageUrl, setImageUrl] = useState(post.image_url || "");
    const [preview, setPreview] = useState<string | null>(post.image_url || null);
    const [uploading, setUploading] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [inStock, setInStock] = useState(post.in_stock !== false);
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
        formData.set("in_stock", inStock ? "true" : "false");
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
            else { window.location.href = "/admin"; }
        });
    }

    return (
        <div className="min-h-screen bg-[#fafafa] text-black font-['Inter']">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-3xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
                    <button onClick={() => router.push("/admin")} className="text-sm text-gray-500 hover:text-black transition-colors flex items-center gap-2">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>
                        Back to Dashboard
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 bg-black rounded-full flex items-center justify-center">
                            <span className="text-white text-[10px] font-bold">A</span>
                        </div>
                        <span className="text-xs text-gray-400 uppercase tracking-wider hidden sm:block">Edit Product</span>
                    </div>
                </div>
            </header>

            <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 md:py-12">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Edit Product</h1>
                    <button onClick={() => setConfirmDelete(true)}
                        className="text-xs text-red-500 hover:text-red-700 transition-colors border border-red-200 hover:border-red-400 px-4 py-2 rounded-md font-medium">
                        Delete
                    </button>
                </div>

                <form action={handleSubmit} className="space-y-6 bg-white border border-gray-200 rounded-lg p-6 md:p-10 shadow-sm">

                    {/* Title */}
                    <div>
                        <label className="block text-xs uppercase tracking-wider font-medium mb-2 text-gray-500">Product Name</label>
                        <input type="text" name="title" required defaultValue={post.title}
                            className="w-full bg-transparent border border-gray-200 rounded-md px-4 py-3 text-base focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" />
                    </div>

                    {/* Category + Price Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs uppercase tracking-wider font-medium mb-2 text-gray-500">Category</label>
                            <input type="text" name="topic" defaultValue={post.topic || ""}
                                className="w-full bg-transparent border border-gray-200 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider font-medium mb-2 text-gray-500">Price (USD)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                                <input type="number" name="price" step="0.01" min="0"
                                    defaultValue={post.price ?? ""}
                                    className="w-full bg-transparent border border-gray-200 rounded-md pl-8 pr-4 py-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider font-medium mb-2 text-gray-500">Compare at Price (Optional)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                                <input type="number" name="compare_at_price" step="0.01" min="0"
                                    defaultValue={post.compare_at_price ?? ""}
                                    placeholder="Sale markup"
                                    className="w-full bg-transparent border border-gray-200 rounded-md pl-8 pr-4 py-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all placeholder:text-gray-300" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider font-medium mb-2 text-gray-500">Stock Quantity</label>
                            <input type="number" name="stock_quantity" min="0"
                                defaultValue={post.stock_quantity ?? 0}
                                placeholder="0"
                                className="w-full bg-transparent border border-gray-200 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all placeholder:text-gray-300" />
                        </div>
                    </div>

                    {/* Stock Toggle & Tags */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between border border-gray-200 rounded-md px-4 py-3 h-[74px]">
                            <div>
                                <p className="text-sm font-medium">Availability</p>
                                <p className="text-xs text-gray-400 mt-0.5">Is this product currently in stock?</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setInStock(!inStock)}
                                className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${inStock ? 'bg-green-500' : 'bg-gray-300'}`}
                            >
                                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${inStock ? 'left-6' : 'left-1'}`}></div>
                            </button>
                            <input type="hidden" name="in_stock" value={inStock ? "true" : "false"} />
                        </div>
                        
                        <div>
                            <label className="block text-xs uppercase tracking-wider font-medium mb-2 text-gray-500">Tags</label>
                            <input type="text" name="tags"
                                defaultValue={post.tags?.join(", ") || ""}
                                placeholder="Comma separated, e.g. citrus, summer"
                                className="w-full bg-transparent border border-gray-200 rounded-md px-4 py-3 text-sm h-[74px] focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all placeholder:text-gray-300" />
                        </div>
                    </div>



                    {/* Image */}
                    <div>
                        <label className="block text-xs uppercase tracking-wider font-medium mb-2 text-gray-500">Product Image</label>
                        <input type="hidden" name="image_url" value={imageUrl} />
                        <div onClick={() => fileRef.current?.click()}
                            className="relative border-2 border-dashed border-gray-200 hover:border-gray-400 rounded-lg p-6 text-center cursor-pointer transition-colors duration-200 flex flex-col items-center justify-center bg-gray-50/50">
                            {preview ? (
                                <div>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={preview} alt="Preview" className="max-h-48 mx-auto object-contain rounded-md" />
                                    <p className="text-xs text-gray-400 mt-3">Click to change</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-3 py-4">
                                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75z" />
                                        </svg>
                                    </div>
                                    <p className="text-sm font-medium text-gray-600">{uploading ? "Uploading..." : "Upload Image"}</p>
                                </div>
                            )}
                        </div>
                        <input ref={fileRef} type="file" accept="image/*" className="hidden"
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) { setPreview(URL.createObjectURL(f)); handleImageUpload(f); } }} />
                        <input type="url" value={imageUrl} onChange={(e) => { setImageUrl(e.target.value); setPreview(e.target.value); }}
                            placeholder="Or paste image URL..."
                            className="w-full bg-transparent border border-gray-200 rounded-md px-4 py-2.5 text-xs mt-3 focus:outline-none focus:border-black transition-colors placeholder:text-gray-300" />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-xs uppercase tracking-wider font-medium mb-2 text-gray-500">Description &amp; Notes</label>
                        <MarkdownEditor name="content" defaultValue={post.content || ""} placeholder="Describe the fragrance, its notes, story, and character..." />
                    </div>

                    {error && <div className="text-red-700 text-xs font-medium bg-red-50 p-3 border border-red-200 rounded-md">{error}</div>}
                    {success && <div className="text-green-700 text-xs font-medium bg-green-50 p-3 border border-green-200 rounded-md text-center">✓ Updated successfully. Returning...</div>}

                    <button disabled={isPending || uploading} type="submit"
                        className="w-full bg-black text-white hover:bg-gray-800 transition-colors py-4 uppercase tracking-wider font-medium text-sm disabled:opacity-50 rounded-md">
                        {isPending ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>

            {/* Delete Confirmation Modal */}
            {confirmDelete && (
                <div className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-sm w-full text-center shadow-xl">
                        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Delete this product?</h3>
                        <p className="text-sm text-gray-500 mb-6">This action is permanent and cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setConfirmDelete(false)} className="flex-1 py-3 border border-gray-200 text-black text-sm hover:bg-gray-50 transition-colors rounded-md font-medium">Cancel</button>
                            <button onClick={handleDelete} className="flex-1 py-3 bg-red-500 text-white text-sm hover:bg-red-600 transition-colors font-medium rounded-md">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
