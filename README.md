# 🛠️ Secure Life Backend – REST API for Life Insurance Management

This is the **backend server** of the Secure Life platform. It handles all API routes for authentication, policy management, applications, user roles, Stripe payments, and more.

---

## 🌐 Base URL

```
https://secure-life-backend.vercel.app/
```

---

## 🚀 Features

- RESTful API with **Node.js + Express.js**
- **MongoDB** integration via official driver
- **Stripe** Payment Gateway Integration
- **Firebase Admin SDK** for auth verification
- **Role-based access**: Admin, Agent, Customer
- **CRUD operations** for:
  - Policies
  - Applications
  - Transactions
  - Users
- **Search & Pagination**
- **Assign Agent to Application**
- **PDF data support endpoint**
- **Secure API with token verification (ready for JWT/Firebase)**

---

## 📁 API Routes Overview

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/users` | Get all users (admin) |
| `PATCH` | `/users/role/:id` | Update user role |
| `GET` | `/agents` | Get all agents |
| `GET` | `/policies` | Paginated policy list with filters |
| `GET` | `/popular-policies` | Top 6 purchased policies |
| `POST` | `/policies` | Create new policy |
| `PATCH` | `/policies/:id` | Edit policy |
| `DELETE` | `/policies/:id` | Delete policy |
| `POST` | `/applications` | Submit new insurance application |
| `GET` | `/applications` | View all applications (admin) |
| `PATCH` | `/applications/approve/:id` | Approve an application |
| `PATCH` | `/applications/reject/:id` | Reject an application with feedback |
| `GET` | `/transactions` | Get payment transactions |
| `POST` | `/create-payment-intent` | Stripe intent for policy payments |

---

## 📦 Installed Packages and Versions

| Package                 | Version     |
|-------------------------|-------------|
| express                 | ^4.x.x      |
| cors                    | ^2.x.x      |
| dotenv                  | ^16.x.x     |
| mongodb                 | ^6.x.x      |
| stripe                  | ^12.x.x     |
| firebase-admin          | ^12.x.x     |
| cookie-parser           | ^1.x.x      |
| nodemon (dev)           | ^3.x.x      |

---

## ⚙️ Setup Instructions

1. Clone the repo:
   ```bash
   git clone https://github.com/yourname/secure-life-backend.git
   cd secure-life-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```env
   PORT=5000
   MONGODB_URI=your_mongo_uri
   STRIPE_SECRET_KEY=your_stripe_key
   
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

---

## 🧾 Stripe Integration

- Accepts payments using `create-payment-intent`
- Stores transactions in DB after confirmation

---

## 📌 Note

- No JWT used yet, but Firebase token verification is implemented.
- All routes are ready for frontend integration.
- Frontend repo: [Secure Life Frontend](https://secure-life.vercel.app)

