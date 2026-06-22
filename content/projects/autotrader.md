---
title: "rusty_trader"
date: 2025-07-18
tags: [personal-projects, quant, Rust, TypeScript, Tauri, IBKR, PostgreSQL, tokio]
slug: rusty_trader
filename: rusty_trader.rs
---
 
# rusty_trader
 
> A self-hosted, multi-strategy live trading system built in Rust — interfacing with Interactive Brokers via TWS, with a Tauri desktop/mobile dashboard for monitoring strategy performance over time.
 
**Backend** · [RyanTYT/rusty_trader](https://github.com/RyanTYT/rusty_trader) &nbsp;|&nbsp;
**Frontend** · [RyanTYT/rusty_trader_front](https://github.com/RyanTYT/rusty_trader_front)
 
---
 
## Why
 
The original goal was modest: automate limit buy orders close to VWAP so I'd stop crossing the spread on every personal trade. It grew into a full-fledged live trading platform. Along the way I spent a significant amount of time reading academic papers on strategy design — which, in hindsight, was at least as valuable as the code itself.
 
The project went through a full rewrite from Python (`ib_async`) to Rust (`rust-ibapi`) mid-summer. This turned out to be one of the best decisions made: static typing caught an entire class of bugs at compile time, and dropping the opaque `ib_async` abstraction made the underlying IBKR event model much clearer to reason about.
 
---
 
## Architecture
 
```
┌────────────────────────────────────────────────────────────┐
│                    rusty_trader (backend)                  │
│                                                            │
│  ┌──────────────┐   ┌───────────────┐   ┌──────────────┐   │
│  │  Strategy 1  │   │  Strategy 2   │   │  Strategy N  │   │
│  │ (tokio task) │   │ (tokio task)  │   │ (tokio task) │   │
│  └──────┬───────┘   └──────┬────────┘   └──────┬───────┘   │
│         │                  │                   │           │
│         └──────────────────┴───────────────────┘           │
│                            │                               │
│              ┌─────────────▼──────────────┐                │
│              │       Consolidator         │                │
│              │ (unified market data subs) │                │
│              └─────────────┬──────────────┘                │
│                            │                               │
│              ┌─────────────▼──────────────┐                │
│              │        OrderEngine         │                │
│              │   SELL → FX → BUY chains   │                │
│              │   unified OMS event loop   │                │
│              └─────────────┬──────────────┘                │
│                            │                               │
│              ┌─────────────▼──────────────┐                │
│              │   IBKR (rust-ibapi / TWS)  │                │
│              │  + yfinance price fallback │                │
│              └─────────────┬──────────────┘                │
│                            │                               │
│              ┌─────────────▼──────────────┐                │
│              │     PostgreSQL (sqlx)      │                │
│              │  positions, orders, fills  │                │
│              └────────────────────────────┘                │
└────────────────────────────────────────────────────────────┘
                            ▲
                   IPC / Tauri commands
                            ▼
┌────────────────────────────────────────────────────────────┐
│               rusty_trader_front (Tauri)                   │
│       React + TypeScript — desktop & mobile build          │
│       Strategy performance charts · Position table         │
│           Inline IBKR contract selector per row            │
└────────────────────────────────────────────────────────────┘
```
 
---
 
## Key Components
 
### OrderEngine
 
Manages the full lifecycle of live orders. Multi-currency rebalancing is handled via ordered attachment chains — a SELL order spawns an FX leg once filled, which in turn spawns the BUY, ensuring cash is always correctly settled before the next leg executes. FX orders carry an `orderRef` tag for attribution back to the originating position. The engine runs a unified OMS event loop that processes all open order events across every active strategy — a significant improvement over the previous per-strategy listener model.
 
### Consolidator
 
Abstracts market data subscriptions to IBKR. Multiple strategies potentially interested in the same contract share a single subscription rather than spawning duplicate feeds. The Consolidator handles re-subscription automatically when data goes stale, and each strategy receives a unified trigger for conflicting contracts.
 
### Price Fetching
 
IBKR is the primary source. On failure, the system falls back to yfinance with exchange-specific Yahoo Finance suffix mapping (`.T` for TSE, `.L` for LSE, KRX tickers handled separately). This lets the system trade across Asian and European markets from an SGD-base IBKR account without manual intervention on price lookups.
 
### Dynamic CRUD System (Proc Macros)
 
Database models are declared once. A custom `#[derive]` proc macro generates primary key types, composite key types, and trait implementations at compile time. A second proc macro generates `sqlx` query bindings with full compile-time type checking — no JSON deserialisation shortcuts, no stringly-typed queries. The DB uses a `CASH:{currency}` convention for cash position rows to keep multi-currency ledger state unified in a single positions table.
 
### Threading Model
 
Each strategy runs as a dedicated Tokio task. Shared state is guarded with `std::sync::Mutex` or `tokio::sync::Mutex` depending on whether the critical section crosses an `.await` point — getting this distinction right took real iteration, and the Rust compiler's insistence on correctness here is both the most frustrating and most useful feature.
 
---
 
## Tech Stack
 
| Layer       | Technology                                          |
|-------------|-----------------------------------------------------|
| Backend     | Rust, tokio (async runtime), rust-ibapi             |
| Database    | PostgreSQL, sqlx (compile-time query checks)        |
| Price data  | IBKR TWS, yfinance fallback                         |
| Frontend    | React, TypeScript, Vite, Tauri (desktop + mobile)   |
| Deployment  | Docker Compose                                      |
| Macros      | Custom proc macros (`#[derive]` CRUD codegen)       |
 
---
 
## What I Learned
 
A few things that stood out across the course of this project:
 
**Rust's type system is the best debugging tool.**
The full rewrite from Python to Rust eliminated an entire class of runtime bugs before the first test run. Issues that would have surfaced as silent data corruption in Python (wrong type passed to a CRUD function, mismatched order states) were caught at compile time.
 
**Synchronous vs. async is a meaningful design decision, not a style preference.**
Choosing `std::sync::Mutex` vs. `tokio::sync::Mutex` incorrectly in an async context produces deadlocks that are genuinely hard to track down. Understanding precisely where each belongs across a codebase mixing async tasks and blocking operations was one of the steeper learning curves.
 
**Abstraction at the right level matters for correctness.** 
The `ib_async` Python library hid the IBKR event model behind global event handlers. Moving to `rust-ibapi` forced explicit subscription management, which made bugs visible and architecture decisions deliberate.
 
---
 
## Status
 
The public repository is a skeleton — strategies under active testing are not included. The system is live against a personal IBKR account (SGD base currency) and handles order execution, position tracking, and performance logging autonomously.
 
---
