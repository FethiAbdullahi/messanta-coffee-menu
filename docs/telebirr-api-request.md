# Messanta Coffee — Telebirr Payment Integration Request

**Merchant:** Messanta Coffee  
**Platform:** Digital menu & in-store ordering system  
**Currency:** ETB  
**Contact:** [Your name] · [Your email] · [Your phone]  
**Date:** July 2026

---

## 1. What the platform does

Messanta Coffee is a **web-based digital menu and ordering platform** for our coffee shop. Customers scan a QR code (or visit our website) to browse the menu, place orders, and pay online. Our **front-desk team** receives paid orders in real time and prepares them.

The platform has two sides:

| Side | Users | Purpose |
|------|--------|---------|
| **Customer menu** | Guests / walk-in customers | Browse menu, add items to cart or order instantly, pay via mobile money |
| **Order desk** (`/orders`) | Front-desk staff | View paid orders live, accept and track preparation (New → Accepted → Preparing → Ready → Completed) |

**Key features today:**
- Live menu (categories, products, prices, daily specials/discounts)
- Shopping cart and one-tap single-item ordering
- Order checkout with unique merchant reference (`tx_ref`) per transaction
- Order confirmation page for customers after successful payment
- Staff dashboard with real-time order updates
- Admin panel for menu management (separate from order desk)

---

## 2. How the platform works (technical flow)

```
Customer                    Messanta Platform              Staff
   │                              │                         │
   │  1. Browse menu & add items  │                         │
   │─────────────────────────────►│                         │
   │  2. Confirm order            │                         │
   │─────────────────────────────►│  Order saved as         │
   │                              │  pending_payment        │
   │  3. Redirect to Telebirr      │                         │
   │◄─────────────────────────────│                         │
   │  4. Pay on Telebirr (phone)  │                         │
   │─────────────────────────────►│                         │
   │                              │  5. Webhook confirms    │
   │                              │     payment → paid        │
   │                              │────────────────────────►│
   │  6. Return to success page   │  7. Order appears on    │
   │◄─────────────────────────────│     order desk (live)   │
```

**Stack:**
- **Frontend:** React (Vite), mobile-friendly web app
- **Backend / database:** Supabase (PostgreSQL)
- **Hosting:** Vercel (planned production URL: `[your-domain.com]`)

**Order lifecycle:**

| Status | Meaning |
|--------|---------|
| `pending_payment` | Order created; customer not yet paid |
| `paid` | Telebirr payment confirmed |
| `accepted` | Staff acknowledged the order |
| `preparing` | Kitchen is making the order |
| `ready` | Ready for pickup |
| `completed` | Order fulfilled |

Each order stores: order number, unique `tx_ref`, line items (product name, qty, price), total in ETB, Telebirr transaction reference, and timestamps.

---

## 3. Proposed Telebirr API integration

We request **Telebirr H5 C2B Web Payment** (Customer-to-Business) integration so customers can pay with Telebirr from their phone during checkout.

### 3.1 Integration model

| Step | Actor | Action |
|------|--------|--------|
| 1 | Customer | Confirms cart on Messanta checkout page |
| 2 | Messanta server | Creates order in DB (`pending_payment`) with unique `merchOrderId` / `tx_ref` |
| 3 | Messanta server | Calls Telebirr **Create Order / Pre-Order** API (server-side, signed) |
| 4 | Customer browser | Redirected to Telebirr hosted checkout (`/payment/web/paygate`) |
| 5 | Customer | Enters Telebirr PIN / approves payment on Telebirr UI |
| 6 | Telebirr | Sends **server-to-server notification** to our `notifyUrl` |
| 7 | Messanta server | Verifies signature, marks order `paid`, stores Telebirr reference |
| 8 | Customer | Redirected to our `returnUrl` (order success page) |
| 9 | Staff | Sees new paid order on `/orders` dashboard (real-time) |

**Note:** Customer phone number and payment credentials are collected **only on Telebirr's page**, not on our site.

### 3.2 Server-side endpoints we will implement

| Endpoint | Purpose |
|----------|---------|
| `POST /api/payment/telebirr/initiate` | Create Telebirr pre-order; return checkout URL |
| `POST /api/payment/telebirr/notify` | Receive & verify Telebirr webhook; update order to `paid` |
| `GET /order/success/:orderId` | Customer return page after payment |
| `POST /api/payment/telebirr/query` (optional) | Query order status if webhook is delayed |

All Telebirr credentials (Fabric App ID, App Secret, Merchant App ID, Merchant Code, RSA private key) will be stored **server-side only** — never exposed in the browser.

### 3.3 Data sent to Telebirr (per transaction)

| Field | Example / source |
|-------|------------------|
| `merchOrderId` / `tx_ref` | `messanta-{timestamp}-{random}` (unique per order) |
| `amount` | Order total in ETB (e.g. `150.00`) |
| `title` | `Messanta Coffee — Order #1042` |
| `notifyUrl` | `https://[domain]/api/payment/telebirr/notify` |
| `redirectUrl` | `https://[domain]/order/success/{orderId}` |

### 3.4 Security & compliance

- HTTPS on all production URLs
- RSA-signed API requests per Telebirr specification
- Webhook signature verification before updating order status
- Idempotent webhook handling (ignore duplicate notifications)
- No card or wallet credentials stored on our platform
- Payment confirmation driven by Telebirr webhook, not browser redirect alone

---

## 4. What we are requesting from Telebirr / Ethio Telecom

Please provide access to the following for **sandbox (test) and production**:

| Item | Purpose |
|------|---------|
| Merchant onboarding / KYC approval | Register Messanta Coffee as a merchant |
| **Fabric App ID** & **App Secret** | API authentication |
| **Merchant App ID** & **Merchant Code** | Payment routing |
| **RSA key pair** (or key registration process) | Request signing |
| **Sandbox API base URL** | Integration testing |
| **Production API base URL** | Go-live |
| **H5 Web Checkout documentation** | Create order, redirect, query, refund |
| **Webhook / notification specification** | `notifyUrl` payload format & signature verification |
| **Test Telebirr wallet / sandbox credentials** | End-to-end payment testing |
| Technical contact or developer portal access | Integration support |

**Preferred integration type:** H5 C2B Web Payment (browser redirect to Telebirr checkout).

**Optional (future):** USSD push / in-app Super App SDK if offered for embedded checkout.

---

## 5. Expected transaction volume (estimate)

| Metric | Estimate |
|--------|----------|
| Location | Single coffee shop (Harar, Ethiopia) |
| Daily orders | 20–80 (growth expected) |
| Average ticket | 80–250 ETB |
| Peak hours | Morning & afternoon |
| Channel | In-store QR scan + direct website |

---

## 6. Summary

Messanta Coffee is a ready-to-deploy **menu + ordering + staff fulfillment** platform. Payment is the final piece: we need **Telebirr C2B Web Payment API** so customers can pay in ETB at checkout and our team receives confirmed orders instantly.

We are prepared to implement server-side integration, webhook handling, and sandbox testing as soon as merchant credentials and API documentation are provided.

**Prepared by:** [Your name]  
**Business:** Messanta Coffee  
**Email:** [Your email]  
**Phone:** [Your phone]
