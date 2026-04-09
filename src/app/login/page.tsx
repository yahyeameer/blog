"use client";

import React, { useState, useTransition } from "react";
import { login, signup } from "./actions";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        setError(null);
        startTransition(async () => {
            const result = isLogin ? await login(formData) : await signup(formData);
            if (result?.error) {
                setError(result.error);
            } else if (result?.success) {
                // Force a hard navigation to clear Next.js client-side caches and guarantee layout re-renders with session
                window.location.href = '/';
            }
        });
    }

    return (
        <div className="min-h-screen bg-white text-black font-['Space_Mono'] flex flex-col justify-center items-center p-6 relative overflow-hidden">

            <div className="w-full max-w-md bg-white border border-gray-200 p-8 md:p-12 relative z-10 shadow-sm">
                <div className="flex justify-between items-center mb-12">
                    <button onClick={() => router.push('/')} className="hover:text-gray-500 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    </button>
                    <div className="p-1.5 bg-white border border-gray-100 rounded-sm shadow-sm">
                        <img src="/logo.jpg" alt="Ambrelle" className="h-10 w-10 object-contain grayscale" />
                    </div>
                </div>

                <div className="flex gap-4 mb-10 border-b border-gray-200 pb-4">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`uppercase tracking-[0.2em] text-xs font-bold transition-colors ${isLogin ? 'text-black' : 'text-gray-400 hover:text-black'}`}
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`uppercase tracking-[0.2em] text-xs font-bold transition-colors ${!isLogin ? 'text-black' : 'text-gray-400 hover:text-black'}`}
                    >
                        Create Account
                    </button>
                </div>

                <div>
                    <h2 className="font-['Syncopate'] text-3xl font-bold uppercase tracking-tight mb-8">
                        {isLogin ? "Welcome Back." : "Join Us."}
                    </h2>

                    <form action={handleSubmit} className="space-y-8">
                        <div>
                            <label className="block text-xs uppercase tracking-[0.1em] font-bold mb-2 text-gray-500">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                required
                                className="w-full bg-transparent border-b border-gray-300 py-3 text-lg focus:outline-none focus:border-black transition-colors rounded-none placeholder:text-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-[0.1em] font-bold mb-2 text-gray-500">Password</label>
                            <input
                                type="password"
                                name="password"
                                required
                                className="w-full bg-transparent border-b border-gray-300 py-3 text-lg focus:outline-none focus:border-black transition-colors rounded-none placeholder:text-transparent"
                            />
                        </div>

                        {error && (
                            <div className="text-red-700 text-xs font-bold bg-red-50 p-3 border border-red-200">
                                {error}
                            </div>
                        )}

                        <button
                            disabled={isPending}
                            type="submit"
                            className="w-full bg-black text-white py-4 uppercase tracking-[0.2em] font-bold text-xs hover:bg-gray-800 transition-colors disabled:opacity-50 mt-8 rounded-none border border-black"
                        >
                            {isPending ? "Processing..." : (isLogin ? "Sign In" : "Register")}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

