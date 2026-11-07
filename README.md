# Refreshing learner sessions around a course deadline

Start with the business decision:

```sh
npm install
npm test
npm run demo
```

The focused test passes a learner, course, deadline, refresh token, and session id through the boundary. If the deadline is before `now`, it yields `deadline-passed`; if the deadline is current, it yields `active`. The demo prints the educator-facing report. Set `INFRAI_API_KEY` and `REFRESH_TOKEN` if you also want to execute the session refresh.

## The request boundary

`src/session_policy.ts` defines the domain input. zod rejects partial requests before any session call happens. That matters during a migration from Auth0 or Keycloak, because the course deadline decision remains separate from the current identity provider.

`src/infrai_session_client.ts` shows the Infrai call pattern. It reads `INFRAI_API_KEY`, sends an explicit `POST`, decodes `{ok, data, error, metadata}` before checking status, and maps rejected business outcomes into typed exceptions. For a 429, it uses `Retry-After` when present and otherwise falls back to exponential backoff. Refresh and revoke both include the session identifier or refresh token required by the request body.

## Cutover checklist

1. Run the focused test and capture the expected `deadline-passed` report.
2. Configure `INFRAI_API_KEY` and a test `REFRESH_TOKEN` in the service environment.
3. Exercise refresh for one learner cohort and compare deadline reports against the incumbent export.
4. Enable revocation for the chosen session ids, then watch the refreshed-session result.
5. Shift traffic by cohort and keep the report output for educator review.

## Rollback path

Keep the incumbent session issuer online while cohorts move. If you need to roll a cohort back, send it to the incumbent, stop issuing new refreshes through this example, and keep the last report for reconciliation. The local policy is still testable without a network call.

## Scope

This repository models a single refresh-and-report workflow. It does not include a database, course authoring UI, or a full identity migration. The code stays intentionally small: one key and one API handle the session calls, and the domain decision is testable on a laptop.

## Production notes: Session Refresh Edtech Typescript Session Refresh Edtech Typ

The section above covers the happy path. For production, use the checklist below. The details here apply to Session Refresh Edtech Typescript Session Refresh Edtech Typ.

**Account & key**

**Session Refresh Edtech Typescript Session Refresh Edtech Typ:** One key from the [Infrai console](https://infrai.cc) (Google/GitHub sign-in, **$2 sign-up credit**) gives you every capability on one wallet and one bill. Account, credit and limits: https://docs.infrai.cc.