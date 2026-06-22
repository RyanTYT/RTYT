
---
title: "QA Engineer — Binance Accelerator Programme"
duration: "Apr–Oct 2026 (6 months, Binance Accelerator Programme)"
date: 2026-04-06
tags: [experience, QA, LLM, Playwright, TestNG, Python, Jira, GHE, Binance, MCP, Automation]
slug: binance-qa
filename: binance-qa.md
---
 
# QA Engineer · Binance Accelerator Programme
 
> Building LLM-augmented QA infrastructure for one of the world's largest crypto exchanges — automating test generation, sprint reporting, and engineering workflows with agents rather than scripts.
 
**Duration** · March 2026 – October 2026  
**Role** · QA Engineer (Binance Accelerator Programme)  
**Stack** · Python · Playwright · TestNG · Claude · Gemini · KimiMax · Google Sheets API · Jira · GitHub Enterprise
 
---
 
## Context
 
Binance's QA surface is wide: a web application, a mobile application, a backend API layer, and the intricate interplay between all three. Regression testing at this scale is not a problem you solve by writing more manual test cases. The work here has been about building the infrastructure that makes quality assurance faster, more consistent, and able to improve on its own over time — with LLMs as first-class participants in the loop.
 
As a non-native Chinese speaker, operating in a Chinese-language engineering environment has been an additional dimension: learning domain-specific technical vocabulary (代码, 迭代, 安早) on top of refreshing everyday Mandarin.
 
---
 
## What I Built so far
 
### 1 — Sprint Documentation Agent (Confluence → Google Sheets)
 
Sprint planning at scale produces documentation spread across Confluence, with inconsistent naming conventions between frontend and backend Jira issue sets — the same sprint is titled differently depending on which team's board you're looking at.
 
I built an agent that:
- **Parses Confluence sprint docs from HTML** using Python, extracting structured content regardless of formatting inconsistencies
- **Normalises sprint titles** across frontend and backend Jira naming conventions into a canonical format
- **Tabularises and writes to Google Sheets** via Google OAuth, producing a unified sprint view for internal reporting
The agent runs end-to-end without manual intervention and has been deployed internally in a personal workspace. What made this non-trivial was the normalisation layer: sprint titles across teams are organically inconsistent, so the agent uses an LLM to resolve ambiguous mappings rather than relying on brittle regex pattern-matching.
 
---
 
### 2 — LLM-Augmented Regression Test Suite (300+ Tests)
 
The core QA work: building a regression test suite for the Binance web and mobile applications, covering UI behaviour, frontend-to-backend API calls, and backend API responses directly.
 
**Test framework:**
- **Playwright** for web application tests (E2E and API-level)
- **TestNG** for mobile application tests

**The LLM layer:**  
Rather than writing every test in isolation, I worked alongside an LLM agent that maintained a knowledge base about the application under test. This KB stores:
- Error logs and known failure patterns from previous runs
- Selector maps for key UI elements (the correct, stable selectors for Playwright to target, built up over many iterations)
- Behaviour notes — edge cases, known flakiness, timing sensitivities

The agent uses this KB to avoid repeating past mistakes, suggest selectors it has already resolved, and draft test scaffolding grounded in what it has learned about the application. The result is a feedback loop: each test run makes the KB more accurate, which makes subsequent test generation faster and less error-prone.
 
**Scale:** 300+ individual regression tests written over approximately two months. A single E2E test may execute 30+ individual assertions. 10+ bugs have been caught on the mobile interface to date, with testing scope still expanding.
 
---
 
### 3 — Workflow Automation with MCP Tools
 
Day-to-day engineering workflows — opening Jira tickets, committing code, pushing changes — involve enough context-switching and formatting overhead to be meaningfully automatable.
 
I work extensively with LLM agents connected to MCP servers for:
- **GitHub Enterprise (GHE)** — automated commits and pushes with structured, consistent commit message formats
- **Jira** — automatically opening issues in the correct format: right project, right issue type, right fields populated, no manual template-filling
The practical effect is that creating a well-formed Jira issue from a bug discovery takes seconds rather than minutes, and the formatting is consistent in a way that purely manual workflows aren't.
 
---
 
## Why LLM-Augmented QA Is Different from Just Writing More Tests
 
| Dimension | Traditional QA | This approach |
|-----------|---------------|---------------|
| Selector maintenance | Manual update when UI changes | KB tracks stable selectors, agent suggests corrections |
| Test generation speed | Bottlenecked by human writing speed | Agent drafts scaffolding grounded in KB |
| Failure memory | Relearn flakiness each cycle | Error logs persist across runs |
| Sprint reporting | Manual copy-paste from Confluence | Agent parses, normalises, and writes to Sheets |
| Workflow overhead | Manual Jira/GHE formatting | MCP-connected agent handles structure |
 
The core insight is the same as in any KB-backed agent system: the value compounds over time. The first test takes as long as it would manually. The hundredth benefits from everything the agent has learned about this specific application.
 
---
 
## What I Learned
 
- **LLM agents are most powerful when given persistent, structured memory.** The regression suite improved measurably once the agent had a reliable KB of selectors and error patterns to draw on.
- **Prompt scope matters for code generation.** Asking an agent to "write a Playwright test for login" produces something generic. Asking it to "write a Playwright test for login using the selector map in the KB, accounting for the known timing issue on the OTP field" produces something usable.
- **MCP tooling reduces friction enough to change behaviour.** When opening a Jira ticket goes from a 3-minute context-switch to a 15-second agent call, you actually document bugs as you find them rather than batching them later.
---
