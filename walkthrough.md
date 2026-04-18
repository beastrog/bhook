# Bhook - Walkthrough & Design Log

## Project Summary
Bhook is a hyperlocal snack ordering web application designed specifically for night-time hostel sales. Customers can browse and reserve existing stock, whilst payments and collection happen offline (in-person).

## The Obsidian Monolith Redesign (Final Iteration)
Per the final requirement to heavily prioritize the **Desktop Screen Prototype** making it "mind-blowing" and then optimizing downward for Tablet/Mobile, the application underwent a total structural architecture rewrite named the *Obsidian Monolith*:

- **100vw Desktop Utilization:** Removed all narrow container constraints from the Landing and Menu screens. The Landing page now uses an immense asymmetrical typography layout that spans 2500px monitors beautifully, moving to a single stacked layout on mobile.
- **The "No-Line" Rule:** We stripped the UI of cheap borders and divider lines. Sections are separated by deep foundational background color shifts (`#131313` base to `#1b1b1b` containers).
- **Massive Menu Masonry:** The Product Vault uses a true, tightly-packed multi-column grid (`grid-cols-1` on mobile, scaling up to `grid-cols-5` on ultra-wide desktop monitors). 
- **Type-driven Brutalism:** 0px border radius across the board. The UI relays extreme precision—using massive Inter fonts with `-0.04em` tracking for headings, and uppercase `+0.2em` tracked `text-label` identifiers.
- **Floating Cart Slideout:** The cart preview is no longer just a small pill. It is now an architectural block fixed to the bottom right of the screen on Desktop, sliding in cleanly without interrupting the browsing experience. 

## Technical Foundation & Build
The Next.js 15 App Router architecture uses **TypeScript** exclusively and heavily integrates with **Supabase Row-Level-Security (RLS)**. Atomic operations ensure that midnight-snack stock reservations cannot be double-booked by simultaneous customers. 
The application passes `npm run build` flawlessly with zero typing, linting, or prerendering errors, resulting in a lightning-fast static output connected to dynamic server actions.

## Vercel Deployment
The entire project has been successfully committed and pushed to `https://github.com/beastrog/bhook`. Vercel captures these Git webhooks natively and triggers production builds instantly on exactly this repository branch (`main`).
