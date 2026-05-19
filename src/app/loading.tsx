// Global loading UI — shown during page transitions
export default function Loading() {
  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Spinning leaf loader */}
        <div className="relative w-16 h-16">
          <div className="w-16 h-16 border-4 border-brand-green-light rounded-full animate-spin border-t-brand-green-dark" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl">🌿</span>
          </div>
        </div>
        <p className="font-playfair text-brand-green-dark font-semibold text-lg">
          Loading…
        </p>
        <p className="font-inter text-muted-foreground text-sm">
          Brewing the good stuff from Coorg ☕
        </p>
      </div>
    </div>
  );
}
