"use client";
import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Bar from "../AdminLayout";
import { 
  Search, Filter, CheckCircle, Clock, Truck, XCircle, 
  Package, Eye, Loader2, Trash2, AlertTriangle, X 
} from "lucide-react";
import Image from "next/image";
import "./admin-orders.scss"; 

// --- STATUS BADGE COMPONENT ---
const StatusBadge = ({ status }) => {
  const statusClass = status ? status.toLowerCase() : "processing";
  
  const icons = {
    Processing: <Package size={12} />,
    Shipped: <Truck size={12} />,
    Delivered: <CheckCircle size={12} />,
    Cancelled: <XCircle size={12} />,
  };

  return (
    <span className={`status-badge ${statusClass}`}>
      {icons[status] || <Clock size={12} />}
      {status}
    </span>
  );
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null); // Stores ID of order to delete
  const [isDeleting, setIsDeleting] = useState(false);

  // --- FETCH REAL DATA ---
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get("/api/AllOrders");
        if (data.success) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error("Error loading orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // --- DELETE LOGIC ---
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      // Call API
      await axios.delete(`/api/AllOrders/${deleteTarget}`);
      
      // Update UI immediately (remove deleted order from list)
      setOrders((prev) => prev.filter((o) => o._id !== deleteTarget));
      
      // Close Popup
      setDeleteTarget(null);
    } catch (error) {
      alert("Failed to delete order");
    } finally {
      setIsDeleting(false);
    }
  };

  // --- FILTERING LOGIC ---
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const searchLower = search.toLowerCase();
      const orderId = order._id ? order._id.toLowerCase() : "";
      
      const firstName = order.customer?.firstName || "";
      const lastName = order.customer?.lastName || "";
      const email = order.customer?.email || "";
      
      const fullName = `${firstName} ${lastName}`.toLowerCase();
      const emailLower = email.toLowerCase();

      const matchesSearch = orderId.includes(searchLower) || 
                            fullName.includes(searchLower) ||
                            emailLower.includes(searchLower);

      const matchesStatus = statusFilter === "All" || order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  return (
    <div className="admin-simple-container">
      <Bar />
      {/* DELETE CONFIRMATION POPUP */}
      {deleteTarget && (
        <div className="popup-overlay">
          <div className="popup-box">
             <div className="icon-wrapper danger">
               <AlertTriangle size={40} />
             </div>
             <h3>Delete Order?</h3>
             <p>Are you sure you want to permanently delete order <span>#{deleteTarget.slice(-6).toUpperCase()}</span>? This cannot be undone.</p>
             <div className="popup-actions">
               <button className="btn-cancel" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>Cancel</button>
               <button className="btn-confirm" onClick={confirmDelete} disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Yes, Delete"}
               </button>
             </div>
          </div>
        </div>
      )}

      <div className="table-wrapper">
        
        {/* TOOLBAR */}
        <div className="toolbar">
           <div className="search-box">
             <Search className="search-icon" size={18} />
             <input 
               type="text" 
               placeholder="Search ID, Name or Email..." 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
             />
           </div>
           
           <div className="filter-box">
             <Filter size={18} />
             <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="All">All Status</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
             </select>
           </div>
        </div>

        {/* TABLE */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th align="right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="empty-state">
                    <div className="loading-row"><Loader2 className="spin" /> Loading Orders...</div>
                  </td>
                </tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const firstName = order.customer?.firstName || "Guest";
                  const lastName = order.customer?.lastName || "User";
                  const email = order.customer?.email || "No Email";
                  
                  return (
                    <tr key={order._id}>
                      <td className="fw-bold">
                         #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="text-muted">
                         {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="customer-cell">
                          <div className="avatar-small">
                             <Image 
                               src={`https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`} 
                               width={32} height={32} 
                               alt="Avatar" 
                             />
                          </div>
                          <div>
                            <p className="cust-name">{firstName} {lastName}</p>
                            <p className="cust-email">{email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="fw-bold">
                         ${order.financials?.total?.toFixed(2) || "0.00"}
                      </td>
                      <td><StatusBadge status={order.status} /></td>
                      <td align="right">
                         <div className="action-buttons">
                           <Link href={`/admin/Orders/${order._id}`} className="btn-icon view" title="View Details">
                             <Eye size={18} />
                           </Link>
                           <button 
                              className="btn-icon delete" 
                              title="Delete Order"
                              onClick={() => setDeleteTarget(order._id)}
                           >
                             <Trash2 size={18} />
                           </button>
                         </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="empty-state">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="pagination">
          <p>Showing {filteredOrders.length} results</p>
          <div className="buttons">
             <button disabled>Prev</button>
             <button disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}