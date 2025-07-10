import { useEffect, useState } from "react";

export function useIsMobile(breakpoint = 1000) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const handler = () => setIsMobile(media.matches);
    handler(); // Call once on mount
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [breakpoint]);

  return isMobile;
}
