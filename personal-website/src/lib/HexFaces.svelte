<script lang="ts">
  import HexShape from "./HexShape.svelte";
  import { HEX_WIDTH, HEX_HEIGHT } from "./hexGeometry";

  interface Props {
    backgroundColor: string;
    borderColor: string;
    isFlipped?: boolean;
    mobileMode?: boolean;
    front?: import("svelte").Snippet;
    back?: import("svelte").Snippet;
  }

  let {
    backgroundColor,
    borderColor,
    isFlipped = false,
    mobileMode = false,
    front,
    back,
  }: Props = $props();

  let rotor: HTMLDivElement;
  let showingBack = $state(false);

  $effect(() => {
    const target = isFlipped;
    let frame = 0;

    function updateVisibleFace() {
      // WebKit can paint transformed descendants despite backface-visibility.
      // Read the actual animated angle, including reversals, instead of using
      // the destination state or a separate content-swap timer.
      const matrix = new DOMMatrixReadOnly(getComputedStyle(rotor).transform);
      showingBack = matrix.m22 < 0;
      if (
        rotor
          .getAnimations()
          .some((animation) => animation.playState !== "finished")
      ) {
        frame = requestAnimationFrame(updateVisibleFace);
      } else {
        showingBack = target;
      }
    }

    updateVisibleFace();
    return () => cancelAnimationFrame(frame);
  });
</script>

<!-- One rotation owns visibility; neither face is removed during a reversal. -->
<div
  bind:this={rotor}
  class="hex-rotor"
  class:is-flipped={isFlipped}
  style="width: {HEX_WIDTH}px; height: {HEX_HEIGHT}px; --content-scale: {mobileMode
    ? 0.8
    : 1}"
>
  <div
    class="hex-face front"
    class:is-visible={!showingBack}
    aria-hidden={isFlipped}
    inert={isFlipped}
  >
    <HexShape {backgroundColor} {borderColor}>
      <div class="hex-content">{@render front?.()}</div>
    </HexShape>
  </div>
  <div
    class="hex-face back"
    class:is-visible={showingBack}
    aria-hidden={!isFlipped}
    inert={!isFlipped}
  >
    <HexShape {backgroundColor} {borderColor} active={isFlipped}>
      <div class="hex-content">{@render back?.()}</div>
    </HexShape>
  </div>
</div>

<style>
  .hex-rotor {
    position: relative;
    transform-style: preserve-3d;
    transform: rotateX(0deg);
    transition: transform 1000ms ease-in-out;
  }
  .hex-rotor.is-flipped {
    transform: rotateX(180deg);
  }
  .hex-face {
    position: absolute;
    inset: 0;
    /* Keep each face's descendants together as one surface. Opacity avoids
       WebKit's inconsistent descendant backface culling without removing DOM. */
    transform: rotateX(0deg);
    transform-style: flat;
    opacity: 0;
    pointer-events: none;
  }
  .hex-face.is-visible {
    opacity: 1;
    pointer-events: auto;
  }
  .hex-face.back {
    transform: rotateX(180deg);
  }
  .hex-content {
    height: 100%;
    padding-block: 0.5rem;
    transform: scale(var(--content-scale));
  }
  @media (prefers-reduced-motion: reduce) {
    .hex-rotor {
      transition: none;
    }
  }
</style>
