import {
  CtaSection,
  FeaturesSection,
  FooterSection,
  HeaderSection,
  HeroSection,
  PricingSection,
  ShowcaseSection,
} from './features/site-template';

export function App() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <HeaderSection />
      <HeroSection />
      <FeaturesSection />
      <ShowcaseSection />
      <PricingSection />
      <CtaSection />
      <FooterSection />
    </div>
  );
}
