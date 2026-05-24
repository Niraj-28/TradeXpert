import {
  LayoutDashboard,
  CandlestickChart,
  Wallet,
  Newspaper,
  User,
} from "lucide-react";

const Sidebar = () => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen p-5">

      <div className="space-y-3 mt-10">

        <button className="flex items-center gap-3 w-full p-3 rounded-xl bg-[#58E6B3] text-black font-semibold">
          <LayoutDashboard />
          Dashboard
        </button>

        <button className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-100">
          <CandlestickChart />
          Trading
        </button>

        <button className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-100">
          <Wallet />
          Portfolio
        </button>

        <button className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-100">
          <Newspaper />
          News
        </button>

        <button className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-100">
          <User />
          Profile
        </button>

      </div>
    </div>
  );
};

export default Sidebar;