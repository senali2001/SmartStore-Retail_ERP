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

The backend requires Java 21 and a Supabase PostgreSQL database. In the Supabase Dashboard, open **Connect** and select the **Session pooler**. Use that connection's host and username; the username is project-specific. In PowerShell, from the repository root, set the connection details (replace the host and username with the exact values shown by Supabase):

```powershell
$env:SPRING_DATASOURCE_URL = 'jdbc:postgresql://<POOLER-HOST>:5432/postgres?sslmode=require'
$env:SPRING_DATASOURCE_USERNAME = '<POOLER-USERNAME>'
$securePassword = Read-Host "Supabase database password" -AsSecureString
$env:SPRING_DATASOURCE_PASSWORD = [System.Net.NetworkCredential]::new("", $securePassword).Password

$env:JAVA_HOME = 'C:\Program Files\Java\jdk-21.0.12.1'
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
.\backend\mvnw.cmd -f .\backend\pom.xml spring-boot:run
```

At the password prompt, type the database password and press Enter. Do not put the password inside the `Read-Host` prompt text or paste it into source code, logs, or chat. The URL and username are required so the app cannot silently connect with stale credentials. The API should be available at `http://localhost:8080`.

For Render, configure `SPRING_DATASOURCE_URL` as a JDBC URL (`jdbc:postgresql://<HOST>:5432/<DATABASE>?sslmode=require`), `SPRING_DATASOURCE_USERNAME` as the database username, and `SPRING_DATASOURCE_PASSWORD` as the database password. Render's `DATABASE_URL` value is not a JDBC URL; do not use it directly for `SPRING_DATASOURCE_URL`.

### Troubleshoot Render startup with Supabase

If Render exits during startup with `EMAXCONNSESSION` or `max clients reached in session mode`, the Supabase session pooler has no free client slots. The backend limits its Hikari connection pool to 3 connections, but those slots are shared with other app instances and local clients.

- In Render, keep the backend service at one instance while using the Supabase session pooler.
- Stop locally running copies of the backend and any other apps using the same Supabase database, then redeploy the Render service.
- In Supabase, check the database/pooler connections and close or restart stale clients if the pool remains full. Do not paste database passwords into logs or support messages.
- Keep the three `SPRING_DATASOURCE_*` variables set on the Render backend service, and make sure the URL is the JDBC session-pooler URL. The app listens on Render's `PORT` automatically.

The Hibernate `PostgreSQLDialect` warning is not the cause of this failure; Hibernate now detects the dialect from the database connection.

The backend Render URL is an API service, not a frontend webpage. Opening its root URL returns a small health response (`status: UP`); use the Vercel URL for the actual application UI.

### Deploy the frontend to Vercel

1. Import this repository into Vercel and set the **Root Directory** to `frontend` (keep the Next.js framework preset and default build command).
2. Add the environment variable `NEXT_PUBLIC_API_BASE_URL` with the Render backend origin `https://smartstore-vqsc.onrender.com` (no trailing slash and no `/api` suffix). Set it for Production and Preview as needed, then deploy.
3. The frontend sends API calls through its same-origin Next.js proxy, so the Vercel domain does not need to be added to backend CORS for those calls. `CORS_ALLOWED_ORIGINS` is only needed for clients that call the backend directly; set it to their exact origins, separated by commas, with no path or trailing slash.
4. Redeploy the Render backend after changing its environment variables. Redeploy the Vercel frontend after changing `NEXT_PUBLIC_API_BASE_URL`; Next.js uses this value when building the API proxy.
5. Open the Vercel URL and try logging in. If requests fail, check the browser developer console and Render logs; in the browser Network panel, API requests should use the frontend's `/api/...` path.

The frontend sends API requests through a same-origin Next.js proxy, which avoids browser CORS failures. The proxy uses `NEXT_PUBLIC_API_BASE_URL`; when it is unset, it targets `https://smartstore-vqsc.onrender.com`. For local development against a locally running backend, set `NEXT_PUBLIC_API_BASE_URL=http://localhost:8080` in `frontend/.env.local`. Copy `frontend/.env.example` to use the deployed API.

Default login accounts (created on first start if missing): `admin` / `admin123`, `cashier` / `cashier123`, `manager` / `manager123`.
