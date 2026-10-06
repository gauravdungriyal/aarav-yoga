# Aarav Yoga

A responsive eight-page static website using the provided brand palette. No dependencies are needed.

Run `npm run build` to regenerate the pages, `npm run check` to validate them, and `npm start` to preview at http://127.0.0.1:4173. You can also open `dist/index.html` directly.

Page content and shared HTML are in `build.mjs`, styling in `styles.css`, and interactions in `app.js`. The generated `dist` folder is tracked and serves as the deployable website.

Class descriptions and journal stories are starter content. Schedules, prices, event dates, instructor biographies, studio address, and contact details await the owner’s information. No enquiry is submitted and no booking or payment is collected.

Illustrative photographs from Pexels (not photographs of Aarav Yoga):
- Outdoor practice: https://www.pexels.com/photo/woman-meditating-outdoors-8391701/
- Group practice: https://www.pexels.com/photo/people-doing-yoga-8436571/
- Yoga props: https://www.pexels.com/photo/yoga-mats-and-yoga-blocks-on-a-wooden-floor-6752163/

Images are saved locally in `dist/assets`. Fonts are served by Google Fonts; system serif and sans-serif fallbacks work offline.

## Updated homepage hero and logo

The uploaded `logo/logo.webp` is used unchanged in every page’s header and footer. `hero.css` controls the full-width homepage photograph, overlaid navigation, headline, and rounded class button.

The hero asset is `dist/assets/studio-hero.png`, generated with built-in imagegen as illustrative artwork, not a photograph of an Aarav Yoga instructor.

Final image prompt: Wide 16:9 bright warm-ivory yoga studio, light wood floor, adult Indian man wearing black sleeveless top and light grey trousers in warrior one lunge with arms straight overhead, positioned in right third, full hands and feet visible, clear left half for headline, diffuse daylight, photorealistic editorial wellness photography, neutral palette, no text, logos, or UI.
