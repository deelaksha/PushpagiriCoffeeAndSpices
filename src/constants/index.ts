import { Product, Testimonial, FAQ, NavItem } from "@/types";

// =============================================
// NAVIGATION
// =============================================

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Shop",
    href: "/shop",
    children: [
      { label: "All Products", href: "/shop" },
      { label: "Coffee", href: "/shop?category=coffee" },
      { label: "Spices", href: "/shop?category=spices" },
      { label: "Premium Blends", href: "/shop?category=premium-blends" },
      { label: "Wholesale Packs", href: "/shop?category=wholesale-packs" },
    ],
  },
  { label: "About", href: "/about" },
  { label: "Wholesale", href: "/wholesale" },
  { label: "Contact", href: "/contact" },
];

// =============================================
// BRAND INFO
// =============================================

export const BRAND = {
  name: "Pushpagiri Coffee & Spice",
  tagline: "From the Misty Hills of Coorg",
  description:
    "Premium organic coffee and authentic spices sourced directly from the plantations of Choudlu, Karnataka.",
  phone: "+91 82772 61881",
  whatsapp: "+918277261881",
  email: "info@pushpagiricoffee.com",
  address: "Pushpagiri, Main Rd, Choudlu, Karnataka 571236",
  instagram: "https://instagram.com/pushpagiricoffee",
  facebook: "https://facebook.com/pushpagiricoffee",
  mapUrl:
    "https://www.google.com/maps?q=Choudlu,+Karnataka,+India",
};

// =============================================
// SAMPLE PRODUCTS DATA
// =============================================

