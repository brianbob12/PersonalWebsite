<script lang="ts">
  import { HEX_WIDTH, HEX_HEIGHT } from "./hexGeometry";

  export let backgroundColor: string;
  export let borderColor: string;
  export let active = false;
</script>

<div
  class="hexagon"
  class:active
  style="width: {HEX_WIDTH}px; height: {HEX_HEIGHT}px; --hex-background: {backgroundColor}; --hex-border: {borderColor}"
>
  <div class="hexagon-left">
    <div class="hexagon-left-top" />
    <div class="hexagon-left-bottom" />
  </div>
  <div class="hexagon-middle"><slot /></div>
  <div class="hexagon-right">
    <div class="hexagon-right-top" />
    <div class="hexagon-right-bottom" />
  </div>
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
  .active .hexagon-left-top::before,
  .active .hexagon-left-bottom::before,
  .active .hexagon-middle::before,
  .active .hexagon-right-top::before,
  .active .hexagon-right-bottom::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    animation: rippleTopBottom 1s ease-in-out infinite;
  }
  .active .hexagon-left-top::before,
  .active .hexagon-left-bottom::before {
    animation-name: rippleLeft;
  }
  .active .hexagon-right-top::before,
  .active .hexagon-right-bottom::before {
    animation-name: rippleRight;
  }

  @keyframes rippleTopBottom {
    from {
      border-top: 1px solid transparent;
      border-bottom: 1px solid transparent;
    }
    to {
      border-top: 20px solid #000000;
      border-bottom: 20px solid #000000;
      opacity: 0;
    }
  }
  @keyframes rippleLeft {
    from {
      border-left: 1px solid transparent;
    }
    to {
      border-left: 10px solid #000000;
      opacity: 0;
    }
  }
  @keyframes rippleRight {
    from {
      border-right: 1px solid transparent;
    }
    to {
      border-right: 10px solid #000000;
      opacity: 0;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .active div::before {
      animation: none;
    }
  }
</style>
