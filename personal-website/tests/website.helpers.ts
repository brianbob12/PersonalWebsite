import { expect, type Locator, type Page } from "@playwright/test";

export function detailsTile(page: Page, name: "Cyrus" | "Ciridae") {
  return page.getByRole("button", { name: `${name} details` });
}

export async function blockAnalytics(page: Page) {
  await page.route(
    /https:\/\/[^/]*(?:posthog\.com|googletagmanager\.com|google-analytics\.com)\//,
    (route) => {
      const isScript = route.request().resourceType() === "script";
      return route.fulfill({
        contentType: isScript ? "application/javascript" : "application/json",
        body: isScript ? "" : "{}",
      });
    },
  );
}

export async function readFontFaces(page: Page) {
  return page.evaluate(async () => {
    await document.fonts.ready;
    return Array.from(document.fonts)
      .filter((face) => face.family.includes("JetBrains Mono"))
      .map((face) => ({ weight: face.weight, status: face.status }))
      .sort((a, b) => a.weight.localeCompare(b.weight));
  });
}

export async function readNameLayout(page: Page) {
  const name = page.getByText("Cyrus Singer", { exact: true });
  await expect(name).toBeVisible();
  return name.evaluate((element) => {
    const range = document.createRange();
    range.selectNodeContents(element);
    const text = range.getBoundingClientRect();
    const tile = element.closest(".hex-container")!.getBoundingClientRect();
    const textCenter = text.left + text.width / 2;
    const tileCenter = tile.left + tile.width / 2;
    return {
      lineCount: range.getClientRects().length,
      centerOffsetPx: Math.abs(textCenter - tileCenter),
      fitsInsideTile: text.left >= tile.left && text.right <= tile.right,
    };
  });
}

export function expectDetailsVisible(tile: Locator) {
  return expectActiveFace(tile, "back");
}

export function expectFrontFaceVisible(tile: Locator) {
  return expectActiveFace(tile, "front");
}

async function expectActiveFace(tile: Locator, face: "front" | "back") {
  const visible = face === "back";
  await expect(tile).toHaveAttribute("aria-pressed", String(visible));
  const front = tile.locator(".hex-face.front");
  const back = tile.locator(".hex-face.back");
  await expect(front).toHaveAttribute("aria-hidden", String(visible));
  await expect(back).toHaveAttribute("aria-hidden", String(!visible));
  await expect(visible ? front : back).toHaveAttribute("inert", "");
  await expect(visible ? back : front).not.toHaveAttribute("inert");
}

export async function expectImagesLoaded(page: Page) {
  await expect
    .poll(() =>
      page
        .locator("img")
        .evaluateAll((images) =>
          images.every(
            (image) =>
              image instanceof HTMLImageElement &&
              image.complete &&
              image.naturalWidth > 0,
          ),
        ),
    )
    .toBe(true);
}

export async function expectNoHorizontalOverflow(page: Page) {
  const hasOverflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  );
  expect(
    hasOverflow,
    "The page fits the viewport without horizontal scrolling",
  ).toBe(false);
}

export async function tapTileAwayFromLinks(tile: Locator) {
  const bounds = await tile.boundingBox();
  expect(bounds, "The tile is visible before tapping").not.toBeNull();
  // The back-face center is a contact link; use the upper quarter to toggle.
  await tile.tap({ position: { x: bounds!.width / 2, y: bounds!.height / 4 } });
}
