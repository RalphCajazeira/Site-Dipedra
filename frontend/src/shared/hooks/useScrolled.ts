import { useEffect, useState } from "react";

export function useScrolled(threshold = 24) {
  const [scrolled, setScrolled] = useState(() =>
    typeof window === "undefined" ? false : window.scrollY > threshold
  );

  useEffect(() => {
    const update = () => {
      setScrolled(window.scrollY > threshold);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });

    return () => {
      window.removeEventListener("scroll", update);
    };
  }, [threshold]);

  return scrolled;
}
