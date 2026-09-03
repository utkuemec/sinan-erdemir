# Working on this site

## Always check mobile as well as desktop

Every content or design change must be verified at phone width (≤767px), not
just on desktop. The layout is not simply a reflow — several sections swap in
different markup or art direction below 767px, so a desktop-only change can
silently leave the old version live on phones.

Places where the two widths diverge:

- `.hero` on the home page: `data-hero="split"` stacks the copy panel above the
  photo band on mobile, and the `<picture>` in `src/routes/index.tsx` chooses
  hero sources by media query.
- The overlay hero swaps `imageLandscape` for `imagePortrait` at 767px.
- `src/styles.css` has `@media (max-width: 767px)` blocks scattered through it
  rather than one mobile section; grep for the breakpoint before assuming a
  rule applies everywhere.

When swapping a photo, check that every `<source media=...>` and every
background-image custom property points at the new file, then confirm the
rendered result at both widths.

## Adding a campaign video

Clips are self-hosted in `public/videos/` and listed in `community.videos.items`.
Phone originals arrive at 1080x1920 and 20-160MB, which is far more than the
~300px-wide player needs, so re-encode before committing:

```
ffmpeg -i in.mp4 -vf scale=720:1280 -c:v libx264 -crf 26 -preset slow \
  -profile:v high -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 96k -ac 1 out.mp4
```

Handheld or driving footage defeats CRF and can still land at 60MB; add
`-crf 28 -maxrate 1500k -bufsize 3000k` for those. Grab a poster from a frame
a second or two in and resize it to 600px wide — posters load eagerly even
though the players are `preload="none"`, so eight full-size ones would cost a
megabyte before anyone presses play.

## Content lives in one file

Site copy is in `src/config/candidate.ts`. Prefer editing it over hardcoding
strings in routes.

## After replacing an image

Add or update the entry in `scripts/optimize-images.mjs` and run
`node scripts/optimize-images.mjs` to regenerate the AVIF/WebP/JPEG variants,
which are committed. Renaming the file is the reliable way to bust browser and
CDN caches when a photo is replaced.
