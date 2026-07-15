# Image Generation Prompts — Alex Rivera Demo Assets

All prompts target GPT Image. Generate the three **reference images** first, then attach the indicated reference(s) to every subsequent prompt so the same face carries through all 18 assets.

**Character lock (appears in every prompt):** Alex Rivera — 38-year-old white Hispanic man, somewhat racially ambiguous; warm light-olive skin, short dark brown hair neatly styled with a slight natural wave, trimmed dark stubble-free clean shave, brown eyes, friendly confident smile, medium athletic build, ~5'11". Wearing a well-fitted navy suit with a crisp white dress shirt, open collar, **no tie**.

**Global style (appears in every photo prompt):** Realistic documentary campaign photography, natural light, shallow-to-medium depth of field, candid photojournalistic feel, mid-sized North American lakeside city ("Lakeview"), summer. No visible text, logos, or signage with legible words unless specified.

---

## Part A — Reference images (generate first, no reference attached)

### R1 — Front-facing portrait (primary face reference)
> Photorealistic head-and-shoulders studio portrait of Alex Rivera, a 38-year-old white Hispanic man with a somewhat racially ambiguous appearance: warm light-olive skin, short dark brown neatly styled hair with a slight natural wave, clean-shaven, brown eyes, warm confident closed-mouth-to-slight smile. He wears a well-fitted navy suit jacket over a crisp white dress shirt with an open collar and no tie. Facing camera directly, even soft lighting, neutral light-gray background, sharp focus on the face, 85mm portrait lens look. 1024×1024.

### R2 — Three-quarter view, waist-up
> Photorealistic waist-up portrait of the same man as the attached reference — Alex Rivera, 38-year-old white Hispanic man, light-olive skin, short dark brown hair, clean-shaven, navy suit, white shirt open collar, no tie. Body turned 45 degrees to camera left, face in three-quarter view looking slightly past camera, relaxed genuine smile showing teeth, hands loosely clasped in front. Soft natural window light, neutral warm-gray background. 1024×1536 portrait.
> **Attach: R1.**

### R3 — Full-length, profile-leaning angle
> Photorealistic full-length photo of the same man as the attached reference — Alex Rivera, 38-year-old white Hispanic man, navy suit, white open-collar shirt, no tie, brown leather shoes. Standing in a bright neutral studio space, body in near-profile turned to camera right, head turned back toward camera mid-laugh, one hand in trouser pocket. Shows full physique and posture. Natural soft light. 1024×1536 portrait.
> **Attach: R1.**

---

## Part B — Production images (attach references as noted)

### 1. `hero-landscape.jpg` — 1536×1024 (3:2 landscape)
> Wide documentary campaign photo: Alex Rivera (match attached reference — 38-year-old white Hispanic man, navy suit, white open-collar shirt, no tie) standing on a sunlit main-street sidewalk in a mid-sized lakeside city, warmly greeting two residents, shaking one's hand, genuine smile. **Alex and the residents occupy only the left third of the frame.** The right two-thirds is a calm, softly blurred streetscape — brick storefronts, street trees, soft golden-hour light — with no people, signage, or busy detail (this area sits under a form overlay). Photojournalistic, natural light, slight film grain.
> **Attach: R2 (+ R1 if the tool allows two).**

### 2. `hero-portrait.jpg` — 1024×1536 (2:3 portrait)
> Vertical crop of the same scene and lighting as the desktop hero: Alex Rivera (match attached reference, navy suit, white open-collar shirt, no tie) on the same golden-hour main street, greeting a resident. **Alex positioned upper-center-right of frame with generous headroom above him; the bottom 40% of the frame is simple, uncluttered sidewalk and soft shadow** (a dark gradient and headline overlay covers it). Documentary style, natural light.
> **Attach: R2, plus image #1 if the tool supports multiple references (for scene continuity).**

### 3. `candidate-portrait.jpg` — 1024×1536 (crops to 4:5)
> Warm, approachable head-to-waist portrait of Alex Rivera (match attached reference — 38-year-old white Hispanic man, light-olive skin, short dark brown hair, clean-shaven), navy suit, white open-collar shirt, no tie. Centered in frame, arms relaxed, sincere warm smile, direct eye contact. Background: softly blurred leafy neighbourhood street in gentle morning light. Professional campaign portrait, 85mm look, shallow depth of field. Keep head and shoulders in the vertical center-safe area (top and bottom will crop to 4:5).
> **Attach: R1 + R2.**

### 4. `ward-map.png` — 1196×1550 (3:4, displayed uncropped)
> ⚠️ **Do not generate with an image model.** Build in a map/vector tool (Figma, Illustrator, Mapbox, QGIS): stylized municipal map of fictional "Ward 5, Lakeview" — bold ward boundary outline, waterfront along the bottom edge with a waterfront trail, major streets (Maple Street, others unnamed), green park shapes (Riverbend Park, Maple Street Community Garden), school markers, neighbourhood labels: Riverbend, Maple Heights, Old Harbour, Cedar Grove, Waterfront Village. Clean flat cartographic style matching the site's sunrise palette. Image models render map text/geography poorly; alt text promises boundary, streets, parks, and schools, so accuracy matters.
> **No reference needed.**

### Community carousel — all 1024×1536 (2:3 portrait, crops to 3:4)
For every prompt 5–16: **Attach R1 + R2**, and prepend: *"Alex Rivera (match attached reference — 38-year-old white Hispanic man, light-olive skin, short dark brown hair, clean-shaven, navy suit, white open-collar shirt, no tie), candid documentary campaign photo, vertical portrait orientation, subject centered, natural light, photojournalistic."* Keep Alex in the middle 3:4 of the frame (top/bottom crop).

