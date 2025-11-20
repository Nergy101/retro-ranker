import type { ComponentChildren } from "preact";

export interface ButtonProps {
  id?: string;
  onClick?: () => void;
  children?: ComponentChildren;
  disabled?: boolean;
  class?: string;
  style?: Record<string, any>;
  onMouseOver?: (e: MouseEvent) => void;
  onMouseOut?: (e: MouseEvent) => void;
}

export function Button(props: ButtonProps) {
  return (
    <button
      {...props}
      class={`button ${props.class || ""}`}
    />
  );
}
