# RTYT — Ryan Tan's Portfolio

> A Neovim-inspired, three-layer portfolio site — built with Astro, React, and TypeScript — deployed at **[ryantyt.github.io/RTYT](https://ryantyt.github.io/RTYT/)**.

---

## Overview

This is the third full redesign of my personal portfolio, and the first one I'm actually proud of. The UX takes you through three distinct layers:

1. **Landing** — a dark, information-dense page with skills, projects, experience, a courses heatmap, journal hover popups, and a chatbot widget.
2. **Boot sequence** — a simulated `nvim` startup log (RyanOS kernel, plugin loading, the works) that transitions into the IDE.
3. **IDE** — a fully interactive Neovim-lookalike with a file tree, editor pane, embedded terminal, statusline, and real Vim keybindings for navigation.

A separate **Timeline** view offers a scroll-animated academic and career history.

The entire content layer is data-driven — experience, projects, journal entries, and courses are read from `content/` at build time and surfaced as navigable "files" inside the IDE.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Astro 6](https://astro.build) with `@astrojs/react` |
| UI | React 19, TypeScript 6 |
| Styling | Vanilla CSS — Rose Pine palette, JetBrains Mono |
| Data | JSON, Markdown (with [Shiki](https://shiki.style) / Rose Pine theme), CSV via PapaParse |
| Deployment | GitHub Actions → GitHub Pages |

No UI component library. Everything is hand-rolled.

---

## Site Architecture

```
ryantyt.github.io/RTYT/
│
├── /                   ← Landing page (LandingReact)
│   ├── Boot sequence   ← BootSequence (transitions to IDE on complete)
│   └── IDE             ← Full Neovim-inspired editor
│
├── /timeline           ← Scroll-animated career & academic timeline
└── /journal/[slug]     ← Individual journal entry pages
```

### Layer 1 — Landing

A single-page scroll covering:

- **Hero** — name, tagline, skills tags, tech stack breakdown by layer (Systems / Research / Storage / AI)
- **Projects** — card grid for the three main projects, each with tag badges
- **Experience** — role cards for Binance and SAP ATAP internships, plus NUS education
- **Courses heatmap** — GitHub-contribution-style grid of all 50+ NUS modules, colour-coded by grade, with a detail panel on hover; filterable by category (CS / Finance / Analytics / Math / Business)
- **Journal** — a list of blog entries with hover popups showing a preview before clicking through
- **Chat widget** — a sequential-response assistant with options for a quick rundown, contact info, resume link, and a mock "chatbot" gag
- **Contact** — email, GitHub, phone, resume PDF link, and a Google Form for notes/feedback

### Layer 2 — Boot Sequence

A simulated Neovim startup log — `nvim v0.10.2`, Rose Pine colorscheme, Treesitter parsers, LSP servers, Mason tools, Telescope, nvim-tree, lualine — rendered with random per-task delays for authenticity. A progress bar fills to 100% before transitioning to the IDE.

### Layer 3 — IDE

A faithful Neovim aesthetic:

- **TopBar** — buffer tab showing the active filename
- **Tree** — `nvim-tree`-style file explorer, built dynamically from `content/`; supports toggling hidden files
- **Editor** — main content pane rendering Markdown (with Shiki syntax highlighting) and structured data pages (courses tables, contact, resume embed)
- **Terminal** — an embedded terminal emulator with real command support and easter eggs
- **StatusLine** — mode indicator (`NORMAL` / `INSERT`), current file, cursor position
- **CommandLine** — Vim ex-command input (`:`, `/` prefix)

#### Vim Keybindings

| Key | Action |
|---|---|
| `j` / `↓` | Navigate down in tree or editor |
| `k` / `↑` | Navigate up |
| `gg` | Jump to top |
| `G` | Jump to bottom |
| `Enter` / `l` | Open file / expand directory |
| `h` | Collapse directory or go back |
| `zh` | Toggle hidden files (`.journal/`, `.vimrc`) |
| `Ctrl+w Ctrl+w` | Toggle focus between tree and editor panes |
| `:q` | Quit IDE → return to landing |
| `:e <file>` | Open file by name |
| `:tabnew <file>` | Same as `:e` |
| `:set hls` | Highlight — easter egg |
| `/` | Search (command-line mode) |


#### Terminal Commands

The embedded terminal supports a subset of shell commands (`ls`, `cd`, `cat`, `open`, `clear`) routed against the live content tree:

```
neofetch        → RyanOS ASCII art with Rose Pine theme stats
vim             → "you're already in vim."
emacs           → "command not found: emacs"
sudo rm -rf /   → "Permission denied. nice try."
pwd             → /home/ryan/portfolio
exit            → ":q to escape."
```

---

## Content Model

All content lives in `content/` and is consumed at build time via Astro and at runtime via React props:

```
content/
├── personal_info.json       ← Name, tagline, tech stack, status
├── contact.json             ← Email, GitHub, phone, resume URL
├── short_projects.json      ← Project cards for the landing section
├── short_experience.json    ← Experience cards for the landing section
├── chatbot_content.json     ← Chat widget responses
├── courses.csv              ← All 50+ NUS modules (code, title, grade, category, review)
│
├── experience/
│   ├── binance-qa.md        ← QA Engineer, Binance Accelerator Programme
│   └── sap-atap.md          ← AI Developer Intern, SAP Asia ATAP
│
├── projects/
│   ├── autotrader.md        ← rusty_trader (Rust / IBKR trading system)
│   ├── llm-pipeline.md      ← LLM Research Pipeline (Python / multi-stage KB)
│   ├── orbital.md           ← ClassMate (NUS Orbital, Next.js / z3-solver)
│   └── trading-bot.md       ← Earlier Python trading bot
│
└── journal/
    ├── personal_website_v3.md
    ├── why_this_blog.md
    ├── orbital.md
    ├── hackathons.md
    ├── neovim.md
    ├── an_orthodox_keyboard.md
    ├── a_trusty_language.md
    ├── summer_trading_bot.md
    ├── summer_trading_bot_2.md
    ├── summer_trading_bot_3.md
    ├── y2_summer.md
    └── why_bza.md
```

---

## Source Structure

```
src/
├── components/
│   ├── boot/
│   │   ├── BootSequence.tsx      ← Animated startup log + progress bar
│   │   └── VimWarning.tsx        ← "Swap file detected" gag on revisit
│   ├── ide/
│   │   ├── IDE.tsx               ← Desktop IDE orchestrator
│   │   ├── IDE_mobile.tsx        ← Mobile IDE variant
│   │   ├── Editor.tsx            ← Content pane (Markdown + structured pages)
│   │   ├── Tree.tsx              ← nvim-tree file explorer
│   │   ├── Terminal.tsx          ← Embedded terminal UI
│   │   ├── StatusLine.tsx        ← Mode + cursor statusline
│   │   ├── CommandLine.tsx       ← Ex-command / search input
│   │   └── TopBar.tsx            ← Buffer tab bar
│   ├── landing/
│   │   ├── LandingReact.tsx      ← Desktop landing page
│   │   ├── LandingReact_mobile.tsx
│   │   ├── CoursesHeatmap.tsx    ← Desktop courses grid
│   │   ├── CoursesHeatmap_mobile.tsx
│   │   ├── JournalPopup.tsx      ← Hover preview for journal entries
│   │   └── ChatWidget.tsx        ← Portfolio chatbot widget
│   ├── timeline/
│   │   ├── TimelineScroll.tsx    ← Desktop scroll-animated timeline
│   │   └── TimelineScroll_mobile.tsx
│   ├── LandingApp.tsx            ← Root: landing + boot + IDE layer switcher
│   ├── TerminalApp.tsx           ← Standalone terminal page
│   └── TimelineApp.tsx           ← Timeline page root
│
├── lib/
│   ├── boot-tasks.ts             ← Boot log messages + timing config
│   ├── commands.ts               ← Terminal command parser + easter eggs
│   ├── content.ts                ← Markdown/frontmatter parser for content entries
│   ├── courses.ts                ← CSV parser + course review builder
│   ├── journal.ts                ← Journal entry helpers
│   ├── keybindings.ts            ← Vim keymap → Action dispatcher
│   ├── markdown.ts               ← Markdown → HTML renderer
│   ├── pages.ts                  ← Page content builder (IDE editor panes)
│   ├── state.ts                  ← Mode type (normal | insert | command)
│   └── tree-data.ts              ← nvim-tree structure builder
│
├── hooks/
│   ├── useKeybindings.ts         ← Global keydown → action handler
│   ├── usePaneFocus.ts           ← Tree ↔ editor focus toggle
│   ├── useTerminal.ts            ← Terminal history + input state
│   └── useIsMobile.ts            ← Breakpoint detection
│
├── pages/
│   ├── index.astro               ← Main entry (landing / boot / IDE)
│   ├── terminal.astro            ← Standalone terminal page
│   ├── timeline.astro            ← Timeline page
│   └── journal/[slug].astro      ← Dynamic journal entry pages
│
├── layouts/
│   └── Base.astro                ← HTML shell, font imports, meta
│
└── styles/
    ├── theme.css                 ← Rose Pine tokens + global reset
    ├── ide.css / mobile-ide.css
    ├── landing.css / mobile-landing.css
    ├── boot.css
    ├── courses.css / mobile-courses.css
    ├── timeline.css / mobile-timeline.css
    └── editor-content.css        ← Rendered Markdown styles
```

---

## Design System

The entire site is built on a two-tier CSS custom property system defined in `theme.css`:

- **Tier 1 — Primitives**: `--s-{N}` spacing (e.g. `--s-10 = 0.5rem`) and `--text-{N}` type scale
- **Tier 2 — Semantic**: component-scoped tokens (e.g. `--ide-tree-w`, `--hm-cell-w`, `--tl-dot-size`)

**Palette** — Rose Pine (full):

| Token | Hex | Usage |
|---|---|---|
| `--b` | `#191724` | Background (base) |
| `--s` | `#1f1d2e` | Surface |
| `--o` | `#26233a` | Overlay |
| `--su` | `#e0def4` | Text |
| `--mu` | `#908caa` | Muted text |
| `--love` | `#eb6f92` | Errors, warnings |
| `--gold` | `#f6c177` | Warnings, highlights |
| `--iris` | `#c4a7e7` | Selection, accents |
| `--pine` | `#31748f` | Links |
| `--foam` | `#9ccfd8` | Info |
| `--rose` | `#ebbcba` | Subtle accents |

**Font** — JetBrains Mono (monospace throughout).

**Responsive breakpoint** — `768px`: `font-size` drops from `20px` to `16px` root, triggering the full mobile layout swap.

---

## Getting Started

**Prerequisites** — Node.js 22+, npm.

```bash
git clone https://github.com/RyanTYT/RTYT.git
cd RTYT
npm install
npm run dev        # http://localhost:4321/RTYT/
```

```bash
npm run build      # Output to dist/
npm run preview    # Preview the production build locally
```

---

## Deployment

Pushes to `main` automatically trigger the GitHub Actions workflow (`.github/workflows/astro.yml`), which:

1. Detects the package manager (npm)
2. Installs dependencies
3. Builds with `astro build` against the `github-pages` environment
4. Deploys the `dist/` output to GitHub Pages

Live at: **[ryantyt.github.io/RTYT](https://ryantyt.github.io/RTYT/)**

---
