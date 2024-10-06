<script lang="ts">
  import FancyLink from "$lib/FancyLink.svelte";
  import HexTile from "$lib/HexTile.svelte";
  import TypescriptIcon from "$lib/Logos/TypescriptIcon.svelte";
</script>

<HexTile flipable backgroundColor="#e2e8f0" name="Backend">
  <div slot="content" class="flex flex-col items-center space-y-2">
    <div class="flex flex-row justify-center pt-12 w-[200%]">
      <span class="font-bold text-2xl">Backend Development</span>
    </div>
    <span class="font-bold text-xl">Languages: </span>
    <div class="flex flex-row justify-center items-center w-[200%]">
      <div class="w-6 h-6 mr-1">
        <TypescriptIcon />
      </div>
      <span>, JavaScript, Java, Kotlin, Python, SQL</span>
    </div>
    <div class="flex flex-row justify-center items-center w-[200%]">
      <span class="font-bold text-xl">Frameworks: </span>
      <div class="w-2" />
      <span>Express.js, Prisma, Apache Spark, tRPC</span>
    </div>
    <div class="flex flex-row justify-center items-center w-[200%]">
      <span class="font-bold text-xl">Testing: </span>
      <div class="w-2" />
      <span>Jest, JUnit, Ava</span>
    </div>
    <span class="font-bold text-xl">Experience: </span>
    <div class="flex flex-row justify-center items-center w-[150%]">
      <span>Bizzybots full stack development ↑</span>
    </div>
    <div class="flex flex-row justify-center items-center w-[150%]">
      <span>Software Engineering Intern at CFO4ALL</span>
    </div>
    <div class="flex flex-row justify-center items-center w-[150%]">
      <span>TA For Internet And Web Systems @Penn</span>
    </div>
    <div class="absolute bottom-0">
      <span class="text-gray-500">Hover on hexagon for projects</span>
    </div>
  </div>
  <div slot="hover" class="h-full">
    <div class="flex flex-col justify-start items-center space-y-4 pt-4">
      <div class="w-[150%] flex flex-row justify-center">
        <span class="text-xl underline">Backend Related Projects:</span>
      </div>
      <div class="flex flex-col items-center">
        <span>2024</span>
        <div class="w-[150%] flex flex-row justify-center space-x-4">
          <span>User friendly formula system</span>
          <FancyLink
            href="https://www.npmjs.com/package/@negotiate-gpt/formulas"
            position="center"
          >
            npm
          </FancyLink>
        </div>
        <div class="w-[150%] flex flex-row justify-center space-x-4">
          <span>Natural Number Parsing Package</span>
          <FancyLink
            href="https://www.npmjs.com/package/natural-number-parsing"
            position="right"
          >
            npm
          </FancyLink>
          <FancyLink
            href="https://github.com/brianbob12/natural-number-parsing"
            position="left"
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
        <span>2022</span>
        <div class="w-[150%] flex flex-row justify-center space-x-4">
          <span>Othello MiniMax Agent - Java</span>
          <FancyLink
            href="https://github.com/brianbob12/othello-with-minimax"
            position="center"
          >
            GitHub
          </FancyLink>
        </div>
      </div>
      <div class="flex flex-col items-center">
        <span>2021</span>
        <div class="w-[200%] flex flex-row justify-center space-x-4">
          <span>Fullstack Web App to create a better political compass</span>
          <FancyLink
            href="https://github.com/brianbob12/PrinciplePolitics"
            position="center"
          >
            GitHub
          </FancyLink>
        </div>
      </div>
      <div class="flex flex-col items-center">
        <span>2020</span>
        <div class="w-[150%] flex flex-row justify-center space-x-4">
          <span class=""> Java Game with Neural Network Agent </span>
          <FancyLink
            href="https://github.com/brianbob12/Robot_Gym"
            position="center"
          >
            GitHub
          </FancyLink>
        </div>
      </div>
    </div>
  </div>
</HexTile>
