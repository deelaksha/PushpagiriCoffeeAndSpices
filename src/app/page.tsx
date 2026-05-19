import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import AboutSection from "@/components/home/AboutSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import JourneySection from "@/components/home/JourneySection";
import Testimonials from "@/components/home/Testimonials";
import WholesaleCTA from "@/components/home/WholesaleCTA";
import GallerySection from "@/components/home/GallerySection";
import FAQSection from "@/components/home/FAQSection";
import NewsletterSection from "@/components/home/NewsletterSection";

export const metadata: Metadata = {
  title: "Premium Organic Coffee & Spices from Coorg | Pushpagiri Coffee & Spice",
  description:
    "Shop premium single-origin Arabica, Robusta, Filter Coffee, Black Pepper, Cardamom, Cloves & more. Direct from our Pushpagiri estate in Choudlu, Coorg, Karnataka.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedProducts />
      <AboutSection />
      <WhyChooseUs />
      <JourneySection />
      <Testimonials />
      <WholesaleCTA />
      <GallerySection />
      <FAQSection />
      <NewsletterSection />
    </>
  );
}
