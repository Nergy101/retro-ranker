import { PiArrowBendDoubleUpRight } from "@preact-icons/pi";

interface SeeMoreCardProps {
  href: string;
  text?: string;
}

export function SeeMoreCard({ href, text = "More devices" }: SeeMoreCardProps) {
  return (
    <a
      href={href}
      class="small-card see-more-card"
      style="text-decoration: none; display: flex; justify-content: center; align-items: center; text-align: center;"
    >
      <PiArrowBendDoubleUpRight
        style={{ fontSize: "2rem", color: "var(--pico-primary-text)" }}
      />
      <span class="see-more-text">{text}</span>
    </a>
  );
}
