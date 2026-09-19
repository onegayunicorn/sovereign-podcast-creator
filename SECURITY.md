# Security

- **Auth**: Firebase ID tokens verified server-side via `firebase-admin`.
- **Quota**: Daily limit enforced per authenticated UID.
- **Secrets**: Provider API keys are server-only. Never exposed to the web tier.
- **Validation**: All inbound payloads validated with Zod.
- **Headers**: Helmet defaults + CORS allowlist.
- **Storage**: Signed URLs for assets; MIME + size checks on uploads.
- **Logging**: Structured Pino logs; API keys scrubbed from output.
- **CI**: Dependency audit + container build on every PR.