export const PRODUCTS: Product[] = [
  // ─── COFFEE ───────────────────────────────────────
  {
    id: "pcs-001",
    name: "Arabica Single Origin Coffee",
    slug: "arabica-single-origin-coffee",
    category: "coffee",
    shortDescription:
      "Premium Arabica beans grown at high altitude in the Pushpagiri hills.",
    description:
      "Our Arabica Single Origin Coffee is sourced from select estates nestled in the misty Pushpagiri hills of Coorg. Hand-picked at peak ripeness and sun-dried to perfection, these beans deliver a smooth, well-balanced cup with delicate floral notes and bright acidity. Each batch is roasted in small quantities to ensure freshness and consistency.",
    images: [
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800",
    ],
    price: 450,
    originalPrice: 550,
    weightOptions: [
      { weight: "250g", price: 450, stock: 50 },
      { weight: "500g", price: 850, stock: 35 },
      { weight: "1kg", price: 1600, stock: 20 },
    ],
    stock: 50,
    sku: "PCS-ARA-001",
    badge: "Best Seller",
    isFeatured: true,
    isOrganic: true,
    origin: "Choudlu, Coorg, Karnataka",
    roastLevel: "medium",
    flavorNotes: ["Floral", "Citrus", "Dark Chocolate", "Caramel"],
    highlights: [
      "Single estate, traceable origin",
      "Hand-picked at peak ripeness",
      "Sun-dried & small-batch roasted",
      "100% organic certified",
      "No additives or preservatives",
    ],
    shippingInfo: "Ships in 2-3 business days. Free shipping above ₹999.",
    rating: 4.9,
    reviewCount: 127,
    tags: ["arabica", "single-origin", "organic", "premium"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-06-01T00:00:00Z",
  },
  {
    id: "pcs-002",
    name: "Robusta Bold Blend Coffee",
    slug: "robusta-bold-blend-coffee",
    category: "coffee",
    shortDescription:
      "Strong, earthy Robusta coffee with a rich crema — perfect for espresso lovers.",
    description:
      "Our Robusta Bold Blend is crafted for those who love a powerful, full-bodied cup. Grown in the low-lying estates of our plantation, these beans are known for their intense flavor, higher caffeine content, and the rich crema they produce. Ideal for espresso, South Indian filter coffee, and milk-based drinks.",
    images: [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800",
      "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=800",
    ],
    price: 350,
    originalPrice: 420,
    weightOptions: [
      { weight: "250g", price: 350, stock: 60 },
      { weight: "500g", price: 680, stock: 40 },
      { weight: "1kg", price: 1300, stock: 25 },
    ],
    stock: 60,
    sku: "PCS-ROB-002",
    badge: "Strong & Bold",
    isFeatured: true,
    isOrganic: true,
    origin: "Choudlu, Coorg, Karnataka",
    roastLevel: "dark",
    flavorNotes: ["Earthy", "Woody", "Cocoa", "Bold"],
    highlights: [
      "High caffeine content",
      "Rich, thick crema",
      "Ideal for South Indian filter coffee",
      "Naturally grown without pesticides",
    ],
    shippingInfo: "Ships in 2-3 business days. Free shipping above ₹999.",
    rating: 4.7,
    reviewCount: 89,
    tags: ["robusta", "bold", "espresso", "filter-coffee"],
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-06-01T00:00:00Z",
  },
  {
    id: "pcs-003",
    name: "Coorg Filter Coffee Powder",
    slug: "coorg-filter-coffee-powder",
    category: "coffee",
    shortDescription:
      "Traditional South Indian filter coffee blend — 80:20 Arabica-Robusta ratio.",
    description:
      "Experience the authentic taste of South Indian filter coffee. Our Coorg Filter Coffee Powder is a carefully crafted blend of 80% Arabica and 20% Robusta beans, providing the perfect balance of smoothness and strength. Ground to a medium coarseness, it is ideal for the traditional steel decoction filter.",
    images: [
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800",
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800",
    ],
    price: 299,
    originalPrice: 360,
    weightOptions: [
      { weight: "200g", price: 299, stock: 80 },
      { weight: "500g", price: 699, stock: 50 },
      { weight: "1kg", price: 1299, stock: 30 },
    ],
    stock: 80,
    sku: "PCS-FCP-003",
    badge: "Traditional",
    isFeatured: true,
    isOrganic: false,
    origin: "Choudlu, Coorg, Karnataka",
    roastLevel: "dark",
    flavorNotes: ["Roasted", "Nutty", "Sweet", "Full-bodied"],
    highlights: [
      "80:20 Arabica-Robusta blend",
      "Medium grind for filter use",
      "Freshly roasted & ground",
      "Traditional Coorg recipe",
    ],
    shippingInfo: "Ships in 1-2 business days. Free shipping above ₹999.",
    rating: 4.8,
    reviewCount: 213,
    tags: ["filter-coffee", "traditional", "south-indian", "coorg"],
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-06-01T00:00:00Z",
  },

  // ─── SPICES ───────────────────────────────────────
  {
    id: "pcs-004",
    name: "Black Pepper – Coorg Special",
    slug: "black-pepper-coorg-special",
    category: "spices",
    shortDescription:
      "Sun-dried whole black peppercorns with intense pungency from Coorg's fertile soil.",
    description:
      "Our Black Pepper is grown on pepper vines that climb the silver oak trees of our plantation. Harvested at the right stage of maturity and sun-dried traditionally, each peppercorn carries the intense pungency and complex heat that Coorg pepper is famous for worldwide. Rich in piperine, these peppercorns are not just a spice—they're a health food.",
    images: [
      "https://images.unsplash.com/photo-1599909543555-f0d5aa27e42c?w=800",
      "https://images.unsplash.com/photo-1624454002302-36b824d7bd0a?w=800",
    ],
    price: 280,
    originalPrice: 340,
    weightOptions: [
      { weight: "100g", price: 280, stock: 100 },
      { weight: "250g", price: 620, stock: 60 },
      { weight: "500g", price: 1100, stock: 40 },
    ],
    stock: 100,
    sku: "PCS-BPP-004",
    badge: "Export Quality",
    isFeatured: true,
    isOrganic: true,
    origin: "Choudlu, Coorg, Karnataka",
    highlights: [
      "Naturally sun-dried",
      "High piperine content",
      "No preservatives or additives",
      "Export quality grade",
      "Antibiotic and antioxidant properties",
    ],
    shippingInfo: "Ships in 2-3 business days. Free shipping above ₹999.",
    rating: 4.9,
    reviewCount: 156,
    tags: ["black-pepper", "organic", "whole-pepper", "coorg"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-06-01T00:00:00Z",
  },
  {
    id: "pcs-005",
    name: "Green Cardamom – Premium Grade",
    slug: "green-cardamom-premium-grade",
    category: "spices",
    shortDescription:
      "Aromatic green cardamom pods bursting with intense fragrance.",
    description:
      "Sourced from the shade of our coffee plantation, our Green Cardamom pods are handpicked for their plumpness and rich essential oil content. Known as the 'Queen of Spices', cardamom from Coorg is prized for its superior aroma and flavor. Perfect for Indian sweets, chai, biryani, and premium desserts.",
    images: [
      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800",
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800",
    ],
    price: 650,
    originalPrice: 780,
    weightOptions: [
      { weight: "50g", price: 650, stock: 70 },
      { weight: "100g", price: 1200, stock: 45 },
      { weight: "250g", price: 2800, stock: 20 },
    ],
    stock: 70,
    sku: "PCS-GCP-005",
    badge: "Queen of Spices",
    isFeatured: true,
    isOrganic: true,
    origin: "Choudlu, Coorg, Karnataka",
    highlights: [
      "Hand-picked & sun-dried",
      "High essential oil content",
      "Vibrant green color preserved",
      "Ideal for chai, sweets & biryani",
    ],
    shippingInfo: "Ships in 2-3 business days. Free shipping above ₹999.",
    rating: 4.8,
    reviewCount: 98,
    tags: ["cardamom", "green-cardamom", "premium", "aromatic"],
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-06-01T00:00:00Z",
  },
  {
    id: "pcs-006",
    name: "Cloves – Whole Organic",
    slug: "cloves-whole-organic",
    category: "spices",
    shortDescription:
      "Aromatic whole cloves with high eugenol content for intense flavor.",
    description:
      "Our organic cloves are hand-harvested from mature clove trees on our estate. With their high eugenol content, these cloves provide an intense, warming aroma perfect for biryanis, masalas, festive cooking, and natural remedies. Dried naturally to preserve their essential oils.",
    images: [
      "https://images.unsplash.com/photo-1517171717143-9e6e6f20d3c0?w=800",
    ],
    price: 420,
    originalPrice: 500,
    weightOptions: [
      { weight: "100g", price: 420, stock: 80 },
      { weight: "250g", price: 980, stock: 50 },
      { weight: "500g", price: 1800, stock: 30 },
    ],
    stock: 80,
    sku: "PCS-CLV-006",
    badge: "Organic",
    isFeatured: false,
    isOrganic: true,
    origin: "Choudlu, Coorg, Karnataka",
    highlights: [
      "High eugenol content",
      "Natural air-dried",
      "Antimicrobial properties",
      "Ideal for masalas & biryani",
    ],
    shippingInfo: "Ships in 2-3 business days. Free shipping above ₹999.",
    rating: 4.7,
    reviewCount: 72,
    tags: ["cloves", "organic", "whole-spice", "eugenol"],
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: "2024-06-01T00:00:00Z",
  },
  {
    id: "pcs-007",
    name: "Cinnamon Sticks – Ceylon Grade",
    slug: "cinnamon-sticks-ceylon-grade",
    category: "spices",
    shortDescription:
      "True Ceylon cinnamon sticks with a sweet, mild fragrance.",
    description:
      "Unlike cassia, our Ceylon cinnamon features thin, delicate layers with a sweet, mild, and complex flavor profile. Sourced from our plantation and carefully dried, these sticks are perfect for teas, desserts, and culinary uses. Lower in coumarin, making them safer for regular consumption.",
    images: [
      "https://images.unsplash.com/photo-1566836610593-62a64888a216?w=800",
    ],
    price: 380,
    originalPrice: 450,
    weightOptions: [
      { weight: "100g", price: 380, stock: 65 },
      { weight: "250g", price: 880, stock: 40 },
      { weight: "500g", price: 1600, stock: 25 },
    ],
    stock: 65,
    sku: "PCS-CIN-007",
    badge: "Ceylon Grade",
    isFeatured: false,
    isOrganic: true,
    origin: "Choudlu, Coorg, Karnataka",
    highlights: [
      "True Ceylon variety",
      "Low coumarin content",
      "Sweet, delicate flavor",
      "Ideal for tea & desserts",
    ],
    shippingInfo: "Ships in 2-3 business days. Free shipping above ₹999.",
    rating: 4.6,
    reviewCount: 61,
    tags: ["cinnamon", "ceylon", "organic", "sweet-spice"],
    createdAt: "2024-03-15T00:00:00Z",
    updatedAt: "2024-06-01T00:00:00Z",
  },

  // ─── PREMIUM BLENDS ───────────────────────────────
  {
    id: "pcs-008",
    name: "Estate Premium Coffee Gift Box",
    slug: "estate-premium-coffee-gift-box",
    category: "premium-blends",
    shortDescription:
      "A curated gift box with Arabica, Robusta and Filter Coffee — perfect gift.",
    description:
      "Our Estate Premium Coffee Gift Box is designed for the true coffee lover. Includes 100g each of our Arabica Single Origin, Robusta Bold Blend, and traditional Filter Coffee Powder, all packed in an elegant handcrafted wooden box. The perfect gift for occasions or a treat for yourself.",
    images: [
      "https://images.unsplash.com/photo-1611068851740-c7a90b3c01f1?w=800",
      "https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?w=800",
    ],
    price: 999,
    originalPrice: 1299,
    weightOptions: [
      { weight: "Gift Box (3x100g)", price: 999, stock: 30 },
    ],
    stock: 30,
    sku: "PCS-GFT-008",
    badge: "Gift Box",
    isFeatured: true,
    isOrganic: true,
    origin: "Choudlu, Coorg, Karnataka",
    highlights: [
      "Elegant handcrafted wooden box",
      "3 premium coffee varieties",
      "Perfect for gifting",
      "Branded packaging",
    ],
    shippingInfo: "Ships in 3-5 business days. Special gift packaging.",
    rating: 5.0,
    reviewCount: 44,
    tags: ["gift", "premium", "collection", "gift-box"],
    createdAt: "2024-04-01T00:00:00Z",
    updatedAt: "2024-06-01T00:00:00Z",
  },
  {
    id: "pcs-009",
    name: "Spice Master Collection",
    slug: "spice-master-collection",
    category: "premium-blends",
    shortDescription:
      "Curated set of 4 premium spices — Pepper, Cardamom, Cloves & Cinnamon.",
    description:
      "The Spice Master Collection brings together the four crown jewels of Indian spices from our Coorg plantation. Each spice is carefully selected, processed, and packed in premium recyclable pouches. A thoughtful gift and an essential for any spice enthusiast or home chef.",
    images: [
      "https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=800",
    ],
    price: 1299,
    originalPrice: 1650,
    weightOptions: [
      { weight: "Collection (4 spices)", price: 1299, stock: 25 },
    ],
    stock: 25,
    sku: "PCS-SMC-009",
    badge: "Collection",
    isFeatured: true,
    isOrganic: true,
    origin: "Choudlu, Coorg, Karnataka",
    highlights: [
      "4 premium organic spices",
      "Eco-friendly packaging",
      "Great for home chefs",
      "Perfect housewarming gift",
    ],
    shippingInfo: "Ships in 3-5 business days. Special gift packaging.",
    rating: 4.9,
    reviewCount: 38,
    tags: ["spice-collection", "gift", "premium", "organic"],
    createdAt: "2024-04-15T00:00:00Z",
    updatedAt: "2024-06-01T00:00:00Z",
  },

  // ─── WHOLESALE ────────────────────────────────────
  {
    id: "pcs-010",
    name: "Arabica Coffee – Wholesale 5kg",
    slug: "arabica-coffee-wholesale-5kg",
    category: "wholesale-packs",
    shortDescription:
      "Bulk Arabica coffee beans for cafes, restaurants and retailers.",
    description:
      "Our wholesale 5kg Arabica coffee pack is ideal for cafes, restaurants, and coffee shops looking to serve premium Coorg coffee. Same high-quality beans as our retail range, packed in bulk food-grade bags. Contact us for custom blends, roast levels, and larger quantities.",
    images: [
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800",
    ],
    price: 6500,
    weightOptions: [
      { weight: "5kg", price: 6500, stock: 15 },
      { weight: "10kg", price: 12000, stock: 10 },
      { weight: "25kg", price: 27500, stock: 5 },
    ],
    stock: 15,
    sku: "PCS-WHL-010",
    badge: "Wholesale",
    isFeatured: false,
    isOrganic: true,
    origin: "Choudlu, Coorg, Karnataka",
    highlights: [
      "Bulk pricing available",
      "Custom blends on request",
      "Custom roasting available",
      "Ideal for cafes & hotels",
    ],
    shippingInfo: "Bulk shipping in 5-7 business days. Call for freight details.",
    rating: 4.8,
    reviewCount: 22,
    tags: ["wholesale", "bulk", "arabica", "trade"],
    createdAt: "2024-05-01T00:00:00Z",
    updatedAt: "2024-06-01T00:00:00Z",
  },
];

// =============================================
// TESTIMONIALS DATA
// =============================================

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Priya Sharma",
    location: "Bangalore",
    rating: 5,
    text: "The Arabica coffee from Pushpagiri is hands down the best I've ever tasted. The floral notes and smooth finish are just incredible. It's become my morning ritual!",
    product: "Arabica Single Origin Coffee",
  },
  {
    id: "t2",
    name: "Rajesh Nair",
    location: "Kochi",
    rating: 5,
    text: "As a restaurant owner, I've tried many coffee suppliers. Pushpagiri stands out for consistency, quality, and the authentic taste of Coorg. My customers love it.",
    product: "Coorg Filter Coffee Powder",
  },
  {
    id: "t3",
    name: "Ananya Krishnan",
    location: "Chennai",
    rating: 5,
    text: "The black pepper is absolutely extraordinary. One pinch and I could tell it was different — more fragrant, more pungent. Nothing from the supermarket compares.",
    product: "Black Pepper – Coorg Special",
  },
  {
    id: "t4",
    name: "Deepak Menon",
    location: "Mumbai",
    rating: 5,
    text: "Ordered the Spice Master Collection as a gift for my parents and they absolutely loved it. The quality is exceptional and the packaging is beautiful.",
    product: "Spice Master Collection",
  },
  {
    id: "t5",
    name: "Kavya Reddy",
    location: "Hyderabad",
    rating: 4,
    text: "The cardamom is so fragrant it transformed my chai completely. Will definitely be a regular customer. Fast shipping too!",
    product: "Green Cardamom – Premium Grade",
  },
  {
    id: "t6",
    name: "Suresh Gowda",
    location: "Mysore",
    rating: 5,
    text: "Being a Coorg native myself, I can say these products are authentically from Coorg. The flavors take me back home every time.",
    product: "Arabica Single Origin Coffee",
  },
];

