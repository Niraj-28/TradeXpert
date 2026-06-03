import { useState, useEffect } from "react";

const logoDomains = {
  RELIANCE: "ril.com",
  TCS: "tcs.com",
  INFY: "infosys.com",
  HDFCBANK: "hdfcbank.com",
  ICICIBANK: "icicibank.com",
  SBIN: "sbi.co.in",
  BHARTIARTL: "airtel.in",
  ITC: "itcportal.com",
  LT: "larsentoubro.com",
  TATASTEEL: "tatasteel.com",
  TATAMOTORS: "tatamotors.com",
  TMCV: "tatamotors.com",
  WIPRO: "wipro.com",
  AXISBANK: "axisbank.com",
  KOTAKBANK: "kotak.com",
  HINDUNILVR: "hul.co.in",
  ADANIENT: "adanienterprises.com",
  BAJFINANCE: "bajajfinserv.in",
  MARUTI: "marutisuzuki.com",
  SUNPHARMA: "sunpharma.com",
  "M&M": "mahindra.com",
  ONGC: "ongcindia.com",
  POWERGRID: "powergrid.in",
  NTPC: "ntpc.co.in",
  COALINDIA: "coalindia.in",
  ADANIPORTS: "adaniports.com",
  ULTRACEMCO: "ultratechcement.com",
  GRASIM: "grasim.com",
  JSWSTEEL: "jsw.in",
  LTIM: "ltimindtree.com",
  HINDALCO: "hindalco.com",
  LICI: "licindia.in",
  JIOFIN: "jiofinancialservices.com",
  IRCTC: "irctc.co.in",
  TATACOMM: "tatacommunications.com",
  BPCL: "bharatpetroleum.in",
  IOC: "iocl.com",
  HPCL: "hindustanpetroleum.com",
  GAIL: "gailonline.com",
  SAIL: "sail.co.in",
  PNB: "pnbindia.in",
  BOB: "bankofbaroda.in",
  CANBK: "canarabank.com",
  UNIONBANK: "unionbankofindia.co.in",
  YESBANK: "yesbank.in",
  IDFCFIRSTB: "idfcfirstbank.com",
  FEDERALBNK: "federalbank.co.in",
  BANDHANBNK: "bandhanbank.com",
  DLF: "dlf.in",
  GMRINFRA: "gmrgroup.in",
  ZOMATO: "zomato.com",
  PAYTM: "paytm.com",
  NYKAA: "nykaa.com",
  DELHIVERY: "delhivery.com",
  AWL: "adaniwilmar.in",
  HAL: "hal-india.co.in",
  BEL: "bel-india.in",
  COFORGE: "coforge.com",
  PERSISTENT: "persistent.com",
  MPHASIS: "mphasis.com",
  KPITTECH: "kpit.com",
  TATAELXSI: "tataelxsi.com",
  DIXON: "dixoninfo.com",
  POLYCAB: "polycab.com",
  KEI: "kei-ind.com",
  HAVELLS: "havells.com",
  VOLTAS: "voltas.com",
  BLUESTARCO: "bluestarindia.com",
  BATAINDIA: "bata.in",
  RELAXO: "relaxofootwear.com",
  PIDILITIND: "pidilite.com",
  ASIANPAINT: "asianpaints.com",
  BERGEPAINT: "bergerpaints.com",
  KANSAINER: "nerolac.com",
  INDIGO: "goindigo.in",
  SPICEJET: "spicejet.com",
  MRF: "mrftyres.com",
  APOLLOTYRE: "apollotyres.com",
  BALKRISIND: "bkt-tires.com",
  CEAT: "ceat.com",
  JKTYRE: "jktyre.com",
  TVSMOTOR: "tvsmotor.com",
  HEROMOTOCO: "heromotocorp.com",
  "BAJAJ-AUTO": "bajajauto.com",
  BAJAJ_AUTO: "bajajauto.com",
  EICHERMOT: "eicher.in",
  ASHOKLEY: "ashokleyland.com",
  ESCORT: "escortsgroup.com",
  ACC: "acclimited.com",
  AMBUJACEM: "ambujacement.com",
  SHREECEM: "shreecement.com",
  JKCEMENT: "jkcement.com",
  RAMCOCEM: "ramcocements.in",
  DALBHARAT: "dalmiabharat.com",
  MUTHOOTFIN: "muthootfinance.com",
  MANAPPURAM: "manappuram.com",
  CHOLAFIN: "cholamandalam.com",
  SRF: "srf.com",
  PFC: "pfcindia.com",
  RECLTD: "recindia.nic.in",
  NHPC: "nhpcindia.com",
  SJVN: "sjvn.nic.in",
  IREDA: "ireda.in",
  HUDCO: "hudco.org.in",
  HINDCOPPER: "hindustancopper.com",
  NATIONALUM: "nalcoindia.com",
  NMDC: "nmdc.co.in",
  OIL: "oil-india.com",
  PETRONET: "petronetlng.com",
  IGL: "iglonline.net",
  MGL: "mahanagargas.com",
  GUJGASLTD: "gujaratgas.com",
  GSPL: "gspcgroup.com",
  TATAPOWER: "tatapower.com",
  JSWENERGY: "jsw.in",
  ADANIPOWER: "adanipower.com",
  ADANIGREEN: "adanigreenenergy.com",
  ADANITRANS: "adanitransmission.com",
  ADANIGAS: "adanigas.com",

  // FALLBACKS / TRENDING constituents
  DMART: "dmartindia.com",
  SIEMENS: "siemens.co.in",
  APOLLOHOSP: "apollohospitals.com",
  MAXHEALTH: "maxhealthcare.in",
  ABB: "abb.com",
  TITAN: "titan.co.in",
  CIPLA: "cipla.com",
  DRREDDY: "drreddys.com",
  DIVISLAB: "divislabs.com",
  LUPIN: "lupin.com",
  ALKEM: "alkemlabs.com",
  AUBANK: "aubank.in",
  TRENT: "trentlimited.com",
  BRITANNIA: "britannia.co.in",
  NESTLEIND: "nestle.in",
  COLPAL: "colgatepalmolive.co.in",
  DABUR: "dabur.com",
  MARICO: "marico.com",
  GODREJCP: "godrejcp.com",
  GODREJPROP: "godrejproperties.com",
  GODREJIND: "godrej.com",
  UPL: "upl-ltd.com",
  VEDL: "vedantalimited.com",
  JSWINFRA: "jsw.in",
  TATACHEM: "tatachemicals.com",
  TATACONSUM: "tataconsumer.com",
  SBILIFE: "sbilife.co.in",
  HDFCLIFE: "hdfclife.com",
  ICICIPRULI: "iciciprulife.com",
  ICICIGI: "icicilombard.com"
};

