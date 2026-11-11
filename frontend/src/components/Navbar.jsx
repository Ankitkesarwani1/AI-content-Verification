import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import { truncateAddress } from '../utils/hashing';
import { ShieldIcon, WalletIcon, CopyIcon, CheckCircleIcon } from './Icons';

export default function Navbar() {
  const location = useLocation();
  const { account, isConnected, isConnecting, connectWallet, network, switchToLocalhost } = useWeb3();
  const [copied, setCopied] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCopy = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Register Content', path: '/register' },
    { name: 'Verify Integrity', path: '/verify' },
    { name: 'Audit History', path: '/history' },
    { name: 'About & Arch', path: '/about' }
  ];

  const isWrongNetwork = network && network.chainId !== 31337 && network.chainId !== 1337;

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
          <div className="brand-icon-wrapper">
            <ShieldIcon className="brand-icon" size={26} />
          </div>
          <div className="brand-text">
            <span className="brand-name">ContentProof</span>
            <span className="brand-tag">Web3 Provenance</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'nav-link-active' : ''}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Wallet Actions */}
        <div className="navbar-actions">
          {isConnected ? (
            <div className="wallet-connected-group">
              {isWrongNetwork ? (
                <button onClick={switchToLocalhost} className="btn-network-warning" title="Switch to Hardhat Localhost">
                  ⚠️ Switch Network
                </button>
              ) : (
                <span className="network-badge">
                  <span className="network-dot"></span>
                  Localhost (31337)
                </span>
              )}

              <div className="wallet-pill" onClick={handleCopy} title="Click to copy address">
                <WalletIcon size={16} />
                <span className="wallet-address">{truncateAddress(account)}</span>
                {copied ? <CheckCircleIcon size={14} className="text-success" /> : <CopyIcon size={14} />}
              </div>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="btn-connect-wallet"
            >
              <WalletIcon size={18} />
              <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            className="mobile-hamburger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`bar ${mobileMenuOpen ? 'open' : ''}`}></span>
            <span className={`bar ${mobileMenuOpen ? 'open' : ''}`}></span>
            <span className={`bar ${mobileMenuOpen ? 'open' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <nav className="mobile-nav">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`mobile-nav-link ${location.pathname === link.path ? 'mobile-nav-link-active' : ''}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