// =============================================
// FAQ DATA
// =============================================

export const FAQS: FAQ[] = [
  {
    id: "faq-1",
    question: "Are your products certified organic?",
    answer:
      "Yes, our coffee and spices are grown using organic farming practices without the use of synthetic pesticides or fertilizers. We are in the process of obtaining FSSAI and organic certifications.",
    category: "products",
  },
  {
    id: "faq-2",
    question: "How long does shipping take?",
    answer:
      "Standard delivery takes 3-7 business days across India. We ship from Choudlu, Karnataka. Free shipping is available on orders above ₹999. Express delivery is available in select cities.",
    category: "shipping",
  },
  {
    id: "faq-3",
    question: "Do you offer wholesale or bulk pricing?",
    answer:
      "Yes! We provide wholesale pricing for cafes, restaurants, hotels, and retailers. Visit our Wholesale page or contact us via WhatsApp for custom pricing and minimum order quantities.",
    category: "wholesale",
  },
  {
    id: "faq-4",
    question: "How should I store my coffee and spices?",
    answer:
      "Store in a cool, dry, airtight container away from direct sunlight and moisture. Coffee is best consumed within 3 months of roasting. Whole spices retain flavor for 12-18 months; ground spices for 6-12 months.",
    category: "products",
  },
  {
    id: "faq-5",
    question: "Can I place a custom or personalized order?",
    answer:
      "Absolutely! We offer custom packaging, personalized gift boxes, and custom roast levels. Contact us via WhatsApp at +91 82772 61881 or email us to discuss your requirements.",
    category: "orders",
  },
  {
    id: "faq-6",
    question: "What is your return and refund policy?",
    answer:
      "We accept returns within 7 days of delivery if the product is damaged or incorrect. As food products, we do not accept returns for personal preference. Contact us with photos of the issue for a quick resolution.",
    category: "orders",
  },
  {
    id: "faq-7",
    question: "Do you export internationally?",
    answer:
      "Yes, we export to select countries. Contact us via email at info@pushpagiricoffee.com for international shipping rates, documentation requirements, and minimum export quantities.",
    category: "shipping",
  },
  {
    id: "faq-8",
    question: "What payment methods do you accept?",
    answer:
      "Currently we accept orders via WhatsApp and process payments through bank transfer (NEFT/RTGS), UPI (Google Pay, PhonePe, Paytm), and Cash on Delivery for select pincodes. Online payment gateway is coming soon.",
    category: "orders",
  },
];

