import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getOrders } from "../../services/orderService";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  SlidersHorizontal, ChevronDown, Search, X, RefreshCw, Briefcase, Clock
} from "lucide-react";
import StockLogo from "../../components/ui/StockLogo";

// Helper to format currency
const formatINR = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
};

// Helper to format time into "hh:mm AM/PM"
const formatTime = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

// Helper to format date groups into "02 Jul '25"
const formatDateGroup = (dateStr) => {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    const day = String(date.getDate()).padStart(2, "0");
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const month = monthNames[date.getMonth()];
    const year = String(date.getFullYear()).slice(-2);
    return `${day} ${month} '${year}`;
  }
};

const defaultFilters = {
  type: "All",
  dateRange: "All",
  selectedCompanies: [],
  status: "All",
  buySell: "All",
};

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Nav tabs: Stocks, F&O, Mutual Funds, Bonds
  const [activeNavTab, setActiveNavTab] = useState("Stocks");

  // Filters Drawer States
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Type");
  const [companySearchQuery, setCompanySearchQuery] = useState("");

  const [tempFilters, setTempFilters] = useState({ ...defaultFilters });
  const [appliedFilters, setAppliedFilters] = useState({ ...defaultFilters });

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

  // Unique symbols extracted from orders for search checklist
  const uniqueSymbols = useMemo(() => {
    const symbols = new Set();
    orders.forEach((o) => {
      if (o.symbol) symbols.add(o.symbol.toUpperCase());
    });
    return Array.from(symbols).sort();
  }, [orders]);

  // Filter list of symbols by text query inside Company filter tab
  const filteredCompanySymbols = useMemo(() => {
    return uniqueSymbols.filter((s) =>
      s.includes(companySearchQuery.toUpperCase())
    );
  }, [uniqueSymbols, companySearchQuery]);

  // Active filters count (both default and custom active count)
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (appliedFilters.type) count++;
    if (appliedFilters.dateRange !== "All") count++;
    if (appliedFilters.status !== "All") count++;
    if (appliedFilters.buySell !== "All") count++;
    if (appliedFilters.selectedCompanies.length > 0) count++;
    return count;
  }, [appliedFilters]);

  // Check if any non-default filter is currently applied
  const hasNonDefaultFilters = useMemo(() => {
    return (
      appliedFilters.type !== "All" ||
      appliedFilters.dateRange !== "All" ||
      appliedFilters.status !== "All" ||
      appliedFilters.buySell !== "All" ||
      appliedFilters.selectedCompanies.length > 0
    );
  }, [appliedFilters]);

  // Main filter function applied to orders list
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // 1. Type Filter (Delivery vs Intraday)
      if (appliedFilters.type !== "All") {
        const orderProd = o.productType?.toUpperCase() || "DELIVERY";
        if (appliedFilters.type === "Delivery" && orderProd !== "DELIVERY") return false;
        if (appliedFilters.type === "Intraday" && orderProd !== "INTRADAY") return false;
      }

      // 2. Status Filter
      if (appliedFilters.status !== "All") {
        if (o.status?.toUpperCase() !== appliedFilters.status.toUpperCase()) return false;
      }

      // 3. Buy/Sell Filter
      if (appliedFilters.buySell !== "All") {
        if (o.type?.toUpperCase() !== appliedFilters.buySell.toUpperCase()) return false;
      }

      // 4. Date Filter
      if (appliedFilters.dateRange !== "All") {
        const orderDate = new Date(o.createdAt);
        const now = new Date();
        if (appliedFilters.dateRange === "Today") {
          if (orderDate.toDateString() !== now.toDateString()) return false;
        } else if (appliedFilters.dateRange === "Last 7 Days") {
          const limit = new Date();
          limit.setDate(limit.getDate() - 7);
          if (orderDate < limit) return false;
        } else if (appliedFilters.dateRange === "Last 30 Days") {
          const limit = new Date();
          limit.setDate(limit.getDate() - 30);
          if (orderDate < limit) return false;
        }
      }

      // 5. Company Checklist Filter
      if (appliedFilters.selectedCompanies.length > 0) {
        if (!appliedFilters.selectedCompanies.includes(o.symbol.toUpperCase())) return false;
      }

      return true;
    });
  }, [orders, appliedFilters]);

  // Group filtered orders by date of creation
  const groupedOrders = useMemo(() => {
    const groups = {};
    filteredOrders.forEach((order) => {
      const dateKey = new Date(order.createdAt).toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(order);
    });

    // Sort dates descending
    return Object.keys(groups)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .map((dateStr) => ({
        dateLabel: formatDateGroup(dateStr),
        dateStr,
        items: groups[dateStr],
      }));
  }, [filteredOrders]);

  // Open drawer and set active tab in sidebar
  const handleChipClick = (category) => {
    setSelectedCategory(category);
    setTempFilters({ ...appliedFilters });
    setIsFilterOpen(true);
  };

  const handleOpenFilterDrawer = () => {
    setTempFilters({ ...appliedFilters });
    setIsFilterOpen(true);
  };

  const handleApplyFilters = () => {
    setAppliedFilters({ ...tempFilters });
    setIsFilterOpen(false);
    toast.success("Filters applied");
  };

  const handleClearAllFilters = () => {
    setTempFilters({ ...defaultFilters });
    setAppliedFilters({ ...defaultFilters });
    setIsFilterOpen(false);
    toast.success("Filters cleared");
  };

  // Toggle company symbol checkbox inside Company category panel
  const handleCompanyToggle = (symbol) => {
    setTempFilters((prev) => {
      const list = [...prev.selectedCompanies];
      const idx = list.indexOf(symbol);
      if (idx > -1) {
        list.splice(idx, 1);
      } else {
        list.push(symbol);
      }
      return { ...prev, selectedCompanies: list };
    });
  };

  return (
    <div className="orders-page-container">
      {/* Title */}
      <h1 className="orders-page-title">All orders</h1>

      {/* Navigation tabs */}
      <div className="orders-nav-tabs">
        {["Stocks"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveNavTab(tab)}
            className={`orders-nav-tab ${activeNavTab === tab ? "active" : ""}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeNavTab !== "Stocks" ? (
        <div className="watchlist-empty-state" style={{ minHeight: "300px" }}>
          <div className="empty-state-icon-box">
            <Briefcase size={32} className="text-slate-400" />
          </div>
          <h2>No Orders Found</h2>
          <p>You haven't placed any virtual orders in {activeNavTab} yet.</p>
        </div>
      ) : (
        <>
          {/* Active Chips row */}
          <div className="orders-filter-row">
            {/* Filter button icon */}
            <div className="filter-circle-btn-wrapper">
              <button
                onClick={handleOpenFilterDrawer}
                className="filter-circle-btn"
                title="Open Filters drawer"
              >
                <SlidersHorizontal size={15} />
              </button>
              {activeFiltersCount > 0 && (
                <div className="filter-badge-count">{activeFiltersCount}</div>
              )}
            </div>

            {/* Type Chip */}
            <button
              onClick={() => handleChipClick("Type")}
              className="filter-chip-btn"
            >
              {appliedFilters.type === "All" ? "Regular" : appliedFilters.type}
              <ChevronDown className="chevron" size={13} />
            </button>

            {/* Optional dynamic chips if non-default filters are active */}
            {appliedFilters.status !== "All" && (
              <button
                onClick={() => handleChipClick("Status")}
                className="filter-chip-btn"
              >
                Status: {appliedFilters.status}
                <ChevronDown className="chevron" size={13} />
              </button>
            )}

            {appliedFilters.buySell !== "All" && (
              <button
                onClick={() => handleChipClick("Buy/Sell")}
                className="filter-chip-btn"
              >
                {appliedFilters.buySell}
                <ChevronDown className="chevron" size={13} />
              </button>
            )}

            {appliedFilters.dateRange !== "All" && (
              <button
                onClick={() => handleChipClick("Date")}
                className="filter-chip-btn"
              >
                {appliedFilters.dateRange}
                <ChevronDown className="chevron" size={13} />
              </button>
            )}

            {appliedFilters.selectedCompanies.length > 0 && (
              <button
                onClick={() => handleChipClick("Company")}
                className="filter-chip-btn"
              >
                {appliedFilters.selectedCompanies.length === 1
                  ? appliedFilters.selectedCompanies[0]
                  : `${appliedFilters.selectedCompanies.length} Stocks`
                }
                <ChevronDown className="chevron" size={13} />
              </button>
            )}

            {/* Clear All Link */}
            {hasNonDefaultFilters && (
              <button
                onClick={handleClearAllFilters}
                className="filter-clear-all-link"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Grouped orders table */}
          {loading ? (
            <div className="watchlist-loading-state" style={{ minHeight: "250px" }}>
              <RefreshCw className="animate-spin text-emerald-400" size={32} />
              <p>Loading transaction history...</p>
            </div>
          ) : groupedOrders.length === 0 ? (
            <div className="watchlist-empty-state" style={{ minHeight: "250px" }}>
              <div className="empty-state-icon-box">
                <Clock size={32} className="text-slate-400" />
              </div>
              <h2>No Orders Found</h2>
              <p>No orders match the selected filters.</p>
            </div>
          ) : (
            <div className="orders-timeline-wrapper">
              {groupedOrders.map((group) => (
                <div key={group.dateStr} className="order-date-group">
                  <h3 className="order-date-group-title">{group.dateLabel}</h3>
                  <div className="order-group-table-card">
                    <table className="orders-grouped-table">
                      <thead>
                        <tr>
                          <th>Company</th>
                          <th>Type</th>
                          <th>Buy/Sell</th>
                          <th className="num">Qty</th>
                          <th className="num">Avg. price</th>
                          <th className="num">Time</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <AnimatePresence>
                          {group.items.map((o) => {
                            const isBuy = o.type === "BUY";
                            const prodType = o.productType === "INTRADAY" ? "Intraday" : "Delivery";
                            const modeType = o.priceMode === "LIMIT" ? "Limit" : "Market";

                            return (
                              <motion.tr
                                layout
                                key={o._id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => navigate(`/stocks/${o.symbol.toUpperCase()}`)}
                                className="clickable-row"
                              >
                                <td>
                                  <div className="order-company-cell">
                                    <StockLogo symbol={o.symbol} size={28} />
                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                      <span className="order-company-symbol">{o.symbol}</span>
                                      <span className="order-company-name">{o.symbol} Equity</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="order-type-cell">{prodType} • {modeType}</td>
                                <td className={`order-buy-sell-cell ${isBuy ? "buy" : "sell"}`}>
                                  {isBuy ? "Buy" : "Sell"}
                                </td>
                                <td className="num order-qty-cell">{o.quantity}</td>
                                <td className="num order-price-cell">{formatINR(o.price)}</td>
                                <td className="num order-time-cell">{formatTime(o.createdAt)}</td>
                                <td>
                                  <span className={`order-status-badge ${o.status.toLowerCase()}`}>
                                    {o.status.toLowerCase()}
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
              ))}
            </div>
          )}
        </>
      )}

      {/* FILTER SLIDING DRAWER DIALOG */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="filter-drawer-overlay"
            />

            {/* Sliding Drawer Container */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="filter-drawer-container"
            >
              {/* Header */}
              <div className="filter-drawer-header">
                <h2>Filters</h2>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="filter-drawer-close-btn"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drawer split body */}
              <div className="filter-drawer-body">
                {/* Sidebar left */}
                <div className="filter-sidebar-left">
                  {[
                    "Type",
                    "Date",
                    "Company",
                    "Status",
                    "Buy/Sell"
                  ].map((category) => {
                    // Check if category has non-default value to render green indicator dot
                    let hasIndicator = false;
                    if (category === "Type" && tempFilters.type !== "All") hasIndicator = true;
                    if (category === "Date" && tempFilters.dateRange !== "All") hasIndicator = true;
                    if (category === "Status" && tempFilters.status !== "All") hasIndicator = true;
                    if (category === "Buy/Sell" && tempFilters.buySell !== "All") hasIndicator = true;
                    if (category === "Company" && tempFilters.selectedCompanies.length > 0) hasIndicator = true;

                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setSelectedCategory(category)}
                        className={`filter-sidebar-tab-btn ${selectedCategory === category ? "active" : ""}`}
                      >
                        {category}
                        {hasIndicator && (
                          <span className="filter-sidebar-indicator-dot" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Content right panel */}
                <div className="filter-content-right">

                  {selectedCategory === "Type" && (
                    <div className="filter-option-group">
                      <label className="filter-radio-label">
                        <input
                          type="radio"
                          name="typeFilter"
                          value="All"
                          checked={tempFilters.type === "All"}
                          onChange={(e) => setTempFilters(prev => ({ ...prev, type: e.target.value }))}
                          className="filter-radio-input"
                        />
                        Regular (All)
                      </label>
                      <label className="filter-radio-label">
                        <input
                          type="radio"
                          name="typeFilter"
                          value="Delivery"
                          checked={tempFilters.type === "Delivery"}
                          onChange={(e) => setTempFilters(prev => ({ ...prev, type: e.target.value }))}
                          className="filter-radio-input"
                        />
                        Delivery
                      </label>
                      <label className="filter-radio-label">
                        <input
                          type="radio"
                          name="typeFilter"
                          value="Intraday"
                          checked={tempFilters.type === "Intraday"}
                          onChange={(e) => setTempFilters(prev => ({ ...prev, type: e.target.value }))}
                          className="filter-radio-input"
                        />
                        Intraday
                      </label>
                    </div>
                  )}

                  {selectedCategory === "Date" && (
                    <div className="filter-option-group">
                      <label className="filter-radio-label">
                        <input
                          type="radio"
                          name="dateFilter"
                          value="All"
                          checked={tempFilters.dateRange === "All"}
                          onChange={(e) => setTempFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                          className="filter-radio-input"
                        />
                        All Transactions
                      </label>
                      <label className="filter-radio-label">
                        <input
                          type="radio"
                          name="dateFilter"
                          value="Today"
                          checked={tempFilters.dateRange === "Today"}
                          onChange={(e) => setTempFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                          className="filter-radio-input"
                        />
                        Today
                      </label>
                      <label className="filter-radio-label">
                        <input
                          type="radio"
                          name="dateFilter"
                          value="Last 7 Days"
                          checked={tempFilters.dateRange === "Last 7 Days"}
                          onChange={(e) => setTempFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                          className="filter-radio-input"
                        />
                        Last 7 Days
                      </label>
                      <label className="filter-radio-label">
                        <input
                          type="radio"
                          name="dateFilter"
                          value="Last 30 Days"
                          checked={tempFilters.dateRange === "Last 30 Days"}
                          onChange={(e) => setTempFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                          className="filter-radio-input"
                        />
                        Last 30 Days
                      </label>
                    </div>
                  )}

                  {selectedCategory === "Company" && (
                    <div>
                      <div className="filter-search-input-wrapper">
                        <Search className="search-icon" size={14} />
                        <input
                          type="text"
                          placeholder="Search symbol..."
                          value={companySearchQuery}
                          onChange={(e) => setCompanySearchQuery(e.target.value)}
                          className="filter-search-field"
                        />
                      </div>
                      <div className="filter-option-group" style={{ maxHeight: "280px", overflowY: "auto" }}>
                        {filteredCompanySymbols.length === 0 ? (
                          <span style={{ fontSize: "12px", color: "#64748b" }}>No traded stocks match.</span>
                        ) : (
                          filteredCompanySymbols.map((sym) => (
                            <label key={sym} className="filter-checkbox-label">
                              <input
                                type="checkbox"
                                value={sym}
                                checked={tempFilters.selectedCompanies.includes(sym)}
                                onChange={() => handleCompanyToggle(sym)}
                                className="filter-checkbox-input"
                              />
                              {sym}
                            </label>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {selectedCategory === "Status" && (
                    <div className="filter-option-group">
                      <label className="filter-radio-label">
                        <input
                          type="radio"
                          name="statusFilter"
                          value="All"
                          checked={tempFilters.status === "All"}
                          onChange={(e) => setTempFilters(prev => ({ ...prev, status: e.target.value }))}
                          className="filter-radio-input"
                        />
                        All Statuses
                      </label>
                      <label className="filter-radio-label">
                        <input
                          type="radio"
                          name="statusFilter"
                          value="Executed"
                          checked={tempFilters.status === "Executed"}
                          onChange={(e) => setTempFilters(prev => ({ ...prev, status: e.target.value }))}
                          className="filter-radio-input"
                        />
                        Executed
                      </label>
                      <label className="filter-radio-label">
                        <input
                          type="radio"
                          name="statusFilter"
                          value="Pending"
                          checked={tempFilters.status === "Pending"}
                          onChange={(e) => setTempFilters(prev => ({ ...prev, status: e.target.value }))}
                          className="filter-radio-input"
                        />
                        Pending
                      </label>
                      <label className="filter-radio-label">
                        <input
                          type="radio"
                          name="statusFilter"
                          value="Cancelled"
                          checked={tempFilters.status === "Cancelled"}
                          onChange={(e) => setTempFilters(prev => ({ ...prev, status: e.target.value }))}
                          className="filter-radio-input"
                        />
                        Cancelled
                      </label>
                    </div>
                  )}

                  {selectedCategory === "Buy/Sell" && (
                    <div className="filter-option-group">
                      <label className="filter-radio-label">
                        <input
                          type="radio"
                          name="buySellFilter"
                          value="All"
                          checked={tempFilters.buySell === "All"}
                          onChange={(e) => setTempFilters(prev => ({ ...prev, buySell: e.target.value }))}
                          className="filter-radio-input"
                        />
                        All Trades
                      </label>
                      <label className="filter-radio-label">
                        <input
                          type="radio"
                          name="buySellFilter"
                          value="Buy"
                          checked={tempFilters.buySell === "Buy"}
                          onChange={(e) => setTempFilters(prev => ({ ...prev, buySell: e.target.value }))}
                          className="filter-radio-input"
                        />
                        Buy
                      </label>
                      <label className="filter-radio-label">
                        <input
                          type="radio"
                          name="buySellFilter"
                          value="Sell"
                          checked={tempFilters.buySell === "Sell"}
                          onChange={(e) => setTempFilters(prev => ({ ...prev, buySell: e.target.value }))}
                          className="filter-radio-input"
                        />
                        Sell
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer buttons */}
              <div className="filter-drawer-footer">
                <button
                  type="button"
                  onClick={handleClearAllFilters}
                  className="filter-footer-clear-btn"
                >
                  Clear all
                </button>
                <button
                  type="button"
                  onClick={handleApplyFilters}
                  className="filter-footer-apply-btn"
                >
                  Apply
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Orders;
