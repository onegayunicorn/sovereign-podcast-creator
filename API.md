# API Reference

Base URL: `http://localhost:3001`

All protected routes require:
```
Authorization: Bearer <Firebase ID token>
```

## Health

`GET /api/health` — service status

## Quota

`GET /api/quota` — returns `{ allowed, limit, remaining, used }`

## Generation

`POST /api/generate` — start a show
```json
{
  "prompt": "string (10–10000)",
  "category": "tech|culture|news",
  "targetDuration": 1–60,
  "mood": "string",
  "personality": { "host": "id", "guest": "id" }
}
```
Returns `{ id, status }` (HTTP 202).

`GET /api/generations/:id` — poll job  
`GET /api/generations/:id/events` — SSE stream of stage events

## Shows

`GET /api/shows` — list user's shows  
`GET /api/shows/:id` — get one  
`DELETE /api/shows/:id` — delete  
`POST /api/shows/:id/share` — create share link `{ shareId }`  
`GET /api/shows/shared/:shareId` — public fetch
