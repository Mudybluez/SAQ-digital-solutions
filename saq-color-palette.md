---
type: reference
title: "SAQ Creative Agency — Color Palette"
created: 2026-06-02
updated: 2026-06-02
tags: [design, brand, colors, reference]
status: active
---

# SAQ Creative Agency — Color Palette

Saka-inspired palette. Precision-built. All colors used across SAQ products and communications.

Interactive version: `saq-color-palette.html` (click hex to copy).

---

## Dark Theme — Backgrounds

| Name | Variable | Hex | Usage |
|------|----------|-----|-------|
| Steppe Night | `--bg` | `#0C0E15` | Page background |
| Obsidian | `--bg2` | `#131620` | Sidebar, cards |
| Elevated | `--bg3` | `#1A1E2C` | Elevated surfaces |
| Hover | `--bg4` | `#222739` | Hover states |
| Border | `--bg5` | `#2E3449` | Subtle borders |

---

## Dark Theme — Gold (Сак)

The primary brand signal. Drawn from Kazakh steppe heritage — gold as precision, craft, and value.

| Name | Variable | Hex | Usage |
|------|----------|-----|-------|
| Saka Gold | `--gold` | `#C4862A` | Primary accent, CTAs |
| Bright Gold | `--gold2` | `#E0A840` | Highlights, hover on gold |
| Sand Cream | `--cream` | `#D4C090` | Secondary accent, dividers |

---

## Dark Theme — Precision Blue (Strategic)

Carries the "strategic / precise" meaning. Used for links, web dev contexts, and information states.

| Name | Variable | Hex | Usage |
|------|----------|-----|-------|
| Strategy Blue | `--blue` | `#4B7AC4` | Links, Web Dev badge |
| Sky Steel | `--blue2` | `#6B94D8` | Lighter blue accents |
| Nomad Violet | `--violet` | `#8B5FC4` | SMM badge |

---

## Dark Theme — Typography

| Name | Variable | Hex | Usage |
|------|----------|-----|-------|
| Parchment | `--text` | `#EDE0C4` | Headings, body text |
| Steppe Sand | `--text2` | `#A08860` | Subtitles, labels |
| Earth Dim | `--text3` | `#5A4A30` | Timestamps, hints, placeholders |

---

## Light Theme — Backgrounds

| Name | Variable | Hex | Usage |
|------|----------|-----|-------|
| Parchment | `--bg` | `#F4EDD8` | Page background |
| Sand Surface | `--bg2` | `#EBE1C4` | Sidebar, cards |
| Elevated | `--bg3` | `#E0D3B0` | Elevated surfaces |
| Hover | `--bg4` | `#CFBE98` | Hover states |
| Border | `--bg5` | `#B8A878` | Subtle borders |

---

## Light Theme — Accents & Typography

| Name | Variable | Hex | Usage |
|------|----------|-----|-------|
| Dark Gold | `--gold` | `#8A5810` | Primary accent |
| Amber Gold | `--gold2` | `#AA7020` | Lighter accent |
| Deep Blue | `--blue` | `#2E5298` | Links, web dev |
| Primary Text | `--text` | `#1A140A` | Headings, body |
| Muted Text | `--text2` | `#7A5C28` | Subtitles, labels |
| Dim Text | `--text3` | `#A08050` | Timestamps, hints |

---

## Service Badges

One color per SAQ service line. Used in tags, labels, and category markers.

| Service | Class | Hex | Notes |
|---------|-------|-----|-------|
| SAQ Agency | `.badge-agency` | `#C4862A` | Saka gold — the parent brand |
| saq_tutoring | `.badge-tutoring` | `#D4A040` | Bright amber — warm, accessible |
| Web Dev | `.badge-webdev` | `#4B7AC4` | Strategy blue — precision, build |
| SMM | `.badge-smm` | `#8B5FC4` | Nomad violet — creative, social |
| Active / Success | `.badge-active` | `#48B482` | Confirmed, live, on-track |

Badge pattern (dark theme):
```css
background: rgba(196, 134, 42, 0.15);
color: #C4862A;
border: 1px solid rgba(196, 134, 42, 0.3);
border-radius: 10px;
padding: 3px 8px;
```

---

## Brand Gradients

Used for hero sections, avatar placeholders, and decorative elements.

| Name | From | To | Direction | Usage |
|------|------|----|-----------|-------|
| Saka Gold | `#C4862A` | `#E0A840` | 135° | Primary brand gradient |
| Night Sky | `#1A2A5E` | `#4B7AC4` | 135° | Web Dev, precision contexts |
| Warrior | `#8B1A1A` | `#C4862A` | 135° | Aggressive CTAs, hero |
| Horizon | `#4B7AC4` | `#8B5FC4` | 135° | Mixed services, digital |
| Dusk | `#2A1A5E` | `#8B5FC4` | 135° | SMM, creative contexts |
| Dawn | `#C4862A` | `#D4C090` | 135° | Light, warm variant |

CSS pattern:
```css
background: linear-gradient(135deg, #C4862A, #E0A840);
```

---

## System / UI Colors

| Name | Hex | Usage |
|------|-----|-------|
| Danger | `#C84040` | Error, delete, remove, ban |
| Warning | `#D4892A` | Attention needed, caution |
| Success | `#48B482` | Done, confirmed, active, ok |
| Info | `#4B7AC4` | Informational, neutral state |

---

## CSS Custom Properties (full set)

```css
:root {
  /* Dark Backgrounds */
  --bg:   #0C0E15;
  --bg2:  #131620;
  --bg3:  #1A1E2C;
  --bg4:  #222739;
  --bg5:  #2E3449;

  /* Gold */
  --gold:  #C4862A;
  --gold2: #E0A840;
  --cream: #D4C090;

  /* Blue / Violet */
  --blue:   #4B7AC4;
  --blue2:  #6B94D8;
  --violet: #8B5FC4;

  /* Typography */
  --text:  #EDE0C4;
  --text2: #A08860;
  --text3: #5A4A30;

  /* System */
  --danger:  #C84040;
  --warning: #D4892A;
  --success: #48B482;
  --info:    #4B7AC4;
}
```

---

## Tailwind Extension

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        saq: {
          bg:      '#0C0E15',
          bg2:     '#131620',
          bg3:     '#1A1E2C',
          bg4:     '#222739',
          bg5:     '#2E3449',
          gold:    '#C4862A',
          gold2:   '#E0A840',
          cream:   '#D4C090',
          blue:    '#4B7AC4',
          blue2:   '#6B94D8',
          violet:  '#8B5FC4',
          text:    '#EDE0C4',
          text2:   '#A08860',
          text3:   '#5A4A30',
          danger:  '#C84040',
          warning: '#D4892A',
          success: '#48B482',
        },
      },
    },
  },
}
```

---

## Design Principles

- **Gold is primary.** It is the Saka signal. Use it for the one thing that matters most on a given surface.
- **Blue is precision.** Reserve for strategic/technical contexts: web dev, links, data.
- **Violet is creative.** SMM, social, content production.
- **Never use pure black or pure white.** Backgrounds are cold charcoal. Light backgrounds are warm parchment.
- **Text follows warmth.** All text tones are warm (parchment / sand / earth), never cold grey.
- **Gradients go left-to-right or 135°.** Never random directions.
