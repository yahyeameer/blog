import { createClient } from "@/lib/supabase-server";
import Link from "next/link";

export default async function AdminPage() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center font-['Space_Mono'] text-[#692484] bg-[#13091B]">
                <div className="text-center">
                    <p className="uppercase tracking-widest text-sm mb-4">Access Denied</p>
                    <Link href="/login" className="text-xs underline">Sign In</Link>
                </div>
            </div>
        );
    }

    const { data: posts } = await supabase.from("posts").select("id, title, slug, topic, image_url, created_at").order("created_at", { ascending: false });

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-[#2C143B] dark:bg-[#13091B] dark:text-[#F1E3FC] font-['Space_Mono'] py-24 px-6 md:px-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#692484]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="max-w-5xl mx-auto relative z-10">
                <div className="flex items-center justify-between mb-12">
                    <Link href="/" className="uppercase tracking-[0.2em] text-[#692484] text-xs font-bold hover:opacity-70 transition-opacity flex items-center gap-2">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6" /></svg>
                        Home
                    </Link>
                    <Link href="/admin/create-post"
                        className="px-6 py-3 bg-[#692484] text-white text-xs uppercase tracking-[0.2em] font-bold rounded-xl hover:bg-[#8B30A4] transition-colors flex items-center gap-2">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
                        New Post
                    </Link>
                </div>

                <h1 className="font-['Syncopate'] text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-4">
                    Admin <span className="text-[#692484]">Panel.</span>
                </h1>
                <p className="text-xs text-[#2C143B]/50 dark:text-[#F1E3FC]/40 uppercase tracking-widest mb-16">
                    {posts?.length || 0} entries in the archives
                </p>

                <div className="space-y-3">
                    {posts?.map((post) => (
                        <div key={post.id}
                            className="group flex items-center gap-5 bg-white dark:bg-[#1A0A24] border border-[#692484]/10 dark:border-[#692484]/20 rounded-xl p-4 hover:border-[#692484]/40 transition-colors duration-200">
                            {/* Thumbnail */}
                            <div className="w-14 h-14 rounded-lg bg-[#692484]/10 flex-shrink-0 overflow-hidden">
                                {post.image_url ? (
                                    <img src={post.image_url} alt={post.title} className="w-full h-full object-contain p-1.5" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-[#692484]/30 font-bold text-xs">IMG</span>
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-['Syncopate'] text-sm font-bold uppercase leading-tight truncate text-[#2C143B] dark:text-[#F1E3FC]">
                                    {post.title}
                                </h3>
                                <div className="flex items-center gap-3 mt-1.5">
                                    {post.topic && (
                                        <span className="text-[9px] uppercase tracking-widest bg-[#692484]/10 text-[#692484] px-2 py-0.5 rounded-full font-bold">{post.topic}</span>
                                    )}
                                    <span className="text-[9px] text-[#2C143B]/40 dark:text-[#F1E3FC]/40">
                                        {new Date(post.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                            </div>

                            {/* Edit Button */}
                            <Link href={`/admin/edit-post/${post.id}`}
                                className="flex-shrink-0 px-4 py-2 border border-[#692484]/30 text-[#692484] text-[10px] uppercase tracking-widest font-bold rounded-lg hover:bg-[#692484] hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100">
                                Edit
                            </Link>
                        </div>
                    ))}

                    {(!posts || posts.length === 0) && (
                        <div className="text-center py-24 border border-dashed border-[#692484]/20 rounded-2xl">
                            <p className="text-xs uppercase tracking-widest text-[#2C143B]/40 dark:text-[#F1E3FC]/40 mb-6">No posts yet</p>
                            <Link href="/admin/create-post" className="px-6 py-3 bg-[#692484] text-white text-xs uppercase tracking-widest font-bold rounded-xl">
                                Create Your First Post
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
