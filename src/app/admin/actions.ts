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
    const priceRaw = formData.get('price') as string
    const comparePriceRaw = formData.get('compare_at_price') as string
    const inStockRaw = formData.get('in_stock') as string
    const stockQuantityRaw = formData.get('stock_quantity') as string
    const tagsRaw = formData.get('tags') as string

    const data: Record<string, unknown> = {
        title,
        slug,
        topic: formData.get('topic') as string,
        content: formData.get('content') as string,
        image_url: formData.get('image_url') as string,
        price: priceRaw ? parseFloat(priceRaw) : null,
        compare_at_price: comparePriceRaw ? parseFloat(comparePriceRaw) : null,
        in_stock: inStockRaw === 'true',
        stock_quantity: stockQuantityRaw ? parseInt(stockQuantityRaw, 10) : 0,
        tags: tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [],
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

    const priceRaw = formData.get('price') as string
    const comparePriceRaw = formData.get('compare_at_price') as string
    const inStockRaw = formData.get('in_stock') as string
    const stockQuantityRaw = formData.get('stock_quantity') as string
    const tagsRaw = formData.get('tags') as string

    const data: Record<string, unknown> = {
        title: formData.get('title') as string,
        topic: formData.get('topic') as string,
        content: formData.get('content') as string,
        price: priceRaw ? parseFloat(priceRaw) : null,
        compare_at_price: comparePriceRaw ? parseFloat(comparePriceRaw) : null,
        in_stock: inStockRaw === 'true',
        stock_quantity: stockQuantityRaw ? parseInt(stockQuantityRaw, 10) : 0,
        tags: tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [],
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

export async function reorderPosts(postIds: string[]) {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        return { error: 'You must be logged in to reorder posts.' }
    }

    const updates = postIds.map((id, index) => ({
        id,
        sort_order: index,
    }));

    // Perform upsert or multiple updates (Supabase allows massive object upsert for id if they exist)
    const { error } = await supabase.from('posts').upsert(updates, { onConflict: 'id' });

    if (error) return { error: error.message }

    revalidatePath('/', 'layout')
    return { success: true }
}
