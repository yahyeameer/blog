export default function Loading() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white border-2 border-black m-4">
            <div className="space-y-6 flex flex-col items-center">
                <div className="w-16 h-16 border-2 border-black flex items-center justify-center">
                    <div className="w-8 h-8 bg-black"></div>
                </div>
                <p className="font-['Space_Mono'] text-xs font-bold tracking-[0.2em] uppercase text-black">
                    Retrieving Data...
                </p>
            </div>
        </div>
    );
}
