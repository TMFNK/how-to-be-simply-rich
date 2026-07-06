# Contributing to Atlas of Wealth

Thanks for considering a contribution. This is a small, static-site project — the bar for pitching in is low.

## Getting set up

`npm install && npm run dev`.

## Before opening a PR

- `npm run build` (type-checks with `tsc` and builds with Vite) and `npm test` (Vitest) must pass.
- Keep changes scoped — small, focused PRs are much easier to review than ones that mix a fix with a refactor.
- Match the existing code style (no linter/formatter is enforced yet; read the surrounding file and follow it).
- If you change frontend behavior, describe how you tested it manually (this repo has no end-to-end test suite).

## Reporting bugs / suggesting features

Open a GitHub issue with what you expected vs. what happened (bugs), or the problem you're trying to solve (features).
