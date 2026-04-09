import { createClient } from "@supabase/supabase-js";
import { AmbrelleClientPage } from "@/components/AmbrelleClientPage";

export const revalidate = 60; // ISR cache revalidation every 60 seconds

export default async function Home() {
  // Use pure stateless Supabase JS client to fetch posts without reading cookies.
  // This allows the Next.js App router to statically generate and cache this page on the Edge.
  const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Fetch all posts globally
  const { data: posts } = await supabase
      .from('posts')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

  const mainPost = posts && posts.length > 0 ? posts[0] : null;

  return <AmbrelleClientPage postContent={mainPost?.content || ""} posts={posts || []} />;
}
