import { useState, useEffect, useMemo } from "react";
import { getOrders } from "../../services/orderService";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  FileText, Clock, CheckCircle, Search, RefreshCw, X
} from "lucide-react";
import StockLogo from "../../components/ui/StockLogo";

// Format currency
const formatINR = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterQuery, setFilterQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchOrdersData = async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Fetch orders error:", error);
      toast.error("Failed to load your order book");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersData();
  }, []);

  // Filter orders based on query and status
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSymbol = o.symbol.toUpperCase().includes(filterQuery.toUpperCase());
      const matchesStatus = statusFilter === "ALL" || o.status.toUpperCase() === statusFilter.toUpperCase();
      return matchesSymbol && matchesStatus;
    });
  }, [orders, filterQuery, statusFilter]);

  return (
    <div className="orders-page-container">
      {/* HERO HEADER */}
      <div className="orders-hero">
        <div className="orders-hero-left">
          <div className="orders-hero-title-row">
            <h1>Order Book</h1>
          </div>
          <p>View transaction logs and virtual execution history</p>
        </div>
        <button onClick={fetchOrdersData} className="refresh-orders-btn">
          <RefreshCw size={15} className="mr-1.5" />
          Refresh
        </button>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="orders-filter-bar">
        <div className="search-orders-wrapper">
          <Search className="search-orders-icon" size={16} />
          <input
            type="text"
            placeholder="Search by stock symbol..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="search-orders-input"
          />
        </div>

        <div className="status-filters-group">
          {["ALL", "EXECUTED", "PENDING", "CANCELLED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`status-filter-btn ${statusFilter === status ? "active" : ""}`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* ORDERS LIST TABLE */}
      {loading ? (
        <div className="watchlist-loading-state">
          <RefreshCw className="animate-spin text-emerald-400" size={32} />
          <p>Loading transaction history...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="watchlist-empty-state">
          <div className="empty-state-icon-box">
            <Clock size={40} className="text-slate-400" />
          </div>
          <h2>No Orders Found</h2>
          <p>
            {orders.length === 0
              ? "You haven't placed any virtual trades yet."
              : "No orders match the selected filters."
            }
          </p>
        </div>
      ) : (
        <div className="orders-table-card">
          <div className="orders-table-responsive-wrapper">
            <table className="orders-table-widget">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Stock</th>
                  <th>Type</th>
                  <th className="num">Quantity</th>
                  <th className="num">Price</th>
                  <th className="num">Total Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredOrders.map((o) => {
                    const dateObj = new Date(o.createdAt);
                    const dateTimeStr = `${dateObj.toLocaleDateString("en-IN")} ${dateObj.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`;
                    const isBuy = o.type === "BUY";

                    return (
                      <motion.tr
                        layout
                        key={o._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <td className="order-time-col">{dateTimeStr}</td>
                        <td className="order-symbol-col">
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <StockLogo symbol={o.symbol} size={28} />
                            <div style={{ display: "flex", flexDirection: "column" }}>
                              <span className="sym-bold">{o.symbol}</span>
                              <span className="exchange-pill" style={{ alignSelf: "flex-start", marginTop: "2px" }}>NSE</span>
                            </div>
                          </div>
                        </td>
                        <td className="order-type-col">
                          <span className={`order-type-badge ${isBuy ? "buy" : "sell"}`}>
                            {o.type}
                          </span>
                        </td>
                        <td className="num">{o.quantity}</td>
                        <td className="num">{formatINR(o.price)}</td>
                        <td className="num font-semibold">{formatINR(o.quantity * o.price)}</td>
                        <td className="order-status-col">
                          <span className={`order-status-badge ${o.status.toLowerCase()}`}>
                            {o.status === "EXECUTED" ? (
                              <CheckCircle size={11} className="inline mr-1" />
                            ) : o.status === "CANCELLED" ? (
                              <X size={11} className="inline mr-1" />
                            ) : (
                              <Clock size={11} className="inline mr-1" />
                            )}
                            {o.status}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
