# Jeeveshwar Laundry Service Management System

A beginner-friendly full-stack mini project built with **HTML, CSS, JavaScript, Node.js, Express.js and MySQL**.

## Project description
Manage laundry customers, available services, clothes orders, delivery progress and payment records. Customers can be registered, staff can create orders for washing/ironing/dry cleaning, update order status and record payments.

## Main features
- Dashboard showing customer count, order count, active orders and paid revenue
- Add and view customers
- View laundry services and per-kg prices
- Create orders; total price is calculated from weight × service price
- Update order status: Received, Washing, Ironing, Ready, Delivered
- Record payments using Cash, UPI, Card or Bank Transfer

## Database tables
1. `customers` — customer contact information.
2. `services` — laundry service name, type, price per kg and description.
3. `orders` — customer/service references, clothes weight, dates, amount and status.
4. `payments` — order reference, amount, payment date, method and status.

### Relationship
- One customer can have many orders.
- One service can be used in many orders.
- One order can have multiple payment records.

## Folder structure
```text
Jeeveshwar-Laundry-Service-Management-System/
├── config/
│   └── db.js
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── routes/                 # Reserved for separating API routes later
├── .env.example
├── .gitignore
├── database.sql
├── package.json
├── README.md
└── server.js
```

## Requirements
- Node.js and npm
- MySQL Server (and MySQL Workbench, optional)
- VS Code or another code editor

## Run on your computer
1. Open this project folder in VS Code.
2. Start MySQL Server.
3. Open MySQL Workbench and run the complete `database.sql` file.
4. In the project terminal, install dependencies:
   ```bash
   npm install
   ```
5. Copy `.env.example` to a new file named `.env`. Enter your MySQL password in `DB_PASSWORD`. Keep `.env` private; it is ignored by Git.
6. Start the application:
   ```bash
   npm start
   ```
7. Open `http://localhost:3000` in your browser.

## API endpoints
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/dashboard` | Dashboard totals |
| GET, POST | `/api/customers` | List/add customers |
| GET | `/api/services` | List services |
| GET, POST | `/api/orders` | List/create orders |
| PATCH | `/api/orders/:id/status` | Update order status |
| GET, POST | `/api/payments` | List/record payments |

## GitHub upload
Create a new empty repository named `Jeeveshwar-Laundry-Service-Management-System` on GitHub. Then run these commands from this project folder (replace the URL with your repository URL):

```bash
git init
git add .
git commit -m "Initial commit: Jeeveshwar Laundry Service Management System"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/Jeeveshwar-Laundry-Service-Management-System.git
git push -u origin main
```

**Important:** Do not upload `.env` or your database password. `.gitignore` excludes `.env` and `node_modules`.
