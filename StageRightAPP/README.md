# StageRight Deck Drills

Static staging-memory drill app focused on naming cables, fixtures, rigging gear, and audio deck pieces.

## Run

Open [index.html](./index.html) in a browser.

There is no build step and no dependency install.

## What is included

- Duolingo-style lesson flow with lives, streak, XP, progress, and recycled misses.
- Separate lesson lanes for mixed review, cables, lighting, rigging, and audio.
- Expanded question pool with extra staging items beyond the screenshots, including:
  - Feeder
  - Stage pin
  - PowerCON
  - True1
  - EtherCON
  - OpticalCON
  - SpeakON
  - Followspot
  - Box truss
  - Line array cabinet

## Swapping in real photos

Each item in [data.js](./data.js) has a `photo` field.

If you add real images later, point `photo` at a local asset path such as:

```js
photo: "assets/photos/powercon.jpg"
```

When `photo` is blank, the app uses the built-in vector illustration for that gear item.
