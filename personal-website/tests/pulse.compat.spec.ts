import {
  expect,
  test,
  type Locator,
  type Page,
  type TestInfo,
} from "@playwright/test";
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

async function expectInternalEdgeGlow(
  page: Page,
  glow: Locator,
  testInfo: TestInfo,
) {
  // Copy the real glow onto white so black outside strokes cannot hide in the
  // site's black background or be clipped by the stationary pointer wrapper.
  await glow.evaluate((element) => {
    const probe = document.createElement("div");
    probe.id = "pulse-edge-probe";
    probe.setAttribute("aria-hidden", "true");
    probe.style.cssText =
      "position:fixed;inset:auto;left:0;top:0;width:280px;height:248px;padding:20px;background:white;opacity:1;animation:none;z-index:2147483647;pointer-events:none";
    const wrapper = element.cloneNode(false) as HTMLDivElement;
    wrapper.style.cssText = `position:relative;inset:auto;width:240px;height:${120 * Math.sqrt(3)}px;opacity:1;animation:none`;
    const svg = element.querySelector("svg")!.cloneNode(true) as SVGSVGElement;
    svg.style.width = "240px";
    svg.style.height = `${120 * Math.sqrt(3)}px`;
    wrapper.append(svg);
    probe.append(wrapper);
    document.body.append(probe);
  });
  let capture: Buffer;
  try {
    capture = await page.screenshot({
      clip: (await page.locator("#pulse-edge-probe").boundingBox())!,
    });
  } finally {
    await page
      .locator("#pulse-edge-probe")
      .evaluate((element) => element.remove());
  }
  await testInfo.attach("internal-edge-glow", {
    body: capture,
    contentType: "image/png",
  });
  const pixels = PNG.sync.read(capture);
  const shade = (x: number, y: number) => {
    let total = 0;
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++) {
        const index =
          ((Math.round(y) + dy) * pixels.width + Math.round(x) + dx) * 4;
        total += pixels.data[index];
      }
    return total / 9;
  };
  const height = 120 * Math.sqrt(3);
  const vertices = [
    [60, 0],
    [180, 0],
    [240, height / 2],
    [180, height],
    [60, height],
    [0, height / 2],
  ];
  for (let i = 0; i < vertices.length; i++) {
    const next = vertices[(i + 1) % vertices.length];
    const x = (vertices[i][0] + next[0]) / 2;
    const y = (vertices[i][1] + next[1]) / 2;
    const distance = Math.hypot(120 - x, height / 2 - y);
    const inwardX = (120 - x) / distance;
    const inwardY = (height / 2 - y) / distance;
    expect(
      shade(20 + x + 2 * inwardX, 20 + y + 2 * inwardY),
      `Side ${i}: shade starts at the inside edge`,
    ).toBeLessThan(230);
    expect(
      shade(20 + x - 3 * inwardX, 20 + y - 3 * inwardY),
      `Side ${i}: no shade outside the hexagon`,
    ).toBeGreaterThan(250);
  }
  expect(
    shade(140, 20 + height / 2),
    "The center remains clear",
  ).toBeGreaterThan(250);
}

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

    // Test a live preference change before touching the animation timeline.
    // Keep live-input checks independent of deterministic timeline seeking.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(glow).toHaveCSS("opacity", "0.5");
    await expect
      .poll(() => glow.evaluate((element) => element.getAnimations().length))
      .toBe(0);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expect
      .poll(() => glow.evaluate((element) => element.getAnimations().length))
      .toBe(1);

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

    const loopPaint = comparePaint(captures[0], captures[2]);
    expect(
      loopPaint.matches,
      `No painted jump at the loop boundary: ${JSON.stringify(loopPaint)}`,
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
    await expectInternalEdgeGlow(page, glow, testInfo);
    const link = tile.locator(".back a").first();
    await link.evaluate((element) =>
      element.addEventListener("click", (event) => event.preventDefault()),
    );
    await link.click();
    await expect(tile).toHaveAttribute("aria-pressed", "true");
    if (touch) await tapTileAwayFromLinks(tile);
    else await page.mouse.move(0, 0);
    await expectFrontFaceVisible(tile);
    await expect(glow).toHaveCount(0);
  });
}
