

To reproduce the issue:

- `npm i`
- `npm test` (works with local server)
- uncomment line 54 in `/tests/communications.spec.ts`
- `npm test` (fails with stub)