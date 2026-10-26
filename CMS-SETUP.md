# Aarav Yoga content manager

Decap CMS is configured for `gauravdungriyal/aarav-yoga`, branch `main`, and Vercel.

Production editor: **https://aarav-yoga-x9f9.vercel.app/admin/**

The code must be pushed to GitHub and deployed to Vercel before that editor is available. GitHub sign-in also requires the one-time account setup below. No credentials are included in this repository.

## One-time GitHub sign-in setup

1. Open [GitHub → Settings → Developer settings → OAuth Apps → New OAuth App](https://github.com/settings/applications/new), using the account that will own the integration.
2. Enter:
   - Application name: `Aarav Yoga CMS`
   - Homepage URL: `https://aarav-yoga-x9f9.vercel.app`
   - Authorization callback URL: **`https://aarav-yoga-x9f9.vercel.app/api/callback`**
3. Register the application and generate a client secret. Keep it private; do not paste it into chat, commit it, or put it in `admin/` or `content/`.
4. In the Vercel project, open **Settings → Environment Variables** and add these for **Production**:

   | Name | Value |
   | --- | --- |
   | `CMS_SITE_URL` | `https://aarav-yoga-x9f9.vercel.app` |
   | `GITHUB_CLIENT_ID` | Client ID from the GitHub OAuth app |
   | `GITHUB_CLIENT_SECRET` | Client secret from the GitHub OAuth app |

5. Confirm Vercel is connected to `gauravdungriyal/aarav-yoga` with production branch `main`, build command `npm run build`, and output directory `dist`. Use Node.js 22 or newer. Keep **Root Directory** at the repository root so the `api/` functions deploy alongside the static site.
6. Deploy the changes, or redeploy after adding environment variables. Visit `/admin/` and sign in with a GitHub account that has **write access** to this repository.

The GitHub backend uses the OAuth `repo` scope, including for draft pull requests. GitHub may request organization approval if the repository is organization-owned. The server checks repository write access before handing a token to Decap.

Only the configured production hostname is allowed to complete sign-in. Vercel preview URLs deliberately show a setup message instead of initiating production OAuth. When changing domains, update the OAuth app URLs, `CMS_SITE_URL`, and `site_url` / `display_url` in `admin/config.json`, then redeploy.

## Editing and publishing

Choose a section in the left menu, then its content entry. Repeated content such as classes, articles and photos is managed as a list: expand an item to edit it, use **Add** for a new item, and reorder or delete items as needed.

- **Homepage:** hero, about copy, values, benefit panels, images, banner and quote. The design has three values and three benefit panels.
- **About us:** purpose, mission, vision, philosophy and reasons to choose the studio.
- **Classes & schedules:** descriptions, categories, photos, optional timings, displayed prices, instructor and studio text.
- **Events & workshops:** descriptions, photos, optional date/time, location and HTTPS registration link. Empty dates display “Coming soon”; dates display in India time. Without a registration link, the button opens WhatsApp.
- **Instructors:** names, photos, alternative text, optional specialities and biographies. Existing illustrative profiles are preserved until replaced.
- **Blog articles:** categories, titles, summaries, formatted article bodies and optional cover images. Articles continue opening in the existing website dialog. Raw HTML is disabled; Markdown images must be local site uploads.
- **Photo gallery:** photos, captions, order and the gallery note.
- **Studio locations:** names, addresses, photos and the introductory text. Map links are generated from addresses.
- **Student testimonials:** heading, names, optional roles and reviews.
- **Contact & site settings:** logo, email, phone, WhatsApp number, social links, footer, menu, contact-page text and WhatsApp FAQs. Enter the WhatsApp number as country code plus digits, without `+` or spaces.
- **Page titles & SEO:** page headings, browser titles, descriptions and optional sharing images. The homepage main heading is under Homepage.

Save as a draft, mark it ready when reviewed, then publish. Decap's editorial workflow uses GitHub branches/pull requests; publishing merges the content into `main`. Vercel then rebuilds the website. Wait for a successful Vercel deployment before expecting the public site to change. Branch protections may require publishing through GitHub approval/merge instead.

### Homepage hero slideshow

Open **Homepage → Hero Slides** in the same editor. Add, delete or reorder between one and six slides. Each slide includes:

- A desktop image and a description for screen readers. An optional mobile image replaces it on screens up to 760px wide.
- An optional heading and primary button label; empty fields use **Hero Title** and **Hero Button**. Line breaks in headings are preserved.
- Primary and secondary button destinations chosen from the site's pages. Clear the second button's label to hide it.
- Separate desktop and mobile text positions, text alignment, and separate image focus positions to adjust cropping.

**Hero Slider Settings** controls autoplay, time between slides (6000 milliseconds = six seconds), fade/slide transitions and transition duration. Start with three landscape photographs and concise headings. The first image is prioritised for loading; later images are lazy-loaded. One slide displays as a static hero without slideshow controls.

Visitors can swipe, use arrows or dots, and pause playback. Autoplay pauses during hover, keyboard focus, the navigation menu, or when the hero/page is out of view. Reduced-motion preferences start the slider paused with instant transitions. Without JavaScript the first slide and its links remain visible.

The existing hero scroll-to-split effect has been replaced by the slideshow; the benefit panels retain their scroll behaviour. Splide 4.1.4 is pinned and copied into the build, including its MIT license, so the public slideshow does not depend on a third-party CDN. Slide content stays in plain JSON under `content/home.json`, independently of Splide and Decap.

Each section is one JSON document, so its list changes share a draft and publish together. Changes to navigation structure, new page types, payments or booking systems still require development.

### Live editor previews and saved-draft previews

All content sections have a live preview pane. Edits appear after a short typing pause, without saving, creating a commit or changing the public website. The pane uses the same templates, styles and scripts as the site. Use **View → Fit pane / Desktop / Mobile** to inspect layouts. For the homepage, **Hero slide** selects the image being edited; autoplay starts paused in the editor. The pane keeps its scroll position across text edits. If an incomplete entry cannot yet render, the previous valid preview stays visible with a message.

**Page** lets you inspect shared settings, studio locations, testimonials and SEO changes on any relevant page. Navigation links stay inside the preview; external destinations are disabled there. Uploaded images can be previewed before publishing. The embedded website runs in an isolated iframe without access to the CMS login or storage.

For a full website preview, **Save** the draft in the production editor, wait for its Vercel build, then use **Check for Preview / View Preview** in Decap's toolbar. The link opens the entry's page on the draft deployment. Publishing still requires the explicit Draft → Ready → Publish workflow and updates the public site only after the production build succeeds.

The repository's `.github/workflows/cms-preview.yml` translates deployment events for **Preview – aarav-yoga-x9f9** into the `deploy-preview/aarav-yoga-x9f9` commit status consumed by Decap. This is necessary because Vercel's ordinary commit-status URL points to its dashboard, not the draft website. The workflow uses GitHub's automatic token, checks out no draft code and requires no new secrets. It becomes active once committed to the repository's default branch. Existing drafts need a new save/build after the workflow is deployed; older deployments do not replay their events.

Keep GitHub Actions enabled, Vercel's Git integration connected, and preview deployments enabled for CMS branches. If Vercel protects preview deployments, sign in with an authorised Vercel account when opening the link. Production CMS sign-in remains restricted to the production hostname; use the production editor to manage drafts, not `/admin/` on a preview deployment. If the Vercel project is renamed, update the workflow project/environment checks and `backend.preview_context` together.

Before pushing this implementation, live editor previews are available locally; the complete GitHub → Vercel draft-link flow must be verified after deployment by saving a test draft without publishing it.

## Local editing

```sh
npm ci
npm run dev:cms
```

Open **http://127.0.0.1:4173/admin/**. The local editor uses the Decap filesystem proxy on `127.0.0.1:8081`, without GitHub credentials. Local saves modify repository files only; they do not publish to GitHub. The development command rebuilds on content/upload changes; refresh the website preview to see them. Local editing uses simple publishing because Decap's local backend does not support editorial workflow.

Both ports must be available. Stop with Ctrl+C. Internet access is needed to download the pinned Decap editor bundle from jsDelivr. A blocked download displays a retry message.

The local proxy is pinned to Decap Server 3.11.3, with patched Joi and simple-git dependencies supplied through npm overrides. If upgrading it, rerun the proxy editing checks and `npm audit` before removing those overrides.

## Source files and verification

- `content/*.json`: editable website content; do not hand-edit generated HTML.
- `assets/uploads/`: source media managed by Decap, copied into `dist/assets/uploads/` during builds. Existing images have been copied here so they are available in the media picker.
- `admin/config.json`: editor fields, GitHub repository and workflow settings.
- `api/auth.js`, `api/callback.js`, `lib/cms-oauth.js`: Vercel GitHub OAuth flow, with state validation, PKCE, a short-lived secure cookie and an exact-origin popup handshake.
- `cms-content.mjs`, `content-format.mjs`: content validation, escaping and Markdown rendering.
- `pages.mjs`: shared page rendering for production builds and editor previews.
- `admin/previews.mjs`, `admin/preview-model.mjs`: live preview controls and temporary editor data. Builds bundle these into `dist/admin/previews.js` and generate the published-content snapshot in `preview-data.json`.
- `.github/workflows/cms-preview.yml`: saved-draft deployment links for Decap.

```sh
npm test
npm run build
npm run check
npm audit
```

The build rejects invalid fields, unsafe URLs and missing images. Automated tests cover content updates, Markdown safety, date/link rendering, OAuth errors, state and origin checks, live preview rendering for all sections, unpublished image handling and draft-link status validation. Real GitHub login, workflow execution and live Vercel draft links must also be checked after deployment.

If sign-in says setup is incomplete, confirm the production environment variables and redeploy. If GitHub rejects the callback, compare its registered callback URL exactly. If content publishes but the website stays unchanged, inspect the Vercel deployment triggered by the content commit.
