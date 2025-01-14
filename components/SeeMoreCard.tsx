interface SeeMoreCardProps {
  href: string;
  text?: string;
}

export function SeeMoreCard({ href, text = "See more" }: SeeMoreCardProps) {
  return (
    <a
      href={href}
      class="small-card see-more-card"
      style="text-decoration: none; display: flex; justify-content: center; align-items: center;"
    >
      <i
        class="ph ph-arrow-bend-double-up-right"
        style="font-size: 2rem; color: var(--pico-primary-text)"
      />
      <span>{text}</span>
    </a>
  );
}
