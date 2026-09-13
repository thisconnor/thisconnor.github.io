# Connor Ruffalo -- Personal Portfolio Site

## What this project is

A personal portfolio website for Connor Ruffalo, hosted on GitHub Pages at
**https://thisconnor.github.io** (repo: `thisconnor/thisconnor.github.io`,
deployed from the `main` branch, root directory). The goal of the site is
career growth: it should read as clean, sharp, and professional to
recruiters, consultants, and founders.

Connor is newer to Claude Code. Briefly explain what you're doing as you
work, and ask before making big structural or design decisions. When
uncertain about details about Connor or his work history, ask him directly
instead of guessing.

## Tech stack and hard constraints

- Static site only: plain HTML, CSS, and vanilla JS. No frameworks, no
  build step, no bundler. GitHub Pages serves these files exactly as
  committed.
- `index.html` must live at the repo root -- it is the homepage.
- Use clean URLs via folders: `/experience/index.html`,
  `/projects/index.html`, `/contact/index.html`.
- Load GSAP (ScrollTrigger, SplitText, Flip) and Lenis from CDN.
  No jQuery. Three.js only if a signature moment genuinely calls for it.
- Shared CSS and JS live in `/css/` and `/js/`. Don't duplicate styles
  per page.
- Responsive down to 375px. The site must look intentional on mobile,
  not merely "not broken."

## Content sources -- read these first

The `/assets/` folder contains:

- **Company logos** for every organization Connor wants listed.
- **Labeled photos of Connor** in business settings.
- **Connor's resume** and a **master document about Connor** -- these two
  files are the source of truth for all copy: roles, titles, dates,
  accomplishments, bio.

Before writing any page content, inventory `/assets/` and read the resume
and master document in full. All facts on the site must come from those
documents. Never invent titles, dates, metrics, or accomplishments. If
something needed for the site isn't in the documents, ask Connor.

Photos are labeled -- match photos to sections sensibly (e.g., a
professional headshot for the hero, event/business photos for experience
context). Optimize images before committing: resize to display
dimensions, compress, prefer WebP with fallbacks.

## Required links

- LinkedIn (Connor): https://www.linkedin.com/in/cruffalo/
- OCIT (Orange County IT): https://ocit.oc.gov/
- Alonsera: https://www.alonsera.com/
- UCI Rocket Project (Liquids): https://www.rocket.eng.uci.edu/liquids/

The three organization links attach to their entries on the Experience
page (logo and/or org name links out). All external links open in a new
tab (`target="_blank" rel="noopener"`). LinkedIn appears in the nav or
footer on every page and in the Contact page.

## Site structure (multi-page)

1. **Home (`/`)** -- Hero with Connor's name, a sharp one-line identity
   statement, and a professional photo. Short intro, a few highlight
   cards or stats pulled from the master doc, and clear paths to
   Experience, Projects, and Contact. The hero is the thesis of the
   site -- make it the strongest moment.
2. **Experience (`/experience/`)** -- Roles with company logos, titles,
   dates, and 2-4 accomplishment bullets each, all sourced from the
   resume/master doc. Each org links to its site (links above).
3. **Projects (`/projects/`)** -- Ventures and notable work pulled from
   the master doc (entrepreneurial projects, campus leadership, technical
   builds). Card or case-study layout.
4. **Contact (`/contact/`)** -- Links only: email and LinkedIn. No
   contact form. No downloadable resume anywhere on the site --
   LinkedIn is the resume.

Consistent nav across all pages with a clear active state. Consistent
footer with LinkedIn and email.

## Design direction

- **Palette:** white-dominant and minimalist. Near-white background,
  black and gray typography, generous whitespace. One accent color in
  the neon / electric light-blue family (cyan-leaning tech blue) used
  with restraint -- links, hover states, accent lines, the signature
  moment. Optionally one deep near-black for contrast sections. Define
  the exact 4-6 hex values as CSS custom properties in one place before
  building, and get Connor's sign-off on the palette and type pairing
  before building all four pages.
