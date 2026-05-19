"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { newsletterSchema, type NewsletterFormData } from "@/lib/validations";
import { Leaf, Check } from "lucide-react";

export default function NewsletterSection() {
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (data: NewsletterFormData) => {
    // TODO: Save to Firebase /newsletter collection
    await new Promise((r) => setTimeout(r, 1000));
    console.log("Newsletter signup:", data);
    setSubmitted(true);
  };

  return (
    <section className="py-20 bg-brand-green-dark">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="w-16 h-16 bg-brand-green-light/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Leaf className="w-8 h-8 text-brand-green-light" />
          </div>
          <h2 className="font-playfair text-4xl font-bold text-white mb-3">
            Join the Coorg Coffee Community
          </h2>
          <p className="font-inter text-white/70 mb-8">
            Get exclusive offers, harvest updates, brewing tips, and recipes directly from our Coorg estate.
          </p>

          {submitted ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-3 text-white"
            >
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8" />
              </div>
              <p className="font-playfair text-xl font-bold">You&apos;re in! 🎉</p>
              <p className="font-inter text-white/70 text-sm">
                Welcome to the Pushpagiri family. Check your inbox for a special welcome offer.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="Enter your email address"
                  className="h-14 text-base bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-brand-green-light"
                  aria-label="Email address for newsletter"
                />
                {errors.email && (
                  <p className="text-red-300 text-xs mt-1 text-left">{errors.email.message}</p>
                )}
              </div>
              <Button
                type="submit"
                size="lg"
                variant="gold"
                disabled={isSubmitting}
                className="h-14 shrink-0"
              >
                {isSubmitting ? "Subscribing..." : "Subscribe Now"}
              </Button>
            </form>
          )}

          <p className="font-inter text-xs text-white/40 mt-4">
            No spam. Unsubscribe anytime. We respect your privacy.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
