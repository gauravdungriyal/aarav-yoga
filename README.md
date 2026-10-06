# Aarav Yoga

A responsive eight-page static website using the provided brand palette. No dependencies are needed.

Run `npm run build` to regenerate the pages, `npm run check` to validate them, and `npm start` to preview at http://127.0.0.1:4173. You can also open `dist/index.html` directly.

The editorial homepage is authored in `homepage.mjs`, styled in `homepage.css`, and animated by `homepage.js`. `build.mjs` generates it alongside the seven existing standalone pages, which retain `styles.css`, `hero.css`, and `app.js`. The generated `dist` folder is tracked and serves as the deployable website.

Class descriptions and journal stories are starter content. Schedules, prices, event dates, instructor biographies, studio address, and contact details await the owner’s information. No enquiry is submitted and no booking or payment is collected.

Illustrative photographs from Pexels (not photographs of Aarav Yoga):
- Outdoor practice: https://www.pexels.com/photo/woman-meditating-outdoors-8391701/
- Group practice: https://www.pexels.com/photo/people-doing-yoga-8436571/
- Yoga props: https://www.pexels.com/photo/yoga-mats-and-yoga-blocks-on-a-wooden-floor-6752163/

Images are saved locally in `dist/assets`. Fonts are served by Google Fonts; system serif and sans-serif fallbacks work offline.

## Editorial homepage

The homepage uses the requested ivory, sand, soft black, and orange palette, with secondary text slightly darkened to keep it readable on both light backgrounds. It includes all thirteen design elements: full-width white header with an uncropped logo, desktop page navigation, hero tagline and opening photograph sized to share one viewport with the header, asymmetric about composition, studio banner, sticky class introduction, overlapping benefits, mat invitation, sample testimonials, instructor placeholders, original statement, placeholder pricing, closing photographs, and minimal footer.

Motion uses native scrolling, IntersectionObserver, CSS transitions, sticky positioning, and a requestAnimationFrame scroll updater. There are no additional runtime dependencies. The hero uses a changing image mask and subtle scale/translation because no matching transparent subject cutout exists. Its additional desktop scroll distance is 55vh; the three benefit panels use 130vh of additional scrolling. Mobile uses ordinary stacked sections. Reduced-motion mode removes pinning, parallax, and entrance animations. With JavaScript disabled, every section remains visible and the header's Menu link reaches the complete footer navigation.

The full-screen menu uses native dialog behaviour plus explicit focus trapping, Escape handling, focus restoration, active section highlighting, and animated entrance/exit. Section links close the menu and navigate using native scrolling. All class and contact actions reach real local pages or section anchors. There is no booking backend.

Testimonials are visibly marked as sample reflections. Instructor names, roles, and portraits are editable placeholders with visible labels. Prices, packages, email, address, and opening hours await real owner-provided details. No social or policy destinations were supplied, so none are fabricated. The owner's uploaded video stays untouched in `logo/` and is excluded from deployment source.

### Replaceable photography

All displayed photographs exist locally; there are no broken image placeholders. Stock photos are illustrative and do not represent Aarav Yoga's actual studio, staff, or customers.

| Local asset | Use | Source |
| --- | --- | --- |
| `dist/assets/hero.jpg` | Existing outdoor meditation hero, class, benefit, and statement | Existing project photograph |
| `dist/assets/editorial-studio.jpg` | About, studio banner, full-screen menu | https://unsplash.com/photos/dwka5DDrnY0 |
| `dist/assets/editorial-vases.jpg` | Asymmetric ceramic still life | https://www.pexels.com/photo/ceramic-vases-and-a-candle-8217492/ |
| `dist/assets/editorial-mat.jpg` | Rolled orange mat invitation | https://www.pexels.com/photo/yogi-rolling-a-yoga-mat-6633997/ |
| `dist/assets/editorial-pair.jpg` | Closing seated partner practice | https://www.pexels.com/photo/women-practicing-yoga-3735503/ |
| `dist/assets/editorial-teacher-man.jpg` | Illustrative instructor and sample portrait | https://www.pexels.com/photo/a-man-doing-yoga-pose-9271215/ |
| `dist/assets/editorial-teacher-woman.jpg` | Illustrative instructor and sample portrait | https://www.pexels.com/photo/smiling-woman-in-yoga-clothing-7593009/ |

For exact reference photography, replace the outdoor meditation photo with a wide soft-sky scene (subject central/right, clear left side), the studio photo with a neutral room featuring tall windows and cushions, and the orange mat photo with a rolled mat resting in warm sunlight. The current studio has high horizontal windows, and the mat photo includes hands holding the rolled mat. A matching background and transparent subject cutout would allow a layered hero transition; the current masked transition is intentional. Replace instructor portraits with actual staff photos and supply verified biographies. Suitable source sizes are 2000–2400px wide for banners and 1200px or more for portraits and still life.

## Existing illustration and logo

The uploaded `logo/logo.webp` is used unchanged in every page’s header and footer.

The existing `dist/assets/studio-hero.png` is used in the advanced class and strength panel. It was generated with built-in imagegen as illustrative artwork, not a photograph of an Aarav Yoga instructor.

Final image prompt: Wide 16:9 bright warm-ivory yoga studio, light wood floor, adult Indian man wearing black sleeveless top and light grey trousers in warrior one lunge with arms straight overhead, positioned in right third, full hands and feet visible, clear left half for headline, diffuse daylight, photorealistic editorial wellness photography, neutral palette, no text, logos, or UI.

The About Us page contains the owner-provided mission, vision, philosophy, courses, trainer information, and charity-funded pricing approach. Copy is lightly edited for clarity; the vision describes support for well-being rather than a promise to cure diseases. Its testimonial section remains empty until real reviews are provided.
