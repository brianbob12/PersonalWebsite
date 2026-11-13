import {
  expect,
  type Locator,
  type Page,
  type TestInfo,
} from "@playwright/test";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

export function comparePaint(actualBuffer: Buffer, referenceBuffer: Buffer) {
  const actual = PNG.sync.read(actualBuffer);
  const reference = PNG.sync.read(referenceBuffer);
  if (actual.width !== reference.width || actual.height !== reference.height) {
    return { matches: false, changedPixels: -1 };
  }
  // Repainting a hidden layer changes text/edge antialiasing in Chromium 120.
  // Use half Playwright's default color threshold, ignore antialiasing only,
  // and require zero remaining differing pixels. A real rear-face leak fails.
  const changedPixels = pixelmatch(
    actual.data,
    reference.data,
    undefined,
    actual.width,
    actual.height,
    { threshold: 0.1, includeAA: false },
  );
  return {
    matches: changedPixels === 0,
    changedPixels,
  };
}

export async function recordBrowserVersion(page: Page, testInfo: TestInfo) {
  const browser = page.context().browser()!;
  await testInfo.attach("browser-version", {
    body: JSON.stringify({
      project: testInfo.project.name,
      browser: browser.browserType().name(),
      version: browser.version(),
      platform: process.platform,
      playwright: process.env.COMPAT_PLAYWRIGHT_VERSION || "locked dependency",
    }),
    contentType: "application/json",
  });
}

export async function pauseFlipAt(tile: Locator, elapsedMs: number) {
  const rotor = tile.locator(".hex-rotor");
  await expect
    .poll(() => rotor.evaluate((element) => element.getAnimations().length))
    .toBeGreaterThan(0);
  await rotor.evaluate((element, time) => {
    const animation = element.getAnimations()[0];
    animation.pause();
    animation.currentTime = time;
  }, elapsedMs);
  // Give style and compositing a frame to observe the paused animation time.
  await rotor.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => resolve(null))),
  );
}

export async function finishFlip(tile: Locator) {
  await tile.locator(".hex-rotor").evaluate((element) => {
    element.getAnimations().forEach((animation) => animation.finish());
  });
}

export function readFlipAngle(tile: Locator) {
  return tile.locator(".hex-rotor").evaluate((element) => {
    const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform);
    return (Math.acos(Math.max(-1, Math.min(1, matrix.m22))) * 180) / Math.PI;
  });
}

export async function expectOnlyFacePaints(
  page: Page,
  tile: Locator,
  face: "front" | "back",
  testInfo: TestInfo,
  label: string,
) {
  const bounds = await tile.boundingBox();
  expect(bounds).not.toBeNull();
  // A page capture preserves paused animation time; locator captures can wait
  // for/finish animations. Never use animations:"disabled" for this assertion.
  const normal = await page.screenshot({ clip: bounds! });
  const other = tile.locator(
    `.hex-face.${face === "front" ? "back" : "front"}`,
  );
  const previousStyle = await other.getAttribute("style");
  await other.evaluate((element) => {
    (element as HTMLElement).style.visibility = "hidden";
  });
  let withoutOther: Buffer;
  try {
    withoutOther = await page.screenshot({ clip: bounds! });
  } finally {
    await other.evaluate((element, previous) => {
      if (previous === null) element.removeAttribute("style");
      else element.setAttribute("style", previous);
    }, previousStyle);
  }
  const comparison = comparePaint(normal, withoutOther);
  if (!comparison.matches) {
    await testInfo.attach(`${label}-actual`, {
      body: normal,
      contentType: "image/png",
    });
    await testInfo.attach(`${label}-only-${face}`, {
      body: withoutOther,
      contentType: "image/png",
    });
  }
  expect(
    comparison.matches,
    `${label}: opposite face painted pixels (${JSON.stringify(comparison)})`,
  ).toBe(true);
}

export async function dispatchLegacyActivation(
  tile: Locator,
  origin: "touch" | "pen",
  clickType: "missing" | "mouse",
) {
  await tile.evaluate(
    (element, { origin, clickType }) => {
      for (const type of ["pointerdown", "pointerup"]) {
        element.dispatchEvent(
          new PointerEvent(type, {
            bubbles: true,
            pointerId: 42,
            pointerType: origin,
            isPrimary: true,
            button: 0,
          }),
        );
      }
      const init = { bubbles: true, detail: 1, button: 0 };
      element.dispatchEvent(
        clickType === "missing"
          ? new MouseEvent("click", init)
          : new PointerEvent("click", { ...init, pointerType: "mouse" }),
      );
    },
    { origin, clickType },
  );
}
