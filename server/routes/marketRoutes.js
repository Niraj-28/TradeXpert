import express from "express";
import axios from "axios";

import { searchInstruments } from "../services/instrumentService.mjs";

const router = express.Router();

const fallbackArticles = [
  {
    id: 1,
    category: "Stocks",
    title: "Reliance Shares Hit Record High Following Retail Ventures Expansion Announcement",
    source: "Bloomberg Quint",
    time: "45 mins ago",
    summary: "Shares of Reliance Industries surged over 3.5% to hit an all-time high today. The market rally follows the company's board approval of a multi-billion dollar investment plan in its retail and green energy arms, boosting investor confidence.",
    author: "Rohan Sen",
    symbol: "RELIANCE",
    isFeatured: true,
  },
  {
    id: 2,
    category: "Economy",
    title: "India GDP Growth Beats Estimates, Rises to 7.8% in Q4 Citing Robust Manufacturing",
    source: "Economic Times",
    time: "2 hours ago",
    summary: "The Indian economy expanded at a faster-than-expected rate of 7.8% in the final quarter of the fiscal year, driven by strong manufacturing output and robust private consumption, solidifying India's position as the fastest-growing major economy.",
    author: "Pooja Mehta",
    symbol: null,
    isFeatured: false,
  },
  {
    id: 3,
    category: "Stocks",
    title: "Tata Steel Share Price Rallies as Global Steel Demand Forecasts Rise",
    source: "Moneycontrol",
    time: "4 hours ago",
    summary: "Tata Steel witnessed active buying in early trade after a global report predicted a recovery in European demand. Brokerage firms maintain a positive outlook with revised target prices for the metal major.",
    author: "Amit Verma",
    symbol: "TATASTEEL",
    isFeatured: false,
  },
  {
    id: 4,
    category: "Global Markets",
    title: "Nasdaq Futures Slide as US Federal Reserve Hints at Sustained High Interest Rates",
    source: "Reuters",
    time: "5 hours ago",
    summary: "Tech heavy Nasdaq futures fell in pre-market trade following Fed minutes showing policymakers remain concerned about inflation. Analysts suggest rate cuts might be delayed until late 2026.",
    author: "Sarah Jenkins",
    symbol: null,
    isFeatured: false,
  },
  {
    id: 5,
    category: "Corporate Actions",
    title: "Infosys Announces Final Dividend of ₹28 per Share Alongside Board Expansion",
    source: "Business Standard",
    time: "7 hours ago",
    summary: "IT bellwether Infosys announced a strong final dividend payout along with its earnings release. The firm also inducted new independent directors to support its cybersecurity and AI expansion roadmap.",
    author: "Vikram Malhotra",
    symbol: "INFY",
    isFeatured: false,
  },
  {
    id: 6,
    category: "Stocks",
    title: "State Bank of India Profit Beats Estimates, NII Grows by 14% Year-over-Year",
    source: "Livemint",
    time: "1 day ago",
    summary: "SBI reported a stellar net profit for the quarter, largely beating consensus estimates. Net Interest Income (NII) registered robust double-digit growth, while asset quality remained exceptionally stable.",
    author: "Ravi Teja",
    symbol: "SBIN",
    isFeatured: false,
  }
];

const formatTimeAgo = (date) => {
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

router.get(
  "/search",
  (req, res) => {
    const query = req.query.q;

    const results =
      searchInstruments(query);

    res.json(results);
  }
);

router.get(
  "/news",
  async (req, res) => {
    try {
      const feedUrl = "https://economictimes.indiatimes.com/markets/stocks/rssfeeds/2146842.cms";
      const response = await axios.get(feedUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
        timeout: 5000,
      });

      const xml = response.data;
      const items = xml.split("<item>");
      items.shift(); // Remove the channel header

      const articles = items.map((item, idx) => {
        const titleMatch = item.match(/<title>(<!\[CDATA\[)?([\s\S]*?)(]]>)?<\/title>/i);
        const descMatch = item.match(/<description>(<!\[CDATA\[)?([\s\S]*?)(]]>)?<\/description>/i);
        const linkMatch = item.match(/<link>([\s\S]*?)<\/link>/i);
        const dateMatch = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/i);

        let title = titleMatch ? titleMatch[2].replace(/<!\[CDATA\[|]]>/g, "").trim() : "";
        let summary = descMatch ? descMatch[2].replace(/<!\[CDATA\[|]]>/g, "").trim() : "";

        // Clean HTML tags from summary
        summary = summary.replace(/<[^>]*>/g, "").trim();

        // Unescape common HTML entities
        const unescape = (str) => str
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'");

        title = unescape(title);
        summary = unescape(summary);

        const pubDate = dateMatch ? new Date(dateMatch[1].trim()) : new Date();

        // Dynamically tag matching symbols if they are mentioned in the news title/summary
        const majorSymbols = ["RELIANCE", "TCS", "INFY", "HDFCBANK", "ICICIBANK", "SBIN", "TATASTEEL", "TATAMOTORS", "MARUTI", "WIPRO"];
        let matchedSymbol = null;
        for (const sym of majorSymbols) {
          if (title.toUpperCase().includes(sym) || summary.toUpperCase().includes(sym)) {
            matchedSymbol = sym;
            break;
          }
        }

        return {
          id: idx + 1,
          title,
          summary: summary || "Read the full coverage for key financial indicators and market impact analysis.",
          link: linkMatch ? linkMatch[1].trim() : "",
          time: formatTimeAgo(pubDate),
          date: pubDate,
          source: "Economic Times",
          category: "Stocks",
          symbol: matchedSymbol,
          isFeatured: idx === 0,
        };
      });

      res.json(articles.length > 0 ? articles : fallbackArticles);
    } catch (error) {
      console.warn("⚠️ RSS news fetch failed, falling back to static articles:", error.message);
      res.json(fallbackArticles);
    }
  }
);

export default router;