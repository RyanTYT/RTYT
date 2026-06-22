---
title: "LLM Pipeline"
date: 2026-03-01
tags: [personal-projects, quant, Python, LLM, Anthropic, Pydantic, FastAPI, knowledge-base]
slug: llm_pipeline
filename: llm_pipeline.py
---
 
# LLM Pipeline
 
> A multi-stage LLM research and portfolio proposal system — sitting on top of a persistent, incrementally-updated knowledge base — designed to do the kind of macro-to-stock analysis a buy-side analyst would, without having to re-research the world from scratch on every run.
 
**Part of** · [RyanTYT/rusty_trader](https://github.com/RyanTYT/rusty_trader/tree/main/llm_service)
 
---
 
## The Problem with Just Asking an LLM
 
The naive approach to LLM-assisted trading research is to paste a question into a chat window and read the response. It fails in several ways:
 
- **Stale training data.** LLMs don't know what happened last week. Markets are driven by what happened last week.
- **No institutional memory.** Every conversation starts from zero. The LLM has no knowledge of what you concluded last month, what themes you're already positioned in, or what changed since.
- **Prompt scope is too wide.** Asking "what stocks should I buy?" produces vague, hedged, unusable output. Decomposing into focused sub-questions produces much better analysis at each layer.
- **Unstructured output.** A chat response can't be automatically validated, diffed against a prior proposal, or fed into downstream order logic.
- **No adversarial review.** A single LLM call agrees with your framing. You want something that pushes back.
This system addresses all five.
 
---
 
## Architecture
 
```
┌───────────────────────────────────────────────────────────────┐
│                     Knowledge Base Layer                      │
│                                                               │
│  update_macro.py ──── macro KB (rates, inflation, GDP, ...)   │
│  update_industries.py  industry KB (sector rotations, ...)    │
│                  ↑                                            │
│            web_search.py  (Anthropic / Gemini / OpenRouter)   │
│            kb_manager.py  (CRUD, STALE/COMPRESS/KEEP triage)  │
│                  ↓                                            │
│            kb_browser.py  (FastAPI read endpoints)            │
└───────────────────────────────┬───────────────────────────────┘
                                │  KB read
                                ▼
┌───────────────────────────────────────────────────────────────┐
│               Portfolio Proposal Pipeline                     │
│                                                               │
│  Stage 1 · idea_generator.py                                  │
│            Generates thematic investment ideas from KB        │
│                        │                                      │
│  Stage 2 · ticker_selector.py                                 │
│            Selects specific tickers per theme                 │
│                        │                                      │
│  Stage 3 · deep_dive.py                                       │
│            Async recursive research per ticker                │
│            PromptBudget(max=500), TickerRelationMap           │
│                        │                                      │
│  Stage 4 · positions_proposer.py  (orchestrator)              │
│            ├── stages.py     (Stage 1–4 pipeline logic)       │
│            ├── enrichment.py (ADV, friction, market data)     │
│            ├── friction.py   (transaction cost pre-fetch)     │
│            ├── currency.py   (multi-currency normalisation)   │
│            ├── backend.py    (proposal assembly)              │
│            ├── formatters.py (output shaping)                 │
│            └── prompts.py    (prompt templates)               │
│                        │                                      │
│  Stage 5 · positions_counter_proposer.py                      │
│            Adversarial review — challenges the proposal       │
│            Returns CounterProposalSession (Pydantic)          │
└───────────────────────────────────────────────────────────────┘
                                │
                          Pydantic output
                    (ProposedPosition, weights,
                     rationale, counter-arguments)
                                │
                         rusty_trader backend
                    (order execution via IBKR OMS)
```
 
---
 
## Key Design Decisions
 
### 1 — Persistent Knowledge Base with Triage-and-Rewrite
 
Rather than re-researching the world on every run, the system maintains a structured KB of macro and industry facts grounded by web search. When the KB is updated, each existing entry is classified under one of three dispositions:
 
- **KEEP** — still accurate, leave as-is
- **COMPRESS** — still valid but overly verbose, condense
- **STALE** — outdated, rewrite with fresh search results
This means the KB improves in quality over time rather than accumulating redundant noise, and the pipeline always has a current, structured briefing on the macro environment and relevant sectors before any proposal work begins.
 
### 2 — Stage Decomposition
 
Breaking the analysis into four focused stages mirrors how human analysts actually work:
macro → sector → company → sizing. Each stage receives a scoped prompt with only the context it needs and returns structured output that the next stage consumes. This produces more coherent reasoning at each layer and makes failures easy to isolate.
 
### 3 — Async Recursive Ticker Research with Budget Control
 
`deep_dive.py` spawns async LLM calls recursively — following references, cross-checking claims, and pulling in related tickers — governed by a `PromptBudget` cap of 500 calls per run. A `TickerRelationMap` tracks which tickers were discovered through which research paths, so the system understands cross-asset dependencies (e.g. a semiconductor thesis touching memory, foundries, and equipment suppliers) without exploding in scope.
 
### 4 — Adversarial Counter-Proposal
 
`positions_counter_proposer.py` takes the assembled proposal and generates a structured challenge: alternative theses, risk factors the proposer downplayed, sizing objections. This is returned as a typed `CounterProposalSession` alongside the original proposal, giving a balanced view before any positions are committed.
 
### 5 — Multi-Provider LLM Client
 
`llm_client.py` abstracts over Anthropic, Gemini, and OpenRouter. Provider choice is configurable per agent — expensive, high-quality calls (proposal assembly, counter-proposals) use Claude; high-volume, lower-stakes calls (KB triage, search summarisation) can route to cheaper providers. This keeps aggregate API cost manageable.
 
### 6 — Pydantic Validation with Field Correction
 
All LLM outputs are parsed against strict Pydantic schemas (`types.py`). LLMs occasionally miss required fields or use slightly wrong key names; `field_corrector.py` handles common mismatches before validation fails — e.g. an `unchanged_positions` entry missing `primary_exchange` or `currency` gets corrected rather than causing a pipeline abort. Validation errors that can't be auto-corrected surface clearly rather than propagating silently downstream.
 
---
 
## Why This Is Better Than Asking an LLM Directly
 
| Dimension | Chat / direct prompt | This system |
|-----------|---------------------|-------------|
| Information freshness | Training cutoff | Web search grounded, daily KB updates |
| Memory across runs | None | Persistent KB with versioned triage |
| Output structure | Free text | Typed Pydantic models, validated |
| Analysis depth | Single-pass | 4-stage decomposition + recursive deep dive |
| Adversarial review | None | Dedicated counter-proposer agent |
| Cost control | Unbounded | PromptBudget cap, per-agent model routing |
| Downstream integration | Copy-paste | Direct feed into IBKR order engine |
 
---
 
## Tech Stack
 
| Layer | Technology |
|-------|-----------|
| Language | Python 3.12 |
| Package manager | uv |
| LLM providers | Anthropic (Claude), Gemini, OpenRouter |
| Schema validation | Pydantic v2 |
| Async | asyncio |
| Web search | Custom `web_search.py` (provider-agnostic) |
| API | FastAPI (`kb_browser.py`) |
| Deployment | Docker |
 
---
 
## Module Reference
 
```
agents/
  idea_generator.py           Thematic idea generation from KB
  ticker_selector.py          Ticker selection per theme
  deep_dive.py                Async recursive per-ticker research
  positions_proposer.py       Pipeline orchestrator
  positions_counter_proposer.py  Adversarial review agent
  update_macro.py             KB update agent — macroeconomic layer
  update_industries.py        KB update agent — sector/industry layer
 
  positions_proposer_mods/
    stages.py       Stage 1–4 pipeline logic
    enrichment.py   ADV pre-fetch, market data enrichment
    friction.py     Transaction cost estimation
    currency.py     Multi-currency position normalisation
    backend.py      Proposal assembly logic
    formatters.py   Output formatting
    prompts.py      Prompt templates
 
api/
  kb_browser.py     FastAPI read endpoints for KB inspection
 
models/
  types.py          Pydantic schemas (ProposedPosition,
                    CounterProposalSession, ...)
  settings_manager.py  Provider config, budget limits
 
tools/
  kb_manager.py     Knowledge base CRUD + triage logic
  llm_client.py     Unified LLM client (Anthropic / Gemini / OpenRouter)
  web_search.py     Web search abstraction
  field_corrector.py  LLM output schema repair
```
 
---
