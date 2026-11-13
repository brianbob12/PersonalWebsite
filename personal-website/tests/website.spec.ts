import { expect, test, type Page } from "@playwright/test";
import {
  blockAnalytics,
  detailsTile,
  expectDetailsVisible,
  expectImagesLoaded,
  expectFrontFaceVisible,
  expectNoHorizontalOverflow,
  readFontFaces,
  readNameLayout,
  tapTileAwayFromLinks,
} from "./website.helpers";

const runtimeErrors = new WeakMap<Page, string[]>();

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  runtimeErrors.set(page, errors);
  page.on("pageerror", (error) => errors.push(error.message));
  await blockAnalytics(page);
});

test.afterEach(async ({ page }) => {
  expect(runtimeErrors.get(page), "No browser runtime errors").toEqual([]);
});

for (const width of [320, 390, 1440]) {
  test.describe(`typography at ${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });

    test("regular and bold fonts load, and the name fits on one centered line", async ({
      page,
    }) => {
      await page.goto("/", { waitUntil: "networkidle" });

      expect(await readFontFaces(page)).toEqual([
        { weight: "400", status: "loaded" },
        { weight: "700", status: "loaded" },
      ]);
      const name = await readNameLayout(page);
      expect(name.lineCount).toBe(1);
      expect(name.centerOffsetPx).toBeLessThan(1);
      expect(name.fitsInsideTile).toBe(true);
    });

    test("the name still fits on one centered line when both font downloads fail", async ({
      page,
    }) => {
      const blockedFonts = new Set<string>();
      await page.route("**/fonts/*.woff2", (route) => {
        blockedFonts.add(route.request().url());
        return route.abort();
      });
      await page.goto("/", { waitUntil: "networkidle" });

      const faces = await readFontFaces(page);
      expect(blockedFonts.size, "Both actual font requests were aborted").toBe(
        2,
      );
      expect(faces.map((face) => face.weight)).toEqual(["400", "700"]);
      // WebKit may reset an aborted face to "unloaded"; the requirement is
      // unavailable custom fonts with usable fallback text, not a status label.
      expect(faces.every((face) => face.status !== "loaded")).toBe(true);
      const name = await readNameLayout(page);
      expect(name.lineCount).toBe(1);
      expect(name.centerOffsetPx).toBeLessThan(1);
      expect(name.fitsInsideTile).toBe(true);
    });
  });
}

test.describe("desktop", () => {
  test.use({ viewport: { width: 1440, height: 1000 } });

  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
  });

  test("the page shows the desktop pattern, identity, images, and contact links", async ({
    page,
  }) => {
    await expect(page).toHaveTitle("Cyrus Singer");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /software engineer/i,
    );
    await expect(page.locator(".all-hexes-container")).toBeVisible();
    await expect(
      page.locator(".hex-row > .hexagon, .hex-row > .hex-container"),
    ).toHaveCount(28);
    await expect(
      page.getByText("Software Engineer", { exact: true }),
    ).toBeVisible();
    await expect(detailsTile(page, "Ciridae")).toBeVisible();

    for (const href of [
      "mailto:cyrus@singer.dev",
      "https://github.com/brianbob12",
      "https://ciridae.com/",
    ]) {
      await expect(page.locator(`a[href="${href}"]`)).toHaveCount(1);
    }
    await expectImagesLoaded(page);
  });

  test("hovering shows details and leaving immediately reverses the flip", async ({
    page,
  }) => {
    const tile = detailsTile(page, "Cyrus");
    // Tag the original faces to verify they survive an interrupted flip.
    await tile.locator(".hex-face").evaluateAll((faces) => {
      faces.forEach((face) => face.setAttribute("data-original-face", ""));
    });

    await tile.hover();
    await expectDetailsVisible(tile);

    await page.mouse.move(0, 0);
    await expectFrontFaceVisible(tile);
    await expect(tile.locator("[data-original-face]")).toHaveCount(2);

    await tile.hover();
    await expectDetailsVisible(tile);
    await expect(tile.locator("[data-original-face]")).toHaveCount(2);
  });

  test("Enter and Space toggle details, while activating a contact link leaves them open", async ({
    page,
  }) => {
    const tile = detailsTile(page, "Cyrus");
    await page.mouse.move(0, 0);
    await tile.focus();

    await page.keyboard.press("Enter");
    await expectDetailsVisible(tile);
    await page.keyboard.press("Space");
    await expectFrontFaceVisible(tile);
    await page.keyboard.press("Space");
    await expectDetailsVisible(tile);

    const link = tile.getByRole("link", { name: "GitHub", exact: true });
    // Keep application handlers, but prevent the test from leaving the site.
    await link.evaluate((element) =>
      element.addEventListener("click", (event) => event.preventDefault()),
    );
    await link.focus();
    await expect(link).toBeFocused();
    await page.keyboard.press("Enter");
    await expectDetailsVisible(tile);
    await link.click();
    await expectDetailsVisible(tile);
  });

  test("resizing below 1200px shows the phone stack and resizing back restores the desktop pattern", async ({
    page,
  }) => {
    await expect(page.locator(".all-hexes-container")).toBeVisible();

    await page.setViewportSize({ width: 1199, height: 900 });
    await expect(page.locator(".mobile-hexes")).toBeVisible();
    await expect(page.locator(".mobile-hexes .hexes > *")).toHaveCount(7);

    await page.setViewportSize({ width: 1200, height: 900 });
    await expect(page.locator(".all-hexes-container")).toBeVisible();
    await expect(page.locator(".mobile-hexes")).toHaveCount(0);
  });

  test("reduced motion removes flip and decorative glow animations", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    const tile = detailsTile(page, "Cyrus");
    await tile.focus();
    await page.keyboard.press("Enter");

    await expectDetailsVisible(tile);
    await expect(tile.locator(".hex-glow")).toHaveCSS("opacity", "0.5");
    await expect(tile.locator(".hex-glow")).toHaveCSS("pointer-events", "none");
    await expect(tile.locator(".hex-rotor")).toHaveCSS(
      "transition-duration",
      "0s",
    );
    await expect
      .poll(() =>
        tile.evaluate(
          (element) => element.getAnimations({ subtree: true }).length,
        ),
      )
      .toBe(0);
  });
});

for (const width of [320, 390]) {
  test.describe(`touch input at ${width}px`, () => {
    // Touch works in both Chromium and Firefox without device emulation.
    test.use({ viewport: { width, height: 844 }, hasTouch: true });

    test("seven tiles fit without horizontal scrolling, and taps toggle details", async ({
      page,
    }) => {
      await page.goto("/", { waitUntil: "networkidle" });
      await expect(page.locator(".mobile-hexes .hexes > *")).toHaveCount(7);
      await expectNoHorizontalOverflow(page);

      const cyrus = detailsTile(page, "Cyrus");
      await tapTileAwayFromLinks(cyrus);
      await expectDetailsVisible(cyrus);
      await tapTileAwayFromLinks(cyrus);
      await expectFrontFaceVisible(cyrus);

      const ciridae = detailsTile(page, "Ciridae");
      await ciridae.tap();
      await expectDetailsVisible(ciridae);
      await expect(
        ciridae.getByRole("link", { name: "ciridae.com", exact: true }),
      ).toHaveAttribute("href", "https://ciridae.com/");
    });
  });
}
