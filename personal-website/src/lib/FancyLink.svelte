<script lang="ts">
  export let href = "";
  export let position: "left" | "center" | "right" = "center";
</script>

<a class="hover-underline-animation {position}" {href}>
  <slot />
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
    color: #6366f1;
  }

  .hover-underline-animation::after {
    content: "";
    position: absolute;
    width: 100%;
    transform: scaleX(0);
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: #6366f1;
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
