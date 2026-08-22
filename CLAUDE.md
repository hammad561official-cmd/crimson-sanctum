# Crimson Sanctum — Claude Code Handoff

## Project
Crimson Sanctum is a cinematic, interactive portfolio for Mohammad Hammad Sadiq. It is not intended to exaggerate achievements or invent projects. The visual craft should elevate truthful content.

## Current stack
- React + TypeScript + Vite
- Tailwind CSS
- Framer Motion
- Three.js / React Three Fiber for selected future scenes only
- Howler audio layer
- React Router
- React Helmet Async

## Design identity
- Dark Fantasy first
- Luxury Minimalism second
- Iron Man HUD third
- Obsidian / charcoal / deep crimson / ruby / soft white
- Typography: Cinzel, Inter, JetBrains Mono

## Core rules
1. Mobile-first. The project is tested on Android before desktop.
2. Adaptive Premium: preserve the same emotional experience while reducing computational cost on smaller devices.
3. Performance before visual excess.
4. Accessibility is built in from the beginning.
5. No autoplay audio.
6. Never invent or exaggerate achievements, experience, or projects.
7. Keep content in structured data where practical.
8. Use Three.js/R3F only for signature scenes that benefit from it.
9. Every animation must have a reason.
10. Do not redesign the project's identity without explicit approval.

## Current milestone
- Foundation: approved
- LoadingScreen: approved architecture
- AudioToggle: extracted and reusable
- IntroAnimation: approved architecture and SVG-first implementation
- Hero: orchestration layer approved
- FirstChamber cinematic presentation: next implementation task

## Hero direction
The visitor enters a vast chamber. The environment is initially dark. A single crimson beam illuminates the center. Crimson light writes the owner's name stroke by stroke. The glow cools into an engraved monument. The subtitle appears only after the chamber completes. Navigation awakens afterward. Visitors get a brief pause before the scroll cue appears.

## Workflow
Build one component at a time. Explain architecture first for major sections. Review before moving on. Do not generate unrelated sections while a milestone is under review.
