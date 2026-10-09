<script lang="ts">
  import posthog from "posthog-js";

  interface Props {
    href?: string;
    position?: "left" | "center" | "right";
    children?: import("svelte").Snippet;
  }

  let { href = "", position = "center", children }: Props = $props();

  function trackClick() {
    posthog.capture("$autocapture", {
      name: "FancyLink Clicked",
      href: href,
      position: position,
    });
  }
</script>

<a class="hover-underline-animation {position}" {href} onclick={trackClick}>
  {@render children?.()}
</a>

<style>
  .hover-underline-animation {
    display: inline-block;
    position: relative;
  }

  a.hover-underline-animation {
    transition: color 0.25s ease-out;
  }

  a.hover-underline-animation:hover {
    color: #000000;
  }

  .hover-underline-animation::after {
    content: "";
    position: absolute;
    width: 100%;
    transform: scaleX(0);
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: #000000;
    transition: transform 0.25s ease-out;
  }

  .hover-underline-animation:hover::after {
    transform: scaleX(1);
  }

  .hover-underline-animation.left::after {
    transform-origin: bottom right;
  }

  .hover-underline-animation.left:hover::after {
    transform-origin: bottom left;
  }

  .hover-underline-animation.center::after {
    transform-origin: bottom center;
  }

  .hover-underline-animation.center:hover::after {
    transform-origin: bottom center;
  }

  .hover-underline-animation.right::after {
    transform-origin: bottom left;
  }

  .hover-underline-animation.right:hover::after {
    transform-origin: bottom right;
  }
</style>
