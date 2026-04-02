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
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground space-y-6">
      <h2 className="font-['Syncopate'] text-3xl font-bold uppercase tracking-widest text-primary">Something went wrong</h2>
      <p className="font-['Space_Mono'] text-sm text-muted-foreground">{error.message || "An unexpected error occurred."}</p>
      <button
        className="px-8 py-3 bg-primary text-primary-foreground font-['Space_Mono'] text-xs uppercase tracking-widest hover:bg-primary/90 transition-colors rounded-sm"
        onClick={() => reset()}
      >
        Try Again
      </button>
    </div>
  );
}
