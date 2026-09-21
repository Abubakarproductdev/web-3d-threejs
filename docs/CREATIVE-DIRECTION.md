# The Maker's Room

## 1. Reference Experience Specification

Research: the published Santioni page, its Awwwards listing, and the illustrated experience analysis at https://www.utsubo.com/blog/immersive-storytelling-websites-guide. No interactive browser is available in this environment. Loading cadence, exact camera paths, FPS, touch behavior, and audio were not personally observed and are not claimed as verified.

The independently documented reference uses a viewport-sized ink-illustrated comic, physical frames, layered WebGL composition, sparse narration, direct object manipulation, and deliberate hold-to-advance moments. Sound supports the visitor's action. Product information is withheld until the narrative has established a world. Its defining principle is participation, not a collection of section entrances. Some descriptions characterize it as scroll-linked, while the detailed analysis identifies hold-to-advance. This implementation follows the client's explicit native-scroll requirement rather than assuming those descriptions are interchangeable.

Original work only: no reference JavaScript, proprietary assets, fonts, artwork, characters, text, scene designs, or branding are used.

## 2. Creative Concept

The Maker's Room is an architectural sketch that becomes a place. A small workspace stands on the pages of a notebook. An orange sphere is the first spark of an idea. A doorway represents a question; a workbench represents the work of answering it. The visitor can set the spark in motion, then scroll through the drawing as it unfolds into a new page.

Palette: paper #f6f5ef, orange #f15a24, ink #242520, and solid stone shades. All surfaces and materials are opaque. No gradients, glass, neon, particles, or photographic effects. Near silence at entry. The initial loading curtain is ink, opening to the white-and-orange world in response to real resource readiness.

## 3. Story Outline

Full experience: a name, a room, a question, the discovery of a craft, then the work itself — Fast Send, SIVO, BoostWork — followed by experience, skills, and a quiet invitation. The person is the subject; the room and its neighboring islands are metaphors, not factual claims about physical places. First-person creative copy describes building useful things without adding biographical claims. Project URLs are absent from the supplied facts and are not invented.

## 4. Chapter Map

00: Preparing the room. Real font, illustration, and renderer readiness.
01: The beginning. Muhammad Abubakar, Software Engineer. Discover the orange spark.
02: A thought takes shape. Question, exploration, purpose — three physical panels.
03: A maker in the making. Useful systems plus software engineering education.
04: Fast Send. QR gate, scattered photos converging to their people.
05: SIVO. Hand landmarks, motion trail, signs becoming speech.
06: BoostWork. Blank document, word strips, bars becoming recommendations.
07: Where I have worked. Ezitech 2025, Arzens 2026, Upwork 2024–present.
08: What I know. Backend, database, cloud, AI, frontend, security, certifications.
09: Where I am going. Quiet orange clearing, name, and a start-a-conversation invitation.

All nine scenes are navigable from the index. No dead buttons or invented links.

## 5. Visual Storyboard / Scene Map

All coordinates are world units. The camera looks at a separately controlled target. Scroll parameters are authored on one GSAP timeline, not set through React state on each frame.

### 00 / Preparing the room

Start: camera offset (10, 8, 13), target (-3, 1.1, 1.9); room assembled below its resting height. Ink loading plane, small orange doorway. No audio. No pointer manipulation.
Middle: real loaded tasks update a resource counter. Typeface and illustration are decoded; the WebGL program is prepared. The loading plane stays opaque.
End: three opaque curtains withdraw upward. The room settles into place and the two lines of Muhammad's name slide out of their typographic masks. No fake percentage timer.

### 01 / The beginning / normalized timeline 0.00-0.30

Start: camera offset (10, 8, 13), target (-3, 1.1, 1.9); notebook at origin, rear wall at z=-2.1, desk at (-1.5, 1.1, 0.4), orange spark at (1.45, 3.1, -1.6). Page-colored background. Ivory planar materials, black contours, directional cel-shaded orange. Name and profession visible in HTML. Optional low sine ambience only after a gesture.
Middle: text holds for reading. Pointer displaces camera target by at most 0.14 world units. Touch/click on spark opens the doorway, lifts drawings, and triggers a quiet note if sound is enabled. Touch/click again reverses it. The keyboard has an equivalent action.
End: camera dollies toward offset (7.2, 5.8, 9.4) and target (-0.3, 1.4, 0.3). Name moves through its upper mask. Walls begin hinging apart and papers lift. Audio rises slightly, never with scroll-speed-dependent loudness.

