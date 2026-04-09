'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    return { success: true }
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: undefined, // no redirect needed
        },
    })

    if (error) {
        return { error: error.message }
    }

    // If email confirmation is required by Supabase, auto-sign in after signup
    if (data?.user && !data.user.email_confirmed_at) {
        // Try signing in immediately (will work if email confirmation is disabled in Supabase dashboard)
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
        if (signInError) {
            return { error: 'Account created! Please check your email to confirm, then sign in.' }
        }
    }

    revalidatePath('/', 'layout')
    return { success: true }
}

export async function signout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/')
}
