import type { Metadata } from "next";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = { title: "About Us | Our Story & Plantation" };

const TIMELINE = [
  { year: "1982", title: "The Beginning", desc: "Our grandfather planted the first coffee seeds on the Pushpagiri estate in Choudlu." },
  { year: "1995", title: "Spice Integration", desc: "We started intercropping black pepper, cardamom, and cloves among our coffee trees." },
  { year: "2005", title: "Organic Transition", desc: "Fully transitioned to organic farming — no synthetic pesticides or fertilizers." },
  { year: "2015", title: "On-site Roastery", desc: "Built our small-batch roastery on the estate for farm-fresh coffee." },
  { year: "2022", title: "Direct-to-Consumer", desc: "Launched online store to share our estate products directly with customers across India." },
  { year: "2024", title: "Growing Family", desc: "Serving 500+ customers across India with export-grade quality products." },
];

const VALUES = [
  { emoji: "🌿", title: "Sustainability", desc: "Every farming decision considers long-term ecological health." },
  { emoji: "🤝", title: "Fairness", desc: "All our estate workers receive fair wages and excellent conditions." },
  { emoji: "✅", title: "Quality", desc: "We never compromise on quality — only the best reaches your door." },
  { emoji: "❤️", title: "Passion", desc: "Coffee and spices are our heritage, passion, and purpose." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Hero */}
      <div className="bg-brand-green-dark text-white py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-leaf-pattern opacity-10" />
        <div className="container-custom relative z-10">
          <h1 className="font-playfair text-5xl lg:text-6xl font-bold mb-4">Our Story</h1>
          <p className="font-inter text-white/70 text-xl max-w-2xl mx-auto">
            Four decades of farming heritage from the misty hills of Coorg, Karnataka.
          </p>
        </div>
      </div>

      {/* Brand Story */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-4xl font-bold text-brand-green-dark mb-4">The Pushpagiri Estate</h2>
          </div>
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-5">
            <p className="font-inter leading-relaxed">
              Nestled at 900 meters above sea level in the verdant Brahmagiri hills of Choudlu, Coorg, the Pushpagiri estate has been nurtured by our family for over four decades. What began as a humble plantation in 1982 has blossomed into one of the region&apos;s finest organic coffee and spice estates.
            </p>
            <p className="font-inter leading-relaxed">
              The name &quot;Pushpagiri&quot; — meaning &quot;flower mountain&quot; in Sanskrit — captures the essence of our land perfectly. In the months of November and December, our estate blooms with the delicate white coffee blossoms, filling the air with an intoxicating fragrance that signals the promise of a new harvest.
            </p>
            <p className="font-inter leading-relaxed">
              The Coorg microclimate — with its abundant rainfall, rich laterite soil, and constant mist — creates the ideal terroir for our Arabica and Robusta coffee varieties. The same conditions nurture our shade-grown spices: black pepper climbing the silver oak trees, cardamom thriving in the forest shade, and cloves and cinnamon perfuming the entire estate.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-brand-cream">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { title: "Our Mission", icon: "🎯", text: "To bring the authentic taste and purity of Coorg's finest coffee and spices directly to homes and businesses across India, while upholding sustainable farming practices and supporting our farming community." },
              { title: "Our Vision", icon: "🔭", text: "To be India's most trusted direct-farm coffee and spice brand — known globally for our single-estate purity, traceability, and commitment to organic excellence." },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-8 shadow-card">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="font-playfair text-2xl font-bold text-brand-green-dark mb-4">{item.title}</h3>
                <p className="font-inter text-muted-foreground leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-4xl font-bold text-brand-green-dark mb-3">Our Journey</h2>
            <p className="font-inter text-muted-foreground">Four decades of growing, learning, and improving</p>
          </div>
          <div className="max-w-3xl mx-auto relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-brand-green-light" />
            <div className="space-y-8">
              {TIMELINE.map((item, i) => (
                <div key={item.year} className="flex gap-6 pl-20 relative">
                  <div className="absolute left-4 top-2 w-8 h-8 bg-brand-green-dark rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <span className="font-inter text-xs font-bold text-brand-brown uppercase tracking-widest">{item.year}</span>
                    <h3 className="font-playfair text-lg font-bold text-brand-green-dark mt-1">{item.title}</h3>
                    <p className="font-inter text-sm text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-brand-green-dark">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-4xl font-bold text-white mb-3">Our Values</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v) => (
              <div key={v.title} className="bg-white/10 border border-white/10 rounded-2xl p-6 text-center">
                <div className="text-4xl mb-3">{v.emoji}</div>
                <h3 className="font-playfair text-lg font-bold text-white mb-2">{v.title}</h3>
                <p className="font-inter text-sm text-white/60">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
