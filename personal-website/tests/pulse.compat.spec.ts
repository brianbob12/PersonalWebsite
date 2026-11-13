import { expect, test } from "@playwright/test";
import { PNG } from "pngjs";
import {
  blockAnalytics,
  detailsTile,
  expectFrontFaceVisible,
  tapTileAwayFromLinks,
} from "./website.helpers";
import {
  comparePaint,
  readFlipAngle,
  recordBrowserVersion,
} from "./compatibility.helpers";

test.use({ reducedMotion: "no-preference" });

test.beforeEach(async ({ page }, testInfo) => {
  await blockAnalytics(page);
  await recordBrowserVersion(page, testInfo);
  await page.goto("/", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
});

for (const name of ["Cyrus", "Ciridae"] as const) {
  test(`${name}: glow breathes continuously without moving edges or content`, async ({
    page,
  }, testInfo) => {
    const tile = detailsTile(page, name);
    const touch = !!testInfo.project.use.hasTouch;
    if (touch) await tapTileAwayFromLinks(tile);
    else await tile.hover();
    await expect.poll(() => readFlipAngle(tile)).toBeGreaterThan(179.9);
    const glow = tile.locator(".hex-glow");
    await expect(glow).toHaveCount(1);
    await expect(glow).toHaveAttribute("aria-hidden", "true");
    await expect(glow).toHaveCSS("pointer-events", "none");

    // Check the real CSS timeline advances before pausing for deterministic paint.
    const advancing = await glow.evaluate(async (element) => {
      const animation = element.getAnimations()[0];
      const start = Number(animation.currentTime);
      for (let i = 0; i < 4; i++) await new Promise(requestAnimationFrame);
      const advanced = Number(animation.currentTime) > start;
      animation.pause();
      const frames = (animation.effect as KeyframeEffect).getKeyframes();
      return { advanced, frames };
    });
    expect(advancing.advanced).toBe(true);
    const animatedProperties = new Set(
      advancing.frames.flatMap((frame) =>
        Object.keys(frame).filter(
          (key) =>
            !["offset", "computedOffset", "easing", "composite"].includes(key),
        ),
      ),
    );
    expect([...animatedProperties]).toEqual(["opacity"]);

    const bounds = (await tile.boundingBox())!;
    const samples = [];
    const captures: Buffer[] = [];
    for (const time of [0, 800, 1600, 2400, 3199, 3200, 3201]) {
      const sample = await glow.evaluate(async (element, time) => {
        element.getAnimations()[0].currentTime = time;
        await new Promise(requestAnimationFrame);
        const rect = (node: Element) => {
          const { x, y, width, height } = node.getBoundingClientRect();
          return { x, y, width, height };
        };
        return {
          time,
          opacity: Number(getComputedStyle(element).opacity),
          geometry: [
            ...element.querySelectorAll("polygon"),
            ...element.closest(".hex-face")!.querySelectorAll("a"),
          ].map(rect),
          strokes: [...element.querySelectorAll("polygon")].map(
            (node) => getComputedStyle(node).strokeWidth,
          ),
        };
      }, time);
      samples.push(sample);
      if ([0, 1600, 3200].includes(time))
        captures.push(await page.screenshot({ clip: bounds }));
    }
    expect(samples[0].opacity).toBeCloseTo(0.25, 4);
    expect(samples[2].opacity).toBeCloseTo(0.85, 4);
    expect(samples[1].opacity).toBeCloseTo(samples[3].opacity, 4);
    for (const sample of samples) {
      expect(sample.geometry).toEqual(samples[0].geometry);
      expect(sample.strokes).toEqual(samples[0].strokes);
    }
    for (const sample of samples.slice(4))
      expect(sample.opacity).toBeCloseTo(samples[0].opacity, 4);
    expect(
      comparePaint(captures[0], captures[2]).matches,
      "No painted jump at the loop boundary",
    ).toBe(true);
    const trough = PNG.sync.read(captures[0]);
    const peak = PNG.sync.read(captures[1]);
    let changedPixels = 0;
    for (let i = 0; i < trough.data.length; i += 4) {
      if (Math.abs(trough.data[i] - peak.data[i]) > 3) changedPixels++;
    }
    expect(
      changedPixels,
      "The glow visibly changes, rather than merely declaring an animation",
    ).toBeGreaterThan(100);
    await testInfo.attach("pulse-samples", {
      body: JSON.stringify(samples, null, 2),
      contentType: "application/json",
    });
    for (const [index, label] of ["trough", "peak", "loop"].entries()) {
      await testInfo.attach(`glow-${label}`, {
        body: captures[index],
        contentType: "image/png",
      });
    }

    // Resume normal playback after deterministic capture. Exercise a real user
    // preference change, rather than leaving a script-paused test animation.
    await glow.evaluate(async (element) => {
      const animation = element.getAnimations()[0];
      animation.play();
      await animation.ready;
    });
    // Changing the system preference while open must cancel the decorative loop.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(glow).toHaveCSS("opacity", "0.5");
    // Older engines can retire a script-paused CSS animation on the next frame.
    // The visual preference and the canceled animation must both settle.
    await expect
      .poll(() => glow.evaluate((element) => element.getAnimations().length))
      .toBe(0);
    const link = tile.locator(".back a").first();
    await link.evaluate((element) =>
      element.addEventListener("click", (event) => event.preventDefault()),
    );
    await link.click();
    await expect(tile).toHaveAttribute("aria-pressed", "true");
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expect
      .poll(() => glow.evaluate((element) => element.getAnimations().length))
      .toBe(1);
    if (touch) await tapTileAwayFromLinks(tile);
    else await page.mouse.move(0, 0);
    await expectFrontFaceVisible(tile);
    await expect(glow).toHaveCount(0);
  });
}
