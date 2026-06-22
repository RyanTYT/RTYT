---
title: "Automated Trading Platform"
tags: [rust, tokio, postgresql, ibkr]
slug: trading-bot
filename: trading_bot.rs
---

Multi-currency portfolio management across US, UK, JP, KR equities.

## Architecture

The platform is split into **four core services** that communicate via Tokio channels — no shared mutable state, no locks.

### Core Services

1. **Market Data Ingester** — connects to 50+ WebSocket streams via `tokio::spawn`
2. **Signal Engine** — evaluates alpha signals against the current portfolio state
3. **Order Manager** — handles FX chains (USD → SGD → HKD) and smart routing
4. **Risk Monitor** — enforces position limits, drawdown thresholds, and ADV constraints

### Data Flow

> The system follows an event-driven architecture where each component reacts to messages rather than polling for state changes.

> This eliminates race conditions and makes the system trivially testable — just replay a sequence of messages.

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Engine | Rust + Tokio | Async runtime, zero-cost abstractions |
| Broker | IBKR TWS API | Order execution, market data |
| Storage | PostgreSQL | Trade log, market snapshots |
| Monitoring | Grafana | Live PnL, latency dashboards |

## Code Structure

```rust
#[tokio::main]
async fn main() -> Result<()> {
    let config = Config::from_env()?;
    let engine = TradingEngine::new(config).await?;

    // Spawn market data listeners
    engine.subscribe_markets().await?;

    // Main event loop
    engine.run().await
}
```

```
trading_platform/
├── src/
│   ├── order_management.rs  # FX chains
│   ├── portfolio.rs         # position tracking
│   ├── ibkr_client.rs       # TWS API async
│   └── rebalancer.rs        # ADV-aware sizing
└── docker-compose.yml
```

## Performance

- **Latency**: Order placement in ~*15ms* from signal to fill
- **Uptime**: ~~99.5%~~ 99.99% over 6 months (improved after migrating to Rust)
- **Throughput**: Handles `200+ events/sec` without backpressure

## Key Decisions

### Why Not Python?

Python got me through the _research phase_ — backtesting with Pandas is fast enough when iterating on ideas. But **production trading** demands more:

- Memory safety — no GC pauses at the worst moment
- Predictable latency — no interpreter overhead
- Fearless concurrency — Rust's ownership model prevents data races at compile time

### Settlement Logic

The trickiest part was modelling T+2 settlement across multiple currencies. The solution:

1. Track `settled` vs `pending` balances separately
2. Project forward using a settlement calendar per exchange
3. Gate new orders on *projected* settled balance, not current
4. Handle partial fills by splitting the settlement entry

---

## Links

- Source: [trading-platform on GitHub](https://github.com/ryantan/trading-platform)
- Related: [Summer Trading — FullSendRust](/journal/trading-rust)

#### Footnotes

This project evolved from the earlier [AutoTrader](https://github.com/ryantan/autotrader) Python prototype (Y1S2). The Rust rewrite started June 2024 and reached production in August 2024.
