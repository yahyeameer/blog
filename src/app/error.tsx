'use client';
 
import { useEffect } from 'react';
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);
 
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black space-y-6 border-2 border-black m-4">
      <h2 className="font-['Syncopate'] text-3xl font-bold uppercase tracking-widest text-black">Something went wrong</h2>
      <p className="font-['Space_Mono'] text-sm text-gray-500">{error.message || "An unexpected error occurred."}</p>
      <button
        className="px-8 py-3 bg-black text-white font-['Space_Mono'] text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors border border-black rounded-none"
        onClick={() => reset()}
      >
        Try Again
      </button>
    </div>
  );
}
