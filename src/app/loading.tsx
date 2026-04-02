export default function Loading() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background">
            <div className="space-y-4 flex flex-col items-center">
                {/* A subtle pulse animation replacing standard spinners for a luxury feel */}
                <div className="w-16 h-16 rounded-full bg-primary/20 animate-pulse flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-primary animate-pulse"></div>
                </div>
                <p className="font-['Space_Mono'] text-[10px] tracking-[0.2em] uppercase text-primary animate-pulse shadow-sm">
                    Accessing Vault...
                </p>
            </div>
        </div>
    );
}
