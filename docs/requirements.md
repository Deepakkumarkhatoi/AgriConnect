# AgriConnect — Requirements Specification

## 1. Executive Summary
AgriConnect is an end-to-end, role-based Smart Farmer Assistance Platform bridging the gap between farmers, buyers, agricultural officers, and administrators. It consolidates mandi prices, weather forecasts & alerts, government scheme discovery, produce marketplace with negotiation, and officer assistance into an integrated, accessible web platform.

## 2. Core User Roles & Permissions

| Role | Permissions & Core Workflows |
|------|------------------------------|
| **Farmer** | Manage farms & crop stages; check mandi price trends; view localized weather alerts; evaluate scheme eligibility & track checklists; list produce for sale; negotiate purchase requests; raise support tickets with photos to officers; read in-app notifications. |
| **Buyer** | Search & filter produce listings across districts/states; contact farmers and make purchase offers with proposed quantities and rates; counter-negotiate; confirm orders; view order status. |
| **Agricultural Officer** | Workspace to monitor assigned tickets by district; respond to crop pest/disease queries; attach guidance notes; publish verified advisories; track case resolution. |
| **Administrator** | Manage accounts; verify buyers and officers; review/moderate produce listings; publish and update government schemes; monitor system analytics and audit trails. |

## 3. Functional Modules

1. **Authentication & RBAC**: JWT-based session management, secure password hashing (bcrypt), role-based protection on both Express APIs and Next.js routes.
2. **Farm & Crop Management**: Acreage, soil, sowing dates, estimated harvest in quintals, stage tracking (Sowing -> Vegetative -> Flowering -> Ripening -> Harvest Ready -> Harvested).
3. **Mandi Price Intelligence**: Search by crop, district, state; compare multiple markets side-by-side; minimum, maximum, modal prices; freshness timestamp; historical price trends.
4. **Weather Forecasts & Rule-Based Alerts**: Real-time forecast data with rule triggers:
   - Heavy Rain Alert (>35mm rain probability > 70%)
   - Heatwave Alert (>40°C)
   - Pest Risk Alert (high humidity > 85% + temperature > 28°C)
5. **Government Scheme Discovery**: Dynamic rule evaluation based on farmer state, acreage, crop type, and KCC status. Document gathering checklist and official portal links.
6. **Produce Marketplace & Negotiation**: Direct farmer-to-buyer marketplace with stateful negotiation (`inquiry` -> `negotiating` -> `accepted` -> `completed` / `cancelled`), atomic inventory reservation.
7. **Officer Support Tickets**: Photo-enabled ticket creation, district-based assignment, officer-farmer messaging thread, resolution tracking.
8. **In-App Notification Center**: Unread count badge, live alerts on order counter-offers, officer guidance, weather warnings.
9. **Multilingual Interface**: Full i18n support for **English**, **Odia (ଓଡ଼ିଆ)**, and **Hindi (हिन्दी)** with responsive toggle.
10. **Operations & Admin Hub**: Listing moderation, user verification, system audit logs, and analytics counters.
