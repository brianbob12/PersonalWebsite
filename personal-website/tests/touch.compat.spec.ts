import { expect, test } from "@playwright/test";
import {
  blockAnalytics,
  detailsTile,
  expectDetailsVisible,
  expectFrontFaceVisible,
  expectNoHorizontalOverflow,
  tapTileAwayFromLinks,
} from "./website.helpers";
import { recordBrowserVersion } from "./compatibility.helpers";

test.beforeEach(async ({ page }, testInfo) => {
  await blockAnalytics(page);
  await recordBrowserVersion(page, testInfo);
  await page.goto("/", { waitUntil: "networkidle" });
});

test("real touchscreen taps toggle both tiles at this device's layout width", async ({
  page,
}) => {
  await expectNoHorizontalOverflow(page);
  for (const name of ["Cyrus", "Ciridae"] as const) {
    const tile = detailsTile(page, name);
    await tapTileAwayFromLinks(tile);
    await expectDetailsVisible(tile);
    await tapTileAwayFromLinks(tile);
    await expectFrontFaceVisible(tile);
  }
});

test("reduced motion removes flip and glow animation on touch devices", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const tile = detailsTile(page, "Cyrus");
  await tapTileAwayFromLinks(tile);
  await expectDetailsVisible(tile);
  await expect(tile.locator(".hex-rotor")).toHaveCSS(
    "transition-duration",
    "0s",
  );
  expect(
    await tile.evaluate(
      (element) => element.getAnimations({ subtree: true }).length,
    ),
  ).toBe(0);
});
