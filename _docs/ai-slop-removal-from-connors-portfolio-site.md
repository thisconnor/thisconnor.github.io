# AI slop removal from Connor’s portfolio site

This document records the editing guardrails applied in the September 2026
anti-slop pass. It draws on the design audit in `nutlope/hallmark` and the
writing guidance in `petergyang/no-ai-slop`.

## Protected content

Do not change these without Connor’s approval:

- The Home hero copy, including its two intentional `--` separators.
- The Projects desert banner: “38 engineers, one collegiate altitude record
  attempt -- and the story told around it.”
- Page entrance, scroll reveals, pinned hero and photo parallax, looping scroll
  hint, multi-effect hovers, and hover lifts.
- The hero photo’s corner brackets.

Keep the site’s personality, motion, and dramatic banner headlines. Fix
hygiene, accuracy, readability, and accessibility.

## Editing guardrails

1. Do not use em dashes or `--` for rhythm in copy. Use an en dash for ranges.
2. Avoid “end to end,” “start to finish,” “top to bottom,” “DNA,” and
   intensifiers such as “a single.”
3. Avoid “Not X. Not Y. Z.” rhythms and rhetorical triads. Factual lists are
   fine.
4. Trace every number to the resume or master document.
5. Use curly apostrophes and quotation marks in visible copy.
6. Do not tone down motion, banner headlines, or hero copy without asking
   Connor.
7. Give every looping or auto-moving media element a visible pause control.
8. Define new colors as `:root` tokens.
9. Add eyebrow labels only when they carry information, never in a column
   beside the heading.
10. Keep project documentation in `_docs/`, never in the repository root.

## Sign-off required

Ask Connor before changing the target-role sentence, resume-derived Experience
bullets beyond punctuation, the IBM Plex Mono design-system usage, banner title
case or length, navigation structure, Home layout, footer concept, hero spacing,
the global spacing scale, accent usage in protected moments, or documentation
architecture.

## Release checks

- Confirm zero console errors and no horizontal overflow at 375, 768, and
  1440px on all four pages.
- Confirm visible `--` appears only in the protected Home hero and Projects
  desert banner.
- Confirm Projects exposes five keyboard-accessible video pause buttons and
  Home exposes one keyboard-accessible logo-scroll pause button.
- Confirm animations run normally and reduced-motion mode is static.
- Confirm every metric still matches the resume and master document.
