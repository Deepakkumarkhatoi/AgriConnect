# 🌱 AgriConnect — Smart Farmer Assistance Platform

> A full-stack, role-based agricultural management and marketplace platform designed to empower India's farming communities with live Mandi intelligence, weather alerts, government scheme discovery, produce marketplace with negotiation, and officer assistance.

---

## 🌟 Key Features Across 10 Modules

1. **Authentication & Multi-Role Access Control (RBAC)**: Dedicated workspaces for **Farmer**, **Buyer / Trader**, **Agricultural Officer**, and **Administrator**.
2. **Farm & Crop Management**: Register acreage, soil type, crop varieties, sowing dates, and growth stages (Sowing → Vegetative → Flowering → Ripening → Harvest Ready).
3. **Mandi Price Intelligence**: Real-time wholesale prices across Indian Mandis (Agmarknet) with side-by-side market comparison, price spread, and historical trends.
4. **Microclimate Weather & Rule-Based Alerts**: 7-day agricultural forecasts with automatic warning triggers for **heavy rainfall**, **extreme heatwaves**, and **high humidity pest risks**.
5. **Government Scheme Discovery**: Dynamic, rule-based eligibility evaluation based on land holding (acres), state, crop, and Kisan Credit Card (KCC) status.
6. **Produce Marketplace & Negotiation**: Direct farmer-to-buyer commerce with counter-offers, proposed quantity/rate negotiation, and atomic inventory reservation.
7. **Officer Assistance & Grievance Redressal**: Photo-enabled ticket logging routed to District Agricultural Officers (DAOs) with prescription advisory notes.
8. **In-App Notification Center**: Instant alerts on order offers, counter-negotiations, officer responses, and weather warnings.
9. **Multilingual Interface**: Native support for **English**, **Odia (ଓଡ଼ିଆ)**, and **Hindi (हिन्दी)** with responsive language toggle.
10. **Operations & Admin Hub**: User verification, account status management, scheme authoring, and platform audit trail logging.

---

## 🔌 How to Connect to Your MongoDB Atlas Cluster

AgriConnect uses Mongoose to connect directly to any MongoDB Atlas Cloud Cluster or local MongoDB instance.

### Step 1: Open Your MongoDB Atlas Dashboard
1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) and log in.
2. Navigate to your Database Deployment / Cluster.

### Step 2: Configure Network Access (IP Whitelist)
> ⚠️ **Important**: If this step is missed, connection will time out with `MongoServerSelectionError`.
1. In the left sidebar, click **Security > Network Access**.
2. Click **Add IP Address**.
3. For development, click **Allow Access from Anywhere (`0.0.0.0/0`)** and click **Confirm**.

### Step 3: Create Database User Credentials
1. In the left sidebar, click **Security > Database Access**.
2. Click **Add New Database User**.
3. Select **Password** authentication.
4. Enter a Username (e.g. `agriadmin`) and Password (e.g. `AgriConnect2026`).
5. Assign built-in role: **Read and write to any database**.
6. Click **Add User**.
> 💡 *Note: If your password has special symbols like `@`, `#`, `:`, `?`, `%`, URL-encode them (e.g. `@` becomes `%40`).*

### Step 4: Get Connection String
1. In the left sidebar, click **Database**.
2. Click the **Connect** button on your cluster.
3. Choose **Drivers** (Node.js).
4. Copy your cluster connection string.

### Step 5: Populate Cluster with Realistic Seed Data
Run the automated seed command from the `server` directory:
```bash
cd server
npm run seed
```
This initializes all 4 demo accounts, realistic Agmarknet prices, central & state schemes (PM-KISAN, KALIA, PMFBY, PMKSY), sample farms, crops, marketplace listings, and support tickets!

---

## 🔑 Pre-Configured Demo Accounts

All demo accounts share the password: **`Password@123`**

| Role | Email | Name & Location | Key Focus |
|------|-------|-----------------|-----------|
| 🌾 **Farmer** | `farmer@agriconnect.com` | Ramesh Mohapatra (Puri, Odisha) | Manage 3.5 acres, track paddy growth, list produce, evaluate schemes |
| 🛒 **Buyer** | `buyer@agriconnect.com` | Ananya Agro Traders (Bhubaneswar) | Browse produce, submit purchase requests, negotiate counter rates |
| 🏛️ **Officer** | `officer@agriconnect.com` | Dr. Debabrata Jena (DAO Puri) | Review district farmer tickets, attach agronomic guidance |
| 👑 **Admin** | `admin@agriconnect.com` | Platform Administrator | Verify users, moderate listings, inspect audit logs |

> 💡 *Pro-Tip: Use the **Quick Demo Switcher** pill in the top navigation bar to switch between any of these 4 roles with a single click without logging out!*

---

## 🚀 Running AgriConnect Locally

### Prerequisites
- Node.js v18+ (Tested on v22.13.0)
- npm v10+

### 1. Start the Backend API Server
```bash
cd server
npm run dev
```
- Server URL: `http://localhost:5000`
- Diagnostic Health Check: `http://localhost:5000/api/v1/health`

### 2. Start the Next.js Frontend
In a separate terminal:
```bash
cd client
npm run dev
```
- Frontend Web App: `http://localhost:3000`

---

## 🏗️ Project Architecture

```text
kisan/
├── client/                     # Next.js 16 (App Router) + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx        # Modern Landing Page with live tickers & role switchers
│   │   │   ├── mandi-prices/   # Mandi price comparison & historical trends
│   │   │   ├── weather/        # 7-day microclimate forecast & rule-based alerts
│   │   │   ├── schemes/        # Government scheme discovery & rule eligibility checker
│   │   │   ├── marketplace/    # Direct produce marketplace & negotiation modal
│   │   │   ├── support/        # Farmer-officer ticket assistance & messaging
│   │   │   ├── farmer/         # Farmer workspace (plots, crops, harvest planner)
│   │   │   ├── buyer/          # Buyer procurement & order negotiation desk
│   │   │   ├── officer/        # Agricultural officer ticket queue & advisory desk
│   │   │   └── admin/          # Admin user verification, moderation & audit logs
│   │   ├── components/layout/  # Responsive Navbar, Footer with Kisan Helpline
│   │   ├── context/            # AuthContext (Role state, quick switcher, session)
│   │   ├── i18n/               # Multilingual translations (English, Odia, Hindi)
│   │   └── lib/                # api.ts (REST client with robust fallback data)
│
├── server/                     # Node.js + Express.js + TypeScript REST API
│   ├── src/
│   │   ├── config/             # MongoDB Atlas connection manager & env validation
│   │   ├── models/             # 12 Mongoose schemas (User, Farm, Crop, Scheme, Order...)
│   │   ├── middleware/         # JWT auth, RBAC permissions, error handlers
│   │   ├── controllers/        # Business logic for all 10 modules
│   │   ├── routes/             # REST endpoints (/api/v1/...)
│   │   ├── jobs/seed.ts        # Comprehensive database seeder
│   │   └── server.ts           # Express server bootstrap
│
└── docs/                       # Requirements, Database Architecture, API Contracts
    ├── requirements.md
    ├── database-design.md
    └── api-contracts.md
```

---

## 📜 Documentation Reference
- [Database Design & Schemas](docs/database-design.md)
- [REST API Contracts](docs/api-contracts.md)
- [Requirements Specification](docs/requirements.md)
