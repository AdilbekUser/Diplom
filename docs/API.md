# ORDA API

Base URL:

```text
http://localhost:3000
```

API namespace:

```text
http://localhost:3000/api
```

Старые URL без `/api` также сохранены для совместимости frontend.

## Health

```http
GET /health
```

Response:

```json
{
  "status": "ok",
  "brand": "ORDA Smart Event System",
  "database": "connected"
}
```

## Auth

```http
POST /api/register
```

Body:

```json
{
  "name": "Adilbek",
  "email": "adilbek@example.com",
  "password": "123456"
}
```

```http
POST /api/login
```

Body:

```json
{
  "email": "adilbek@example.com",
  "password": "123456"
}
```

## Profile

Protected route.

```http
GET /api/me
PUT /api/me
```

Headers:

```text
Authorization: Bearer <JWT_TOKEN>
```

## Events

```http
GET /api/events
GET /api/events/:id
```

Filters:

```text
?search=forum
?category=conference
?format=online
?free=true
?featured=true
```

Admin protected:

```http
POST /api/events
PUT /api/events/:id
DELETE /api/events/:id
```

Event body:

```json
{
  "title": "ORDA Conference",
  "date": "2026-06-20",
  "time": "10:00",
  "category": "conference",
  "description": "Event description",
  "agenda": "Opening, keynote, networking",
  "organizer": "ORDA",
  "location": "Astana, Grand Hall",
  "format": "hybrid",
  "meetingUrl": "https://meet.google.com/example",
  "price": 0,
  "currency": "KZT",
  "featured": true,
  "tags": "business, conference",
  "capacity": 120,
  "status": "published"
}
```

## Bookings

Protected route.

```http
POST /api/book
GET /api/my-bookings
DELETE /api/my-bookings/:id
```

Book body:

```json
{
  "eventId": "event_mongodb_id"
}
```

## Admin

Admin protected:

```http
GET /api/bookings
GET /api/stats
PATCH /api/bookings/:id/check-in
```

Demo data:

```http
GET /api/seed
```

Note: `/api/seed` clears demo events and bookings, then inserts prepared demo events.
