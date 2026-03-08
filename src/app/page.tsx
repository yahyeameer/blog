import { createClient } from "@/lib/supabase-server";
import { AmbrelleClientPage } from "@/components/AmbrelleClientPage";

export default async function Home() {
  const supabase = await createClient();

  // Fetch the active session
  const { data: { session } } = await supabase.auth.getSession();

  // Fetch all posts (we can separate the "Brand story" later if needed, but for now we fetch all)
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  // Use the very first post as the main content if it exists
  const mainPost = posts && posts.length > 0 ? posts[0] : null;

  return <AmbrelleClientPage postContent={mainPost?.content} posts={posts || []} user={session?.user} />;
}

