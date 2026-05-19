import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ShoppingBag, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4">
      <div className="text-center max-w-xl mx-auto">
        {/* Visual */}
        <div
          className="w-40 h-40 rounded-full flex items-center justify-center mx-auto mb-8 shadow-soft-hover"
          style={{ background: "linear-gradient(135deg, #3A5A40 0%, #A8D5BA 100%)" }}
        >
          <span className="text-7xl">☕</span>
        </div>

        <h1 className="font-playfair text-8xl font-bold text-brand-green-dark mb-2">404</h1>
        <h2 className="font-playfair text-3xl font-bold text-brand-green-dark mb-4">
          Looks like this page got lost in the plantation!
        </h2>
        <p className="font-inter text-muted-foreground text-lg mb-10 leading-relaxed">
          The page you&apos;re looking for seems to have wandered off into the misty Coorg hills.
          Let us help you find your way back.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/">
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/shop">
              <ShoppingBag className="w-5 h-5" />
              Browse Products
            </Link>
          </Button>
          <Button size="lg" variant="ghost" onClick={() => window.history.back()}>
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </Button>
        </div>

        {/* Popular links */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="font-inter text-sm text-muted-foreground mb-4">Popular pages you might be looking for:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: "Coffee Products", href: "/shop?category=coffee" },
              { label: "Spices", href: "/shop?category=spices" },
              { label: "Wholesale", href: "/wholesale" },
              { label: "About Us", href: "/about" },
              { label: "Contact", href: "/contact" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-brand-green-dark hover:text-brand-brown font-medium underline underline-offset-2"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
