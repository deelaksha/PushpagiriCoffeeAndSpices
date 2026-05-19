"use client";

import { motion } from "framer-motion";
import { JOURNEY_STEPS } from "@/constants";
import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";

export default function JourneySection() {
  return (
    <section className="section-padding bg-brand-cream">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="font-inter text-sm font-semibold text-brand-brown uppercase tracking-widest">
            Our Process
          </span>
          <h2 className="section-title mt-2">Farm-to-Cup Journey</h2>
          <p className="font-inter text-muted-foreground text-lg max-w-2xl mx-auto">
            Every step from our plantation to your doorstep is handled with
            care and precision.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Connector line — desktop */}
          <div className="hidden lg:block absolute top-10 left-0 right-0 h-0.5 bg-brand-green-light/40 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 relative z-10">
            {JOURNEY_STEPS.map((step, i) => {
              const Icon = Icons[step.icon as keyof typeof Icons] as LucideIcon;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  className="flex flex-col items-center text-center"
                >
                  {/* Step icon */}
                  <div className="relative mb-4">
                    <div className="w-20 h-20 bg-brand-green-dark rounded-full flex items-center justify-center shadow-soft">
                      {Icon && <Icon className="w-8 h-8 text-white" />}
                    </div>
                    <div className="absolute -top-1 -right-1 w-7 h-7 bg-brand-brown rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="font-playfair text-base font-bold text-brand-green-dark mb-2">
                    {step.title}
                  </h3>
                  <p className="font-inter text-xs text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
