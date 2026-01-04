"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./dashboard.scss"; // Separate simple file for dashboard styles
import { Trash2, RefreshCw } from "lucide-react";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/AllOrders");
      setOrders(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id, field, value) => {
    // Optimistic update
    const updatedOrders = orders.map(o => o._id === id ? { ...o, [field === 'status' ? 'status' : 'payment']: field === 'status' ? value : { ...o.payment, status: value } } : o);
    setOrders(updatedOrders);
    
    await axios.put("/api/AllOrders", { 
        id, 
        status: field === 'status' ? value : orders.find(o=>o._id===id).status,
        paymentStatus: field === 'payment' ? value : orders.find(o=>o._id===id).payment.status
    });
  };

  const deleteOrder = async (id) => {
      if(!confirm("Delete this order?")) return;
      await axios.delete("/api/AllOrders", { data: { id } });
      fetchOrders();
  };

  return (
    <div className="admin-dashboard">
      <header>
        <h1>Viking Armory Command</h1>
        <button onClick={fetchOrders}><RefreshCw size={16}/> Refresh</button>
      </header>
      
      {loading ? <div className="loading">Loading Forges...</div> : (
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Method</th>
                <th>Payment Status</th>
                <th>Order Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td>#{order._id.slice(-6).toUpperCase()}</td>
                  <td>
                    <div>{order.customer.firstName} {order.customer.lastName}</div>
                    <small>{order.customer.email}</small>
                  </td>
                  <td>${order.financials.total}</td>
                  <td><span className={`badge ${order.payment.method}`}>{order.payment.method}</span></td>
                  <td>
                    <select 
                      value={order.payment.status} 
                      onChange={(e) => updateStatus(order._id, 'payment', e.target.value)}
                      className={`status-select ${order.payment.status}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                    </select>
                  </td>
                  <td>
                     <select 
                      value={order.status} 
                      onChange={(e) => updateStatus(order._id, 'status', e.target.value)}
                      className="status-select"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>
                    <button className="del-btn" onClick={() => deleteOrder(order._id)}><Trash2 size={16}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}