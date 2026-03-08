import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import EditPostClient from "./EditPostClient";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        return <div className="min-h-screen flex items-center justify-center font-['Space_Mono'] text-[#692484]">Access Denied. Please sign in.</div>;
    }

    const { data: post } = await supabase.from("posts").select("*").eq("id", id).single();
    if (!post) notFound();

    return <EditPostClient post={post} />;
}
