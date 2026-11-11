import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldIcon, ExternalLinkIcon } from './Icons';

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-inner">
        <div className="footer-col brand-col">
          <div className="footer-brand">
            <div className="brand-icon-wrapper-sm">
              <ShieldIcon size={20} />
            </div>
            <span className="brand-name">ContentProof</span>
          </div>
          <p className="footer-desc">
            Decentralized content authenticity and cryptographic provenance protocol.
            Verifying digital and AI-generated media with tamper-proof SHA-256 fingerprinting on Ethereum.
          </p>
          <div className="academic-badge">
            🎓 B.Tech AI & Data Science Major Project
          </div>
        </div>

        <div className="footer-col">
          <h4>Platform</h4>
          <ul>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/register">Register Content</Link></li>
            <li><Link to="/verify">Verify Authenticity</Link></li>
            <li><Link to="/history">Audit Records</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Architecture & Tech</h4>
          <ul>
            <li><Link to="/about">System Architecture</Link></li>
            <li><a href="https://ethereum.org" target="_blank" rel="noreferrer">Ethereum Protocol <ExternalLinkIcon size={12} /></a></li>
            <li><a href="https://hardhat.org" target="_blank" rel="noreferrer">Hardhat Framework <ExternalLinkIcon size={12} /></a></li>
            <li><a href="https://docs.ethers.org" target="_blank" rel="noreferrer">Ethers.js v6 <ExternalLinkIcon size={12} /></a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Research Scope</h4>
          <p className="footer-notice">
            Cryptographic verification proves that a bitstream matches an immutable on-chain record created at a specific block timestamp. It does not certify autonomous AI origins without provenance attestation.
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 ContentProof. Built for Academic Demonstration & Research.</p>
        <p className="footer-subtext">Developed by Ankit Kesarwani • Open-Source MIT</p>
      </div>
    </footer>
  );
}

