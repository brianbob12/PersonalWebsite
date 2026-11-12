# Browser compatibility

## Supported browsers

The production site targets Chrome and Edge 111+, Firefox 114+, and Safari and
iOS/iPadOS Safari 16.4+. These are the browser targets of the current Vite 8
production build. Keep the build targets explicit when changing Vite versions;
support is a requirement, not a claim that every release has been exercised.

The current application uses **Tailwind 3**, not Tailwind 4. Tailwind 4's Firefox
128+ requirement does not describe this checkout. A future Tailwind 4 upgrade
must explicitly revisit this policy. See [Vite's browser targets][vite] and
[Tailwind's compatibility requirements][tailwind].

Required platform features include CSS 3D transforms, unprefixed
`backface-visibility`, `overflow: clip`, `inert`, Pointer Events, and the Web
Animations API. Safari unprefixed backface visibility in 15.4 and added `inert`
in 15.5, both below the supported floor. An inert face stays visually rendered;
the attribute only disables interaction and accessibility exposure. See
[Safari 15.4][safari-154], [Safari 15.5][safari-155], and
[WebKit's explanation of inert][inert].

## Required behavior

- Both faces remain mounted. A full flip takes one second, with the visible
  face changing when the tile is edge-on, halfway through elapsed time in
  either direction. Interrupted flips reverse from the current position.
- Hide the complete rear-facing surface, including text, images, borders, and
  animated descendants. Accessibility attributes are not a visual hiding
  mechanism. Keep the rotor's shared 3D context separate from each face's
  flattened content. Do not put flattening effects on the rotor itself.
- Mouse hover opens details and leaving closes them. Touch and pen activation
  toggle details at phone, tablet, and desktop widths. The responsive layout
  breakpoint does not determine the input device. A mouse click following hover
  must not toggle a second time.
- Enter and Space toggle the tile. Back-face links remain keyboard accessible
  when active and activating a link does not flip the tile. The inactive face's
  links cannot receive focus or clicks.
- `prefers-reduced-motion: reduce` removes flip and ripple animations. This is
  an intentional immediate change, rather than an animation failure.
- The phone stack fits without horizontal scrolling. The desktop layout also
  fits the currently visible height on tablets with browser toolbars. Account
  for the interaction between the two overflow axes.
- Self-hosted regular/bold fonts load; the name stays on one centered line even
  when font downloads fail.

## Investigation and implementation constraints

### Face rendering

During the November 2026 investigation, the deployed CSS set `preserve-3d` on
both the rotor and each face. Backface visibility is not inherited, and extending
the 3D context into transformed descendants can expose separately rendered
content. This is a **theoretical explanation** for the reported immediate Safari
content change, not a confirmed diagnosis of a particular Safari release.

The regression matrix subsequently showed rear-face painting in WebKit despite
flattening each face. The implementation therefore samples the rotor's actual
animated transformation matrix each animation frame and selects the facing
surface with opacity and pointer-event gating. Both surfaces stay mounted; the
choice follows the current angle during reversals, rather than a timeout or the
destination state. This also avoids relying on native backface culling in capture
paths where it is broken. The frame-painting regression runs on Windows too.

Use the [CSS Transforms flip-card model][transforms] as the reference. Its
rotor preserves 3D while faces flatten their content. The [W3C discussion of
descendant backface visibility][backface-discussion] explains the interoperability
hazard. `clip-path`, non-visible/non-clip overflow, opacity below 1, and filters
are [grouping properties][grouping] that flatten the element on which they are
applied. A clipped outer wrapper does **not**, by that rule alone, prove that an
inner rotor's own 3D context is broken. Missing perspective changes projection;
it is not by itself evidence of a broken flip.

### Animation timing

The previous `1000ms ease` rotation reaches 90 degrees at approximately 293.3ms
in the forward direction. Half the angle is not half the elapsed time with an
asymmetric easing curve. Use a symmetric curve such as `ease-in-out` or `linear`
for the halfway requirement; do not add a separate content-swap timeout. See
the [CSS easing definitions][easing].

### Touch events and hybrid devices

Safari before 18.2 dispatches `click` as a `MouseEvent`, with no `pointerType`.
Safari 18.2 switched clicks to `PointerEvent`, but WebKit also documents touch
clicks incorrectly reporting `pointerType: "mouse"`. Consequently, neither a
missing click pointer type nor `"mouse"` on a click reliably identifies the
originating input. Track the originating `pointerdown`/`pointerup` input instead,
while retaining click activation for keyboard and assistive technology.

The old handler rejects these clicks in the >=1200px layout while touch cannot
trigger mouse hover, making wide iPads a concrete failure case. See
[Safari 18.2's event changes][safari-182], [the original MouseEvent report][mouse-click],
and [WebKit's touch pointerType bug][touch-click]. Devices may have multiple
input mechanisms; [pointer and hover media queries][input-media] describe
capabilities, not viewport size.

### Viewports

`100vh` need not match the visible viewport when mobile browser toolbars are
shown. Use dynamic viewport units where a layout must fill that visible area;
Safari supports them from 15.4. Also, setting `overflow-x: hidden` makes the
other axis's `visible` value compute to `auto`, potentially introducing an
unintended vertical scroller. See [WebKit's viewport explanation][safari-154]
and the [CSS Overflow rules][overflow].

## Verification policy

Run regression scenarios against several **actual engine snapshots**, pinning
each Playwright release to its matching browser binaries. Changing only a user
agent string or viewport does not test an older browser engine. Include Chromium,
Firefox, and WebKit, and phone and wide-tablet touch profiles. Record the browser
version in each run's report. See [Playwright browser installation][pw-browsers],
[browser release versions][pw-releases], and [test projects][pw-projects].

Cover intermediate animation frames in both directions, quick reversal, settled
face painting, legacy/misreported click events, wide-tablet touch input, mouse
click deduplication, keyboard/link behavior, reduced motion, fonts, and layout.
Do not disable motion in the tests intended to verify animated face painting.

Playwright WebKit is a patched engine, not the installed Safari application.
iPhone/iPad emulation does not reproduce every iOS behavior or replace real
device checks. Exercise WebKit on macOS as well as Linux, and record any remaining
minimum-version or real-device gaps honestly. In particular, Windows WebKit's
backface screenshots have a [documented capture limitation][pw-screenshot]; a
failing screenshot there is not proof of the reported macOS Safari defect.

Before a release affecting these interactions, check Safari/iOS at the supported
floor and a current release on actual Apple hardware or a real-device service.
Check a wide iPad without a mouse, an iPad with a trackpad, browser toolbars
shown/hidden, and Reduce Motion enabled/disabled. Automated emulation supplements
this check; it does not certify these combinations.

[vite]: https://vite.dev/guide/build#browser-compatibility
[tailwind]: https://tailwindcss.com/docs/compatibility
[safari-154]: https://webkit.org/blog/12445/new-webkit-features-in-safari-15-4/
[safari-155]: https://webkit.org/blog/12669/new-webkit-features-in-safari-15-5/
[inert]: https://webkit.org/blog/12578/non-interactive-elements-with-the-inert-attribute/
[transforms]: https://drafts.csswg.org/css-transforms-2/#backface-visibility
[backface-discussion]: https://www.w3.org/Bugs/Public/show_bug.cgi?id=23015
[grouping]: https://drafts.csswg.org/css-transforms-2/#grouping-property-values
[easing]: https://www.w3.org/TR/css-easing-1/#cubic-bezier-easing-functions
[safari-182]: https://webkit.org/blog/16301/webkit-features-in-safari-18-2/#web-api
[mouse-click]: https://bugs.webkit.org/show_bug.cgi?id=239810
[touch-click]: https://bugs.webkit.org/show_bug.cgi?id=282988
[input-media]: https://www.w3.org/TR/mediaqueries-4/#mf-interaction
[overflow]: https://www.w3.org/TR/css-overflow/#overflow-properties
[pw-browsers]: https://playwright.dev/docs/browsers
[pw-releases]: https://playwright.dev/docs/release-notes
[pw-projects]: https://playwright.dev/docs/test-projects
[pw-screenshot]: https://github.com/microsoft/playwright/issues/21620
