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
      style={{
        textDecoration: "none",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      {/* <PiArrowBendDoubleUpRight
        style={{ fontSize: "2rem", color: "var(--pico-primary-text)" }}
      /> */}
      <span class="see-more-text">{text}</span>
    </a>
  );
}
