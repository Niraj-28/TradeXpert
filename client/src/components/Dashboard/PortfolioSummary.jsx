import {

  Wallet,
  TrendingUp,
  Briefcase,

} from "lucide-react";

const PortfolioSummary = () => {

  const portfolio = {

    balance: 250000,

    invested: 185000,

    currentValue: 214500,

    pnl: 29500,

    pnlPercent: 15.94,

  };

  return (

    <div className="grid grid-cols-1 sm:grid-cols-4 xl:grid-cols-4 gap-2.5 mt-5">

      {/* WALLET */}

      <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-3.5 shadow-sm">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-[11px] text-[#64748B] font-medium">

              Wallet

            </p>

            <h2 className="text-sm font-bold text-[#0F172A] mt-1.5">

              ₹{portfolio.balance.toLocaleString()}

            </h2>

          </div>

          <div className="w-7 h-7 rounded-lg bg-[#DCFCE7] flex items-center justify-center">

            <Wallet
              size={16}
              className="text-green-600"
            />

          </div>

        </div>

      </div>

      {/* INVESTED */}

      <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-3.5 shadow-sm">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-[11px] text-[#64748B] font-medium">

              Invested

            </p>

            <h2 className="text-sm font-bold text-[#0F172A] mt-1.5">

              ₹{portfolio.invested.toLocaleString()}

            </h2>

          </div>

          <div className="w-7 h-7 rounded-lg bg-[#DBEAFE] flex items-center justify-center">

            <Briefcase
              size={16}
              className="text-blue-600"
            />

          </div>

        </div>

      </div>

      {/* VALUE */}

      <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-3.5 shadow-sm">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-[11px] text-[#64748B] font-medium">

              Current Value

            </p>

            <h2 className="text-sm font-bold text-[#0F172A] mt-1.5">

              ₹{portfolio.currentValue.toLocaleString()}

            </h2>

          </div>

          <div className="w-7 h-7 rounded-lg bg-[#DCFCE7] flex items-center justify-center">

            <TrendingUp
              size={16}
              className="text-green-600"
            />

          </div>

        </div>

      </div>

      {/* PNL */}

      <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-3.5 shadow-sm">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-[11px] text-[#64748B] font-medium">

              Total P&L

            </p>

            <h2 className="text-sm font-bold text-green-600 mt-1.5">

              ₹{portfolio.pnl.toLocaleString()}

              <span className="text-xs font-semibold ml-1">

                (+{portfolio.pnlPercent}%)

              </span>

            </h2>

          </div>

          <div className="w-8 h-8 rounded-2xl bg-[#DCFCE7] flex items-center justify-center">

            <TrendingUp
              size={18}
              className="text-green-600"
            />

          </div>

        </div>

      </div>

    </div>

  );

};

export default PortfolioSummary;