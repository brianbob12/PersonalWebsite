<script lang="ts">
  import { HEX_WIDTH, HEX_HEIGHT } from "./hexGeometry";

  // Center fixed strokes on the perimeter; the SVG clip keeps only their
  // inner halves, so the shadow begins at the edge instead of a detached ring.
  const glowPoints = [
    [HEX_WIDTH / 4, 0],
    [(3 * HEX_WIDTH) / 4, 0],
    [HEX_WIDTH, HEX_HEIGHT / 2],
    [(3 * HEX_WIDTH) / 4, HEX_HEIGHT],
    [HEX_WIDTH / 4, HEX_HEIGHT],
    [0, HEX_HEIGHT / 2],
  ]
    .map((point) => point.join(","))
    .join(" ");

  interface Props {
    backgroundColor: string;
    borderColor: string;
    active?: boolean;
    children?: import("svelte").Snippet;
  }

  let {
    backgroundColor,
    borderColor,
    active = false,
    children,
  }: Props = $props();
</script>

<div
  class="hexagon"
  class:active
  style="width: {HEX_WIDTH}px; height: {HEX_HEIGHT}px; --hex-background: {backgroundColor}; --hex-border: {borderColor}"
>
  <div class="hexagon-left">
    <div class="hexagon-left-top"></div>
    <div class="hexagon-left-bottom"></div>
  </div>
  <div class="hexagon-middle">{@render children?.()}</div>
  <div class="hexagon-right">
    <div class="hexagon-right-top"></div>
    <div class="hexagon-right-bottom"></div>
  </div>
  {#if active}
    <!-- Fixed strokes form one continuous halo; only the HTML wrapper fades. -->
    <div class="hex-glow" aria-hidden="true">
      <svg
        viewBox={`0 0 ${HEX_WIDTH} ${HEX_HEIGHT}`}
        width={HEX_WIDTH}
        height={HEX_HEIGHT}
        focusable="false"
      >
        <g fill="none" stroke={borderColor} stroke-linejoin="round">
          {#each [[48, 0.015], [40, 0.02], [32, 0.025], [26, 0.035], [20, 0.05], [14, 0.075], [10, 0.11], [6, 0.18]] as [width, opacity]}
            <polygon
              points={glowPoints}
              stroke-width={width}
              stroke-opacity={opacity}
            />
          {/each}
        </g>
      </svg>
    </div>
  {/if}
</div>

<style>
  .hexagon {
    display: flex;
    overflow: hidden;
  }
  .hexagon-left,
  .hexagon-right {
    display: flex;
    flex-direction: column;
    width: 25%;
    height: 115.5%;
  }
  .hexagon-left-top,
  .hexagon-left-bottom,
  .hexagon-right-top,
  .hexagon-right-bottom {
    position: relative;
    width: 120%;
    height: 100%;
    background-color: var(--hex-background);
    border-color: var(--hex-border);
  }
  .hexagon-left-top,
  .hexagon-left-bottom {
    border-left-width: 3px;
  }
  .hexagon-right-top,
  .hexagon-right-bottom {
    border-right-width: 3px;
  }
  .hexagon-left-top {
    transform: translate(35%, 8.2%) rotate(30deg);
  }
  .hexagon-left-bottom {
    transform: translate(35%, -35%) rotate(-30deg);
  }
  .hexagon-right-top {
    transform: translate(-51%, 8.2%) rotate(-30deg);
  }
  .hexagon-right-bottom {
    transform: translate(-51%, -35%) rotate(30deg);
  }
  .hexagon-middle {
    position: relative;
    width: 50%;
    height: 100%;
    z-index: 5;
    background-color: var(--hex-background);
    border-block: 4px solid var(--hex-border);
  }
  .hexagon.active {
    position: relative;
  }
  .hex-glow {
    position: absolute;
    inset: 0;
    z-index: 6;
    pointer-events: none;
    opacity: 0.5;
  }
  .hex-glow svg {
    /* A static basic-shape clip follows the face throughout the flip. */
    clip-path: polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%);
    display: block;
    width: 100%;
    height: 100%;
  }
  /* Opt in to motion. Reduced motion keeps the same quiet, static outline. */
  @media (prefers-reduced-motion: no-preference) {
    .hex-glow {
      animation: hex-breathe 3.2s ease-in-out infinite;
    }
  }
  @keyframes hex-breathe {
    0%,
    100% {
      opacity: 0.25;
    }
    50% {
      opacity: 0.85;
    }
  }
</style>
