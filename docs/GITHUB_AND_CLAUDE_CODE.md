# GitHub + Claude Code Handoff

## Repository root
Upload the **contents of this project root** to the root of a GitHub repository. Do not create a second nested `crimson-sanctum/crimson-sanctum` folder inside the repository.

## Recommended repository
Use a repository named `crimson-sanctum`.

## Local setup

```bash
npm install
npm run dev
```

## Validation

```bash
npm run typecheck
npm run lint
npm run build
```

## Claude Code workflow

1. Open the GitHub repository in the Claude Code environment you are using.
2. Let Claude inspect `CLAUDE.md` before making changes.
3. Work one milestone/component at a time.
4. Commit approved changes with a short message.
5. Keep unfinished experiments out of the main branch unless explicitly approved.

## Current implementation handoff
The current code contains the approved foundation, LoadingScreen, AudioToggle, IntroAnimation, and Hero orchestration layer. The next component to implement is the Hero cinematic presentation (`FirstChamber` / `HeroChamber`).

## Mobile-first testing
Test the first playable versions on Android before adding desktop-only visual enhancements. Keep the same emotional experience across devices while reducing computational cost on smaller hardware.
