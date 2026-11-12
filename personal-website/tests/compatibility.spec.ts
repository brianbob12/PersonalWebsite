import { expect, test } from "@playwright/test";
import {
  blockAnalytics,
  detailsTile,
  expectDetailsVisible,
  expectFrontFaceVisible,
} from "./website.helpers";
import {
  dispatchLegacyActivation,
  expectOnlyFacePaints,
  finishFlip,
  pauseFlipAt,
  readFlipAngle,
  recordBrowserVersion,
} from "./compatibility.helpers";

test.use({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "no-preference",
});

test.beforeEach(async ({ page }, testInfo) => {
  await blockAnalytics(page);
  await recordBrowserVersion(page, testInfo);
  await page.goto("/", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  // Disable only the decorative ripple, never the flip being measured.
  await page.addStyleTag({
    content: ".hexagon div::before { animation: none !important; }",
  });
  await page.mouse.move(0, 0);
});

for (const name of ["Cyrus", "Ciridae"] as const) {
  test(`${name}: both directions are edge-on halfway through elapsed time`, async ({
    page,
  }) => {
    const tile = detailsTile(page, name);
    await tile.focus();
    for (let direction = 0; direction < 2; direction++) {
      await page.keyboard.press("Enter");
      await pauseFlipAt(tile, 500);
      expect(await readFlipAngle(tile)).toBeCloseTo(90, 0);
      await finishFlip(tile);
    }
  });

  test(`${name}: only the facing surface paints before and after the midpoint`, async ({
    page,
  }, testInfo) => {
    test.skip(
      process.platform === "win32" && testInfo.project.name === "webkit",
      "Windows WebKit captures ignore backface culling; Linux and macOS run this assertion (Playwright #21620).",
    );
    const tile = detailsTile(page, name);
    await tile.focus();
    await expectOnlyFacePaints(page, tile, "front", testInfo, "settled-front");
    for (const direction of ["forward", "reverse"] as const) {
      await page.keyboard.press("Enter");
      for (const elapsedMs of [50, 250, 490, 510, 750, 950]) {
        await pauseFlipAt(tile, elapsedMs);
        const front = elapsedMs < 500 === (direction === "forward");
        await expectOnlyFacePaints(
          page,
          tile,
          front ? "front" : "back",
          testInfo,
          `${direction}-${elapsedMs}ms`,
        );
      }
      await finishFlip(tile);
      await expectOnlyFacePaints(
        page,
        tile,
        direction === "forward" ? "back" : "front",
        testInfo,
        `${direction}-settled`,
      );
    }
  });
}

test("leaving before the midpoint reverses from the current angle", async ({
  page,
}) => {
  const tile = detailsTile(page, "Cyrus");
  await tile.hover();
  await pauseFlipAt(tile, 250);
  const before = await readFlipAngle(tile);
  expect(before).toBeGreaterThan(0);
  expect(before).toBeLessThan(90);
  await page.mouse.move(0, 0);
  await expectFrontFaceVisible(tile);
  const after = await readFlipAngle(tile);
  expect(after).toBeLessThanOrEqual(before + 1);
  await expect.poll(() => readFlipAngle(tile)).toBeLessThan(1);
  await expect(tile.locator(".hex-face")).toHaveCount(2);
});

for (const origin of ["touch", "pen"] as const) {
  for (const clickType of ["missing", "mouse"] as const) {
    test(`${origin} toggles a wide tile when click.pointerType is ${clickType}`, async ({
      page,
    }) => {
      const tile = detailsTile(page, "Cyrus");
      // Deliberately model the event sequences from WebKit #239810/#282988.
      // Real taps are covered separately; these are compatibility regressions.
      await dispatchLegacyActivation(tile, origin, clickType);
      await expectDetailsVisible(tile);
      await dispatchLegacyActivation(tile, origin, clickType);
      await expectFrontFaceVisible(tile);
    });
  }
}

for (const width of [390, 1440]) {
  test(`mouse hover works at ${width}px without a second toggle on click`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    const tile = detailsTile(page, "Cyrus");
    await tile.hover();
    const bounds = await tile.boundingBox();
    await tile.click({
      position: { x: bounds!.width / 2, y: bounds!.height / 4 },
    });
    await expectDetailsVisible(tile);
    await page.mouse.move(0, 0);
    await expectFrontFaceVisible(tile);
  });
}

test("desktop pattern uses the visible viewport without a nested vertical scroller", async ({
  page,
}) => {
  for (const height of [1024, 850]) {
    await page.setViewportSize({ width: 1366, height });
    const layout = await page
      .locator(".all-hexes-container")
      .evaluate((element) => ({
        height: element.getBoundingClientRect().height,
        viewport: window.innerHeight,
        overflowY: getComputedStyle(element).overflowY,
      }));
    expect(Math.abs(layout.height - layout.viewport)).toBeLessThan(1);
    expect(["visible", "clip"]).toContain(layout.overflowY);
  }
});
