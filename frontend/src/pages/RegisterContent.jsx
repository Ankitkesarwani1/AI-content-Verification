import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import { computeSHA256, formatBytes } from '../utils/hashing';
import {
  UploadCloudIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  FileTextIcon,
  CopyIcon,
  ExternalLinkIcon,
  SparklesIcon,
  ShieldIcon
} from '../components/Icons';

export default function RegisterContent() {
  const navigate = useNavigate();
  const { account, isConnected, connectWallet, contract } = useWeb3();

  // File & Hashing States
  const [file, setFile] = useState(null);
  const [fileHash, setFileHash] = useState('');
  const [hashTime, setHashTime] = useState(0);
  const [isHashing, setIsHashing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Form States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [aiGenerator, setAiGenerator] = useState('Midjourney v6');
  const [customGenerator, setCustomGenerator] = useState('');

  // Transaction States
  const [isRegistering, setIsRegistering] = useState(false);
  const [txReceipt, setTxReceipt] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [copiedHash, setCopiedHash] = useState(false);

  const fileInputRef = useRef(null);

  const handleFileProcess = async (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setTxReceipt(null);
    setErrorMessage(null);

    // Auto populate title if empty
    if (!title) {
      const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, "");
      setTitle(nameWithoutExt);
    }

    // Set image preview if image
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewUrl(null);
    }

    // Compute cryptographic SHA-256
    try {
      setIsHashing(true);
      const { hash, timeMs } = await computeSHA256(selectedFile);
      setFileHash(hash);
      setHashTime(timeMs);
    } catch (err) {
      console.error('Hashing error:', err);
      setErrorMessage('Failed to compute file hash. Please try another file.');
    } finally {
      setIsHashing(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isConnected) {
      connectWallet();
      return;
    }
    if (!contract) {
      setErrorMessage('Smart contract is not ready. Please verify your connection.');
      return;
    }
    if (!fileHash) {
      setErrorMessage('Please upload a file to generate a cryptographic hash first.');
      return;
    }
    if (!title.trim()) {
      setErrorMessage('Please enter a title or label for this content.');
      return;
    }

    try {
      setIsRegistering(true);
      setErrorMessage(null);
      setTxReceipt(null);

      // Format composite label
      const generatorTag = aiGenerator === 'Other' ? (customGenerator || 'Custom AI') : aiGenerator;
      const compositeLabel = `${title.trim()} [Origin: ${generatorTag}]${description ? ` - ${description.trim()}` : ''}`;

      console.log('Sending transaction with hash:', fileHash, 'label:', compositeLabel);

      // Call smart contract
      const tx = await contract.registerContent(fileHash, compositeLabel);
      console.log('Transaction sent:', tx.hash);

      const receipt = await tx.wait();
      console.log('Transaction confirmed in block:', receipt.blockNumber);

      setTxReceipt({
        txHash: receipt.hash || tx.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed ? receipt.gasUsed.toString() : 'N/A',
        timestamp: new Date().toLocaleString()
      });
    } catch (err) {
      console.error('Registration failed:', err);
      const reason = err.reason || err.message || '';
      if (reason.includes('duplicate') || reason.includes('Content already registered')) {
        setErrorMessage('Registration Rejected: This exact file has already been registered on the blockchain. Cryptographic duplicates are prohibited.');
      } else if (err.code === 4001 || err.code === 'ACTION_REJECTED') {
        setErrorMessage('Transaction was rejected in MetaMask.');
      } else {
        setErrorMessage(reason || 'Transaction failed. Check browser console or network status.');
      }
    } finally {
      setIsRegistering(false);
    }
  };

  const copyHash = () => {
    if (fileHash) {
      navigator.clipboard.writeText(fileHash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Register Content Fingerprint</h1>
        <p className="page-subtitle">
          Permanently anchor the cryptographic SHA-256 fingerprint of your AI-generated or digital asset onto the Ethereum blockchain.
        </p>
      </div>

      <div className="register-layout">
        {/* Left Column: Upload & Hash Card */}
        <div className="card">
          <h2 className="card-title">1. File Ingestion & Cryptographic Hashing</h2>
          <p className="card-subtitle">Select any image, document, or audio file. All computation happens locally in your browser.</p>

          <div
            className={`dropzone ${file ? 'dropzone-active' : ''}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            {previewUrl ? (
              <div className="preview-container">
                <img src={previewUrl} alt="File preview" className="image-preview" />
                <span className="preview-overlay">Click or drag new file to replace</span>
              </div>
            ) : (
              <div className="dropzone-prompt">
                <UploadCloudIcon className="dropzone-icon" size={48} />
                <p className="dropzone-main-text">
                  <strong>Click to browse</strong> or drag & drop file here
                </p>
                <p className="dropzone-sub-text">PNG, JPG, WEBP, PDF, DOCX, TXT, MP3, MP4 (Max 100MB)</p>
              </div>
            )}
          </div>

          {/* File Metadata & Hash Output */}
          {file && (
            <div className="file-info-box mt-4">
              <div className="file-info-header">
                <FileTextIcon size={20} className="text-primary" />
                <div className="file-info-name">
                  <strong>{file.name}</strong>
                  <span>{formatBytes(file.size)} • {file.type || 'Unknown MIME'}</span>
                </div>
              </div>

              <div className="hash-display-group">
                <div className="hash-label-row">
                  <span className="hash-label">Cryptographic Fingerprint (SHA-256 bytes32):</span>
                  <span className="hash-timing">⚡ Computed in {hashTime}ms</span>
                </div>
                <div className="hash-box">
                  <span className="hash-code font-mono">{fileHash || 'Calculating...'}</span>
                  <button onClick={copyHash} className="btn-icon" title="Copy full hash">
                    {copiedHash ? <CheckCircleIcon size={16} className="text-success" /> : <CopyIcon size={16} />}
                  </button>
                </div>
              </div>

              <div className="crypto-assurance-pill">
                <ShieldIcon size={16} />
                <span>Zero raw content is uploaded to any server. Only this 32-byte mathematical digest is registered.</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Metadata & Blockchain Submission */}
        <div className="card">
          <h2 className="card-title">2. Provenance Metadata & On-Chain Record</h2>
          <p className="card-subtitle">Attach human-readable attribution data to the permanent blockchain transaction.</p>

          <form onSubmit={handleRegister} className="form-stack">
            <div className="form-group">
              <label className="form-label" htmlFor="content-title">
                Content Title / Asset Name <span className="text-danger">*</span>
              </label>
              <input
                id="content-title"
                type="text"
                className="form-input"
                placeholder="e.g. Cyberpunk Neural Symphony Artwork #42"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="generator-select">
                Content Origin / AI Model Provenance
              </label>
              <select
                id="generator-select"
                className="form-select"
                value={aiGenerator}
                onChange={(e) => setAiGenerator(e.target.value)}
              >
                <option value="Midjourney v6">Midjourney v6</option>
                <option value="DALL-E 3">DALL-E 3</option>
                <option value="Stable Diffusion XL">Stable Diffusion XL</option>
                <option value="Flux.1 Schnell">Flux.1 Schnell</option>
                <option value="ChatGPT-4o (Text/Code)">ChatGPT-4o (Text/Code)</option>
                <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
                <option value="Suno / Udio (AI Audio)">Suno / Udio (AI Audio)</option>
                <option value="Human Created / Verified">Human Created / Verified</option>
                <option value="Other">Other / Custom Tool</option>
              </select>
            </div>

            {aiGenerator === 'Other' && (
              <div className="form-group">
                <label className="form-label">Specify Tool / Model Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Local Llama-3 Fine-tuned"
                  value={customGenerator}
                  onChange={(e) => setCustomGenerator(e.target.value)}
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="content-desc">
                Description / Prompt / Optional Notes
              </label>
              <textarea
                id="content-desc"
                rows="3"
                className="form-textarea"
                placeholder="Optional generation prompt, licensing parameters, or project notes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="alert-box alert-error">
                <AlertTriangleIcon size={18} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            {!isConnected ? (
              <button
                type="button"
                onClick={connectWallet}
                className="btn btn-primary btn-block btn-lg"
              >
                Connect Wallet to Register
              </button>
            ) : (
              <button
                type="submit"
                disabled={!file || !fileHash || isHashing || isRegistering}
                className="btn btn-primary btn-block btn-lg"
              >
                {isRegistering ? (
                  <>
                    <span className="spinner-sm"></span>
                    <span>Confirming on Ethereum Blockchain...</span>
                  </>
                ) : (
                  <>
                    <ShieldIcon size={20} />
                    <span>Register on Blockchain</span>
                  </>
                )}
              </button>
            )}
          </form>

          {/* Success Receipt Card */}
          {txReceipt && (
            <div className="receipt-card mt-4">
              <div className="receipt-header">
                <CheckCircleIcon size={24} className="text-success" />
                <h3>Successfully Registered on Blockchain!</h3>
              </div>
              <p className="receipt-intro">
                The cryptographic fingerprint is now permanently sealed on Ethereum.
              </p>

              <div className="receipt-details">
                <div className="receipt-row">
                  <span className="receipt-key">Transaction Hash:</span>
                  <span className="receipt-val font-mono">{txReceipt.txHash}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-key">Block Number:</span>
                  <span className="receipt-val font-mono">#{txReceipt.blockNumber}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-key">Gas Used:</span>
                  <span className="receipt-val font-mono">{txReceipt.gasUsed}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-key">Confirmed At:</span>
                  <span className="receipt-val">{txReceipt.timestamp}</span>
                </div>
              </div>

              <div className="receipt-actions mt-3">
                <button
                  onClick={() => navigate('/verify')}
                  className="btn btn-success btn-sm"
                >
                  Verify This File Now →
                </button>
                <button
                  onClick={() => navigate('/history')}
                  className="btn btn-outline btn-sm"
                >
                  View in Audit Log
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