### Transition / A thought takes shape / 0.30-0.66

Start: three opaque, ink-edged narrative panels rise from below the viewport at rotations -8, 4, and 9 degrees. Camera stops translating while their copy is read. The room is still visible between panels.
Middle: the panels independently tilt in perspective. The first carries a question, the second the original room illustration, the third an orange declaration of purpose. All three movements are reversible. No independent fade-in observers.
End: the first two pages move laterally out of view. The orange third page rotates flat, centers, and grows to cover the viewport. At full coverage the world changes its background to solid orange; the panel then withdraws to reveal the same transformed world. Camera returns to offset (10.5, 7.5, 12.5), target (-3.0, 1.25, 1.9), room rotation -0.15 radians. A muted paper-like synthesized cue marks this transition only when enabled.

### 02 / A maker in the making / 0.66-1.00

Start: large ivory type on orange, a more open room, floating sketches returning to their places. Small narration and reading controls remain ink for contrast. Camera movement decelerates before reading.
Middle: title and short purpose statement hold. Education is progressively revealed below the statement, using only the provided degree, institution, and dates. Ambient pitch settles to a resolving interval. Narration metadata exists, but no narration is fabricated.
End: camera rests. An email invitation and restart action remain. Native reverse scroll rewinds every scene. Contact overlay offers the supplied email, phone, and portfolio handle, not an invented URL.

## 6. Interaction Map

- Native scroll: master timeline, natural browser momentum, no wheel interception.
- Pointer position: small camera/room parallax, disabled on reduced motion and coarse-pointer devices.
- Orange sphere: open/close the sketch; companion keyboard action provided.
- Doorway: move into the next narrative beat; no navigation away.
- Index: accessible modal with implemented chapter jumps, contact, illustration mode, and reduced motion.
- Sound: explicit on/off, remembered locally; audio context requires a gesture.
- Contact: real mailto, tel, and copy-email actions with visible feedback.

## 7. Audio Map

Opening: silence by default, optionally a restrained synthesized drone.
Object: brief pitched pluck, volume-limited.
Transition: quiet filtered two-note gesture.
Scene two: resolving lower interval. No constant UI-hover noises.
Each chapter contains chapterNarration, duration, startTime, endTime, and an optional narrationSrc. No voice track is included in this milestone. The audio director supports a supplied track later.

## 8. Technical Architecture

Vite + React + TypeScript are retained as required by the supplied project environment, rather than replacing its entry point with Next.js. React Three Fiber/Three.js implement actual procedural 3D; GSAP/ScrollTrigger implement the pinned master timeline. Semantic HTML handles reading, navigation, and contact. Components are separated into experience, narrative, three, navigation, and audio modules. Mutable animation state connects GSAP and useFrame without per-frame React renders.

## 9. Asset Requirements

- Original generated architectural illustration, used for the narrative page and WebGL fallback.
- Procedural real 3D notebook, cut-out arch, opening doorway, worktable, laptop, orange sphere, papers, steps, and plant.
- Locally bundled Barlow Condensed, DM Sans, and IBM Plex Mono fonts.
- Procedural opaque hatch and cel-shading textures; no remote model dependencies.
- Synthesized, user-initiated ambience and cues; no external audio downloads.
- Original SVG favicon and social artwork.

## 10. Performance and Verification Plan

Lazy-load the WebGL world. Cap DPR to 1.5 desktop and 1.25 mobile; degrade to 1 on sustained slow frames. Reuse geometry/materials where useful. No postprocessing, large textures, realtime shadow maps, or particles. Pause continuous rendering when the document is hidden or a modal is open; use demand rendering for reduced motion. Dispose manually allocated resources and tear down GSAP, event listeners, audio, and pointer effects.

Mobile uses a centered room below a smaller title, a wider camera, single-file comic composition, and tap equivalents. Reduced motion has a complete ordinary-flow reading version. WebGL errors/context loss produce the original illustration with all HTML intact. A visible illustration-mode control enables manual fallback checks.

Automated verification available here: production build and source review. Real-browser screenshots, interactive reference inspection, actual hardware FPS, audio audition, and device testing are unavailable; do not present them as completed. Deployment domain is unspecified, so sitemap.xml intentionally contains no fabricated canonical URL.