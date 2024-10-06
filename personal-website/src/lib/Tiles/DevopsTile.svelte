<script lang="ts">
  import HexTile from "$lib/HexTile.svelte";
  import DockerLogo from "$lib/Logos/DockerLogo.svelte";
</script>

<HexTile backgroundColor="#d6d3d1" name="DevOps">
  <div
    slot="content"
    class="flex flex-col justify-start items-center space-y-4"
  >
    <div class="flex flex-row justify-center pt-8 w-[200%]">
      <span class="font-bold text-2xl">DevOps</span>
    </div>
    <div class="flex flex-row justify-center items-center w-[200%]">
      <span class="font-bold text-xl">Tools: </span>
      <div class="w-[84px] mr-2 ml-4">
        <DockerLogo />
      </div>
      <span>Git, GitHub Actions</span>
    </div>
    <div class="flex flex-row justify-center items-center w-[150%]">
      <span class="font-bold text-xl">AWS: </span>
      <div class="w-4" />
      <p>
        EC2, App Runner, ECR, EKS, RDS, S3, IAM, Secrets Manager, CloudFront,
        ...
      </p>
    </div>
    <div class="flex flex-row justify-center items-center w-[150%]">
      <span class="font-bold text-xl">GCP: </span>
      <div class="w-4" />
      <p>
        Compute Engine, Cloud Run, Cloud Functions, Cloud Storage, Logging,
        Metrics, Monitoring, Firebase, ...
      </p>
    </div>
    <span class="font-bold text-xl">Other Products I like: </span>
    <div class="flex flex-row justify-center items-center w-[140%] ml-12">
      <p>
        PostHog, Logtail(now BetterStack), Clerk, uploadthing, GitKraken,
        SourceTree
      </p>
    </div>
  </div>
</HexTile>
