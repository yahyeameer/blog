'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'

export async function createPost(formData: FormData) {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        return { error: 'You must be logged in to create a post.' }
    }

    const title = formData.get('title') as string
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

    const data = {
        title,
        slug,
        topic: formData.get('topic') as string,
        content: formData.get('content') as string,
        image_url: formData.get('image_url') as string,
    }

    const { error } = await supabase
        .from('posts')
        .insert(data)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect(`/`)
}

export async function updatePost(id: string, formData: FormData) {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        return { error: 'You must be logged in to edit a post.' }
    }

    const data: Record<string, string> = {
        title: formData.get('title') as string,
        topic: formData.get('topic') as string,
        content: formData.get('content') as string,
    }

    const imageUrl = formData.get('image_url') as string
    if (imageUrl) data.image_url = imageUrl

    const { error } = await supabase
        .from('posts')
        .update(data)
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    return { success: true }
}

export async function deletePost(id: string) {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        return { error: 'You must be logged in to delete a post.' }
    }

    const { error } = await supabase.from('posts').delete().eq('id', id)
    if (error) return { error: error.message }

    revalidatePath('/', 'layout')
    return { success: true }
}
