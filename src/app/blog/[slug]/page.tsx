import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import { CommentSection } from "../CommentSection";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    // Fetch the post matching the slug (or ID as fallback)
    const { data: post, error } = await supabase
        .from('posts')
        .select('*')
        .or(`slug.eq.${params.slug},id.eq.${params.slug}`)
        .single();

    if (error || !post) {
        notFound();
    }

    // Fetch comments for this post
    const { data: comments } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', post.id)
        .order('created_at', { ascending: true });

    return (
        <div className="min-h-screen bg-[#FDFCE4] text-[#111111] dark:bg-[#18181B] dark:text-[#FAFAFA] font-['Space_Mono'] selection:bg-[#EC4899]/40 transition-colors duration-500 flex flex-col pt-24 px-6 md:px-12 lg:px-24">

            {/* Top Kinetic Bar & Nav (Simplified for reading) */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-[#FDFCE4]/90 dark:bg-[#18181B]/90 backdrop-blur-xl border-b border-[#111111]/10 dark:border-white/10 h-20 flex justify-between items-center px-6 md:px-12 transition-colors duration-500">
                <Link href="/" className="uppercase tracking-[0.2em] text-[#EC4899] text-xs font-bold hover:text-[#111111] dark:hover:text-white transition-colors flex items-center gap-2">
                    <span className="text-xl">←</span> Return
                </Link>
                <div className="flex items-center gap-6">
                    <ThemeToggle />
                    {session ? (
                        <div className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-50">Auth: Active</div>
                    ) : (
                        <Link href="/login" className="text-xs uppercase tracking-[0.1em] hover:text-[#EC4899] transition-colors font-bold">Sign In</Link>
                    )}
                </div>
            </div>

            <article className="max-w-4xl mx-auto w-full mt-12 pb-32">
                <header className="mb-16">
                    <p className="uppercase tracking-[0.2em] text-[#EC4899] text-xs font-bold mb-6 flex items-center gap-4">
                        <span className="w-12 h-px bg-[#EC4899]" /> {post.topic || "Scent Profile"}
                    </p>
                    <h1 className="font-['Syncopate'] text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[1.1] mb-8">
                        {post.title}
                    </h1>
                    <div className="flex gap-4 text-xs tracking-widest opacity-60 font-bold uppercase">
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>Ambrelle Archive</span>
                    </div>
                </header>

                {post.image_url && (
                    <div className="w-full aspect-video md:aspect-[21/9] bg-[#111111]/10 dark:bg-white/10 mb-16 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[#EC4899] opacity-0 group-hover:opacity-20 transition-opacity duration-700 z-10 mix-blend-color" />
                        <img
                            src={post.image_url}
                            alt={post.title}
                            className="w-full h-full object-cover grayscale mix-blend-luminosity group-hover:grayscale-0 group-hover:mix-blend-normal transition-all duration-700"
                        />
                    </div>
                )}

                <div
                    className="prose prose-lg dark:prose-invert max-w-none font-sans text-[#111111]/90 dark:text-[#FAFAFA]/90 leading-relaxed space-y-8 prose-p:my-6 prose-strong:text-[#EC4899] prose-headings:font-['Syncopate'] prose-headings:uppercase prose-headings:tracking-tight"
                    dangerouslySetInnerHTML={{ __html: post.content.replace(/\n\n/g, '<br/><br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                />

                <CommentSection
                    postId={post.id}
                    postSlug={post.slug || post.id}
                    comments={comments || []}
                    user={session?.user}
                />
            </article>
        </div>
    );
}
