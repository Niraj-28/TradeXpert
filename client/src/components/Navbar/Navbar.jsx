import logo from "../../assets/logo.png";

const Navbar = () => {
  return (
    <div className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">

      <div className="flex items-center gap-3">

        <img
          src={logo}
          alt="TradeXpert"
          className="h-10"
        />

      </div>

      <div className="flex items-center gap-4">

        <button className="px-4 py-2 rounded-xl bg-[#58E6B3] text-black font-semibold hover:opacity-90">
          Start Trading
        </button>

      </div>

    </div>
  );
};

export default Navbar;