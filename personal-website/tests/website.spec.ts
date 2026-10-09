import { expect, test, type Page } from "@playwright/test";

const runtimeErrors = new WeakMap<Page, string[]>();

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  runtimeErrors.set(page, errors);
  page.on("pageerror", (error) => errors.push(error.message));
  // Exercise the UI without sending test traffic to production analytics.
  await page.route(
    /https:\/\/[^/]*(?:posthog\.com|googletagmanager\.com|google-analytics\.com)\//,
    (route) =>
      route.fulfill({
        contentType:
          route.request().resourceType() === "script"
            ? "application/javascript"
            : "application/json",
        body: route.request().resourceType() === "script" ? "" : "{}",
      }),
  );
});

test.afterEach(async ({ page }) => {
  expect(runtimeErrors.get(page), "No browser runtime errors").toEqual([]);
});

test.describe("desktop", () => {
  test.use({ viewport: { width: 1440, height: 1000 } });

  test("renders the desktop pattern, content, assets, and contact links", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "networkidle" });
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
    await expect(
      page.getByRole("button", { name: "Ciridae details" }),
    ).toBeVisible();
    await expect(page.locator('a[href="mailto:cyrus@singer.dev"]')).toHaveCount(
      1,
    );
    await expect(
      page.locator('a[href="https://github.com/brianbob12"]'),
    ).toHaveCount(1);
    await expect(page.locator('a[href="https://ciridae.com/"]')).toHaveCount(1);
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
  });

  test("hover flips reverse immediately and preserve both faces", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const tile = page.getByRole("button", { name: "Cyrus details" });
    const front = tile.locator(".hex-face.front");
    const back = tile.locator(".hex-face.back");
    await front.evaluate((element) => {
      element.setAttribute("data-original-face", "front");
    });
    await back.evaluate((element) => {
      element.setAttribute("data-original-face", "back");
    });
    await tile.hover();
    await expect(tile).toHaveAttribute("aria-pressed", "true");
    await expect(front).toHaveAttribute("aria-hidden", "true");
    await expect(front).toHaveAttribute("inert", "");
    await expect(back).toHaveAttribute("aria-hidden", "false");
    await page.mouse.move(0, 0);
    await expect(tile).toHaveAttribute("aria-pressed", "false");
    await expect(back).toHaveAttribute("inert", "");
    await expect(tile.locator("[data-original-face]")).toHaveCount(2);
    await tile.hover();
    await expect(tile).toHaveAttribute("aria-pressed", "true");
    await expect(tile.locator("[data-original-face]")).toHaveCount(2);
  });

  test("keyboard toggles details and link clicks do not flip the tile", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const tile = page.getByRole("button", { name: "Cyrus details" });
    await page.mouse.move(0, 0);
    await tile.focus();
    await page.keyboard.press("Enter");
    await expect(tile).toHaveAttribute("aria-pressed", "true");
    await page.keyboard.press("Space");
    await expect(tile).toHaveAttribute("aria-pressed", "false");
    await page.keyboard.press("Space");
    await expect(tile).toHaveAttribute("aria-pressed", "true");
    const link = tile.getByRole("link", { name: "GitHub", exact: true });
    await link.focus();
    await expect(link).toBeFocused();
    // Prevent external navigation in this test; retain the application's handlers.
    await link.evaluate((element) =>
      element.addEventListener("click", (event) => event.preventDefault()),
    );
    await page.keyboard.press("Enter");
    await expect(tile).toHaveAttribute("aria-pressed", "true");
    await link.click();
    await expect(tile).toHaveAttribute("aria-pressed", "true");
  });

  test("resizing across the layout breakpoint switches patterns", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page.locator(".all-hexes-container")).toBeVisible();
    await page.setViewportSize({ width: 1199, height: 900 });
    await expect(page.locator(".mobile-hexes")).toBeVisible();
    await expect(page.locator(".mobile-hexes .hexes > *")).toHaveCount(7);
    await page.setViewportSize({ width: 1200, height: 900 });
    await expect(page.locator(".all-hexes-container")).toBeVisible();
    await expect(page.locator(".mobile-hexes")).toHaveCount(0);
  });

  test("reduced motion removes the flip transition", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/", { waitUntil: "networkidle" });
    const tile = page.getByRole("button", { name: "Cyrus details" });
    await tile.focus();
    await page.keyboard.press("Enter");
    await expect(tile).toHaveAttribute("aria-pressed", "true");
    await expect
      .poll(() =>
        tile
          .locator(".hex-rotor")
          .evaluate((element) => getComputedStyle(element).transitionDuration),
      )
      .toBe("0s");
  });
});

for (const width of [320, 390]) {
  test.describe(`mobile ${width}px`, () => {
    test.use({
      viewport: { width, height: 844 },
      isMobile: true,
      hasTouch: true,
    });

    test("fits seven tiles and toggles both detail tiles with taps", async ({
      page,
    }) => {
      await page.goto("/", { waitUntil: "networkidle" });
      await expect(page.locator(".mobile-hexes .hexes > *")).toHaveCount(7);
      expect(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth <=
            document.documentElement.clientWidth,
        ),
      ).toBe(true);
      const cyrus = page.getByRole("button", { name: "Cyrus details" });
      const bounds = await cyrus.boundingBox();
      expect(bounds).not.toBeNull();
      // The center of the back face is a contact link; tap away from links to toggle.
      const togglePosition = { x: bounds!.width / 2, y: bounds!.height / 4 };
      await cyrus.tap({ position: togglePosition });
      await expect(cyrus).toHaveAttribute("aria-pressed", "true");
      await expect(cyrus.locator(".hex-face.back")).toHaveAttribute(
        "aria-hidden",
        "false",
      );
      await cyrus.tap({ position: togglePosition });
      await expect(cyrus).toHaveAttribute("aria-pressed", "false");
      const ciridae = page.getByRole("button", { name: "Ciridae details" });
      await ciridae.tap();
      await expect(ciridae).toHaveAttribute("aria-pressed", "true");
      await expect(
        ciridae.getByRole("link", { name: "ciridae.com", exact: true }),
      ).toHaveAttribute("href", "https://ciridae.com/");
    });
  });
}
