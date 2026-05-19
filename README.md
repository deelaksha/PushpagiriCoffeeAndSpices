# 🌿 Pushpagiri Coffee & Spice — Ecommerce Website

A **complete production-level ecommerce website** for Pushpagiri Coffee & Spice, built with Next.js 15, TypeScript, Tailwind CSS, and Framer Motion.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 15** | App Router, SSR/SSG, Server Components |
| **TypeScript** | Type safety everywhere |
| **Tailwind CSS** | Utility-first styling |
| **ShadCN UI** | Accessible component primitives |
| **Framer Motion** | Animations & transitions |
| **Zustand** | Cart state management (persisted) |
| **React Hook Form** | Form handling |
| **Zod** | Schema validation |
| **Lucide React** | Icons |
| **Firebase** | Placeholder ready (not implemented) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Open in Browser
```
http://localhost:3000
```

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (Navbar, Footer, Cart)
│   ├── page.tsx            # Home page
│   ├── loading.tsx         # Global loading state
│   ├── error.tsx           # Global error boundary
│   ├── not-found.tsx       # 404 page
│   ├── sitemap.ts          # Dynamic XML sitemap
│   ├── robots.ts           # robots.txt
│   ├── shop/
│   │   ├── page.tsx        # Shop listing page
│   │   └── [slug]/page.tsx # Product detail page
│   ├── cart/page.tsx       # Cart page
│   ├── checkout/page.tsx   # Checkout page
│   ├── about/page.tsx      # About page
│   ├── contact/page.tsx    # Contact page
│   ├── wholesale/page.tsx  # Wholesale page
│   └── admin/
│       ├── layout.tsx      # Admin layout (no Navbar/Footer)
│       └── page.tsx        # Admin dashboard
│
├── components/
│   ├── ui/                 # ShadCN base components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── badge.tsx
│   │   ├── card.tsx
│   │   └── accordion.tsx
│   ├── layout/             # Global layout components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── CartDrawer.tsx
│   │   └── WhatsAppFloat.tsx
│   ├── home/               # Home page sections
│   │   ├── HeroSection.tsx
│   │   ├── FeaturedProducts.tsx
│   │   ├── AboutSection.tsx
│   │   ├── WhyChooseUs.tsx
│   │   ├── JourneySection.tsx
│   │   ├── Testimonials.tsx
│   │   ├── WholesaleCTA.tsx
│   │   ├── GallerySection.tsx
│   │   ├── FAQSection.tsx
│   │   └── NewsletterSection.tsx
│   └── shop/
│       └── ProductCard.tsx
│
├── constants/index.ts      # All data: products, FAQs, testimonials
├── hooks/
│   ├── useLocalStorage.ts  # Utility hooks
│   └── useProducts.ts      # Product filtering hook
├── lib/
│   ├── utils.ts            # Utility functions
│   ├── firebase.ts         # Firebase placeholder config
│   └── validations.ts      # Zod schemas
├── services/firebase/      # Firebase service layer
│   ├── products.ts
│   ├── orders.ts
│   └── notifications.ts
├── store/
│   └── cartStore.ts        # Zustand cart store
└── types/index.ts          # All TypeScript types
```

---

## 🎨 Design System

### Brand Colors
| Color | Hex | Usage |
|---|---|---|
| Light Green | `#A8D5BA` | Accents, badges |
| Dark Green | `#3A5A40` | Primary, headings |
| Coffee Brown | `#6F4E37` | Accents, prices |
| Cream | `#F8F5F0` | Background |
| Gold | `#C9A84C` | CTA buttons, highlights |

### Fonts
- **Headings**: Playfair Display (Google Fonts)
- **Body**: Inter (Google Fonts)

---

## 📄 Pages

| Page | Route | Description |
|---|---|---|
| Home | `/` | Full landing page with all sections |
| Shop | `/shop` | Product grid with filters & search |
| Product Detail | `/shop/[slug]` | Full product page |
| Cart | `/cart` | Cart management |
| Checkout | `/checkout` | Order form + WhatsApp order |
| About | `/about` | Brand story & timeline |
| Contact | `/contact` | Contact form + map |
| Wholesale | `/wholesale` | B2B inquiry page |
| Admin | `/admin` | Dashboard (frontend only) |
| 404 | `*` | Custom not-found page |

---

## 🔥 Firebase Integration (Placeholder)

Firebase is **not connected** but fully structured for future integration:

1. **Edit** `/src/lib/firebase.ts` — add your Firebase config
2. **Uncomment** the initialization code
3. **Run** `npm install firebase`
4. **Uncomment** service functions in `/src/services/firebase/`

Collections structure:
- `products` — Product catalog
- `orders` — Customer orders
- `customers` — Customer profiles
- `newsletter` — Email subscriptions
- `contact_forms` — Contact submissions
- `wholesale_inquiries` — B2B inquiries

---

## 💳 Payment Integration (Placeholder)

Currently orders flow via **WhatsApp**. To add payment:
1. Add Razorpay / PayU SDK
2. Create `/api/payment/route.ts`
3. Integrate in `/app/checkout/page.tsx`

---

## 📱 WhatsApp Integration

- Floating WhatsApp button (bottom-right)
- "Order via WhatsApp" on product & checkout pages
- Dynamic message auto-generation with cart contents
- Business number: Update `BRAND.whatsapp` in `/src/constants/index.ts`

---

## 🔧 Customization

### Update Business Info
Edit `/src/constants/index.ts` → `BRAND` object:
```ts
export const BRAND = {
  name: "Pushpagiri Coffee & Spice",
  phone: "+91 82772 61881",
  whatsapp: "+918277261881",
  email: "info@pushpagiricoffee.com",
  address: "...",
};
```

### Add Products
Edit the `PRODUCTS` array in `/src/constants/index.ts`

### Change Theme Colors
Edit `/tailwind.config.ts` → `theme.extend.colors`

---

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Build for Production
```bash
npm run build
npm start
```

---

## 📞 Support

Pushpagiri Coffee & Spice  
📍 Choudlu, Karnataka 571236  
📞 +91 82772 61881  
✉️ info@pushpagiricoffee.com
