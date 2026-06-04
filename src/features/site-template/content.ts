import type { LucideIcon } from 'lucide-react';
import {
  ArrowUpRight,
  Gauge,
  Image,
  Images,
  LayoutTemplate,
  MonitorPlay,
  MousePointer2,
  Paintbrush2,
  Scaling,
  Smartphone,
  Sparkles,
  Zap,
} from 'lucide-react';

export type NavigationSection = {
  id: string;
  label: string;
};

export type FeatureCard = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export type ShowcaseItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export type ShowcaseStat = {
  label: string;
  value: string;
  icon: LucideIcon;
};

export type BedTag = 'Best Seller' | 'New' | 'Sale' | 'Editor Pick';

export type BedListing = {
  id: string;
  name: string;
  subtitle: string;
  imageUrl: string;
  basePrice: number;
  tag: BedTag;
  rating: number;
  reviewCount: number;
};

export const BED_LISTINGS: BedListing[] = [
  {
    id: 'cloud-support-queen',
    name: 'CloudSupport Queen',
    subtitle: 'Memory foam comfort with ventilated airflow',
    imageUrl: 'https://picsum.photos/seed/bed-1/600/480',
    basePrice: 999,
    tag: 'Best Seller',
    rating: 4.8,
    reviewCount: 312,
  },
  {
    id: 'spinal-align-pro',
    name: 'SpinalAlign Pro',
    subtitle: 'Targeted lumbar support for restorative sleep',
    imageUrl: 'https://picsum.photos/seed/bed-2/600/480',
    basePrice: 1399,
    tag: 'Editor Pick',
    rating: 4.9,
    reviewCount: 204,
  },
  {
    id: 'heritage-oak-queen',
    name: 'Heritage Oak Queen',
    subtitle: 'Solid oak frame with hand-stitched upholstery',
    imageUrl: 'https://picsum.photos/seed/bed-3/600/480',
    basePrice: 2299,
    tag: 'New',
    rating: 4.7,
    reviewCount: 89,
  },
  {
    id: 'plush-zone-queen',
    name: 'PlushZone Queen',
    subtitle: 'Euro-top pillow design for deep cushioning',
    imageUrl: 'https://picsum.photos/seed/bed-4/600/480',
    basePrice: 799,
    tag: 'Sale',
    rating: 4.5,
    reviewCount: 156,
  },
  {
    id: 'airflow-cool-queen',
    name: 'Airflow Cool Queen',
    subtitle: 'Gel-infused foam keeps you temperature neutral',
    imageUrl: 'https://picsum.photos/seed/bed-5/600/480',
    basePrice: 1199,
    tag: 'Best Seller',
    rating: 4.6,
    reviewCount: 271,
  },
  {
    id: 'zen-nest-queen',
    name: 'ZenNest Queen',
    subtitle: 'Organic latex with natural cotton cover',
    imageUrl: 'https://picsum.photos/seed/bed-6/600/480',
    basePrice: 1699,
    tag: 'New',
    rating: 4.8,
    reviewCount: 63,
  },
  {
    id: 'ergo-balance-queen',
    name: 'ErgoBalance Queen',
    subtitle: 'Adjustable-firmness zones for couples',
    imageUrl: 'https://picsum.photos/seed/bed-7/600/480',
    basePrice: 1599,
    tag: 'Editor Pick',
    rating: 4.9,
    reviewCount: 198,
  },
  {
    id: 'luxe-hybrid-queen',
    name: 'Luxe Hybrid Queen',
    subtitle: 'Pocket coil + foam for premium support',
    imageUrl: 'https://picsum.photos/seed/bed-8/600/480',
    basePrice: 2099,
    tag: 'Sale',
    rating: 4.7,
    reviewCount: 47,
  },
];

export const navigationSections: NavigationSection[] = [
  { id: 'features', label: 'Features' },
  { id: 'showcase', label: 'Showcase' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'start', label: 'Start Here' },
];

export const heroHighlights: string[] = [
  'Clean structure for landing pages and marketing sites',
  'Responsive spacing and typography tuned for small screens first',
  'Animation patterns ready for premium interactions and reveals',
];

export const heroPreviewCards: FeatureCard[] = [
  {
    icon: Smartphone,
    title: 'Mobile-first layout',
    description: 'Responsive spacing, readable type, and stacked content blocks that scale elegantly.',
  },
  {
    icon: LayoutTemplate,
    title: 'Composable sections',
    description: 'Drop in product, portfolio, agency, SaaS, or service content without rewriting the foundation.',
  },
];

export const heroStackSummary = [
  { label: 'Animation', value: 'Framer Motion' },
  { label: 'Styling', value: 'Tailwind CSS' },
  { label: 'Build', value: 'Vite + React' },
];

export const featureCards: FeatureCard[] = [
  {
    icon: LayoutTemplate,
    title: 'Flexible page structure',
    description: 'A neutral layout that can become a product launch, studio site, portfolio, or campaign page.',
  },
  {
    icon: Scaling,
    title: 'Mobile-first by default',
    description: 'Responsive sections and spacing are tuned to feel intentional on phones before scaling up.',
  },
  {
    icon: Paintbrush2,
    title: 'Easy to rebrand',
    description: 'Swap colors, type, copy, and CTA flows without touching the underlying project setup.',
  },
  {
    icon: Zap,
    title: 'Motion-ready interactions',
    description: 'Framer Motion is already in place for entrances, micro-interactions, and premium section transitions.',
  },
  {
    icon: Image,
    title: 'Built for strong visuals',
    description: 'Use the clean card and showcase patterns as a base for high-quality imagery and art direction.',
  },
  {
    icon: MousePointer2,
    title: 'Clear conversion paths',
    description: 'The starter keeps calls to action simple so you can connect forms, booking flows, or product funnels later.',
  },
];

export const showcaseItems: ShowcaseItem[] = [
  {
    title: 'Launch Pages',
    description: 'Use bold headlines, image-led storytelling, and focused CTAs for product or service launches.',
    icon: Sparkles,
  },
  {
    title: 'Brand Websites',
    description: 'Build clean corporate, studio, or consultancy sites with adaptable sections and a polished rhythm.',
    icon: LayoutTemplate,
  },
  {
    title: 'Portfolio Experiences',
    description: 'Turn the showcase cards into case studies, galleries, team stories, or editorial layouts.',
    icon: ArrowUpRight,
  },
];

export const showcaseStats: ShowcaseStat[] = [
  { label: 'Designed for', value: 'Mobile first', icon: Gauge },
  { label: 'Visual style', value: 'Clean and flexible', icon: Images },
  { label: 'Interaction level', value: 'Motion ready', icon: MonitorPlay },
];

export const ctaChecklist: string[] = [
  'Replace the starter copy with your brand voice',
  'Add photography, renders, or product visuals that fit the site direction',
  'Connect the final CTA to your real form, CRM, or booking flow',
];
