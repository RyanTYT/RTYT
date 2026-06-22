---
title: "Orbital (CP2106)"
tags: [react, nodejs]
slug: orbital
date: 2023-06-01
filename: orbital.md
---

# ClassMate

> A collaborative timetable planner for NUS freshmen — generate constraint-satisfying schedules across friend groups with a single click.

**GitHub** · [RyanTYT/ClassMate](https://github.com/RyanTYT/ClassMate) &nbsp;|&nbsp;
**Stack** · Next.js · TypeScript · PostgreSQL · Node.js · Sequelize · z3-solver · Jest

---

## The Problem

Coordinating tutorial slots with friends across multiple modules is a surprisingly painful ritual every NUS freshman goes through — endless WhatsApp polls, back-and-forth Google Sheets, and someone always ending up with a 9am they didn't want.

ClassMate automates this. Users form friend groups tied to module codes, declare personal constraints (no classes before 10am, at least a 1-hour lunch window, etc.), and the app generates a batch of valid timetables — one per person in the group — that satisfy both individual and shared constraints simultaneously.

---

## Architecture
Frontend (Next.js + React, Vercel)
└── Auth middleware (JWT)
└── Pages: Home (groups/friends), Timetable, Settings
└── Custom UI — no component library, everything hand-rolled

Backend (Node.js + TypeScript, GCP)
└── REST API with route + middleware layers
└── Sequelize ORM → Supabase (PostgreSQL)
└── z3-solver: constraint satisfaction engine for timetable generation

Database schema
Users ──< User_Modules ──< Lessons
Users ──< Users_Groups ──< Groups
Groups ──< GroupRequests

The core logic lives on the backend: z3-solver receives encoded slot constraints for each
group member and returns feasible timetable combinations, which are then served to and
rendered on the frontend as a visual weekly grid.

---

## Key Features

- **Group timetable generation** — solves across all members simultaneously; shared constraints (same tutorial slot for everyone) are first-class
- **Personal constraints** — configurable start time floor, mandatory lunch gaps, and custom blackout windows
- **Dark / light mode** — full theme toggle with persistent preference
- **Semester navigation** — AY/semester switcher across the top bar
- **JWT-gated pages** — all routes protected; session handled via token middleware
- **Regression + integration tests** — Jest test suite covering key frontend interactions and backend API calls

---

## Tech Stack

| Layer       | Technology                                      |
|-------------|------------------------------------------------|
| Frontend    | Next.js 13, React, TypeScript, CSS (hand-rolled)|
| Backend     | Node.js, TypeScript, Sequelize ORM              |
| Database    | PostgreSQL via Supabase                         |
| Solver      | z3-solver (constraint satisfaction)             |
| Auth        | JWT tokens                                      |
| Testing     | Jest (unit + integration)                       |
| Deployment  | Vercel (frontend), GCP (backend)                |

---

## What I Learned

This was my first substantial full-stack project — built in Y1 summer without the LLM tooling I rely on today, which meant a lot of sitting in docs and debugging by instinct.

A few things that stuck:

- **React state management is non-trivial at scale.** Getting `useEffect` dependencies, component re-render timing, and prop drilling right across a multi-page app took real iteration.
- **Backend is easier than frontend** (for me, at least). The Node/Sequelize layer was miles more predictable than coordinating UI state.
- **Build your own components once.** Every animation — including the expanding side nav — was hand-coded from scratch. Tedious at the time; good instinct for understanding what component libraries are actually doing under the hood.
- **Deployment cost surprises you.** Accidentally spent ~$70 on AWS RDS before migrating to Supabase's free tier. Lesson learned early.
