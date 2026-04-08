import React from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
// We are skipping App.css and completely relying on index.css for rich aesthetics

function Nav() {
  const location = useLocation();
  return (
    <nav className="navbar">
      <div className="nav-brand">
        ✨ <span>Astro<span className="brand-highlight">Route</span></span>
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
        </li>
        <li>
          <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link>
        </li>
        <li>
          <Link to="/features" className={location.pathname === '/features' ? 'active' : ''}>Features</Link>
        </li>
      </ul>
    </nav>
  );
}

function Home() {
  return (
    <div className="page home-page delay-1">
      <div className="hero-section">
        <h1 className="title">Welcome to <span className="gradient-text">GitHub Pages</span></h1>
        <p className="subtitle">Seamlessly deploying React apps with Vite and React Router.</p>
        <div className="hero-buttons">
          <Link to="/about" className="btn btn-primary">Discover More</Link>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="btn btn-secondary">View on GitHub</a>
        </div>
      </div>
    </div>
  );
}

function About() {
  return (
    <div className="page delay-2">
      <div className="content-card">
        <h2 className="section-title">About This Template</h2>
        <p className="section-text">
          This single-page application is built using <strong>React</strong> and <strong>Vite</strong>. 
          It uses <strong>HashRouter</strong> to ensure that your paths are correctly resolved 
          on GitHub Pages without needing 404 tricks.
        </p>
        <div className="feature-grid">
          <div className="feature-item">
            <span className="icon">🚀</span>
            <h3>Blazing Fast</h3>
            <p>Powered by Vite for near-instant HMR and fast builds.</p>
          </div>
          <div className="feature-item">
            <span className="icon">🛣️</span>
            <h3>Router Ready</h3>
            <p>React Router configuration included directly in the box.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Features() {
  return (
    <div className="page delay-3">
      <div className="content-card">
        <h2 className="section-title">Amazing Features</h2>
        <ul className="pretty-list">
          <li><strong>Rich Aesthetics:</strong> Glassmorphism and dynamic gradients.</li>
          <li><strong>Micro-animations:</strong> Smooth hover effects and transitions.</li>
          <li><strong>Vite Setup:</strong> Built using modern tooling defaults.</li>
          <li><strong>GitHub Pages:</strong> Simple push-to-deploy structure.</li>
        </ul>
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
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />
          </Routes>
        </main>
        <footer className="footer">
          <p>© {new Date().getFullYear()} Modern React + Vite Template. Hosted on GitHub Pages.</p>
        </footer>
      </div>
    </HashRouter>
  );
}

export default App;
