import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";

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

function Markets({ cryptos, loading, handleRefresh }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCryptos = cryptos.filter(coin => 
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page delay-1">
      <div className="market-header-layout">
        <div className="hero-compact">
          <h1 className="title-compact">Live <span className="gradient-text">Crypto Markets</span></h1>
          <p className="subtitle-compact">Real-time cryptocurrency prices, market caps, and volume.</p>
        </div>

        <div className="controls-bar-compact">
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search for a coin..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-secondary refresh-btn-compact" onClick={handleRefresh}>
            Refresh 🔄
          </button>
        </div>
      </div>

      <div className="content-card full-width">
        {loading ? (
          <div className="loading-container">
            <div className="skeleton-loader"></div>
            <div className="skeleton-loader"></div>
            <div className="skeleton-loader"></div>
            <div className="skeleton-loader"></div>
            <div className="skeleton-loader"></div>
          </div>
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
                {filteredCryptos.length > 0 ? filteredCryptos.map(coin => (
                  <tr 
                    key={coin.id} 
                    className="clickable-row" 
                    onClick={() => navigate(`/coin/${coin.id}`, { state: { coin } })}
                  >
                    <td className="coin-cell">
                      <img src={coin.image} alt={coin.name} className="coin-logo" />
                      <div>
                        <div className="coin-name">{coin.name}</div>
                        <div className="coin-symbol">{coin.symbol.toUpperCase()}</div>
                      </div>
                    </td>
                    <td className="price-cell">${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</td>
                    <td className={coin.price_change_percentage_24h >= 0 ? "positive-change" : "negative-change"}>
                      <span className="change-badge">
                        {coin.price_change_percentage_24h > 0 ? '↗ ' : '↘ '}{Math.abs(coin.price_change_percentage_24h || 0).toFixed(2)}%
                      </span>
                    </td>
                    <td className="mcap-cell">${coin.market_cap.toLocaleString()}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="empty-state">No coins found matching "{searchTerm}"</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function CoinDetail({ cryptos }) {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Fallback if accessed directly without router state
  const coin = location.state?.coin || cryptos.find(c => c.id === id);

  if (!coin) {
    return <div className="page"><div className="content-card">Coin not found.</div></div>;
  }

  return (
    <div className="page display-wide delay-1">
      <div className="content-card full-width">
        <div className="coin-header-detail-compact">
          <button className="btn btn-secondary back-btn-compact" onClick={() => navigate(-1)}>
            &larr; Back
          </button>
          <div className="coin-title-group">
            <img src={coin.image} alt={coin.name} className="coin-logo-medium" />
            <h2 className="title-compact">{coin.name} <span className="gradient-text">{coin.symbol.toUpperCase()}</span></h2>
          </div>
          <div className="price-row-compact">
            <span className="price-medium">${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</span>
            <span className={coin.price_change_percentage_24h >= 0 ? "positive-change" : "negative-change"}>
              {coin.price_change_percentage_24h > 0 ? '+' : ''}{coin.price_change_percentage_24h?.toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="tradingview-wrapper">
          <AdvancedRealTimeChart 
            symbol={`BINANCE:${coin.symbol.toUpperCase()}USDT`}
            theme="dark"
            interval="1"
            timezone="Etc/UTC"
            style="1"
            locale="en"
            enable_publishing={false}
            hide_side_toolbar={false}
            allow_symbol_change={true}
            details={true}
            hotlist={true}
            calendar={false}
            autosize={true}
          />
        </div>
      </div>
    </div>
  );
}

function App() {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCryptos = () => {
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1')
      .then(res => res.json())
      .then(data => {
        setCryptos(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCryptos();
    const interval = setInterval(fetchCryptos, 60000);
    return () => clearInterval(interval);
  }, []);

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
            <Route path="/" element={<Markets cryptos={cryptos} loading={loading} handleRefresh={fetchCryptos} />} />
            <Route path="/coin/:id" element={<CoinDetail cryptos={cryptos} />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}

export default App;