### 5. `community/photo-01.jpg` — Filing nomination papers
> …Alex standing at a counter inside a bright civic-building lobby (Lakeview City Hall), handing a document folder to a clerk across the counter, proud smile, a small group of supporters softly blurred behind him. Marble and glass interior, daylight through tall windows. No legible text.

### 6. `community/photo-02.jpg` — Summer street festival
> …Alex crouching slightly to chat with a young family — parents and two kids — at a lively summer street festival, string lights and colourful booths softly blurred behind, late-afternoon sun, relaxed laughter.

### 7. `community/photo-03.jpg` — Farmers' market
> …Alex speaking with a produce vendor across a market stall piled with tomatoes and greens, gesturing warmly, canvas canopies and morning light, other shoppers blurred in background.

### 8. `community/photo-04.jpg` — Waterfront cleanup
> …Alex with three volunteers along a lakeside waterfront trail during a spring cleanup — suit jacket off is NOT allowed; he wears the same navy suit with sleeves as-is, holding a filled garbage bag, work gloves on, volunteers in casual clothes with grabbers and bags, lake and trail behind, bright overcast light.

### 9. `community/photo-05.jpg` — Food bank
> …Alex behind a serving counter at a community food bank, ladling food onto a tray for a guest, hairnet-free, warm indoor lighting, shelving with canned goods softly blurred behind, genuine engaged expression.

### 10. `community/photo-06.jpg` — Family picnic
> …Alex seated on a picnic blanket at a leafy city park (Riverbend Park) with his partner and two school-age children, picnic basket and food spread out, dappled sunlight through mature trees, relaxed candid laughter. Faces of family natural and consistent but generic.

### 11. `community/photo-07.jpg` — Seniors' centre tour
> …Alex walking slowly through a bright seniors' centre common room beside a staff member, leaning in to listen to a seated elderly resident, gentle warm interior light, plants and armchairs, respectful attentive body language.

### 12. `community/photo-08.jpg` — Small business visit
> …Alex inside a small independent shop (café/bakery feel) on a tree-lined street, chatting across the counter with the owner, espresso machine and pastry case softly blurred, warm afternoon window light. No legible signage.

### 13. `community/photo-09.jpg` — Town hall
> …Alex standing at the front of a community-centre meeting room holding a handheld microphone, mid-answer with an open-handed gesture, rows of seated residents seen from behind in soft focus in the foreground, fluorescent-warm mixed lighting, engaged expression.

### 14. `community/photo-10.jpg` — Youth soccer team
> …Alex kneeling on one knee at the edge of a grass soccer pitch surrounded by a co-ed youth soccer team (~ages 8–10) in matching jerseys, one hand on a soccer ball, kids grinning, goal net and park trees behind, bright weekend morning light. (He is the coach.)

### 15. `community/photo-11.jpg` — Door-knocking
> …Alex on the front steps of a modest two-storey house, mid-conversation with a resident at their open door, holding a clipboard, two volunteers with tote bags on the sidewalk behind him, Saturday-morning light, leafy residential street.

### 16. `community/photo-12.jpg` — Community garden
> …Alex crouched beside a raised garden bed in a community garden, inspecting tomato plants with an older gardener, wooden beds and trellises around them, golden late-day light, hands lightly dusted with soil.

### 17. `endorsers/endorser-01.jpg` — Jordan Okafor — 1024×1024
> Photorealistic head-and-shoulders headshot of Jordan Okafor, a distinguished Black man in his early 60s, short gray-flecked hair, warm authoritative smile, charcoal blazer over light blue shirt, no tie. Subject centered and framed slightly high (displayed in a circle crop from top-center). Simple soft light-gray background, even studio lighting.
> **No Alex reference — different person.**

### 18. `endorsers/endorser-02.jpg` — Maria Castellanos — 1024×1024
> Photorealistic head-and-shoulders headshot of Maria Castellanos, a Latina woman in her late 40s, shoulder-length dark wavy hair, confident friendly smile, burgundy blazer over cream blouse, small gold earrings. Subject centered and framed slightly high (circle crop from top-center). Simple soft warm-neutral background, even studio lighting.
> **No Alex reference — different person.**

### 19. `og-image.png` — 1200×630 (1.91:1)
> Branded social share card: Alex Rivera (match attached reference — navy suit, white open-collar shirt, no tie) on the right third, warm confident three-quarter portrait against a sunrise-toned gradient background (warm orange-to-deep-teal, matching the site's "sunrise" palette). Left two-thirds: clean bold text "ALEX RIVERA" with "for City Council" beneath and "Lakeview · Ward 5 · 2026" smaller below. Generous margins — keep all text and the face well inside the edges (platforms crop). Flat modern political-campaign graphic style.
> **Attach: R2.** *(If the model mangles the typography, generate it without text and add type in Canva/Figma.)*

---

## Workflow notes
- Generate R1 → R2 → R3, pick the best face, and attach R1 (+R2) to everything featuring Alex (#1–3, 5–16, 19).
- Prompts 17–18 must NOT include an Alex reference.
- Prompt 4 (ward map) should be made in a map tool, not generated.
- Config fixes needed in `src/config/candidate.ts`: the bio paragraphs and alt strings use she/her for Alex ("her nomination papers", "the youth soccer team she coaches", "Alex and her partner") — update to he/him to match these images, or the alt text/accessibility strings will contradict the photos.
- Drop finished files in `public/images/` keeping these names (extension changes are fine if you update the config paths).
