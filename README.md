# 🔍 Scavenger Hunt PWA

A kid-friendly, installable photo scavenger hunt built with **Next.js (App Router)**, **Tailwind CSS**, and the **Google Gemini API**. Players hunt for ~49 real-world items around the house and yard, snap a photo of each, and an AI checks the find and scores it.

## Features

- **Randomized hunt** of all items across four zones: Nature, Around the House, Windows & Porch, and Inside.
- **Camera scanning** via a hidden `<input type="file" capture="environment">` triggered by a custom "Scan Item" button (opens the rear camera on phones).
- **AI verification** through a server route (`app/api/check/route.ts`) using Gemini. It returns `{ match, score, tier, reason }`.
- **Traffic-light scoring:**
  - 🔴 **Red** - not the item, does not count, try again.
  - 🟡 **Yellow** - a match scoring 1-7, counts as a find.
  - 🟢 **Green** - a match scoring 8-10, counts as a find.
- **Progress bar** and a **count-up timer** that starts on "Start the Hunt".
- **Skip and come back** to any item; **finish any time** (you can't go back once you finish).
- **Final recap:** total score, time, items found / total, and a photo gallery of your finds.
- **Bonus items** (⭐) worth extra points, **confetti** on finds, friendly AI feedback, photo thumbnails, and tier-colored badges.
- **Progress is saved** to `localStorage`, so a refresh resumes the hunt.
- **Installable PWA** (`app/manifest.ts`, `standalone` display) - "Add to Home Screen" behaves like a native app on iPhone.

## Getting started

### 1. Set your Gemini API key

Create a `.env.local` file in the project root (copy from `.env.example`):

```bash
GEMINI_API_KEY=your_key_here
```

Get a free key from [Google AI Studio](https://aistudio.google.com/app/apikey). `.env.local` is gitignored.

### 2. Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Testing on a real iPhone

The camera capture and PWA install both require **HTTPS** (except on `localhost`). To try it on a phone:

- **Deploy to Vercel** (easiest): push the repo, import it in Vercel, and add `GEMINI_API_KEY` in the project's Environment Variables. Open the deployment URL on your phone and use Share -> "Add to Home Screen".
- **Or run local HTTPS:** `npx next dev --experimental-https` and open the LAN URL on a device on the same network.

## Environment variables

| Variable         | Required | Description                                            |
| ---------------- | -------- | ------------------------------------------------------ |
| `GEMINI_API_KEY` | Yes      | Your Google Gemini API key (used only on the server).  |
| `GEMINI_MODEL`   | No       | Overrides the model. Defaults to `gemini-2.5-flash`.   |

> **Note:** If this model is ever retired, set `GEMINI_MODEL` to a current flash model (e.g. `gemini-2.0-flash` or `gemini-flash-latest`). The model name is read only in `app/api/check/route.ts`.

## Project structure

```
app/
  api/check/route.ts   # Gemini image verification endpoint
  layout.tsx           # Metadata + viewport (iOS standalone)
  manifest.ts          # PWA manifest (standalone)
  page.tsx             # Game state machine (start / playing / finished)
  icon.png             # Browser + PWA icon
  apple-icon.png       # iOS home screen icon
  globals.css          # Kids theme + animations
components/             # UI: StartScreen, ItemCard, ScanButton, HuntBoard, ResultToast, Timer, ProgressBar, FinishScreen
lib/
  items.ts             # The item list + categories
  game.ts              # Scoring, tiers, hunt state helpers
  storage.ts           # localStorage persistence
  image.ts             # Camera image -> data URL + downscaling
  confetti.ts          # Celebration effect
public/                # Manifest icons (192 / 512)
```

## How scoring works

- The AI returns whether the photo matches the target item and a 0-10 quality score.
- Non-matches are **red** (retry). Matches are **yellow** (1-7) or **green** (8-10) and count as found.
- Your final score is the sum of your best score per found item, plus **+5** for each bonus item found.
