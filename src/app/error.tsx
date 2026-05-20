"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="bg-brand-cream min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="text-7xl mb-6">⚠️</div>
        <h1 className="font-playfair text-3xl font-bold text-brand-green-dark mb-3">
          Something went wrong
        </h1>
        <p className="font-inter text-muted-foreground mb-2">
          We encountered an unexpected error. Our team has been notified.
        </p>
        {error.digest && (
          <p className="font-inter text-xs text-muted-foreground mb-8 bg-muted px-3 py-2 rounded-lg inline-block">
            Error ID: {error.digest}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-4">
          <Button onClick={reset} size="lg">Try Again</Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
