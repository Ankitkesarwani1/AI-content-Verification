import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import { truncateAddress, truncateHash } from '../utils/hashing';
import {
  SearchIcon,
  DatabaseIcon,
  CopyIcon,
  CheckCircleIcon,
  RefreshIcon,
  ExternalLinkIcon,
  ShieldIcon
} from '../components/Icons';

export default function History() {
  const navigate = useNavigate();
  const { contract, account } = useWeb3();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMineOnly, setFilterMineOnly] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const fetchHistory = async () => {
    if (!contract) return;
    try {
      setLoading(true);
      const hashes = await contract.getAllRegisteredHashes();
      const loaded = [];

      for (let i = hashes.length - 1; i >= 0; i--) {
        const hash = hashes[i];
        const [exists, registrar, timestamp, label] = await contract.verifyContent(hash);
        if (exists) {
          loaded.push({
            id: i,
            hash,
            registrar,
            timestamp: Number(timestamp),
            label: label || 'Untitled Content',
            isMine: account && registrar.toLowerCase() === account.toLowerCase()
          });
        }
      }
      setRecords(loaded);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contract) {
      fetchHistory();
    }
  }, [contract, account]);

  const copyHash = (hash, index) => {
    navigator.clipboard.writeText(hash);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const exportAsJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(records, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `contentproof_audit_log_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Filtered records
  const filteredRecords = records.filter((r) => {
    if (filterMineOnly && !r.isMine) return false;
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      r.label.toLowerCase().includes(query) ||
      r.hash.toLowerCase().includes(query) ||
      r.registrar.toLowerCase().includes(query)
    );
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-flex-between">
          <div>
            <h1 className="page-title">On-Chain Audit Records</h1>
            <p className="page-subtitle">
              Public immutable ledger of all content fingerprints recorded in the ContentRegistry smart contract.
            </p>
          </div>
          <div className="header-actions-group">
            <button onClick={exportAsJSON} className="btn btn-outline btn-sm" disabled={records.length === 0}>
              Export JSON Audit
            </button>
            <button onClick={fetchHistory} className="btn btn-outline btn-sm" disabled={loading}>
              <RefreshIcon className={loading ? 'spin' : ''} size={16} />
              <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="filter-toolbar mt-4">
          <div className="search-bar-wrapper">
            <SearchIcon size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by title, cryptographic hash, or registrar wallet address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-buttons">
            <button
              className={`filter-btn ${!filterMineOnly ? 'filter-btn-active' : ''}`}
              onClick={() => setFilterMineOnly(false)}
            >
              All Records ({records.length})
            </button>
            <button
              className={`filter-btn ${filterMineOnly ? 'filter-btn-active' : ''}`}
              onClick={() => setFilterMineOnly(true)}
              disabled={!account}
            >
              My Registered Assets
            </button>
          </div>
        </div>
      </div>

      {/* History Records Table / List */}
      <div className="card">
        {loading ? (
          <div className="empty-state">
            <span className="spinner-lg"></span>
            <p className="mt-3">Loading on-chain records from Ethereum smart contract...</p>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="empty-state">
            <DatabaseIcon size={44} className="text-muted" />
            <p>
              {searchQuery
                ? 'No matching records found for this search filter.'
                : 'No content fingerprints registered on-chain yet.'}
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="audit-table">
              <thead>
                <tr>
                  <th>Asset Title / Provenance Metadata</th>
                  <th>Cryptographic SHA-256 Hash</th>
                  <th>Registrar Wallet</th>
                  <th>Timestamp</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((item, idx) => (
                  <tr key={idx} className={item.isMine ? 'row-highlight' : ''}>
                    <td className="cell-title">
                      <div className="title-stack">
                        <strong>{item.label}</strong>
                        {item.isMine && <span className="badge badge-mine">Yours</span>}
                      </div>
                    </td>
                    <td className="cell-hash font-mono">
                      <div className="hash-copy-inline">
                        <span>{truncateHash(item.hash)}</span>
                        <button
                          onClick={() => copyHash(item.hash, idx)}
                          className="btn-icon-xs"
                          title="Copy Full Hash"
                        >
                          {copiedIndex === idx ? (
                            <CheckCircleIcon size={14} className="text-success" />
                          ) : (
                            <CopyIcon size={14} />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="cell-wallet font-mono">
                      {truncateAddress(item.registrar)}
                    </td>
                    <td className="cell-date">
                      {new Date(item.timestamp * 1000).toLocaleDateString()} {new Date(item.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td>
                      <span className="badge badge-verified-sm">
                        <CheckCircleIcon size={12} />
                        Confirmed
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => navigate('/verify')}
                        className="btn btn-outline btn-xs"
                        title="Open verification page"
                      >
                        Verify File
                      </button>
                    </td>
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

