# 🛒 Retail ERP Management System

A full stack **Retail Management System** designed for supermarket operations, including billing, inventory management, role based access control, and payment processing.  
This system provides a centralized platform for managing day to day retail business operations efficiently and securely.

---

## 🚀 Features

### 👨‍💼 Admin Panel
- Manage users and roles (Admin, Manager, Cashier, Stock Manager)
- Monitor overall system activities
- Access system wide reports and analytics

### 🧑‍💼 Manager Module
- View sales reports and performance analytics
- Monitor inventory levels
- Manage business operations overview

### 🧾 Cashier (Billing System)
- Fast and efficient checkout system
- Generate customer invoices/receipts
- Handle daily transactions

### 📦 Stock Management
- Add, update, and delete products
- Track inventory in real time
- Low stock alerts and monitoring

### 💳 Payment Integration
- Secure payment processing
- Transaction history tracking
- Support for online payment gateways

---

## 🏗️ System Architecture

- **Frontend:** Next.js
- **Backend:** Spring Boot (REST API + Business Logic)
- **Database:** PostgreSQL
- **Authentication:** JWT based Role Authentication
- **Architecture Style:** Client–Server Architecture

---

## 🛠️ Tech Stack

### Frontend
- Next.js
- TypeScript / JavaScript
- CSS

### Backend
- Java
- Spring Boot
- Spring Security
- Spring Data JPA
- iText (PDF Generation)
- Maven

### Database
- PostgreSQL

### Tools & Services
- JWT Authentication
- REST APIs
- Payment Gateway Integration (paypal)

## Run the backend locally

The backend requires Java 21 and a Supabase database password. New Supabase projects expose `db.<project>.supabase.co` on **IPv6 only**. This Windows machine cannot resolve that host, so Spring Boot never starts and the frontend shows login failed.

Use the **Session pooler** (IPv4, port 5432). Host and username are in `backend/src/main/resources/application.yml`. In PowerShell:

```powershell
cd "D:\PROJECTS 2026\ERP-Systems\backend"
$env:DB_PASSWORD = '<your Supabase database password>'
.\mvnw.cmd spring-boot:run
```

This project’s session pooler host is `aws-0-ap-northeast-1.pooler.supabase.com`. If startup reports `tenant/user not found`, copy the exact host from the Supabase Dashboard **Connect** dialog and override it:

```powershell
$env:SPRING_DATASOURCE_URL = 'jdbc:postgresql://<POOLER-HOST>:5432/postgres?sslmode=require'
$env:SPRING_DATASOURCE_USERNAME = 'postgres.<PROJECT-REF>'
```

The password is read from `SPRING_DATASOURCE_PASSWORD` (or the legacy `DB_PASSWORD`) and must not be committed. The API should be available at `http://localhost:8080`.

For Render, configure `SPRING_DATASOURCE_URL` as a JDBC URL (`jdbc:postgresql://<HOST>:5432/<DATABASE>?sslmode=require`), `SPRING_DATASOURCE_USERNAME` as the database username, and `SPRING_DATASOURCE_PASSWORD` as the database password. Render's `DATABASE_URL` value is not a JDBC URL; do not use it directly for `SPRING_DATASOURCE_URL`.

### Troubleshoot Render startup with Supabase

If Render exits during startup with `EMAXCONNSESSION` or `max clients reached in session mode`, the Supabase session pooler has no free client slots. The backend limits its Hikari connection pool to 3 connections, but those slots are shared with other app instances and local clients.

- In Render, keep the backend service at one instance while using the Supabase session pooler.
- Stop locally running copies of the backend and any other apps using the same Supabase database, then redeploy the Render service.
- In Supabase, check the database/pooler connections and close or restart stale clients if the pool remains full. Do not paste database passwords into logs or support messages.
- Keep the three `SPRING_DATASOURCE_*` variables set on the Render backend service, and make sure the URL is the JDBC session-pooler URL. The app listens on Render's `PORT` automatically.

The Hibernate `PostgreSQLDialect` warning is not the cause of this failure; Hibernate now detects the dialect from the database connection.

### Deploy the frontend to Vercel

1. Import this repository into Vercel and set the **Root Directory** to `frontend` (keep the Next.js framework preset and default build command).
2. Add the environment variable `NEXT_PUBLIC_API_BASE_URL` with the Render backend origin, for example `https://smartstore-retail-erp.onrender.com` (no trailing slash and no `/api` suffix). Set it for Production and Preview as needed, then deploy.
3. Copy the deployed Vercel frontend origin, such as `https://<your-project>.vercel.app`, into the Render backend environment variable `CORS_ALLOWED_ORIGINS`. For multiple exact origins, separate them with commas. Do not include a path or trailing slash.
4. Redeploy the Render backend after changing `CORS_ALLOWED_ORIGINS`. Redeploy the Vercel frontend after changing `NEXT_PUBLIC_API_BASE_URL`; Next.js embeds this public variable during the build.
5. Open the Vercel URL and try logging in. If requests fail, check the browser developer console and Render logs; confirm the request goes to the Render URL and the Vercel origin exactly matches `CORS_ALLOWED_ORIGINS`.

For local development, the frontend defaults to `http://localhost:8080`; copy `frontend/.env.example` to `frontend/.env.local` only if you need to override it.

Default login accounts (created on first start if missing): `admin` / `admin123`, `cashier` / `cashier123`, `manager` / `manager123`.
