import { HeroSection } from "@/features/home/components/HeroSection";
import { HomeMarquee } from "@/features/home/components/HomeMarquee";
import { FeaturedProjectsSection } from "@/features/home/components/FeaturedProjectsSection";
import { IndustrialBanner } from "@/features/home/components/IndustrialBanner";
import { ProductCollectionSection } from "@/features/home/components/ProductCollectionSection";

export function HomePage() {
  return (
    <>
      <HeroSection />
      <HomeMarquee />
      <FeaturedProjectsSection />
      <IndustrialBanner />
      <ProductCollectionSection />
    </>
  );
}
