import React from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import {
  ShieldIcon,
  LockIcon,
  CheckCircleIcon,
  CpuIcon,
  LayersIcon,
  DatabaseIcon,
  UploadCloudIcon,
  SearchIcon,
  SparklesIcon,
  ExternalLinkIcon
} from '../components/Icons';

export default function LandingPage() {
  const { isConnected, connectWallet } = useWeb3();

  const steps = [
    {
      step: '01',
      title: 'Upload Any Media or Document',
      desc: 'Select an image, PDF, or text file. Files are processed entirely client-side inside your browser—raw content never leaves your machine.',
      icon: <UploadCloudIcon size={28} />
    },
    {
      step: '02',
      title: 'Cryptographic SHA-256 Hashing',
      desc: 'The Web Cryptography API computes an immutable 256-bit (bytes32) unique mathematical fingerprint of your exact binary bitstream.',
      icon: <CpuIcon size={28} />
    },
    {
      step: '03',
      title: 'Immutable Smart Contract Registration',
      desc: 'Your Ethereum transaction permanently records the fingerprint, registrar wallet address, and block timestamp on the Ethereum blockchain.',
      icon: <DatabaseIcon size={28} />
    },
    {
      step: '04',
      title: 'Zero-Trust Public Verification',
      desc: 'Anyone anywhere can upload a candidate file to instantly verify whether it matches the genuine, untampered original on-chain record.',
      icon: <CheckCircleIcon size={28} />
    }
  ];

  const features = [
    {
      title: 'Cryptographic Bit-Level Integrity',
      desc: 'Even altering a single pixel or comma changes the entire SHA-256 hash completely via the avalanche effect.',
      icon: <LockIcon size={24} />
    },
    {
      title: 'Decentralized Provenance Records',
      desc: 'No centralized database or authority can modify or delete existing registration records once written to the blockchain.',
      icon: <LayersIcon size={24} />
    },
    {
      title: 'Zero-Knowledge Privacy',
      desc: 'Only the 32-byte cryptographic hash is published to the chain. Your intellectual property and private documents remain private.',
      icon: <ShieldIcon size={24} />
    },
    {
      title: 'Duplicate Tamper Prevention',
      desc: 'Smart contract validation explicitly rejects duplicate hash submissions, ensuring the earliest timestamp is uniquely preserved.',
      icon: <CheckCircleIcon size={24} />
    },
    {
      title: 'Visual Similarity Lab (Perceptual Hashing)',
      desc: 'Compare cryptographic precision with perceptual similarity metrics (aHash) to identify visually similar derivatives.',
      icon: <SparklesIcon size={24} />
    },
    {
      title: 'Transparent Audit Trail',
      desc: 'Every registration emits on-chain events containing cryptographic hashes, registrar addresses, and exact Unix timestamps.',
      icon: <DatabaseIcon size={24} />
    }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-badge">
          <span className="hero-badge-dot"></span>
          <span>Blockchain-Powered Provenance & Authenticity Protocol</span>
        </div>

        <h1 className="hero-title">
          Verify AI-Generated & Digital Content with{' '}
          <span className="gradient-text">Cryptographic Certainty</span>
        </h1>

        <p className="hero-subtitle">
          ContentProof permanently registers cryptographic SHA-256 fingerprints of digital media on Ethereum.
          Establish indisputable timestamped provenance, detect tampering down to a single byte, and verify originality.
        </p>

        <div className="hero-cta-group">
          {isConnected ? (
            <Link to="/dashboard" className="btn btn-primary btn-lg">
              Launch Dashboard →
            </Link>
          ) : (
            <button onClick={connectWallet} className="btn btn-primary btn-lg">
              Connect MetaMask Wallet →
            </button>
          )}
          <Link to="/verify" className="btn btn-secondary btn-lg">
            <SearchIcon size={20} />
            <span>Verify a File Now</span>
          </Link>
          <Link to="/about" className="btn btn-outline btn-lg">
            About Project
          </Link>
        </div>

        {/* Hero Metrics Strip */}
        <div className="hero-metrics">
          <div className="metric-card">
            <span className="metric-value">100%</span>
            <span className="metric-label">Collision Resistant SHA-256</span>
          </div>
          <div className="metric-divider"></div>
          <div className="metric-card">
            <span className="metric-value">Zero</span>
            <span className="metric-label">Server Content Leakage</span>
          </div>
          <div className="metric-divider"></div>
          <div className="metric-card">
            <span className="metric-value">Instant</span>
            <span className="metric-label">On-Chain Verification</span>
          </div>
          <div className="metric-divider"></div>
          <div className="metric-card">
            <span className="metric-value">Tamper-Proof</span>
            <span className="metric-label">Ethereum Smart Contract</span>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="section-header">
          <span className="section-eyebrow">Architecture Flow</span>
          <h2 className="section-title">How ContentProof Works</h2>
          <p className="section-desc">
            A seamless combination of client-side cryptography and decentralized Ethereum consensus.
          </p>
        </div>

        <div className="steps-grid">
          {steps.map((s, idx) => (
            <div key={idx} className="step-card">
              <div className="step-card-header">
                <span className="step-number">{s.step}</span>
                <div className="step-icon-wrapper">{s.icon}</div>
              </div>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section">
        <div className="section-header">
          <span className="section-eyebrow">Core Capabilities</span>
          <h2 className="section-title">Engineered for Academic & Enterprise Rigor</h2>
          <p className="section-desc">
            Built using industry-standard Solidity patterns, Web3 security principles, and responsive modern UX.
          </p>
        </div>

        <div className="features-grid">
          {features.map((f, idx) => (
            <div key={idx} className="feature-card">
              <div className="feature-icon-wrapper">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Research Accuracy Notice Callout */}
      <section className="research-notice-section">
        <div className="research-notice-card">
          <div className="notice-icon">🔬</div>
          <div className="notice-content">
            <h3>Important Scientific Distinction</h3>
            <p>
              <strong>Cryptographic Integrity vs. Autonomous AI Origin:</strong> The Ethereum smart contract proves that a specific file's exact bitstream was registered by a verified wallet at an exact block timestamp. The blockchain does not independently know if the content was generated by Midjourney, DALL-E, or human hands—it provides the verifiable audit trail of who claimed and sealed that specific asset first.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-section">
        <div className="cta-card">
          <h2>Ready to Register or Verify Content?</h2>
          <p>Deploy to local Hardhat, connect with MetaMask, and interact with the smart contract in real time.</p>
          <div className="cta-actions">
            <Link to="/register" className="btn btn-primary btn-lg">
              Register New Content
            </Link>
            <Link to="/verify" className="btn btn-outline-white btn-lg">
              Verify Candidate File
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

