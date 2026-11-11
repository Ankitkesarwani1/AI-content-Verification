import React, { useState, useRef } from 'react';
import { useWeb3 } from '../context/Web3Context';
import {
  computeSHA256,
  computePerceptualHash,
  computeTextSHA256,
  calculateSimilarity,
  formatBytes,
  truncateAddress
} from '../utils/hashing';
import {
  UploadCloudIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertTriangleIcon,
  FileTextIcon,
  CopyIcon,
  ShieldIcon,
  SearchIcon,
  SparklesIcon,
  RefreshIcon
} from '../components/Icons';

export default function VerifyContent() {
  const { contract, isConnected } = useWeb3();

  // Active Tab: 'file' | 'demo' | 'similarity'
  const [activeTab, setActiveTab] = useState('file');

  // File verification state
  const [file, setFile] = useState(null);
  const [fileHash, setFileHash] = useState('');
  const [isHashing, setIsHashing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [copiedHash, setCopiedHash] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Live Integrity Demo State
  const [demoText1, setDemoText1] = useState('ContentProof Official AI Prompt #101');
  const [demoText2, setDemoText2] = useState('ContentProof Official AI Prompt #102');
  const [demoHash1, setDemoHash1] = useState('');
  const [demoHash2, setDemoHash2] = useState('');

  // Perceptual Similarity State
  const [simFile1, setSimFile1] = useState(null);
  const [simFile2, setSimFile2] = useState(null);
  const [simHash1, setSimHash1] = useState(null);
  const [simHash2, setSimHash2] = useState(null);
  const [similarityScore, setSimilarityScore] = useState(null);

  const fileInputRef = useRef(null);

  // Compute live demo hashes
  React.useEffect(() => {
    computeTextSHA256(demoText1).then(setDemoHash1);
  }, [demoText1]);

  React.useEffect(() => {
    computeTextSHA256(demoText2).then(setDemoHash2);
  }, [demoText2]);

  const handleFileProcess = async (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setVerificationResult(null);
    setErrorMessage(null);

    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewUrl(null);
    }

    try {
      setIsHashing(true);
      const { hash } = await computeSHA256(selectedFile);
      setFileHash(hash);
      // Immediately run on-chain verification
      await executeVerification(hash);
    } catch (err) {
      console.error('Hash error:', err);
      setErrorMessage('Failed to compute file hash.');
    } finally {
      setIsHashing(false);
    }
  };

  const executeVerification = async (hashToVerify) => {
    if (!contract) {
      setErrorMessage('Contract connection unavailable. Make sure your local node is running.');
      return;
    }

    try {
      setIsVerifying(true);
      setErrorMessage(null);

      console.log('Querying ContentRegistry for hash:', hashToVerify);
      const [exists, registrar, timestamp, label] = await contract.verifyContent(hashToVerify);

      setVerificationResult({
        exists,
        registrar: exists ? registrar : null,
        timestamp: exists ? Number(timestamp) : null,
        label: exists ? label : null,
        queriedHash: hashToVerify
      });
    } catch (err) {
      console.error('Verification query failed:', err);
      setErrorMessage(err.message || 'Failed to query smart contract.');
    } finally {
      setIsVerifying(false);
    }
  };

  const copyHash = (hash) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Content Authenticity & Verification</h1>
        <p className="page-subtitle">
          Cryptographically test whether a digital asset matches an immutable registration record on the Ethereum blockchain.
        </p>

        {/* Tab navigation */}
        <div className="tab-pills mt-4">
          <button
            className={`tab-pill ${activeTab === 'file' ? 'tab-pill-active' : ''}`}
            onClick={() => setActiveTab('file')}
          >
            <ShieldIcon size={16} />
            <span>File Verification</span>
          </button>
          <button
            className={`tab-pill ${activeTab === 'demo' ? 'tab-pill-active' : ''}`}
            onClick={() => setActiveTab('demo')}
          >
            <SparklesIcon size={16} />
            <span>Integrity / Avalanche Demo</span>
          </button>
          <button
            className={`tab-pill ${activeTab === 'similarity' ? 'tab-pill-active' : ''}`}
            onClick={() => setActiveTab('similarity')}
          >
            <SearchIcon size={16} />
            <span>AI Perceptual Similarity Lab</span>
          </button>
        </div>
      </div>

      {/* TAB 1: File Verification */}
      {activeTab === 'file' && (
        <div className="verify-layout">
          {/* Upload card */}
          <div className="card">
            <h2 className="card-title">Upload Candidate File to Verify</h2>
            <p className="card-subtitle">Upload any file to calculate its SHA-256 fingerprint and verify it against on-chain records.</p>

            <div
              className={`dropzone ${file ? 'dropzone-active' : ''}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files[0]) handleFileProcess(e.dataTransfer.files[0]);
              }}
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => e.target.files[0] && handleFileProcess(e.target.files[0])}
                style={{ display: 'none' }}
              />
              {previewUrl ? (
                <div className="preview-container">
                  <img src={previewUrl} alt="Candidate file preview" className="image-preview" />
                  <span className="preview-overlay">Click to select another file</span>
                </div>
              ) : (
                <div className="dropzone-prompt">
                  <SearchIcon className="dropzone-icon" size={48} />
                  <p className="dropzone-main-text">
                    <strong>Click to browse</strong> or drag & drop candidate file
                  </p>
                  <p className="dropzone-sub-text">Any file format supported (Images, Documents, Media)</p>
                </div>
              )}
            </div>

            {file && (
              <div className="file-info-box mt-4">
                <div className="file-info-header">
                  <FileTextIcon size={20} className="text-primary" />
                  <div className="file-info-name">
                    <strong>{file.name}</strong>
                    <span>{formatBytes(file.size)} • {file.type || 'MIME'}</span>
                  </div>
                </div>

                <div className="hash-display-group">
                  <span className="hash-label">Calculated Cryptographic SHA-256:</span>
                  <div className="hash-box">
                    <span className="hash-code font-mono">{fileHash}</span>
                    <button onClick={() => copyHash(fileHash)} className="btn-icon" title="Copy hash">
                      {copiedHash ? <CheckCircleIcon size={16} className="text-success" /> : <CopyIcon size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => executeVerification(fileHash)}
                  disabled={isVerifying || isHashing}
                  className="btn btn-primary btn-block mt-3"
                >
                  {isVerifying ? (
                    <>
                      <span className="spinner-sm"></span>
                      <span>Querying Blockchain...</span>
                    </>
                  ) : (
                    <>
                      <RefreshIcon size={16} />
                      <span>Re-Verify On-Chain</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {errorMessage && (
              <div className="alert-box alert-error mt-4">
                <AlertTriangleIcon size={18} />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Verification Results Column */}
          <div className="card">
            <h2 className="card-title">Verification Outcome</h2>
            <p className="card-subtitle">On-chain consensus report verified directly by the smart contract.</p>

            {!verificationResult ? (
              <div className="empty-state">
                <SearchIcon size={44} className="text-muted" />
                <p>Upload a file to run cryptographic verification against the Ethereum ContentRegistry contract.</p>
              </div>
            ) : verificationResult.exists ? (
              /* VERIFIED CARD */
              <div className="result-card result-verified">
                <div className="result-status-header">
                  <div className="status-badge-lg badge-verified">
                    <CheckCircleIcon size={24} />
                    <span>VERIFIED AUTHENTIC</span>
                  </div>
                </div>

                <p className="result-message">
                  <strong>Cryptographic Match Confirmed:</strong> The exact binary bitstream of this file matches a verified fingerprint registered on the Ethereum blockchain.
                </p>

                <div className="provenance-table">
                  <div className="provenance-row">
                    <span className="prov-key">Content Label:</span>
                    <span className="prov-val font-semibold">{verificationResult.label || 'Unnamed Asset'}</span>
                  </div>
                  <div className="provenance-row">
                    <span className="prov-key">Registrar Wallet:</span>
                    <span className="prov-val font-mono">{verificationResult.registrar}</span>
                  </div>
                  <div className="provenance-row">
                    <span className="prov-key">Block Timestamp:</span>
                    <span className="prov-val">
                      {new Date(verificationResult.timestamp * 1000).toLocaleString()} (Unix: {verificationResult.timestamp})
                    </span>
                  </div>
                  <div className="provenance-row">
                    <span className="prov-key">Cryptographic Hash:</span>
                    <span className="prov-val font-mono text-sm">{verificationResult.queriedHash}</span>
                  </div>
                </div>

                <div className="academic-note-box">
                  <ShieldIcon size={16} />
                  <span>
                    <strong>Integrity Guarantee:</strong> This proves beyond mathematical doubt that this exact digital file existed in this precise state at or before block timestamp {new Date(verificationResult.timestamp * 1000).toLocaleTimeString()}.
                  </span>
                </div>
              </div>
            ) : (
              /* NOT VERIFIED CARD */
              <div className="result-card result-unverified">
                <div className="result-status-header">
                  <div className="status-badge-lg badge-unverified">
                    <XCircleIcon size={24} />
                    <span>NOT REGISTERED / UNVERIFIED</span>
                  </div>
                </div>

                <p className="result-message">
                  <strong>No Matching Fingerprint Found:</strong> The calculated SHA-256 hash does not exist in the ContentRegistry smart contract records.
                </p>

                <div className="unverified-reasons">
                  <h4>What does this mean?</h4>
                  <ul>
                    <li>The file was <strong>never registered</strong> on this blockchain network.</li>
                    <li>The file has been <strong>tampered with or modified</strong> (even 1 altered byte changes the hash completely).</li>
                    <li>The file was re-saved with different compression or metadata headers.</li>
                  </ul>
                </div>

                <div className="queried-hash-box mt-3">
                  <span className="text-muted text-xs">Queried Hash:</span>
                  <div className="font-mono text-xs">{verificationResult.queriedHash}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Integrity & Avalanche Effect Demonstration */}
      {activeTab === 'demo' && (
        <div className="card">
          <div className="demo-header">
            <h2 className="card-title">Cryptographic Integrity & Avalanche Effect Demo</h2>
            <p className="card-subtitle">
              Demonstrating the fundamental security principle of cryptographic hashing: 
              a minute change to the input content produces an entirely unpredictable and uncorrelated hash output.
            </p>
          </div>

          <div className="avalanche-grid">
            {/* Input 1 */}
            <div className="avalanche-col">
              <label className="form-label">Original Content String:</label>
              <textarea
                rows="3"
                className="form-textarea font-mono"
                value={demoText1}
                onChange={(e) => setDemoText1(e.target.value)}
              />
              <div className="hash-result-box">
                <span className="text-xs text-muted">SHA-256 Digest 1:</span>
                <span className="hash-code font-mono text-primary">{demoHash1}</span>
              </div>
            </div>

            {/* Input 2 */}
            <div className="avalanche-col">
              <label className="form-label">Modified Content String (Notice the last digit):</label>
              <textarea
                rows="3"
                className="form-textarea font-mono"
                value={demoText2}
                onChange={(e) => setDemoText2(e.target.value)}
              />
              <div className="hash-result-box">
                <span className="text-xs text-muted">SHA-256 Digest 2:</span>
                <span className="hash-code font-mono text-purple">{demoHash2}</span>
              </div>
            </div>
          </div>

          <div className="avalanche-explanation mt-4">
            <div className="explanation-pill">
              <strong>College Viva / Defense Insight:</strong>
              <p>
                In SHA-256, strictly changing a single character from <code>#101</code> to <code>#102</code> causes on average ~50% of the output bits to flip completely. This property—the <strong>Avalanche Effect</strong>—ensures that counterfeit or modified AI assets cannot masquerade as the authentic registered document.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AI Perceptual Similarity Lab */}
      {activeTab === 'similarity' && (
        <div className="card">
          <div className="demo-header">
            <h2 className="card-title">AI-Assisted Visual Similarity Analysis (Perceptual Hashing)</h2>
            <p className="card-subtitle">
              Comparing two images using 64-bit Average Perceptual Hashing (aHash). 
              Unlike exact cryptographic verification, perceptual hashes remain close when an image undergoes visual scaling or minor lighting adjustments.
            </p>
          </div>

          <div className="similarity-drop-grid">
            {/* Image 1 */}
            <div className="similarity-col">
              <h4>Image Asset A (Original)</h4>
              <div
                className="sim-dropzone"
                onClick={() => document.getElementById('sim-file-1').click()}
              >
                <input
                  id="sim-file-1"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={async (e) => {
                    const f = e.target.files[0];
                    if (f) {
                      setSimFile1(f);
                      const res = await computePerceptualHash(f);
                      setSimHash1(res);
                      if (simHash2) {
                        setSimilarityScore(calculateSimilarity(res.pHash, simHash2.pHash));
                      }
                    }
                  }}
                />
                {simHash1?.previewUrl ? (
                  <img src={simHash1.previewUrl} alt="Asset A" className="sim-preview" />
                ) : (
                  <div className="sim-prompt">
                    <UploadCloudIcon size={32} />
                    <span>Upload Image A</span>
                  </div>
                )}
              </div>
              {simHash1 && (
                <div className="sim-hash-info">
                  <span className="font-mono text-xs">aHash: {simHash1.pHash}</span>
                </div>
              )}
            </div>

            {/* Image 2 */}
            <div className="similarity-col">
              <h4>Image Asset B (Derivative / Resized)</h4>
              <div
                className="sim-dropzone"
                onClick={() => document.getElementById('sim-file-2').click()}
              >
                <input
                  id="sim-file-2"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={async (e) => {
                    const f = e.target.files[0];
                    if (f) {
                      setSimFile2(f);
                      const res = await computePerceptualHash(f);
                      setSimHash2(res);
                      if (simHash1) {
                        setSimilarityScore(calculateSimilarity(simHash1.pHash, res.pHash));
                      }
                    }
                  }}
                />
                {simHash2?.previewUrl ? (
                  <img src={simHash2.previewUrl} alt="Asset B" className="sim-preview" />
                ) : (
                  <div className="sim-prompt">
                    <UploadCloudIcon size={32} />
                    <span>Upload Image B</span>
                  </div>
                )}
              </div>
              {simHash2 && (
                <div className="sim-hash-info">
                  <span className="font-mono text-xs">aHash: {simHash2.pHash}</span>
                </div>
              )}
            </div>
          </div>

          {/* Similarity Score Display */}
          {similarityScore !== null && (
            <div className="similarity-score-card mt-4">
              <div className="score-header">
                <span className="score-title">Perceptual Visual Similarity Score:</span>
                <span className={`score-value ${similarityScore > 85 ? 'text-success' : similarityScore > 60 ? 'text-warning' : 'text-danger'}`}>
                  {similarityScore}%
                </span>
              </div>
              <div className="score-bar-bg">
                <div className="score-bar-fill" style={{ width: `${similarityScore}%` }}></div>
              </div>
              <p className="score-explanation mt-3">
                {similarityScore > 85
                  ? 'High Visual Similarity: Images appear visually identical or derived with minor compression/resolution changes.'
                  : similarityScore > 60
                  ? 'Moderate Similarity: Images share overall structural composition with noticeable color/detail variations.'
                  : 'Low Similarity: Images represent distinctly different visual compositions.'}
              </p>
            </div>
          )}

          <div className="research-callout-box mt-4">
            <h4>🔬 Research Distinction in College Defense</h4>
            <p>
              In our project architecture, <strong>exact cryptographic verification (SHA-256)</strong> is stored on-chain because blockchain storage requires exactness and tamper-proofing. <strong>Perceptual similarity (aHash)</strong> serves as a supplementary off-chain heuristic for content creators to detect visual mimicry or near-duplicate AI adaptations.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

