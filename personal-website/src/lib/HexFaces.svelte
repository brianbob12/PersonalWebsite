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
</script>

<!-- One rotation owns visibility; neither face is removed during a reversal. -->
<div
  class="hex-rotor"
  class:is-flipped={isFlipped}
  style="width: {HEX_WIDTH}px; height: {HEX_HEIGHT}px; --content-scale: {mobileMode
    ? 0.8
    : 1}"
>
  <div class="hex-face front" aria-hidden={isFlipped} inert={isFlipped}>
    <HexShape {backgroundColor} {borderColor}>
      <div class="hex-content">{@render front?.()}</div>
    </HexShape>
  </div>
  <div class="hex-face back" aria-hidden={!isFlipped} inert={!isFlipped}>
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
    transition: transform 1000ms ease;
  }
  .hex-rotor.is-flipped {
    transform: rotateX(180deg);
  }
  .hex-face {
    position: absolute;
    inset: 0;
    backface-visibility: hidden;
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
