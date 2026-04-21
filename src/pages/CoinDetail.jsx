import { useParams } from "react-router-dom";
import { fetchCoinData, fetchChartData } from "../api/coinGecko";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatMarketCap, formatter } from "../utils/formatter";
import {
  LineChart,
  BarChart,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  Tooltip,
} from "recharts";

export const CoinDetail = () => {
  const navigate = useNavigate();
  const [coinData, setCoinData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

  const loadCoinData = async () => {
    try {
      const data = await fetchCoinData(id);
      setCoinData(data);
    } catch (err) {
      console.log("Error Message: ", err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadChartData = async () => {
    try {
      const data = await fetchChartData(id);
      const formattedData = data.prices.map((price) => ({
        time: new Date(price[0]).toLocaleDateString("en-US",{
          month: "short",
          day: "numeric",
        }),
        price: parseFloat(price[1].toFixed(2)),
      }));

      setChartData(formattedData);
    } catch (err) {
      console.log("Error Message: ", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCoinData();
    loadChartData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p className="spinner-text">Loading Coin Data...</p>
      </div>
    );
  }

  if (!coinData) {
    return (
      <div className="app">
        <div className="no-results">
          <p>Coin Not Found</p>
          <button onClick={() => navigate("/")}>Go to Home</button>
        </div>
      </div>
    );
  }

  const priceChange = coinData.market_data.price_change_percentage_24h || 0;
  const isPositive = priceChange >= 0;

  return (
    <div>
      <div className="app">
        {/* Header */}
        <div className="header">
          <div className="header-content">
            <div className="logo-section">
              <h2>🚀 Crypto Lens</h2>
              <p>Real Time Cryptocurrency Prices and Real Data</p>
            </div>
            <button onClick={() => navigate("/")}>Back To List</button>
          </div>
        </div>

        <div className="coin-detail">
          <div className="coin-card">
            <div className="coin-header">
              <div className="coin-title">
                <img src={coinData.image.small} />
              </div>
              <div>
                <h1>{coinData.name}</h1>
                <p>{coinData.symbol.toUpperCase()}</p>
              </div>
              <span>Rank #{coinData.market_data.market_cap_rank}</span>
            </div>

            {/* Bottom — price info */}
            <div className="coin-price-section">
              <div className="current-price">
                <h2>{formatter(coinData.market_data.current_price.usd)}</h2>
                <p
                  className={`change-badge ${isPositive ? "positive" : "negative"}`}
                >
                  {isPositive ? "▲" : "▼"}
                  {Math.abs(priceChange).toFixed(2)}%
                </p>
              </div>
              <div className="price-ranges">
                <div className="price-range">
                  <span className="range-label">24h High</span>
                  <span className="range-value">
                    {formatter(coinData.market_data.high_24h.usd)}
                  </span>
                </div>
                <div className="price-range">
                  <span className="range-label">24h Low</span>
                  <span className="range-value">
                    {formatter(coinData.market_data.low_24h.usd)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="chart-section">
          Price Change (7 Days)
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="4 4"
                stroke="rgba(255,255,255,0.1)"
              />
              <XAxis
                dataKey="time"
                stroke="#9ca3af"
                style={{ fontSize: "10px" }}
              />

              <YAxis
                stroke="#9ca3af"
                style={{ fontSize: "12px" }}
                domain={["auto", "auto"]}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(20,20,40,0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  color: "#e0e0e0",
                }}
              />

              <Line
                type="monotone"
                dataKey="price"
                stroke="#ADD8E6"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Market Cap</span>
            <span className="stat-value">
              {formatter(coinData.market_data.market_cap.usd)}
            </span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Volume (24h)</span>
            <span className="stat-value">
              ${formatMarketCap(coinData.market_data.total_volume.usd)}
            </span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Circulating Supply</span>
            <span className="stat-value">
              {coinData.market_data.circulating_supply?.toLocaleString() ||
                "N/A"}
            </span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Total Supply</span>
            <span className="stat-value">
              {coinData.market_data.total_supply?.toLocaleString() || "N/A"}
            </span>
          </div>
        </div>
      </div>
      <div className="footer">
        Data Provided by the CoinGecko API Updated Every 30 seconds{" "}
      </div>
    </div>
  );
};
