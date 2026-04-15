import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { CommentSection } from "../CommentSection";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    // Fetch the post matching the slug (or ID as fallback)
    const { data: post, error } = await supabase
        .from('posts')
        .select('*')
        .or(`slug.eq.${slug},id.eq.${slug}`)
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
        <div className="min-h-screen bg-white text-black font-['Space_Mono'] flex flex-col pt-24 px-6 md:px-12 lg:px-24">

            {/* Top Bar */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-black h-20 flex justify-between items-center px-6 md:px-12">
                <Link href="/" className="uppercase tracking-[0.2em] text-black text-xs font-bold hover:text-gray-600 transition-colors flex items-center gap-2">
                    <span className="text-xl">←</span> Return
                </Link>
                <div className="flex items-center gap-6">
                    <ThemeToggle />
                    {session ? (
                        <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">Auth: Active</div>
                    ) : (
                        <Link href="/login" className="text-xs uppercase tracking-[0.1em] hover:text-gray-500 transition-colors font-bold text-black border-b border-black">Sign In</Link>
                    )}
                </div>
            </div>

            <article className="max-w-4xl mx-auto w-full mt-12 pb-32">
                <header className="mb-16 border-b border-gray-200 pb-12">
                    <p className="uppercase tracking-[0.2em] text-black text-xs font-bold mb-6 flex items-center gap-4">
                        <span className="w-12 h-px bg-black" /> {post.topic || "Scent Profile"}
                    </p>
                    <h1 className="font-['Syncopate'] text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[1.1] mb-8 text-black">
                        {post.title}
                    </h1>
                    <div className="flex gap-4 text-xs tracking-widest text-gray-500 font-bold uppercase">
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>Ambrelle Archive</span>
                    </div>
                </header>

                {post.image_url && (
                    <div className="w-full aspect-video md:aspect-[21/9] bg-gray-50 mb-16 relative border-2 border-black p-2">
                        <Image
                            src={post.image_url}
                            alt={post.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 900px"
                            className="object-cover grayscale"
                        />
                    </div>
                )}

                <div
                    className="prose prose-lg max-w-none font-sans text-black leading-relaxed space-y-8 prose-p:my-6 prose-strong:text-black prose-headings:font-['Syncopate'] prose-headings:uppercase prose-headings:tracking-tight mb-20"
                    dangerouslySetInnerHTML={{ __html: post.content.replace(/\n\n/g, '<br/><br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                />

                <div className="pt-16 border-t border-black">
                    <CommentSection
                        postId={post.id}
                        postSlug={post.slug || post.id}
                        comments={comments || []}
                        user={session?.user}
                    />
                </div>
            </article>
        </div>
    );
}
