# ContentProof – Blockchain-Based AI-Generated Content Provenance and Authenticity Verification

[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-363636?logo=solidity)](https://soliditylang.org/)
[![Ethereum](https://img.shields.io/badge/Network-Ethereum_Localhost-3c3c3d?logo=ethereum)](https://ethereum.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-v2.29.1-FFF100?logo=javascript)](https://hardhat.org/)
[![React](https://img.shields.io/badge/Frontend-React_18_%2B_Vite-61DAFB?logo=react)](https://react.dev/)
[![Ethers.js](https://img.shields.io/badge/Web3-Ethers.js_v6-2535a0)](https://docs.ethers.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

An academic capstone mini-project developed for **B.Tech Artificial Intelligence and Data Science (Third Year)** by **Ankit Kesarwani**.

ContentProof is a decentralized content authenticity and provenance protocol. It establishes an immutable, timestamped audit trail for AI-generated and digital media by permanently anchoring cryptographic **SHA-256** fingerprints on an Ethereum smart contract (`ContentRegistry.sol`).

---

## 📑 Table of Contents
1. [Core Features](#-core-features)
2. [Scientific Scope & Academic Accuracy](#-important-scientific-scope--accuracy)
3. [System Architecture](#-system-architecture)
4. [Technology Stack](#-technology-stack)
5. [Prerequisites](#-prerequisites)
6. [Step-by-Step Installation & Local Execution](#-step-by-step-installation--local-execution)
7. [Configuring MetaMask for Localhost](#-configuring-metamask-for-localhost)
8. [Automated Smart Contract Testing](#-automated-smart-contract-testing)
9. [Project File Structure](#-project-file-structure)
10. [College Submission & Documentation Directory](#-college-submission-documentation)
11. [License](#-license)

---

## 🌟 Core Features

- **Client-Side SHA-256 Cryptographic Hashing**: Raw files (images, PDFs, documents, audio) are processed locally inside the browser using the **Web Cryptography API** (`SubtleCrypto`). Files are never transmitted to any third-party server, preserving 100% data privacy.
- **Immutable Smart Contract Registry (`ContentRegistry.sol`)**: Stores unique 32-byte cryptographic fingerprints (`bytes32`), registrar wallet addresses, Unix block timestamps, and descriptive provenance metadata.
- **Strict Duplicate Prevention**: The contract checks `!records[contentHash].exists`, rejecting duplicate submissions to protect original first-registrant primacy.
- **Zero-Trust One-Click Verification**: Instantly verifies whether a candidate file matches an on-chain record, returning registrar address, exact timestamp, and registration label.
- **Interactive Avalanche Effect Demo**: Real-time educational interactive demonstration showing how a single character change completely scrambles the output hash (avalanche effect).
- **AI Perceptual Similarity Lab (aHash)**: 64-bit Average Perceptual Hashing for images, enabling creators to detect visual mimicry or near-duplicate derivatives while distinguishing exact cryptographic integrity from visual likeness.
- **On-Chain Audit Log & Export**: Search, filter, and inspect registered assets with one-click JSON export.

---

## 🔬 Important Scientific Scope & Accuracy

In academic computer science and blockchain research, precision is critical:

| Category | What ContentProof Proves | What Blockchain Alone Does NOT Prove |
| :--- | :--- | :--- |
| **Bit-Level Integrity** | Proves 100% exact mathematical match to a registered bitstream. | Does not guarantee that modified variants are recognized unless perceptual hashing is used. |
| **Chronological Existence** | Proves the exact file existed before or at the block timestamp. | Does not prove the historical creation process before registration. |
| **Registrar Provenance** | Proves which specific cryptographic Ethereum wallet registered the hash. | Does not physically verify the human identity behind the private key without off-chain KYC. |
| **AI Content Attribution** | Records the creator's declared model (e.g. Midjourney, DALL-E, ChatGPT). | Smart contracts cannot autonomously inspect pixels to prove whether a human or AI generated the file. |
| **Factual Truth** | Proves the file content has not been tampered with since registration. | Integrity does not equal truthfulness; false information can still be hashed. |

---

## 🏗️ System Architecture

```
+----------------------------------------------------------------------------------+
|                             USER BROWSER / CLIENT LAYER                          |
|                                                                                  |
|  [Select File]  ==>  [Web Cryptography API]  ==>  [SHA-256 Digest (bytes32)]    |
|   (Image/PDF)         (crypto.subtle.digest)        (0x5f8a...3b21)              |
+-------------------------------------------------------+--------------------------+
                                                        |
                                                        v
+----------------------------------------------------------------------------------+
|                       WEB3 INTERACTION & TRANSACTION LAYER                       |
|                                                                                  |
|       [MetaMask Non-Custodial Wallet]  <--->  [Ethers.js v6 BrowserProvider]     |
|             (Signs EIP-1193 Transaction with User's Private Key)                 |
+-------------------------------------------------------+--------------------------+
                                                        |
                                                        v  RPC: http://127.0.0.1:8545
+----------------------------------------------------------------------------------+
|                    ETHEREUM CONSENSUS & SMART CONTRACT LAYER                     |
|                                                                                  |
|                       ContentRegistry.sol (Chain ID: 31337)                      |
|                                                                                  |
|   +--------------------------------------------------------------------------+   |
|   | struct ContentRecord {                                                   |   |
|   |     address registrar;                                                   |   |
|   |     uint256 timestamp;                                                   |   |
|   |     string label;                                                        |   |
|   |     bool exists;                                                         |   |
|   | }                                                                        |   |
|   |                                                                          |   |
|   | mapping(bytes32 => ContentRecord) private records;                       |   |
|   | bytes32[] private registeredHashes;                                      |   |
|   +--------------------------------------------------------------------------+   |
+----------------------------------------------------------------------------------+
```

---

## 🛠️ Technology Stack

- **Smart Contract Language**: Solidity `^0.8.24` (EVM target: Paris)
- **Local Blockchain**: Hardhat `2.29.1` Node (Chain ID: `31337`, Port: `8545`)
- **Plugin Suite**: `@nomicfoundation/hardhat-toolbox` (`^5.0.0`)
- **Testing Framework**: Mocha, Chai Matchers, Hardhat Network Helpers
- **Frontend Framework**: React `18.3.1` + Vite `5.4.11` (ESM module)
- **Routing**: React Router DOM `v6.28.0`
- **Web3 Connector**: Ethers.js `v6.13.4`
- **Styling**: Tailored Modern SaaS Design System (CSS3 Custom Properties)

---

## 📦 Prerequisites

1. **Node.js**: `v18.0.0` or higher (verified compatible with Node `v22.17.1`)
2. **npm**: `v9.0.0` or higher
3. **MetaMask Extension**: Installed in Google Chrome, Brave, or Edge browser ([Download MetaMask](https://metamask.io/))

---

## 🚀 Step-by-Step Installation & Local Execution

### Step 1: Clone Repository & Install Root Dependencies
```bash
git clone https://github.com/Ankitkesarwani1/AI-content-Verification.git
cd AI-content-Verification
npm install
```

### Step 2: Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

### Step 3: Run Smart Contract Test Suite
Verify that all 9 automated test specifications pass cleanly:
```bash
npx hardhat test
```
*Expected Output:* `9 passing (3s)`

### Step 4: Launch Local Hardhat Ethereum Blockchain
In Terminal 1:
```bash
npx hardhat node
```
This boots up a local Ethereum JSON-RPC node at `http://127.0.0.1:8545` with 20 pre-funded test accounts containing 10,000 ETH each. Keep this terminal running.

### Step 5: Deploy Smart Contract to Localhost
In Terminal 2:
```bash
npx hardhat run scripts/deploy.js --network localhost
```
*Output:*
```
Deploying ContentRegistry to network: localhost
==================================================
✅ ContentRegistry deployed successfully!
📍 Contract Address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
==================================================
📁 Synchronized contract address and ABI to frontend/src/contractData.json
```

### Step 6: Start the React Frontend Application
In Terminal 2 (or a new Terminal):
```bash
cd frontend
npm run dev
```
Open your browser and navigate to: **`http://localhost:5173`**

---

## 🦊 Configuring MetaMask for Localhost

To interact with the smart contract via your browser:

1. Open the MetaMask browser extension.
2. Click the Network Selector (top-left) -> **Add network** -> **Add a network manually**.
3. Enter the following parameters:
   - **Network Name**: `Hardhat Localhost`
   - **New RPC URL**: `http://127.0.0.1:8545`
   - **Chain ID**: `31337`
   - **Currency Symbol**: `ETH`
4. Click **Save** and switch to `Hardhat Localhost`.
5. **Import a Test Account**:
   - In the terminal running `npx hardhat node`, copy Private Key #0:
     `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
   - In MetaMask, click Account icon -> **Add account or hardware wallet** -> **Import account**.
   - Paste the private key. You will immediately see an account with ~10,000 ETH for gas fees.

---

## 🧪 Automated Smart Contract Testing

The project includes an exhaustive unit test suite in `test/ContentRegistry.test.js`:

```bash
npx hardhat test
```

### Covered Test Cases:
1. `should deploy with 0 initial registrations` - Verifies clean state on genesis.
2. `should successfully register new content and emit ContentRegistered event` - Confirms record creation and event parameters.
3. `should reject registration with bytes32(0) hash` - Validates zero-hash sanity guard.
4. `should reject duplicate registration of the same content hash` - Verifies duplicate rejection.
5. `should verify existing content and return correct registrar, timestamp, and label` - Tests retrieval accuracy.
6. `should return exists = false and empty fields for unregistered hash` - Tests unknown queries.
7. `should confirm that modifying content alters hash and fails verification` - Proves cryptographic avalanche tamper detection.
8. `should allow enumerating registered hashes by index` - Validates enumeration functions.
9. `should revert if querying out of bounds hash index` - Tests boundary safety.

---

## 📁 Project File Structure

```
AI-content-Verification/
├── contracts/
│   └── ContentRegistry.sol        # Enhanced Solidity smart contract (0.8.24)
├── scripts/
│   └── deploy.js                  # Deployment script with auto frontend ABI sync
├── test/
│   └── ContentRegistry.test.js    # 9 automated Mocha/Chai unit tests
├── docs/
│   ├── ARCHITECTURE.md            # Detailed system architecture & data flow
│   ├── SMART_CONTRACT.md          # Technical specification of ContentRegistry.sol
│   ├── TESTING.md                 # Testing strategy & coverage documentation
│   ├── PROJECT_REPORT.md          # Complete college mini-project report draft
│   ├── PRESENTATION_OUTLINE.md    # 8-slide presentation & viva defense script
│   └── SCREENSHOTS.md             # Demonstration guide & UI walkthrough
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Responsive navigation & wallet status badge
│   │   │   ├── Footer.jsx         # Academic project footer & links
│   │   │   └── Icons.jsx          # Custom SVG icon library
│   │   ├── context/
│   │   │   └── Web3Context.jsx    # React Context for MetaMask & Ethers.js
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx    # Professional landing page with metrics
│   │   │   ├── Dashboard.jsx      # Live stats & personal asset management
│   │   │   ├── RegisterContent.jsx# Drag-and-drop registration with SHA-256
│   │   │   ├── VerifyContent.jsx  # Verification, avalanche demo & perceptual lab
│   │   │   ├── History.jsx        # Searchable audit table with JSON export
│   │   │   └── About.jsx          # Comprehensive project & architecture guide
│   │   ├── utils/
│   │   │   └── hashing.js         # SHA-256 (SubtleCrypto) & perceptual aHash
│   │   ├── contract.js            # Contract instance generator
│   │   ├── contractData.json      # Auto-generated deployed address & ABI
│   │   ├── App.jsx                # Route declarations & shell
│   │   ├── App.css                # Premium modern SaaS design system
│   │   └── main.jsx               # Application entry point
│   ├── index.html                 # HTML template with Google Fonts (Inter)
│   ├── package.json               # Frontend dependencies (React, Vite, Ethers)
│   └── vite.config.js             # Vite configuration with preserveSymlinks
├── hardhat.config.js              # Hardhat v2 configuration (Solidity 0.8.24)
├── package.json                   # Root package definition & scripts
├── .gitignore                     # Git exclusion rules
└── README.md                      # Comprehensive project guide (this document)
```

---

## 📚 College Submission & Documentation

Complete academic submission documentation is available in the [`docs/`](docs/) directory:
- [System Architecture Specification](docs/ARCHITECTURE.md)
- [Smart Contract Technical Reference](docs/SMART_CONTRACT.md)
- [Testing & Quality Assurance Report](docs/TESTING.md)
- [College Project Report Draft](docs/PROJECT_REPORT.md)
- [8-Slide Presentation & Viva Defense Outline](docs/PRESENTATION_OUTLINE.md)
- [Demonstration & Screenshots Guide](docs/SCREENSHOTS.md)

---

## 📜 License

This project is licensed under the **MIT License** – free for academic, research, and non-commercial educational use.

**Author**: Ankit Kesarwani  
**Department**: Artificial Intelligence and Data Science  
**Project**: ContentProof (2026)

