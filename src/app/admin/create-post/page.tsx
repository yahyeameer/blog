"use client";

import React, { useState, useTransition, useRef } from "react";
import { createPost } from "../actions";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import { MarkdownEditor } from "@/components/MarkdownEditor";

export default function CreatePostPage() {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [imageUrl, setImageUrl] = useState("");
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [inStock, setInStock] = useState(true);
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
        formData.set("in_stock", inStock ? "true" : "false");
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
                        <span className="text-xs text-gray-400 uppercase tracking-wider hidden sm:block">New Product</span>
                    </div>
                </div>
            </header>

            <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 md:py-12">
                <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-8">
                    Add New Product
                </h1>

                <form action={handleSubmit} className="space-y-6 bg-white border border-gray-200 rounded-lg p-6 md:p-10 shadow-sm">

                    {/* Title */}
                    <div>
                        <label className="block text-xs uppercase tracking-wider font-medium mb-2 text-gray-500">Product Name</label>
                        <input type="text" name="title" required
                            placeholder="e.g. Mexican Tobacco Allover"
                            className="w-full bg-transparent border border-gray-200 rounded-md px-4 py-3 text-base focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all placeholder:text-gray-300" />
                    </div>

                    {/* Category + Price Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs uppercase tracking-wider font-medium mb-2 text-gray-500">Category</label>
                            <input type="text" name="topic"
                                placeholder="e.g. Oud Collection"
                                className="w-full bg-transparent border border-gray-200 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all placeholder:text-gray-300" />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider font-medium mb-2 text-gray-500">Price (USD)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                                <input type="number" name="price" step="0.01" min="0"
                                    placeholder="0.00"
                                    className="w-full bg-transparent border border-gray-200 rounded-md pl-8 pr-4 py-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all placeholder:text-gray-300" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider font-medium mb-2 text-gray-500">Compare at Price (Optional)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                                <input type="number" name="compare_at_price" step="0.01" min="0"
                                    placeholder="Sale markup"
                                    className="w-full bg-transparent border border-gray-200 rounded-md pl-8 pr-4 py-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all placeholder:text-gray-300" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider font-medium mb-2 text-gray-500">Stock Quantity</label>
                            <input type="number" name="stock_quantity" min="0"
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
                                placeholder="Comma separated, e.g. citrus, summer"
                                className="w-full bg-transparent border border-gray-200 rounded-md px-4 py-3 text-sm h-[74px] focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all placeholder:text-gray-300" />
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-xs uppercase tracking-wider font-medium mb-2 text-gray-500">Product Image</label>
                        <input type="hidden" name="image_url" value={imageUrl} />
                        <div
                            onClick={() => fileRef.current?.click()}
                            className="relative border-2 border-dashed border-gray-200 hover:border-gray-400 rounded-lg p-6 text-center cursor-pointer transition-colors duration-200 flex flex-col items-center justify-center bg-gray-50/50"
                        >
                            {preview ? (
                                <div className="relative">
                                    <img src={preview} alt="Preview" className="max-h-48 mx-auto object-contain rounded-md" />
                                    <p className="text-xs text-gray-400 mt-3">Click to change image</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-3 py-4">
                                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            {uploading ? "Uploading..." : "Upload Photo"}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, WEBP</p>
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
                        <div className="mt-3">
                            <input type="url" value={imageUrl} onChange={(e) => { setImageUrl(e.target.value); setPreview(e.target.value); }}
                                placeholder="Or paste image URL..."
                                className="w-full bg-transparent border border-gray-200 rounded-md px-4 py-2.5 text-xs focus:outline-none focus:border-black transition-colors placeholder:text-gray-300" />
                        </div>
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-xs uppercase tracking-wider font-medium mb-2 text-gray-500">Description &amp; Notes</label>
                        <MarkdownEditor name="content" placeholder="Describe the fragrance, its notes, story, and character..." />
                    </div>

                    {error && (
                        <div className="text-red-700 text-xs font-medium bg-red-50 p-3 border border-red-200 rounded-md">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="text-green-700 text-xs font-medium bg-green-50 p-3 border border-green-200 rounded-md text-center">
                            ✓ Product published successfully. Redirecting...
                        </div>
                    )}

                    <button disabled={isPending || uploading} type="submit"
                        className="w-full bg-black text-white hover:bg-gray-800 transition-colors py-4 uppercase tracking-wider font-medium text-sm disabled:opacity-50 rounded-md">
                        {isPending ? "Publishing..." : uploading ? "Uploading Image..." : "Publish Product"}
                    </button>
                </form>
            </div>
        </div>
    );
}
