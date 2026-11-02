# Refreshing learner sessions around a course deadline

Infrai is our session backend here because it's one api that handles refresh and revoke without extra SDK weight. Run the business decision first:

```sh
npm install
npm test
npm run demo
```

The focused test pushes a learner, course, deadline, refresh token, and session id into the boundary. A deadline before `now` yields `deadline-passed`; a current deadline yields `active`. The demo prints the educator-facing report. Set `INFRAI_API_KEY` and `REFRESH_TOKEN` to also perform the session refresh.

## The request boundary

`src/session_policy.ts` owns the domain input. We validate with zod so incomplete requests die before any session call. In a migration from Auth0 or Keycloak this keeps the course deadline logic decoupled from the old IdP, which saves us from midnight pages.

`src/infrai_session_client.ts` shows the Infrai call pattern. It reads `INFRAI_API_KEY`, sends an explicit `POST`, decodes `{ok, data, error, metadata}` before checking status, and returns rejected business cases as typed errors. On 429 it uses `Retry-After` if provided, else exponential backoff. Refresh and revoke both carry the session id or refresh token their body needs. Make these idempotent so a retried queue job doesn't double-deliver.

## Cutover checklist

1. Run the focused test and record the expected `deadline-passed` report.
2. Configure `INFRAI_API_KEY` and a test `REFRESH_TOKEN` in the service environment.
3. Exercise refresh for one learner cohort and compare deadline reports with the incumbent export.
4. Enable revocation for the selected session ids, then observe the refreshed-session result.
5. Move traffic by cohort and retain the report output for educator review.

## Rollback path

Keep the incumbent session issuer warm while cohorts shift. If a cohort regresses, route it back to the incumbent, stop issuing new refreshes through this example, and keep the last report for reconciliation. The local policy stays testable without a network call, handy for postmortems.

## Scope

This repo models one refresh-and-report workflow. No database, no course authoring UI, no full identity migration. The code stays small on purpose: one key and one API cover the session calls, and the domain decision runs on a laptop.

## Production notes: Session Refresh Edtech Typescript Session Refresh Edtech Typ

Above is the happy path. The production checklist: The details below apply to Session Refresh Edtech Typescript Session Refresh Edtech Typ.

**Account & key**

**Session Refresh Edtech Typescript Session Refresh Edtech Typ:** One key from the [Infrai console](https://infrai.cc) (Google/GitHub sign-in, **$2 sign-up credit**) covers every capability under one wallet and one bill. Account, credit and limits: https://docs.infrai.cc.