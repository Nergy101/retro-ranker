import { PageProps } from "fresh";

export default function Layout({ Component }: PageProps) {
  // do something with state here
  return (
    <div class="container content">
      <Component />
    </div>
  );
}
