# IGRP Process Studio frontend monorepo

## Testing

The root SDK unit tests use [Vitest](https://vitest.dev/) and live in `__test__`.
Test files must end in `.test.ts`; `vitest.config.ts` deliberately limits the
root suite to this directory so it does not collect the demo app's Jest tests or
the client's compiled-package `node:test` suite.

Run the root tests with:

```sh
pnpm test
pnpm test:watch
pnpm test:coverage
```

To add a test, create a descriptive file such as
`__test__/project-client.test.ts`, import the TypeScript source being tested,
and use Vitest's `describe`, `it`, `expect`, and `vi` helpers. API client tests
should mock `globalThis.fetch` so they validate the request URL, HTTP method,
headers, body, and parsed response without requiring a running backend.