const StockLogo = ({ symbol, size = 40, className = "" }) => {
  const [logoErrorCount, setLogoErrorCount] = useState(0);
  const upperSym = symbol ? symbol.toUpperCase() : "";
  const domain = logoDomains[upperSym];

  useEffect(() => {
    setLogoErrorCount(0);
  }, [symbol]);

  // Determine avatar background color deterministically from symbol name
  const getAvatarColors = (sym) => {
    if (!sym) return { bg: "#e6fcf1", text: "#00b074", border: "#cbf7e3" };
    let hash = 0;
    for (let i = 0; i < sym.length; i++) {
      hash = sym.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return {
      bg: `hsl(${hue}, 85%, 96%)`,
      text: `hsl(${hue}, 85%, 35%)`,
      border: `hsl(${hue}, 85%, 88%)`
    };
  };

  const colors = getAvatarColors(upperSym);

  // Fallback stages:
  // 0: FMP Regional: https://financialmodelingprep.com/image-stock/${upperSym}.NS.png
  // 1: FMP Standard: https://financialmodelingprep.com/image-stock/${upperSym}.png
  // 2: Clearbit Domain lookup
  // 3: Fallback initials
  let currentSrc = "";
  if (logoErrorCount === 0) {
    currentSrc = `https://financialmodelingprep.com/image-stock/${upperSym}.NS.png`;
  } else if (logoErrorCount === 1) {
    currentSrc = `https://financialmodelingprep.com/image-stock/${upperSym}.png`;
  } else if (logoErrorCount === 2 && domain) {
    currentSrc = `https://logo.clearbit.com/${domain}`;
  }

  const handleError = () => {
    setLogoErrorCount((prev) => prev + 1);
  };

  const isFmp = logoErrorCount < 2;

  if (logoErrorCount < 3 && (logoErrorCount < 2 || domain)) {
    return (
      <img
        src={currentSrc}
        alt={upperSym}
        onError={handleError}
        className={`stock-logo-img ${className}`}
        style={{
          width: size,
          height: size,
          minWidth: size,
          minHeight: size,
          borderRadius: "8px",
          objectFit: "contain",
          background: isFmp ? "transparent" : "#ffffff",
          border: isFmp ? "none" : "1px solid #e8edf5",
          padding: isFmp ? "0px" : "2px"
        }}
      />
    );
  }

  // Fallback to initials
  const initials = upperSym ? upperSym.slice(0, 2) : "ST";
  return (
    <div
      className={`stock-logo-fallback ${className}`}
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        fontSize: size > 40 ? "18px" : "11px",
        backgroundColor: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
        boxShadow: `0 4px 10px rgba(0, 0, 0, 0.02)`
      }}
    >
      {initials}
    </div>
  );
};

export default StockLogo;
