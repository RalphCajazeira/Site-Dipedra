import { HeroSection } from "@/features/home/components/HeroSection";
import { HomeMarquee } from "@/features/home/components/HomeMarquee";
import { FeaturedProjectsSection } from "@/features/home/components/FeaturedProjectsSection";
import { IndustrialBanner } from "@/features/home/components/IndustrialBanner";
import { DifferentialsSection } from "@/features/home/components/DifferentialsSection";
import { FinalCtaSection } from "@/features/home/components/FinalCtaSection";
import { ProductCollectionSection } from "@/features/home/components/ProductCollectionSection";

export function HomePage() {
  return (
    <>
      <HeroSection />
      <HomeMarquee />
      <FeaturedProjectsSection />
      <IndustrialBanner />
      <ProductCollectionSection />
      <DifferentialsSection />
      <FinalCtaSection />
    </>
  );
}
