const express = require("express");
const path = require("path");
const pool = require("./config/db");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/dashboard", async (req, res) => {
  try {
    const [[customers]] = await pool.query("SELECT COUNT(*) AS total FROM customers");
    const [[orders]] = await pool.query("SELECT COUNT(*) AS total FROM orders");
    const [[pending]] = await pool.query("SELECT COUNT(*) AS total FROM orders WHERE status <> 'Delivered'");
    const [[revenue]] = await pool.query("SELECT COALESCE(SUM(amount),0) AS total FROM payments WHERE status='Paid'");
    res.json({ customers: customers.total, orders: orders.total, pending: pending.total, revenue: revenue.total });
  } catch (e) { res.status(500).json({ error: "Could not load dashboard" }); }
});

app.get("/api/customers", async (req, res) => {
  try { const [rows] = await pool.query("SELECT * FROM customers ORDER BY customer_id DESC"); res.json(rows); }
  catch (e) { res.status(500).json({ error: "Could not load customers" }); }
});

app.post("/api/customers", async (req, res) => {
  const { name, phone, email, address } = req.body;
  if (!name || !phone) return res.status(400).json({ error: "Name and phone are required" });
  try {
    const [r] = await pool.query(
      "INSERT INTO customers (name,phone,email,address) VALUES (?,?,?,?)",
      [name, phone, email || null, address || null]
    );
    res.status(201).json({ customer_id: r.insertId, message: "Customer added" });
  } catch (e) { res.status(500).json({ error: "Could not add customer" }); }
});

app.get("/api/services", async (req, res) => {
  try { const [rows] = await pool.query("SELECT * FROM services ORDER BY service_id"); res.json(rows); }
  catch (e) { res.status(500).json({ error: "Could not load services" }); }
});

app.get("/api/orders", async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT o.*, c.name AS customer_name, s.service_name
      FROM orders o JOIN customers c ON o.customer_id=c.customer_id
      JOIN services s ON o.service_id=s.service_id ORDER BY o.order_id DESC`);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: "Could not load orders" }); }
});

app.post("/api/orders", async (req, res) => {
  const { customer_id, service_id, clothes_weight, delivery_date } = req.body;
  if (!customer_id || !service_id || Number(clothes_weight) <= 0)
    return res.status(400).json({ error: "Choose a customer, service and valid weight" });
  try {
    const [[service]] = await pool.query("SELECT price_per_kg FROM services WHERE service_id=?", [service_id]);
    if (!service) return res.status(400).json({ error: "Service not found" });
    const amount = Number((Number(clothes_weight) * Number(service.price_per_kg)).toFixed(2));
    const [r] = await pool.query(
      `INSERT INTO orders (customer_id,service_id,clothes_weight,order_date,delivery_date,total_amount,status)
       VALUES (?,?,?,CURDATE(),?,?, 'Received')`,
      [customer_id, service_id, clothes_weight, delivery_date || null, amount]
    );
    res.status(201).json({ order_id: r.insertId, total_amount: amount, message: "Order created" });
  } catch (e) { res.status(500).json({ error: "Could not create order" }); }
});

app.patch("/api/orders/:id/status", async (req, res) => {
  const allowed = ["Received", "Washing", "Ironing", "Ready", "Delivered"];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ error: "Invalid status" });
  try {
    const [r] = await pool.query("UPDATE orders SET status=? WHERE order_id=?", [req.body.status, req.params.id]);
    if (!r.affectedRows) return res.status(404).json({ error: "Order not found" });
    res.json({ message: "Order status updated" });
  } catch (e) { res.status(500).json({ error: "Could not update order" }); }
});

app.get("/api/payments", async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT p.*, o.total_amount, c.name AS customer_name
      FROM payments p JOIN orders o ON p.order_id=o.order_id
      JOIN customers c ON o.customer_id=c.customer_id ORDER BY p.payment_id DESC`);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: "Could not load payments" }); }
});

app.post("/api/payments", async (req, res) => {
  const { order_id, amount, payment_method, status } = req.body;
  if (!order_id || Number(amount) <= 0) return res.status(400).json({ error: "Order and valid amount are required" });
  try {
    const [r] = await pool.query(
      "INSERT INTO payments (order_id,amount,payment_date,payment_method,status) VALUES (?,?,CURDATE(),?,?)",
      [order_id, amount, payment_method || "Cash", status || "Paid"]
    );
    res.status(201).json({ payment_id: r.insertId, message: "Payment recorded" });
  } catch (e) { res.status(500).json({ error: "Could not record payment" }); }
});

app.get("*", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Jeeveshwar Laundry app running at http://localhost:${PORT}`));
