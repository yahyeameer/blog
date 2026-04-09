import { createClient } from "@/lib/supabase-server";
import Link from "next/link";
import { DraggableProductList } from "./DraggableProductList";

export default async function AdminPage() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center font-['Inter'] text-black bg-white">
                <div className="text-center">
                    <p className="uppercase tracking-widest text-sm mb-4 font-medium">Access Denied</p>
                    <Link href="/login" className="text-xs border-b border-black hover:opacity-50 transition-opacity">Sign In</Link>
                </div>
            </div>
        );
    }

    const { data: posts } = await supabase
        .from("posts")
        .select("id, title, slug, topic, image_url, price, in_stock, created_at, sort_order")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

    const totalProducts = posts?.length || 0;
    const inStockCount = posts?.filter(p => p.in_stock !== false).length || 0;
    const outOfStockCount = totalProducts - inStockCount;

    return (
        <div className="min-h-screen bg-[#fafafa] text-black font-['Inter']">
            {/* Admin Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-9 h-9 bg-black rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold tracking-wider">A</span>
                            </div>
                            <span className="text-sm font-semibold tracking-wide hidden sm:block group-hover:opacity-60 transition-opacity">AMBRELLE</span>
                        </Link>
                        <div className="hidden sm:block w-px h-6 bg-gray-200 mx-2"></div>
                        <span className="hidden sm:block text-xs text-gray-400 uppercase tracking-widest">Admin Dashboard</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/admin/create-post"
                            className="px-5 py-2.5 bg-black text-white hover:bg-gray-800 transition-colors text-xs uppercase tracking-wider font-medium rounded-md flex items-center gap-2">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
                            Add Product
                        </Link>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4 mb-10">
                    <div className="bg-white rounded-lg border border-gray-200 p-5">
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total Products</p>
                        <p className="text-3xl font-semibold">{totalProducts}</p>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-5">
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">In Stock</p>
                        <p className="text-3xl font-semibold text-green-600">{inStockCount}</p>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-5">
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Out of Stock</p>
                        <p className="text-3xl font-semibold text-red-500">{outOfStockCount}</p>
                    </div>
                </div>

                {/* Section Title */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold tracking-tight">All Products</h2>
                    <p className="text-xs text-gray-400">{totalProducts} items</p>
                </div>

                {/* Product List */}
                <DraggableProductList initialPosts={posts || []} />
            </div>
        </div>
    );
}
