import { AboutCtaSection } from "@/features/about/components/AboutCtaSection";
import { AboutPageHero } from "@/features/about/components/AboutPageHero";
import { AboutStorySection } from "@/features/about/components/AboutStorySection";
import { AboutValuesSection } from "@/features/about/components/AboutValuesSection";
import { aboutPageHero } from "@/features/about/data";

export function SobrePage() {
  return (
    <>
      <AboutPageHero
        breadcrumb={[
          { label: "Home", to: "/" },
          { label: "Sobre" }
        ]}
        description={aboutPageHero.description}
        eyebrow={aboutPageHero.eyebrow}
        image={aboutPageHero.image}
        imageAlt={aboutPageHero.imageAlt}
        title={aboutPageHero.title}
      />
      <AboutStorySection />
      <AboutValuesSection />
      <AboutCtaSection />
    </>
  );
}
