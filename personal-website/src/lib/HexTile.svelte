<script lang="ts">
  import posthog from "posthog-js";

  export let flipable: boolean = false;
  export let name: string = "Empty";
  export let mobileMode: boolean = false;

  export let backgroundColor = "#374151"; //"#f9fafb";

  $: borderColor = flipable ? "#6366f1" : "#14b8a6";

  const root3Over2 = Math.sqrt(3) / 2;
  const borderSize = 4;
  const angleBorderSize = borderSize * 0.75;

  const size = 500;

  let isFlipped = false;
  const handleMouseEnter = () => {
    if (!flipable || mobileMode) {
      trackTap();
      return;
    }
    trackFlip();
    isFlipped = true;
  };
  const handleMouseLeave = () => {
    if (!flipable || mobileMode) return;
    isFlipped = false;
  };

  function delay(
    node: HTMLElement,
    { duration, apppear }: { duration: number; apppear: boolean },
  ) {
    return {
      duration,
      css: (t: number) => {
        if (apppear) {
          return `opacity: 0`;
        }
        return `opacity: 1`;
      },
    };
  }

  function trackTap() {
    posthog.capture("tapTile", {
      name: name,
    });
  }

  function trackFlip() {
    posthog.capture("flipTile", {
      name: name,
    });
  }

  function toggleFlipped() {
    if (!flipable) {
      return;
    }
    isFlipped = !isFlipped;
  }
</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<div
  class="hex-container"
  on:mouseenter={handleMouseEnter}
  on:mouseleave={handleMouseLeave}
  role={flipable ? "button" : "none"}
  tabindex={flipable ? 0 : -1}
  style={flipable ? (isFlipped ? "z-index:20" : "z-index:10") : ""}
>
  <div
    class="hexagon"
    style="width: {size}px; height: {size * root3Over2}px; transform: {isFlipped
      ? 'rotateX(180deg)'
      : 'rotateX(0deg)'}"
    on:click={toggleFlipped}
    on:keypress={toggleFlipped}
    role="button"
    tabindex={0}
  >
    <div class="hexagon-left">
      <div
        class="hexagon-left-top {isFlipped ? 'hexagon-left-top-hover' : ''}"
        style="background-color: {backgroundColor}; border-left-width: {angleBorderSize}px; border-color: {borderColor}"
      />
      <div
        class="hexagon-left-bottom {isFlipped
          ? 'hexagon-left-bottom-hover'
          : ''}"
        style="background-color: {backgroundColor}; border-left-width: {angleBorderSize}px; border-color: {borderColor}"
      />
    </div>
    <div
      class="hexagon-middle {isFlipped ? 'hexagon-middle-hover' : ''}"
      style="background-color: {backgroundColor}; border-top-width: {borderSize}px; border-bottom-width: {borderSize}px; border-color: {borderColor}"
    >
      {#if isFlipped}
        <div
          class="hex-content"
          in:delay={{ duration: 250, apppear: true }}
          out:delay={{ duration: 250, apppear: false }}
          style="transform: rotateX(180deg) {mobileMode ? 'scale(0.8)' : ''}"
        >
          <slot name="hover" />
        </div>
      {:else}
        <div
          class="hex-content"
          in:delay={{ duration: 250, apppear: true }}
          out:delay={{ duration: 250, apppear: false }}
          style="transform: rotateX(0deg) {mobileMode ? 'scale(0.8)' : ''}"
        >
          <slot name="content" />
        </div>
      {/if}
    </div>
    <div class="hexagon-right">
      <div
        class="hexagon-right-top {isFlipped ? 'hexagon-right-top-hover' : ''}"
        style="background-color: {backgroundColor}; border-right-width: {angleBorderSize}px; border-color: {borderColor}"
      />
      <div
        class="hexagon-right-bottom {isFlipped
          ? 'hexagon-right-bottom-hover'
          : ''}"
        style="background-color: {backgroundColor}; border-right-width: {angleBorderSize}px; border-color: {borderColor}"
      />
    </div>
  </div>
</div>

<style>
  .hexagon {
    display: flex;
    flex-direction: row;
    overflow: hidden;
    transform: rotateX(0deg);
    transition: transform 1000ms ease;
  }
  .hexagon-left {
    display: flex;
    flex-direction: column;
    height: 115.5%; /* h = size*/
    width: 25%;
  }
  .hexagon-left-top {
    width: 120%;
    height: 100%;
    transform: translate(35%, 8.2%) rotate(30deg);
    position: relative;
  }
  .hexagon-left-top-hover:before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: rippleLeft 1s ease-in-out infinite;
    width: 100%;
    height: 100%;
  }
  .hexagon-left-bottom {
    width: 120%;
    height: 100%;
    transform: translate(35%, -35%) rotate(-30deg);
    position: relative;
  }
  .hexagon-left-bottom-hover:before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: rippleLeft 1s ease-in-out infinite;
    width: 100%;
    height: 100%;
  }
  .hexagon-middle {
    position: relative;
    width: 50%;
    height: 100%;
    z-index: 5;
  }
  .hexagon-middle-hover:before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: rippleTopBottom 1s ease-in-out infinite;
    width: 100%;
    height: 100%;
  }
  .hexagon-right {
    display: flex;
    flex-direction: column;
    width: 25%;
    height: 115.5%; /* h = size*/
  }
  .hexagon-right-top {
    width: 120%;
    height: 100%;
    transform: translate(-51%, 8.2%) rotate(-30deg);
    position: relative;
  }
  .hexagon-right-top-hover:before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: rippleRight 1s ease-in-out infinite;
    width: 100%;
    height: 100%;
  }
  .hexagon-right-bottom {
    width: 120%;
    height: 100%;
    transform: translate(-51%, -35%) rotate(30deg);
    position: relative;
  }
  .hexagon-right-bottom-hover:before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: rippleRight 1s ease-in-out infinite;
    width: 100%;
    height: 100%;
  }
  .hex-container {
    transition: transform 0.3s ease;
  }
  .hex-content {
    height: 100%;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }

  @keyframes rippleTopBottom {
    from {
      border-top: 1px solid transparent;
      border-bottom: 1px solid transparent;
    }

    to {
      border-top: 20px solid #6366f1;
      border-bottom: 20px solid #6366f1;
      opacity: 0;
    }
  }

  @keyframes rippleLeft {
    from {
      border-left: 1px solid transparent;
    }

    to {
      border-left: 10px solid #6366f1;
      opacity: 0;
    }
  }

  @keyframes rippleRight {
    from {
      border-right: 1px solid transparent;
    }

    to {
      border-right: 10px solid #6366f1;
      opacity: 0;
    }
  }
</style>
