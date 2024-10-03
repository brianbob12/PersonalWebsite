<script lang="ts">
  import HexTile from "$lib/HexTile.svelte";
</script>

<HexTile flipable>
  <div slot="content" class="flex flex-col items-center space-y-2 h-full">
    <div class="flex flex-row justify-center pt-32 w-[170%]">
      <div>
        <span class="font-bold text-6xl">Cyrus Singer</span>
      </div>
    </div>
    <div>
      <span class="text-2xl">Software Engineer</span>
    </div>
    <div class="absolute bottom-0">
      <span class="text-gray-500">Hover on hexagon for more info</span>
    </div>
  </div>
  <div slot="hover" class="h-full">
    <div class="flex flex-col justify-center items-center h-full space-y-4">
      <img src="/headshot.jpeg" alt="Cyrus Singer" class="rounded-full" />
      <div class="flex flex-row space-x-4">
        <a
          class="hover-underline-animation right"
          href="https://github.com/cyrus-singer">GitHub</a
        >
        <a
          class="hover-underline-animation center"
          href="https://www.linkedin.com/in/cyrus-singer-000000204/">LinkedIn</a
        >
        <a
          class="hover-underline-animation left"
          href="https://github.com/brianbob12/CV/blob/main/CV.pdf">Resume</a
        >
      </div>
      <a
        class="hover-underline-animation center"
        href="mailto:japaneserhino@gmail.com">japaneserhino@gmail.com</a
      >
      <a
        class="hover-underline-animation center"
        href="mailto:cysinger@seas.upenn.edu">cysinger@seas.upenn.edu</a
      >
    </div>
  </div>
</HexTile>

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
