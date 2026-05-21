import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // ─── Log full URLs for server-side fetch() calls in dev ──────────────────
  ...(isDev && {
    logging: {
      fetches: {
        fullUrl: true,
      },
    },
  }),

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google profile photos
      },
    ],
  },

  experimental: {
    // Server Actions enabled by default in Next.js 15
  },

  // ─── Webpack: verbose error reporting only (no devtool override) ──────────
  webpack(config, { isServer, dev }) {
    if (dev) {
      // Print detailed error stats to the terminal
      config.stats = {
        errors: true,
        errorDetails: true,
        warnings: true,
        moduleTrace: true, // full import chain that caused the error
        logging: "verbose",
      };

      // Custom plugin: dump full error details on every build
      config.plugins = config.plugins || [];
      config.plugins.push({
        apply(compiler: any) {
          compiler.hooks.done.tap("DebugErrorPlugin", (stats: any) => {
            if (stats.hasErrors()) {
              console.error(
                "\n\n========== WEBPACK BUILD ERROR ==========\n"
              );
              const info = stats.toJson({
                errors: true,
                moduleTrace: true,
                errorDetails: true,
              });

              info.errors?.forEach((err: any, i: number) => {
                console.error(`--- Error #${i + 1} ---`);
                console.error(
                  "File   :",
                  err.moduleName || err.file || "unknown"
                );
                console.error("Message:", err.message);
                if (err.details) console.error("Details:", err.details);
                if (err.moduleTrace?.length) {
                  console.error("Import chain:");
                  err.moduleTrace.forEach((t: any) =>
                    console.error("  ←", t.originName || t.origin)
                  );
                }
                console.error("");
              });

              console.error("=========================================\n");
            }
          });
        },
      });
    }

    return config;
  },
};

export default nextConfig;
