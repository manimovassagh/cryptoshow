import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';

function Nav() {
  const location = useLocation();
  return (
    <nav className="navbar">
      <div className="nav-brand">
        ✨ <span>Crypto<span className="brand-highlight">Show</span></span>
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Markets</Link>
        </li>
      </ul>
    </nav>
  );
}

function Markets() {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1')
      .then(res => res.json())
      .then(data => {
        setCryptos(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="page delay-1">
      <div className="hero-section">
        <h1 className="title">Live <span className="gradient-text">Crypto Markets</span></h1>
        <p className="subtitle">Real-time cryptocurrency prices, market caps, and volume.</p>
      </div>

      <div className="content-card full-width">
        {loading ? (
          <div className="loading-spinner">Loading Market Data...</div>
        ) : (
          <div className="table-responsive">
            <table className="crypto-table">
              <thead>
                <tr>
                  <th>Coin</th>
                  <th>Price</th>
                  <th>24h Change</th>
                  <th>Market Cap</th>
                </tr>
              </thead>
              <tbody>
                {cryptos.map(coin => (
                  <tr key={coin.id}>
                    <td className="coin-cell">
                      <img src={coin.image} alt={coin.name} className="coin-logo" />
                      <div>
                        <div className="coin-name">{coin.name}</div>
                        <div className="coin-symbol">{coin.symbol.toUpperCase()}</div>
                      </div>
                    </td>
                    <td className="price-cell">${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</td>
                    <td className={coin.price_change_percentage_24h >= 0 ? "positive-change" : "negative-change"}>
                      {coin.price_change_percentage_24h > 0 ? '+' : ''}{coin.price_change_percentage_24h?.toFixed(2)}%
                    </td>
                    <td className="mcap-cell">${coin.market_cap.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <HashRouter>
      <div className="app-container">
        <div className="background-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
        </div>
        <Nav />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Markets />} />
          </Routes>
        </main>
        <footer className="footer">
          <p>© {new Date().getFullYear()} CryptoShow Template. Powered by CoinGecko.</p>
        </footer>
      </div>
    </HashRouter>
  );
}

export default App;
