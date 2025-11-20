import { PageProps } from "fresh";

export default function Layout(props: PageProps) {
  const { Component } = props;
  // do something with state here
  return (
    <div class="container container-blog content">
      <Component />
    </div>
  );
}
