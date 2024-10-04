<script lang="ts">
  import FancyLink from "$lib/FancyLink.svelte";
  import HexTile from "$lib/HexTile.svelte";
  import NextJsLogo from "$lib/Logos/NextJsLogo.svelte";
  import ReactLogo from "$lib/Logos/ReactLogo.svelte";
  import SvelteLogo from "$lib/Logos/SvelteLogo.svelte";
  import TypescriptIcon from "$lib/Logos/TypescriptIcon.svelte";
</script>

<HexTile flipable backgroundColor="#f9fafb">
  <div
    slot="content"
    class="flex flex-col justify-start items-center space-y-2"
  >
    <div class="flex flex-row justify-center pt-12 w-[200%]">
      <span class="font-bold text-2xl">Frontend Development</span>
    </div>
    <span class="font-bold text-xl">Languages: </span>
    <div class="flex flex-row justify-center items-center w-[150%]">
      <SvelteLogo height={40} width={80} /><span>,</span>
      <div class="w-2" />
      <div class="w-6 h-6">
        <TypescriptIcon />
      </div>
      <span>,</span>
      <div class="w-2" />
      <p>HTML, CSS, JavaScript, Pug, Markdown,</p>
    </div>
    <span class="font-bold text-xl">Frameworks: </span>
    <div class="flex flex-row justify-center items-center w-[180%] space-x-2">
      <ReactLogo height={40} width={40} /> <span>React, </span>
      <NextJsLogo height={40} width={80} /> <span>, </span>
      <p>SvelteKit(this site!)</p>
    </div>
    <span class="font-bold text-xl">Tools: </span>
    <div class="flex flex-row justify-center items-center w-[150%]">
      <p>Selenium, Tailwind, ReactQuery, tRPC, esbuild</p>
    </div>
    <div class="absolute bottom-0">
      <span class="text-gray-500">Hover on hexagon for projects</span>
    </div>
  </div>
  <div slot="hover" class="h-full">
    <div class="flex flex-col justify-start items-center space-y-4 pt-4">
      <div class="w-[150%] flex flex-row justify-center">
        <span class="text-xl underline">Frontend Related Projects:</span>
      </div>
      <div class="flex flex-col items-center">
        <span>2024</span>
        <div class="w-[150%] flex flex-row justify-center space-x-4">
          <span>Runtime UI Generation for React</span>
          <FancyLink
            href="https://github.com/brianbob12/RuntimeUI"
            position="center"
          >
            GitHub
          </FancyLink>
        </div>
        <div class="w-[150%] flex flex-row justify-center space-x-4">
          <span>Really Cool Personal Website With SvelteKit</span>
          <FancyLink
            href="https://github.com/brianbob12/PersonalWebsite"
            position="center"
          >
            GitHub
          </FancyLink>
        </div>
        <div class="w-[150%] flex flex-row justify-center space-x-4">
          <span>Play Chess with an LLM Fullstack App</span>
          <FancyLink
            href="https://github.com/brianbob12/chess-with-llm"
            position="center"
          >
            GitHub
          </FancyLink>
        </div>
      </div>
      <div class="flex flex-col items-center">
        <span>2021</span>
        <div class="w-[200%] flex flex-row justify-center space-x-4">
          <span>React Native Task Management App</span>
          <FancyLink
            href="https://github.com/brianbob12/CauchReact"
            position="center"
          >
            GitHub
          </FancyLink>
        </div>
        <div class="w-[200%] flex flex-row justify-center space-x-4">
          <span>Genetic Algorithm to evolve trees (browser canvas)</span>
          <FancyLink
            href="https://github.com/brianbob12/Treevolution"
            position="center"
          >
            GitHub
          </FancyLink>
        </div>
      </div>
      <div class="flex flex-col items-center">
        <span>2020</span>
        <div class="w-[200%] flex flex-row justify-center space-x-4">
          <span>Android Native Task Management App</span>
          <FancyLink
            href="https://github.com/brianbob12/Cauch-Android"
            position="center"
          >
            GitHub
          </FancyLink>
        </div>
      </div>
    </div>
  </div>
</HexTile>
