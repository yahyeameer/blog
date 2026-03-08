'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase-server'

export async function addComment(formData: FormData) {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        return { error: 'You must be logged in to comment.' }
    }

    const postId = formData.get('post_id') as string
    const content = formData.get('content') as string
    const postSlug = formData.get('post_slug') as string

    const { error } = await supabase
        .from('comments')
        .insert({
            post_id: postId,
            user_id: session.user.id,
            content
        })

    if (error) {
        return { error: error.message }
    }

    revalidatePath(`/blog/${postSlug}`)
}
