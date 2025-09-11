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
      class={`px-2 py-1 border-gray-500 border-2 rounded-sm bg-white hover:bg-gray-200 transition-colors ${
        props.class || ""
      }`}
    />
  );
}
