import { useEffect, useState } from "react";
import { fetchCrypto } from "../api/coinGecko";
import { CryptoCard } from "../components/CryptoCard";

export const Home = () => {
  const [cryptoLists, setCryptoLists] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("market_cap_rank");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCryptoData = async () => {
    try {
      const data = await fetchCrypto();
      setCryptoLists(data);
    } catch (err) {
      console.log("Error :", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptoData();
  }, []);

  const filterAndSort = () => {
    let filtered = [...cryptoLists];

    filtered = filtered.filter(
      (crypto) =>
        crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price":
          return a.current_price - b.current_price;
        case "price_desc":
          return b.current_price - a.current_price;
        case "change":
          return a.price_change_percentage_24h - b.price_change_percentage_24h;
        case "market_cap":
          return a.market_cap - b.market_cap;
        default:
          return a.market_cap_rank - b.market_cap_rank;
      }
    });
    setFilteredList(filtered);
  };

  useEffect(() => {
    filterAndSort();
  }, [sortBy, cryptoLists, searchQuery]);

  return (
    <div>
      <div className="app">
        {isLoading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p className="spinner-text">Loading Crypto Data...</p>
          </div>
        ) : (
          <>
            <div className="header">
              <div className="header-content">
                <div className="logo-section">
                  <h2>🚀 Crypto Lens</h2>
                  <p>Real Time Cryptocurrency Prices and Real Data</p>
                </div>
                <div className="search-section">
                  <input
                    type="text"
                    placeholder="Search Cryptos...."
                    onChange={(e) => setSearchQuery(e.target.value)}
                    value={searchQuery}
                  />
                </div>
              </div>
            </div>
            <div className="controls">
              <div className="filter-group">
                <label>Sort By:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="market_cap_value">Rank</option>
                  <option value="name">Name</option>
                  <option value="price">Price (Low to High)</option>
                  <option value="price_desc">Price (High to Low)</option>
                  <option value="change">24h Change</option>
                  <option value="market_cap">Market cap</option>
                </select>
              </div>
              <div className="view-toggle">
                <button
                  className={viewMode === "grid" ? "active" : ""}
                  onClick={() => setViewMode("grid")}
                >
                  Grid
                </button>
                <button
                  className={viewMode === "list" ? "active" : ""}
                  onClick={() => setViewMode("list")}
                >
                  List
                </button>
              </div>
            </div>
            {filteredList.length === 0 && searchQuery !== "" ? (
              <div className="no-results">
                <h3>No Crypto Data Found</h3>
              </div>
            ) : (
              <div className={`crypto-container ${viewMode}`}>
                {filteredList.map((crypto) => (
                  <CryptoCard key={crypto.id} crypto={crypto} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <div className="footer">Data Provided by the CoinGecko API Updated Every 30 seconds  </div>
    </div>
  );
};
