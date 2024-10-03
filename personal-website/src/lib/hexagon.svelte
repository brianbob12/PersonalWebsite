<script lang="ts">
  export let size: number;
  export let backgroundColor: string;
  export let borderSize: number = 1;
  $: angleBorderSize = borderSize * 0.75;
  export let borderColor: string = "red";
  const root3Over2 = Math.sqrt(3) / 2;
</script>

<div class="hexagon" style="width: {size}px; height: {size * root3Over2}px">
  <div class="hexagon-left">
    <div
      class="hexagon-left-top"
      style="background-color: {backgroundColor}; border-left-width: {angleBorderSize}px; border-color: {borderColor}"
    />
    <div
      class="hexagon-left-bottom"
      style="background-color: {backgroundColor}; border-left-width: {angleBorderSize}px; border-color: {borderColor}"
    />
  </div>
  <div
    class="hexagon-middle"
    style="background-color: {backgroundColor}; border-top-width: {borderSize}px; border-bottom-width: {borderSize}px; border-color: {borderColor}"
  >
    <slot />
  </div>
  <div class="hexagon-right">
    <div
      class="hexagon-right-top"
      style="background-color: {backgroundColor}; border-right-width: {angleBorderSize}px; border-color: {borderColor}"
    />
    <div
      class="hexagon-right-bottom"
      style="background-color: {backgroundColor}; border-right-width: {angleBorderSize}px; border-color: {borderColor}"
    />
  </div>
</div>

<style>
  .hexagon {
    display: flex;
    flex-direction: row;
    overflow: hidden;
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
  }
  .hexagon-left-bottom {
    width: 120%;
    height: 100%;
    transform: translate(35%, -35%) rotate(-30deg);
  }
  .hexagon-middle {
    width: 50%;
    height: 100%;
    z-index: 5;
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
  }
  .hexagon-right-bottom {
    width: 120%;
    height: 100%;
    transform: translate(-51%, -35%) rotate(30deg);
  }
</style>
