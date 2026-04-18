# Design System Specification: Editorial Vitality

## 1. Overview & Creative North Star: "The Neon Pulse"
This design system is built to disrupt the mundane ritual of snacking. Our Creative North Star is **"The Neon Pulse."** We are moving away from the "grocery aisle" aesthetic toward a "high-end nightlife" energy. This system rejects the safety of generic grids in favor of a **mind-bendingly minimal** editorial approach.

To achieve this, we utilize **Intentional Asymmetry**. Elements should feel like they are floating in a void of deep space, punctuated by bursts of radioactive color. We use massive typography scales to create a hierarchy that feels rhythmic and urgent, mirroring the instant gratification of a snack craving. The interface is not a tool; it is a sensory experience.

---

## 2. Colors: High-Contrast Electricity
Our palette is anchored by `#100f00` (Background/Surface), a "near-black" with a hint of organic warmth, providing a deep stage for our hero color: `#d3f734` (Primary), a vibrant, electric lime.

### The "No-Line" Rule
**Prohibit 1px solid borders for sectioning.** Traditional lines clutter the mind. Boundaries must be defined solely through background color shifts. To separate a product category from the hero section, transition from `surface` (#100f00) to `surface-container-low` (#161400).

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. We use tonal nesting to define importance:
- **Base Level:** `surface` (#100f00)
- **Secondary Content:** `surface-container` (#1c1a00)
- **Interactive Cards:** `surface-container-high` (#232000)
- **Floating Modals:** `surface-container-highest` (#292700)

### The "Glass & Gradient" Rule
To add soul to the minimalism, main CTAs and "New Arrival" banners should utilize a subtle linear gradient from `primary` (#d3f734) to `primary-container` (#badd0e) at a 135-degree angle. For floating navigation bars, use `surface-container` at 80% opacity with a `24px` backdrop-blur to create a "frosted obsidian" effect.

---

### 3. Typography: The Bold Voice
We pair the geometric aggression of **Space Grotesk** with the clean, approachable rhythm of **Plus Jakarta Sans**.

| Level | Token | Font | Size | Character |
| :--- | :--- | :--- | :--- | :--- |
| **Display** | `display-lg` | Space Grotesk | 3.5rem | Bold, tight tracking (-0.02em). Use for "Hunger" headlines. |
| **Headline**| `headline-lg`| Space Grotesk | 2.0rem | High-contrast. The primary hook for product names. |
| **Title**   | `title-lg`   | Plus Jakarta | 1.375rem| Semi-bold. Used for category navigation. |
| **Body**    | `body-lg`    | Plus Jakarta | 1.0rem | Standard reading. Line height at 1.6 for breathability. |
| **Label**   | `label-md`   | Plus Jakarta | 0.75rem | All-caps, wide tracking (+0.05em) for metadata. |

---

## 4. Elevation & Depth: Tonal Layering
We do not use shadows to mimic 1990s skeuomorphism. We use light and opacity to mimic modern architecture.

*   **The Layering Principle:** A "Buy Now" card should not have a shadow. Instead, place a `surface-container-high` card on top of a `surface` background. The `0.5rem` difference in tonal value is enough for the eye to perceive depth.
*   **Ambient Shadows:** If an element must float (e.g., a cart drawer), use an "Electric Glow" shadow: `0px 20px 40px rgba(211, 247, 52, 0.08)`. This uses the `primary` color as the shadow tint, making the element look like it’s emitting light.
*   **The "Ghost Border" Fallback:** If accessibility requires a container, use a `1px` stroke of `outline-variant` (#4d4915) at **15% opacity**. It should be felt, not seen.

---

## 5. Components: Minimalist Primitives

### Buttons
- **Primary:** Background `primary` (#d3f734), Text `on-primary` (#4c5b00). Shape: `full` (9999px). No border.
- **Secondary:** Background `surface-container-highest`, Text `primary`. Shape: `md` (1.5rem).
- **Tertiary:** No background. Text `on-surface` with a `primary` underline (2px) offset by 4px.

### Cards & Lists
- **The Rule of Silence:** **Forbid divider lines.** Use `1.5rem` (md) or `2rem` (lg) vertical whitespace to separate snack items. 
- **Product Cards:** Use `surface-container-low` with a `lg` (2rem) corner radius. Imagery should bleed off the edge or overlap the card boundary to break the "box" feel.

### Input Fields
- **State:** Text inputs use a bottom-only border of `outline` (#7c773e). On focus, the border transforms into a 2px `primary` line. 
- **Error State:** Use `error` (#ff7351) for the label and `error_container` for a subtle background wash.

### Selection Chips
- **Inactive:** `surface-variant` background, `on-surface-variant` text.
- **Active:** `primary` background, `on-primary` text. Use `sm` (0.5rem) roundedness for a sharper, "market" feel.

---

## 6. Do’s and Don’ts

### Do
- **DO** use white space as a structural element. If in doubt, add more padding.
- **DO** overlap high-quality product photography over `display` typography to create depth.
- **DO** use `primary` sparingly. It is a laser, not a paint bucket.

### Don't
- **DON'T** use pure black (#000000) for backgrounds; use `surface` (#100f00) to keep the "premium paper" feel.
- **DON'T** use standard Material Design "Drop Shadows." They look cheap in a high-end editorial context.
- **DON'T** center-align long-form body text. Keep it left-aligned to maintain the editorial "grid" anchor.