- **Feel:** clean, precise, engineered. Minimal directions live or die
  on precision of spacing, type scale, and detail -- sweat those.
- **Typography:** a characterful display face paired deliberately with a
  clean body face. Not default system fonts, not the same pairing every
  AI site uses. Type is part of the personality.
- **Avoid the generic AI look:** no purple-indigo gradients, no cream +
  terracotta, no three-identical-cards-in-a-row filler, no decoration
  that doesn't serve the content.
- Use the frontend-design skill for aesthetic decisions. Where this
  brief pins something down (white + light-blue accents, minimalist),
  the brief wins.

## Motion and animation standards

Build motion to an Awwwards level of polish, but tuned SNAPPY -- Connor's
word. Crisp and immediate over floaty and long. Motion is choreographed,
not scattered.

- **Libraries:** GSAP 3 for all animation -- ScrollTrigger for scroll
  choreography, SplitText for headline reveals, Flip for layout
  transitions. Lenis for smooth scrolling, synced to GSAP's ticker.
- **Hero entrance:** staggered page-load sequence (nav -> headline ->
  supporting copy -> CTA -> media), 0.06-0.10s stagger, masked line or
  character reveals on the headline (SplitText inside overflow-hidden
  wrappers).
- **Scroll reveals:** every section animates in once via ScrollTrigger
  (start ~"top 80%") combining y-translate (24-48px), opacity, and
  subtle scale (0.97 -> 1).
- **Page transitions:** since this is multi-page, add a quick, clean
  page-load reveal on every page so navigation feels cohesive. Keep it
  under ~0.6s -- never make navigation feel slower.
- **Micro-interactions:** every interactive element gets a deliberate
  hover and focus state (scale, underline draw, letter-spacing shift, or
  accent-color sweep) at 0.2-0.3s.
- **One signature moment:** a single memorable set piece on the Home
  hero (e.g., an accent-line draw system, a subtle particle/grid field
  in the light-blue accent, or a pinned reveal). Spend the boldness
  there; keep everything else quiet and disciplined.
- **Timing and easing:** never linear, never default ease. Entrances:
  expo.out or power4.out. Exits: power2.in. Ambient loops: sine.inOut.
  Micro-interactions 0.2-0.3s, reveals 0.5-0.8s, hero sequence up to
  ~1.2s. Keep staggers tight and consistent so the motion language feels
  unified across all pages.
- **Performance:** animate only transform and opacity -- never width,
  height, top, or left. Hold 60fps. Use will-change sparingly and remove
  after animating.
- **Accessibility:** respect prefers-reduced-motion (gate all
  non-essential motion). Keep keyboard focus states visible. Simplify or
  disable heavy effects below 768px and never scroll-jack on touch
  devices.

## QA loop -- required before saying a task is done

- Run the site in the preview panel. Zero console errors.
- Verify at 375px, 768px, and 1440px. Fix any overflow, jank, or
  misfiring scroll triggers.
- Screenshot and review each page like a design critic: is every timing
  intentional? Are staggers consistent? Tighten anything floaty,
  mechanical, or mistimed.
- Click every link (all four external links, all nav paths) and confirm
  they resolve and open correctly.

## Git and deploy workflow

- The site deploys automatically via GitHub Pages when `main` is pushed.
- When Connor says "deploy," "push it live," or similar: stage all
  changes, commit with a short descriptive message, and push to `main`.
- Commit at sensible milestones during work sessions too, so history
  stays readable and mistakes are easy to roll back.
- Never force-push. Never commit files from outside this project folder.

## Style conventions

- Do not use em dashes or dashes for rhythm in copy. Use an en dash for
  ranges. Double hyphens are fine in code comments. Use curly apostrophes
  in visible copy.
- Keep copy tight and specific -- plain verbs, sentence case, no filler.
  Specific beats clever. Every fact traceable to the resume or master
  doc.
- Follow the anti-slop editing guardrails and protected-content list in
  [`_docs/ai-slop-removal-from-connors-portfolio-site.md`](_docs/ai-slop-removal-from-connors-portfolio-site.md).
