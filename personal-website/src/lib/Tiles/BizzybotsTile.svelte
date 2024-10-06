<script lang="ts">
  import FancyLink from "$lib/FancyLink.svelte";
  import HexTile from "$lib/HexTile.svelte";

  export let mobileMode: boolean = false;
</script>

<HexTile flipable backgroundColor="#e2e8f0" name="Bizzybots" {mobileMode}>
  <div
    slot="content"
    class="flex flex-col justify-start items-center space-y-8"
  >
    <div class="flex flex-col justify-start items-center pt-10 w-[200%]">
      <span class="font-bold text-2xl">Creator of</span>
      <span class="font-bold text-2xl">and Lead Developer of</span>
      <span class="font-bold text-2xl">Bizzybots</span>
      <span class="text-xl">Wharton Behavioral Lab</span>
      <span class="text-gray-500">2022 - present</span>
    </div>
    <div class="flex flex-row justify-center items-center w-[160%]">
      <p>
        The Bizzybots platform is a tool to help researchers and educators
        create custom, controllable, and reliable chatbots based on LLMs.
      </p>
    </div>
    <div class="flex flex-row justify-center items-center w-[120%]">
      <p>
        Bizzybots is used across the world and is the data source for a
        published paper.
      </p>
    </div>
    <div class="absolute bottom-0">
      <span class="text-gray-500">Hover on hexagon for more info</span>
    </div>
  </div>
  <div slot="hover" class="h-full">
    <div class="flex flex-col justify-start items-center h-full space-y-4">
      <div class="w-[110%] flex flex-col justify-center items-center ml-2 pt-2">
        <span>LLM's don't always follow instructions to the letter.</span>
      </div>
      <div class="w-[130%] flex flex-row justify-center items-center">
        <span> They can reveal information in the prompt when deployed. </span>
      </div>
      <div class="w-[200%] flex flex-col justify-center items-center">
        <span> They don't have a convincing conversational interface. </span>
      </div>
      <div
        class="w-[187%] flex flex-col justify-center items-center border-b-2 pb-2 border-gray-300"
      >
        <span class="font-bold"> These are the issues Bizzybots solves. </span>
      </div>
      <div class="w-[180%] flex flex-col justify-center items-center">
        <p>
          My team and I created a web platform where users can create and share
          conversation-ready chatbots.
        </p>
      </div>
      <div class="w-[160%] pl-4 flex flex-col justify-center items-center">
        <p>
          Behaviors can be stated in the bot's prompt or configured through the
          bot's deterministic control system.
        </p>
      </div>
      <div class="w-[160%] flex flex-col justify-center items-center">
        <span> Want to learn more? </span>
        <div class="h-2" />
        <span> Send me an email! </span>
        <FancyLink href="mailto:japaneserhino@gmail.com" position="center">
          japaneserhino@gmail.com
        </FancyLink>
      </div>
    </div>
  </div>
</HexTile>
