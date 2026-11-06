const $ = (id) => document.getElementById(id);
const message = (text, bad=false) => { $("message").textContent=text; $("message").style.color=bad?"#b33":"#176b87"; };
async function api(url, options={}) {
  const response = await fetch(url, { headers: {"Content-Type":"application/json"}, ...options });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data;
}
async function loadDashboard(){
  const d=await api("/api/dashboard");
  $("customerCount").textContent=d.customers; $("orderCount").textContent=d.orders;
  $("pendingCount").textContent=d.pending;
  $("revenue").textContent="₹"+Number(d.revenue).toFixed(2);
}
async function loadCustomers(){
  const rows=await api("/api/customers");
  $("customerSelect").innerHTML='<option value="">Select customer</option>'+rows.map(c=>`<option value="${c.customer_id}">${escapeHtml(c.name)} (#${c.customer_id})</option>`).join("");
}
async function loadServices(){
  const rows=await api("/api/services");
  $("serviceSelect").innerHTML='<option value="">Select service</option>'+rows.map(s=>`<option value="${s.service_id}">${escapeHtml(s.service_name)} — ₹${s.price_per_kg}/kg</option>`).join("");
  $("serviceList").innerHTML=rows.map(s=>`<div class="service-item"><span>${escapeHtml(s.service_name)}</span><strong>₹${Number(s.price_per_kg).toFixed(2)}/kg</strong></div>`).join("");
}
async function loadOrders(){
  const rows=await api("/api/orders");
  $("ordersBody").innerHTML=rows.length?rows.map(o=>`<tr><td>#${o.order_id}</td><td>${escapeHtml(o.customer_name)}</td><td>${escapeHtml(o.service_name)}</td><td>${o.clothes_weight} kg</td><td>₹${Number(o.total_amount).toFixed(2)}</td><td><span class="status">${escapeHtml(o.status)}</span></td><td><select data-order="${o.order_id}" class="statusSelect">${["Received","Washing","Ironing","Ready","Delivered"].map(s=>`<option ${s===o.status?"selected":""}>${s}</option>`).join("")}</select></td></tr>`).join(""):'<tr><td colspan="7">No orders yet. Create your first order above.</td></tr>';
  $("paymentOrder").innerHTML='<option value="">Select order</option>'+rows.map(o=>`<option value="${o.order_id}">#${o.order_id} — ${escapeHtml(o.customer_name)} (₹${Number(o.total_amount).toFixed(2)})</option>`).join("");
}
function escapeHtml(value){return String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
$("customerForm").addEventListener("submit",async e=>{e.preventDefault();try{await api("/api/customers",{method:"POST",body:JSON.stringify(Object.fromEntries(new FormData(e.target)))});e.target.reset();await loadCustomers();await loadDashboard();message("Customer added successfully.");}catch(err){message(err.message,true);}});
$("orderForm").addEventListener("submit",async e=>{e.preventDefault();try{const d=await api("/api/orders",{method:"POST",body:JSON.stringify(Object.fromEntries(new FormData(e.target)))});e.target.reset();await refresh();message(`Order #${d.order_id} created. Total: ₹${Number(d.total_amount).toFixed(2)}`);}catch(err){message(err.message,true);}});
$("paymentForm").addEventListener("submit",async e=>{e.preventDefault();try{await api("/api/payments",{method:"POST",body:JSON.stringify(Object.fromEntries(new FormData(e.target)))});e.target.reset();await loadDashboard();message("Payment recorded.");}catch(err){message(err.message,true);}});
$("ordersBody").addEventListener("change",async e=>{if(!e.target.matches(".statusSelect"))return;try{await api(`/api/orders/${e.target.dataset.order}/status`,{method:"PATCH",body:JSON.stringify({status:e.target.value})});await refresh();message("Order status updated.");}catch(err){message(err.message,true);}});
async function refresh(){await Promise.all([loadDashboard(),loadCustomers(),loadServices(),loadOrders()]);}
$("refreshBtn").addEventListener("click",()=>refresh().catch(e=>message(e.message,true)));
refresh().catch(e=>message("Setup required: "+e.message,true));
