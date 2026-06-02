# TradeXpert - Progress Tracker

## Plan (approved)
### Client (UI/UX)
- [x] Tighten Dashboard layout in `client/src/pages/Dashboard/Dashboard.jsx` (smaller gaps, spacing, headings)
- [ ] Reduce element sizes in:
  - [ ] `client/src/components/Dashboard/MarketIndices.jsx`
  - [ ] `client/src/components/Dashboard/MarketCards.jsx`
  - [ ] `client/src/components/Dashboard/TopMovers.jsx`
  - [ ] `client/src/components/Dashboard/LiveTicker.jsx`
- [ ] Adjust/extend shared styling tokens/utilities in `client/src/index.css` for a minimalist trading look

### Server (Real-time Upstox)
- [ ] Wire server to use `upstoxMarketService` (WS+protobuf) instead of limited `marketPollingService`
- [ ] Replace hardcoded instruments in `server/services/upstoxMarketService.js` with dynamic instrument-key mapping
- [ ] Implement batching/subscription strategy for large NSE+BSE universes
- [ ] Adjust socket payload strategy to avoid huge emits (snapshot vs incremental)

## Notes
- Current dashboard UI uses Tailwind classes with large typography/padding.
- Current real-time feed appears limited due to hardcoded `stocksMap` and polling-only server start.

