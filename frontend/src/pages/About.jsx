import React from 'react';
import {
  ShieldIcon,
  CpuIcon,
  DatabaseIcon,
  LayersIcon,
  CheckCircleIcon,
  LockIcon,
  SparklesIcon,
  AlertTriangleIcon
} from '../components/Icons';

export default function About() {
  const techStack = [
    {
      category: 'Smart Contract & Blockchain',
      items: [
        { name: 'Solidity ^0.8.24', desc: 'Secure smart contract language with built-in overflow protection' },
        { name: 'Ethereum EVM', desc: 'Decentralized state machine executing immutable bytecode' },
        { name: 'Hardhat v2.29.1', desc: 'Professional development environment, compiler & local node' },
        { name: 'Ethers.js v6.13.4', desc: 'Modern type-safe Web3 client library for browser contract calls' }
      ]
    },
    {
      category: 'Frontend & Architecture',
      items: [
        { name: 'React 18 & Vite', desc: 'High-performance reactive frontend framework with lightning HMR' },
        { name: 'React Router v6', desc: 'Declarative client-side routing for seamless multi-page experience' },
        { name: 'Modern Responsive CSS', desc: 'Tailored SaaS design system with CSS custom properties' },
        { name: 'MetaMask Integration', desc: 'EIP-1193 non-custodial wallet provider with account listeners' }
      ]
    },
    {
      category: 'Security & Cryptography',
      items: [
        { name: 'SHA-256 (FIPS 180-4)', desc: 'Collision-resistant 256-bit cryptographic digest computed via SubtleCrypto' },
        { name: 'Web Cryptography API', desc: 'Hardware-accelerated client-side hashing; zero content transmitted to servers' },
        { name: 'Perceptual Hashing (aHash)', desc: '64-bit visual frequency analysis for experimental derivative similarity' },
        { name: 'Reentrancy & Zero-Hash Guards', desc: 'Strict Solidity require statements preventing zero-hash and duplicate inputs' }
      ]
    }
  ];

  return (
    <div className="page-container about-page">
      <div className="page-header">
        <h1 className="page-title">About ContentProof Protocol</h1>
        <p className="page-subtitle">
          College Mini-Project Documentation: Blockchain-Based AI-Generated Content Provenance & Authenticity Verification.
        </p>
      </div>

      {/* Problem Statement Card */}
      <section className="card mb-4">
        <div className="section-title-row">
          <AlertTriangleIcon size={24} className="text-warning" />
          <h2 className="card-title">1. Problem Statement & Motivation</h2>
        </div>
        <p className="about-text">
          The meteoric expansion of generative AI models (such as Midjourney, DALL-E, Stable Diffusion, and GPT-4o) has revolutionized digital creative workflows. However, this has also precipitated critical societal challenges:
        </p>
        <ul className="about-bullets">
          <li><strong>Digital Forgery & Deepfakes:</strong> Unverifiable synthetic media spreading misinformation without origin tracking.</li>
          <li><strong>Intellectual Property Plagiarism:</strong> AI creators have no tamper-proof method to prove they generated an artwork, audio piece, or article at a specific historical moment.</li>
          <li><strong>Lack of Timestamped Provenance:</strong> Centralized file storage and web databases can be manipulated, back-dated, or quietly edited by administrators.</li>
          <li><strong>Privacy vs. Verification Trade-off:</strong> Existing verification services require uploading sensitive, unreleased intellectual property to proprietary third-party servers.</li>
        </ul>
      </section>

      {/* Proposed Solution */}
      <section className="card mb-4">
        <div className="section-title-row">
          <CheckCircleIcon size={24} className="text-success" />
          <h2 className="card-title">2. Proposed Solution</h2>
        </div>
        <p className="about-text">
          <strong>ContentProof</strong> addresses these vulnerabilities through a decentralized, zero-trust architecture combining client-side cryptographic hashing with Ethereum smart contract consensus:
        </p>
        <div className="solution-pillars-grid">
          <div className="pillar-box">
            <h4>Client-Side Hashing</h4>
            <p>Files are hashed locally inside the browser using standard SHA-256. Private files never leave the user's computer.</p>
          </div>
          <div className="pillar-box">
            <h4>Decentralized Provenance</h4>
            <p>Only the 32-byte cryptographic fingerprint is written to the blockchain, creating an immutable timestamped receipt.</p>
          </div>
          <div className="pillar-box">
            <h4>Zero-Trust Verification</h4>
            <p>Anyone with a copy of the candidate file can independently compute its hash and query the blockchain in sub-second time.</p>
          </div>
          <div className="pillar-box">
            <h4>Similarity Analysis</h4>
            <p>Provides visual similarity insights to detect near-duplicate or cropped derivatives of registered images.</p>
          </div>
        </div>
      </section>

      {/* System Architecture Diagram */}
      <section className="card mb-4">
        <div className="section-title-row">
          <LayersIcon size={24} className="text-primary" />
          <h2 className="card-title">3. System Architecture & Data Flow</h2>
        </div>
        <div className="architecture-diagram-box">
          <div className="arch-flow">
            <div className="arch-node">
              <span className="arch-badge">Client Layer</span>
              <h4>Digital / AI File</h4>
              <p>Image, PDF, Audio, Text</p>
            </div>
            <span className="arch-arrow">➔</span>
            <div className="arch-node">
              <span className="arch-badge">Browser Crypto</span>
              <h4>SHA-256 Digest</h4>
              <p>Web Cryptography API (SubtleCrypto)</p>
            </div>
            <span className="arch-arrow">➔</span>
            <div className="arch-node">
              <span className="arch-badge">Web3 Signer</span>
              <h4>MetaMask / Ethers.js</h4>
              <p>Signs Ethereum Transaction</p>
            </div>
            <span className="arch-arrow">➔</span>
            <div className="arch-node arch-node-highlight">
              <span className="arch-badge">Smart Contract</span>
              <h4>ContentRegistry.sol</h4>
              <p>Immutable Mapping + Events</p>
            </div>
          </div>
        </div>
        <p className="about-text mt-3 text-muted text-sm">
          <strong>Verification Flow:</strong> Candidate File ➔ Browser calculates SHA-256 ➔ Ethers.js invokes <code>contract.verifyContent(hash)</code> ➔ Returns (exists, registrar, timestamp, label) without incurring any gas fees (view function).
        </p>
      </section>

      {/* Technology Stack Grid */}
      <section className="card mb-4">
        <div className="section-title-row">
          <CpuIcon size={24} className="text-purple" />
          <h2 className="card-title">4. Technology Stack</h2>
        </div>
        <div className="tech-stack-container">
          {techStack.map((category, idx) => (
            <div key={idx} className="tech-category-card">
              <h3 className="tech-category-title">{category.category}</h3>
              <div className="tech-items-list">
                {category.items.map((item, i) => (
                  <div key={i} className="tech-item">
                    <span className="tech-name">{item.name}</span>
                    <span className="tech-desc">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Critical Scientific Scope & Defense Discussion */}
      <section className="card mb-4 research-defense-card">
        <div className="section-title-row">
          <ShieldIcon size={24} className="text-primary" />
          <h2 className="card-title">5. Critical Research Scope & Academic Honesty</h2>
        </div>
        <div className="research-defense-content">
          <p className="about-text">
            For academic project defense and technical rigor, it is vital to clearly delineate what this blockchain protocol guarantees versus what it does not:
          </p>

          <div className="defense-table">
            <div className="defense-col">
              <h4>✅ What ContentProof Proves</h4>
              <ul>
                <li><strong>Bit-level Integrity:</strong> Proves that the candidate file bitstream is 100% identical to the registered asset.</li>
                <li><strong>Existence Timestamp:</strong> Proves that the exact asset existed prior to the recorded block timestamp.</li>
                <li><strong>Registrar Identity:</strong> Proves that a specific cryptographic wallet address submitted the registration.</li>
                <li><strong>Tamper Detection:</strong> Proves conclusively if an image or document has been modified in any manner.</li>
              </ul>
            </div>

            <div className="defense-col">
              <h4>❌ What Blockchain Alone Cannot Prove</h4>
              <ul>
                <li><strong>Autonomous AI Detection:</strong> Blockchain cannot analyze pixels to tell if Midjourney or Photoshop created it; it records attribution.</li>
                <li><strong>Real-World Authorship:</strong> Proves which wallet registered first, but cannot physically confirm who held the keyboard without off-chain identity (KYC).</li>
                <li><strong>Factual Truth:</strong> Cryptographic integrity proves a document is untampered, not that its written contents are factually correct.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Limitations & Future Scope */}
      <section className="card">
        <div className="section-title-row">
          <SparklesIcon size={24} className="text-emerald" />
          <h2 className="card-title">6. Limitations & Future Scope</h2>
        </div>
        <div className="future-scope-grid">
          <div className="scope-item">
            <h4>Decentralized Storage (IPFS / Filecoin)</h4>
            <p>Integrating decentralized pinners to allow optional encrypted off-chain storage for content distribution.</p>
          </div>
          <div className="scope-item">
            <h4>C2PA Standard Alignment</h4>
            <p>Supporting Coalition for Content Provenance and Authenticity (C2PA) cryptographic manifest embedding.</p>
          </div>
          <div className="scope-item">
            <h4>Layer-2 Scaling (Arbitrum / Polygon)</h4>
            <p>Deploying onto low-gas Layer-2 rollups to reduce on-chain registration cost to fractions of a cent.</p>
          </div>
          <div className="scope-item">
            <h4>Zero-Knowledge Redaction (zk-SNARKs)</h4>
            <p>Allowing users to selectively redact sensitive parts of a document while proving the rest matches the original hash.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

