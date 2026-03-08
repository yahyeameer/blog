"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
        <div className="min-h-screen bg-[#FAFAFA] text-[#2C143B] dark:bg-[#13091B] dark:text-[#F1E3FC] font-['Space_Mono'] selection:bg-[#692484]/40 flex flex-col justify-center items-center p-6 transition-colors duration-500 relative overflow-hidden">

            {/* Background Kinetic Elements */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#692484]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#692484]/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="w-full max-w-md bg-[#2C143B]/5 dark:bg-white/5 backdrop-blur-xl border border-[#2C143B]/10 dark:border-white/10 p-8 md:p-12 relative z-10"
            >
                <div className="flex justify-between items-center mb-12">
                    <button onClick={() => router.push('/')} className="hover:text-[#692484] transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    </button>
                    <div className="p-1.5 bg-white rounded-full shadow-lg">
                        <img src="/logo.jpg" alt="Ambrelle" className="h-10 w-10 object-contain" />
                    </div>
                </div>

                <div className="flex gap-4 mb-10 border-b border-[#2C143B]/10 dark:border-white/10 pb-4">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`uppercase tracking-[0.2em] text-xs font-bold transition-colors ${isLogin ? 'text-[#692484]' : 'text-[#2C143B]/40 dark:text-[#F1E3FC]/40 hover:text-current'}`}
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`uppercase tracking-[0.2em] text-xs font-bold transition-colors ${!isLogin ? 'text-[#692484]' : 'text-[#2C143B]/40 dark:text-[#F1E3FC]/40 hover:text-current'}`}
                    >
                        Create Account
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={isLogin ? "login" : "signup"}
                        initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <h2 className="font-['Syncopate'] text-3xl font-bold uppercase tracking-tight mb-8">
                            {isLogin ? "Welcome Back." : "Join The Logic."}
                        </h2>

                        <form action={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs uppercase tracking-[0.1em] font-bold mb-2 text-[#2C143B]/60 dark:text-[#F1E3FC]/60">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    className="w-full bg-transparent border-b border-[#2C143B]/20 dark:border-white/20 py-3 text-lg focus:outline-none focus:border-[#692484] transition-colors placeholder:text-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-[0.1em] font-bold mb-2 text-[#2C143B]/60 dark:text-[#F1E3FC]/60">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    className="w-full bg-transparent border-b border-[#2C143B]/20 dark:border-white/20 py-3 text-lg focus:outline-none focus:border-[#692484] transition-colors placeholder:text-transparent"
                                />
                            </div>

                            {error && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#692484] text-xs font-bold bg-[#692484]/10 p-3 border border-[#692484]/20">
                                    {error}
                                </motion.div>
                            )}

                            <button
                                disabled={isPending}
                                type="submit"
                                className="w-full relative group bg-[#2C143B] dark:bg-[#F1E3FC] text-[#FAFAFA] dark:text-[#13091B] py-4 uppercase tracking-[0.2em] font-bold text-xs mt-4 overflow-hidden disabled:opacity-50"
                            >
                                <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                                    {isPending ? "Processing..." : (isLogin ? "Access Archives" : "Establish Identity")}
                                </span>
                                <motion.div
                                    className="absolute inset-0 bg-[#692484] z-0 origin-left"
                                    initial={{ scaleX: 0 }}
                                    whileHover={{ scaleX: 1 }}
                                    transition={{ ease: "circOut" }}
                                />
                            </button>
                        </form>
                    </motion.div>
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

