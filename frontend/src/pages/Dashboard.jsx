import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import { truncateAddress, truncateHash } from '../utils/hashing';
import {
  ShieldIcon,
  WalletIcon,
  DatabaseIcon,
  CheckCircleIcon,
  UploadCloudIcon,
  SearchIcon,
  CopyIcon,
  RefreshIcon,
  ExternalLinkIcon,
  AlertTriangleIcon
} from '../components/Icons';

export default function Dashboard() {
  const {
    account,
    isConnected,
    isConnecting,
    connectWallet,
    contract,
    network,
    balance,
    contractAddress,
    switchToLocalhost
  } = useWeb3();

  const [totalCount, setTotalCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [recentRecords, setRecentRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedAddr, setCopiedAddr] = useState(false);

  // Fetch contract data
  const fetchDashboardData = async () => {
    if (!contract) return;
    try {
      setLoading(true);
      const count = await contract.getRegistrationCount();
      const total = Number(count);
      setTotalCount(total);

      // Fetch all hashes to build recent activity
      if (total > 0) {
        const hashes = await contract.getAllRegisteredHashes();
        const records = [];
        let myRegistrations = 0;

        // Fetch last 5 records
        const startIdx = Math.max(0, hashes.length - 6);
        for (let i = hashes.length - 1; i >= startIdx; i--) {
          const hash = hashes[i];
          const [exists, registrar, timestamp, label] = await contract.verifyContent(hash);
          if (exists) {
            const isMine = account && registrar.toLowerCase() === account.toLowerCase();
            if (isMine) myRegistrations++;
            records.push({
              hash,
              registrar,
              timestamp: Number(timestamp),
              label,
              isMine
            });
          }
        }

        // Count total user registrations if needed
        if (account) {
          let userTotal = 0;
          for (let i = 0; i < hashes.length; i++) {
            const [, registrar] = await contract.verifyContent(hashes[i]);
            if (registrar.toLowerCase() === account.toLowerCase()) {
              userTotal++;
            }
          }
          setUserCount(userTotal);
        }

        setRecentRecords(records);
      } else {
        setRecentRecords([]);
        setUserCount(0);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contract) {
      fetchDashboardData();
    }
  }, [contract, account]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedAddr(true);
    setTimeout(() => setCopiedAddr(false), 2000);
  };

  return (
    <div className="page-container dashboard-page">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Provenance Dashboard</h1>
          <p className="page-subtitle">Real-time status of ContentRegistry smart contract and wallet connection.</p>
        </div>
        <div className="dashboard-header-actions">
          <button onClick={fetchDashboardData} className="btn btn-outline btn-sm" disabled={loading}>
            <RefreshIcon className={loading ? 'spin' : ''} size={16} />
            <span>{loading ? 'Refreshing...' : 'Refresh On-Chain Data'}</span>
          </button>
        </div>
      </div>

      {/* Network Alert if not connected or wrong network */}
      {!isConnected && (
        <div className="alert-banner alert-warning">
          <AlertTriangleIcon size={20} />
          <div className="alert-content">
            <strong>Wallet Not Connected:</strong> Connect your MetaMask wallet to view your personal registered content and submit transactions.
          </div>
          <button onClick={connectWallet} disabled={isConnecting} className="btn btn-primary btn-sm">
            {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
          </button>
        </div>
      )}

      {isConnected && network && network.chainId !== 31337 && network.chainId !== 1337 && (
        <div className="alert-banner alert-danger">
          <AlertTriangleIcon size={20} />
          <div className="alert-content">
            <strong>Wrong Network Detected:</strong> You are currently on {network.name} (Chain ID: {network.chainId}). ContentProof is deployed to Hardhat Localhost (Chain ID: 31337).
          </div>
          <button onClick={switchToLocalhost} className="btn btn-warning btn-sm">
            Switch to Hardhat Localhost
          </button>
        </div>
      )}

      {/* Stats Cards Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper bg-blue-subtle text-primary">
            <DatabaseIcon size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total On-Chain Registrations</span>
            <span className="stat-number">{totalCount}</span>
            <span className="stat-hint">Global immutable records</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper bg-purple-subtle text-purple">
            <ShieldIcon size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Your Registered Assets</span>
            <span className="stat-number">{isConnected ? userCount : '—'}</span>
            <span className="stat-hint">Registered by connected wallet</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper bg-emerald-subtle text-emerald">
            <CheckCircleIcon size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Verification Precision</span>
            <span className="stat-number">256-bit</span>
            <span className="stat-hint">Cryptographic SHA-256 standard</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper bg-amber-subtle text-amber">
            <WalletIcon size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Wallet Balance</span>
            <span className="stat-number">{isConnected ? `${parseFloat(balance).toFixed(4)} ETH` : '—'}</span>
            <span className="stat-hint">Account balance</span>
          </div>
        </div>
      </div>

      {/* Two Column Section */}
      <div className="dashboard-grid-2col">
        {/* Left Column: Quick Actions & Wallet Details */}
        <div className="col-stack">
          {/* Quick Action Cards */}
          <div className="card">
            <h2 className="card-title">Quick Actions</h2>
            <div className="action-buttons-grid">
              <Link to="/register" className="action-tile action-tile-primary">
                <div className="action-tile-icon">
                  <UploadCloudIcon size={24} />
                </div>
                <div>
                  <h3 className="action-tile-title">Register New Content</h3>
                  <p className="action-tile-desc">Upload a file, generate SHA-256, and record on Ethereum.</p>
                </div>
              </Link>

              <Link to="/verify" className="action-tile action-tile-secondary">
                <div className="action-tile-icon">
                  <SearchIcon size={24} />
                </div>
                <div>
                  <h3 className="action-tile-title">Verify Content Integrity</h3>
                  <p className="action-tile-desc">Check if a file matches any registered on-chain fingerprint.</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Connected Wallet & Node Info */}
          <div className="card">
            <h2 className="card-title">Blockchain Connection Info</h2>
            <div className="info-list">
              <div className="info-item">
                <span className="info-label">Smart Contract:</span>
                <span className="info-value font-mono">
                  {contractAddress}
                  <button onClick={() => copyToClipboard(contractAddress)} className="btn-icon" title="Copy Address">
                    <CopyIcon size={14} />
                  </button>
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Active Network:</span>
                <span className="info-value">
                  {network ? `${network.name} (Chain ${network.chainId})` : 'Not Connected'}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Connected Wallet:</span>
                <span className="info-value font-mono">
                  {account ? (
                    <>
                      {truncateAddress(account)}
                      <button onClick={() => copyToClipboard(account)} className="btn-icon" title="Copy Address">
                        {copiedAddr ? <CheckCircleIcon size={14} className="text-success" /> : <CopyIcon size={14} />}
                      </button>
                    </>
                  ) : (
                    'Not connected'
                  )}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Target RPC Node:</span>
                <span className="info-value font-mono">http://127.0.0.1:8545</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Recent On-Chain Registrations */}
        <div className="card">
          <div className="card-header-flex">
            <div>
              <h2 className="card-title">Recent Registrations</h2>
              <p className="card-subtitle">Latest immutable fingerprints recorded on the blockchain.</p>
            </div>
            <Link to="/history" className="link-more">
              View All →
            </Link>
          </div>

          {recentRecords.length === 0 ? (
            <div className="empty-state">
              <DatabaseIcon size={40} className="text-muted" />
              <p>No content has been registered on-chain yet.</p>
              <Link to="/register" className="btn btn-primary btn-sm mt-3">
                Register First File
              </Link>
            </div>
          ) : (
            <div className="recent-list">
              {recentRecords.map((item, index) => (
                <div key={index} className="recent-item">
                  <div className="recent-item-icon">
                    <ShieldIcon size={20} className="text-primary" />
                  </div>
                  <div className="recent-item-details">
                    <div className="recent-item-title-row">
                      <span className="recent-item-title">{item.label || 'Untitled Asset'}</span>
                      {item.isMine && <span className="badge badge-mine">Yours</span>}
                    </div>
                    <div className="recent-item-hash font-mono">
                      {truncateHash(item.hash)}
                      <button onClick={() => copyToClipboard(item.hash)} className="btn-icon-xs" title="Copy Full Hash">
                        <CopyIcon size={12} />
                      </button>
                    </div>
                    <div className="recent-item-meta">
                      <span>Registrar: {truncateAddress(item.registrar)}</span>
                      <span>•</span>
                      <span>{new Date(item.timestamp * 1000).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

