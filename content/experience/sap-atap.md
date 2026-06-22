---
title: "SAP Asia — AI Developer Intern (ATAP)"
duration: "Jun–Dec 2024 (6 months, NUS ATAP)"
tags: [sapui5, llms, sap-cap, odata, figma]
slug: sap
date: 2024-06-01
filename: sap_atap.md
---

## Overview

Six months on SAP's HR Information Technology team, building internal-facing web apps that bring LLMs into enterprise HR workflows. Mostly frontend work in SAPUI5, with backend integration via SAP CAP and Python Flask for the AI pieces. Two main projects: **Skills Tagging** and **HR GenAI**.

## Skills Tagging

Users upload spreadsheets of course titles and descriptions; an LLM-backed Flask service suggests skills (with proficiency levels) for each course, which users then validate or override manually.

The project was already half-built when I joined — UI mostly done, but running entirely on local JSON models with no real persistence. My job was migrating it onto live oData models wired into the CAP backend:

- Rebuilt the frontend's data layer to support full CRUD against real entities
- Hit a wall with oData **v4** — nightly documentation was thin, and updates (CREATE/UPDATE calls) kept breaking. Eventually proxied the CAP service to expose **oData v2** instead, which had far better docs and made CRUD straightforward
- Added search, sorting, and course-adding functionality
- Later deployed the app to Cloud Foundry and wrote workflow docs
- Migrated the AI layer from `ai-core` to the newer `gen-ai` service, mapping JSON request/response shapes across six model variations

## HR GenAI

A governance layer for LLM usage across the org — think approval workflows for deployed models, plus prompt management for end users.

- Built three admin-facing CRUD tables backed by CAP entities (one needed a backend key fix before CRUD would behave)
- Built a fourth table for managing user prompts, with search and deletion
- Implemented lazy loading to cut unnecessary oData calls on initial page load — tricky where two pages shared a data model, since naive lazy loading caused unwanted refreshes between them; that page stayed shelved
- Paired with a colleague to build a **Custom Control** that highlights biased sentences in LLM chat responses, with a hover Popover showing details — had to get indexing of flagged spans exactly right and fix some issues with XSS due to dangerously set HTML
- Refactored a large, unwieldy file into modular components for maintainability
- Closed out the internship handing the codebase off to a colleague

## What I took away

**Technical:** SAPUI5 + SAP CAP end-to-end, oData v2/v4 integration patterns, Cloud Foundry deployment, Figma for UI design, XSS-safe custom controls, and just generally how to debug enterprise frontend code with sparse documentation.

**Non-technical:** Real exposure to SCRUM in a small, partly-remote team — sprint planning, retros, daily standups — and a lot of practice working through ambiguity with limited docs and async colleagues across timezones.

I came in mostly to build frontend, and left a lot more comfortable owning full features end-to-end — frontend, backend integration, and the AI plumbing connecting them.
