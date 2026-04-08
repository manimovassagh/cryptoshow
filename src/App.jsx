import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';

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

function Markets({ cryptos, loading }) {
  const navigate = useNavigate();

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

function CoinDetail({ cryptos }) {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [series, setSeries] = useState([{ data: [] }]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fallback if accessed directly without router state
  const coin = location.state?.coin || cryptos.find(c => c.id === id);

  useEffect(() => {
    if (!coin) return;

    let isMounted = true;
    let intervalId;

    const fetchKlins = async () => {
      try {
        // We use Binance API for live 1-minute candlestick data since CoinGecko free tier doesn't support 1-minute granularity well.
        const symbol = `${coin.symbol.toUpperCase()}USDT`;
        const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1m&limit=100`);
        
        if (!response.ok) {
          throw new Error('Could not fetch 1m candles for this pair on Binance.');
        }

        const data = await response.json();
        
        // Binance Format: [Open time, Open, High, Low, Close, Volume, Close time, ...]
        const formattedData = data.map(item => {
          return {
            x: new Date(item[0]),
            y: [parseFloat(item[1]), parseFloat(item[2]), parseFloat(item[3]), parseFloat(item[4])]
          };
        });

        if (isMounted) {
          setSeries([{ data: formattedData }]);
          setLoading(false);
          setError('');
        }
      } catch (err) {
        if (isMounted) {
          console.error(err);
          setError('Live 1-minute candle chart is currently unavailable for this specific coin pair.');
          setLoading(false);
        }
      }
    };

    fetchKlins();
    // Poll every 10 seconds to update the 1-minute candle
    intervalId = setInterval(fetchKlins, 10000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [coin]);

  if (!coin) {
    return <div className="page"><div className="content-card">Coin not found.</div></div>;
  }

  const chartOptions = {
    chart: {
      type: 'candlestick',
      height: 450,
      background: 'transparent',
      toolbar: { show: false },
      animations: { enabled: false }
    },
    title: {
      text: `${coin.name} (${coin.symbol.toUpperCase()}) - 1m Live Candles`,
      align: 'left',
      style: {
        fontSize: '18px',
        color: '#e2e8f0'
      }
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: { colors: '#94a3b8' }
      }
    },
    yaxis: {
      tooltip: { enabled: true },
      labels: {
        style: { colors: '#94a3b8' },
        formatter: (value) => { return '$' + value.toLocaleString(); }
      }
    },
    grid: {
      borderColor: 'rgba(255,255,255,0.05)'
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: '#10b981',
          downward: '#ef4444'
        }
      }
    },
    theme: {
      mode: 'dark'
    }
  };

  return (
    <div className="page delay-1">
      <div className="content-card full-width">
        <button className="btn btn-secondary back-btn" onClick={() => navigate(-1)}>
          &larr; Back to Markets
        </button>
        
        <div className="coin-header-detail">
          <img src={coin.image} alt={coin.name} className="coin-logo-large" />
          <div>
            <h2 className="title">{coin.name} <span className="gradient-text">{coin.symbol.toUpperCase()}</span></h2>
            <div className="price-row">
              <span className="price-large">${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</span>
              <span className={coin.price_change_percentage_24h >= 0 ? "positive-change" : "negative-change"}>
                {coin.price_change_percentage_24h > 0 ? '+' : ''}{coin.price_change_percentage_24h?.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        <div className="chart-container">
          {loading ? (
            <div className="loading-spinner">Loading Live 1m Candles...</div>
          ) : error ? (
             <div className="error-message">{error}</div>
          ) : (
             <ReactApexChart options={chartOptions} series={series} type="candlestick" height={450} />
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch highest market cap coins once at App mounting to share across views easily
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
    <HashRouter>
      <div className="app-container">
        <div className="background-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
        </div>
        <Nav />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Markets cryptos={cryptos} loading={loading} />} />
            <Route path="/coin/:id" element={<CoinDetail cryptos={cryptos} />} />
          </Routes>
        </main>
        <footer className="footer">
          <p>© {new Date().getFullYear()} CryptoShow Template. Powered by CoinGecko & Binance API.</p>
        </footer>
      </div>
    </HashRouter>
  );
}

export default App;
