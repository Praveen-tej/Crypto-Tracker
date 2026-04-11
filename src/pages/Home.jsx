import { useEffect, useState } from "react";
import { fetchCrypto } from "../api/coinGecko";
import { CryptoCard } from "../components/CryptoCard";

export const Home = () => {
  const [cryptoLists, setCryptoLists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");

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
            <div className="controls">
              <div className="filter-group">
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
            </div>

            <div className={`crypto-container ${viewMode}`}>
              {cryptoLists.map((crypto) => (
                <CryptoCard key={crypto.id} crypto={crypto} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};