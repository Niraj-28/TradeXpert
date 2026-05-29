import { Search } from "lucide-react";

const DiscoverStocks = () => {
  return (
    <div className="discover-search">
      <Search size={18} />
      <input
        type="text"
        placeholder="Search NSE/BSE stocks..."
      />
    </div>
  );
};

export default DiscoverStocks;