// =============================================
// FARM TO CUP JOURNEY STEPS
// =============================================

export const JOURNEY_STEPS = [
  {
    step: 1,
    icon: "Sprout",
    title: "Cultivated with Care",
    description:
      "Our coffee and spices are grown organically at our Pushpagiri estate in Choudlu, Coorg — surrounded by pristine forests at 900m altitude.",
  },
  {
    step: 2,
    icon: "Hand",
    title: "Hand-Picked at Peak",
    description:
      "Every cherry and spice pod is carefully hand-selected at peak ripeness by our experienced estate workers to ensure only the best reaches you.",
  },
  {
    step: 3,
    icon: "Sun",
    title: "Sun-Dried Naturally",
    description:
      "Produce is naturally sun-dried on raised beds, preserving flavor compounds and allowing the terroir to shine through in every cup.",
  },
  {
    step: 4,
    icon: "Flame",
    title: "Small-Batch Roasted",
    description:
      "Coffee is roasted in small batches in our on-site roastery, with each roast profile carefully calibrated for the specific bean variety.",
  },
  {
    step: 5,
    icon: "Package",
    title: "Packed Fresh",
    description:
      "Products are packed in nitrogen-flushed, resealable pouches immediately after roasting to lock in freshness and aroma.",
  },
  {
    step: 6,
    icon: "Truck",
    title: "Delivered to Your Door",
    description:
      "Orders are shipped within 48 hours via trusted courier partners, reaching you fresh — from our hill estate to your doorstep.",
  },
];

// =============================================
// WHY CHOOSE US
// =============================================

export const WHY_CHOOSE_US = [
  {
    icon: "Leaf",
    title: "100% Organic",
    description:
      "Grown without synthetic chemicals using traditional, sustainable farming methods passed down through generations.",
  },
  {
    icon: "MapPin",
    title: "Single Estate",
    description:
      "Every product is traceable to our Pushpagiri estate in Choudlu, Coorg — no middlemen, just pure origin quality.",
  },
  {
    icon: "Award",
    title: "Export Grade Quality",
    description:
      "Our products meet international export standards, ensuring world-class quality in every batch we produce.",
  },
  {
    icon: "Heart",
    title: "Farmer Fair Trade",
    description:
      "We ensure fair wages and excellent working conditions for all our plantation workers and their families.",
  },
  {
    icon: "RefreshCw",
    title: "Always Fresh",
    description:
      "Small-batch roasting and quick shipping means your coffee reaches you within days of being roasted.",
  },
  {
    icon: "Headphones",
    title: "Personal Service",
    description:
      "Direct access to us via WhatsApp. We're a family business and treat every customer like family.",
  },
];
