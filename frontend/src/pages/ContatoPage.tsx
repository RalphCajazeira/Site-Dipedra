import { ArrowUpRight } from "lucide-react";

import { InternalPageHero } from "@/features/products/components/InternalPageHero";
import { Button } from "@/shared/ui";

import { ContactFormSection } from "@/features/contact/components/ContactFormSection";
import { ContactOverviewSection } from "@/features/contact/components/ContactOverviewSection";
import { contactPageHero } from "@/features/contact/data";
import { whatsappHref } from "@/shared/config/site";

export function ContatoPage() {
  return (
    <>
      <InternalPageHero
        breadcrumb={[
          { label: "Home", to: "/" },
          { label: "Contato" }
        ]}
        description={contactPageHero.description}
        eyebrow={contactPageHero.eyebrow}
        image={contactPageHero.image}
        imageAlt={contactPageHero.imageAlt}
        mediaCaption={contactPageHero.mediaCaption}
        mediaEyebrow={contactPageHero.mediaEyebrow}
        title={contactPageHero.title}
      >
        <Button href={whatsappHref} variant="primary">
          Falar no WhatsApp
          <ArrowUpRight size={16} />
        </Button>
        <Button href="#canais" variant="ghost">
          Ver canais
        </Button>
      </InternalPageHero>

      <ContactOverviewSection />
      <ContactFormSection />
    </>
  );
}
