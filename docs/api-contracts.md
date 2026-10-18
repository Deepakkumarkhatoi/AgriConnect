# AgriConnect — REST API Contracts

All endpoints are prefixed with `/api/v1`. Authenticated routes require `Authorization: Bearer <token>` or HTTP cookie.

## 1. Authentication (`/api/v1/auth`)
- `POST /register`: Register new user (`name`, `email`, `password`, `role`, `phone`, `village`, `district`, `state`)
- `POST /login`: Sign in with `email` and `password` -> Returns `{ token, user }`
- `GET /me`: Returns current authenticated user and profile
- `POST /logout`: Clears session

## 2. Farm & Crops (`/api/v1/farms`, `/api/v1/crops`)
- `GET /farms`: List farmer's plots (Farmer only)
- `POST /farms`: Add new farm/plot
- `GET /farms/:id`: Get farm details
- `PATCH /farms/:id`: Update farm details
- `DELETE /farms/:id`: Remove farm
- `GET /crops`: List farmer's crops with stages and harvest estimates
- `POST /crops`: Record crop sowing details
- `PATCH /crops/:id/stage`: Update growth stage or harvest status
- `POST /crops/:id/activity`: Add farm log activity (irrigation, fertilizer, spraying)

## 3. Mandi Prices (`/api/v1/market-prices`)
- `GET /`: Search prices by `crop`, `state`, `district`, `market`
- `GET /crops`: List unique available crops
- `GET /compare`: Compare prices across specified markets (query: `crop`, `markets`)
- `GET /history`: Get historical price trends for a crop/mandi

## 4. Weather & Alerts (`/api/v1/weather`)
- `GET /`: Get current weather & 5-day forecast for given district/coordinates
- `GET /alerts`: Get automated rule-based alerts (heavy rain, heatwave, pest humidity)

## 5. Government Schemes (`/api/v1/schemes`)
- `GET /`: Browse all schemes with filters (`state`, `category`, `search`)
- `GET /:id`: Scheme details with document checklist and official application links
- `POST /check-eligibility`: Dynamic rule evaluation for farm profile
- `GET /saved`: Get farmer's saved schemes and document completion state
- `POST /saved/:schemeId`: Bookmark scheme to shortlist
- `PATCH /saved/:schemeId/checklist`: Toggle checklist items
- `DELETE /saved/:schemeId`: Remove from saved

## 6. Marketplace & Orders (`/api/v1/listings`, `/api/v1/orders`)
- `GET /listings`: Public / Buyer search (filters: `crop`, `district`, `minPrice`, `maxPrice`, `quality`)
- `POST /listings`: Farmer posts produce for sale
- `GET /listings/my`: Farmer's active & sold produce listings
- `PATCH /listings/:id`: Update listing price, quantity, or status
- `DELETE /listings/:id`: Delete or archive listing
- `POST /orders`: Buyer submits purchase / negotiation request
- `GET /orders`: View orders (filtered by current user's role: Buyer sees their purchases, Farmer sees incoming requests)
- `GET /orders/:id`: Full negotiation thread and order status
- `POST /orders/:id/negotiate`: Submit counter-offer or reply
- `PATCH /orders/:id/status`: Transition status (`accepted`, `rejected`, `completed`, `cancelled`) with atomic quantity adjustment

## 7. Support & Officer Workspace (`/api/v1/support`)
- `GET /tickets`: List tickets (Farmer sees own tickets; Officer sees assigned/district tickets; Admin sees all)
- `POST /tickets`: Farmer raises ticket with crop issue, subject, description, photoUrl
- `GET /tickets/:id`: Ticket details with message conversation
- `POST /tickets/:id/messages`: Farmer or Officer posts reply / advisory
- `PATCH /tickets/:id/status`: Update status (`in_progress`, `resolved`, `closed`)

## 8. Notifications (`/api/v1/notifications`)
- `GET /`: Get in-app notifications with unread count
- `PATCH /:id/read`: Mark notification as read
- `POST /read-all`: Mark all as read

## 9. Admin Operations (`/api/v1/admin`)
- `GET /stats`: System overview (counts of users, listings, open tickets, orders, schemes)
- `GET /users`: User directory with role & status filters
- `PATCH /users/:id/status`: Verify or suspend user
- `POST /schemes`: Add new government scheme
- `PATCH /schemes/:id`: Edit scheme
- `GET /audit-logs`: Audit trail of critical system actions
