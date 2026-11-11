# ContentProof Demonstration & Screenshot Guide

This guide describes each view in the application and provides step-by-step instructions for demonstrating the platform during college project evaluation, presentations, or viva examinations.

---

## 1. Landing Page (`/`)
- **Visual Features**:
  - Gradient header: "Verify AI-Generated & Digital Content with Cryptographic Certainty"
  - Interactive metrics banner (100% collision-resistant SHA-256, Zero Server Content Leakage, Instant Verification).
  - 4-step "How ContentProof Works" flow cards.
  - "Important Scientific Distinction" callout highlighting what blockchain guarantees.
- **Action for Demo**: Show the landing page to explain the motivation and architecture before connecting the wallet.

---

## 2. Provenance Dashboard (`/dashboard`)
- **Visual Features**:
  - Top header displaying active network (`Localhost (31337)`) and connected wallet address pill.
  - 4 statistical cards:
    - Total On-Chain Registrations (queried live from smart contract).
    - Your Registered Assets (filtered by active wallet).
    - Verification Precision (256-bit).
    - Wallet ETH Balance.
  - Quick Action tiles to Register and Verify.
  - Smart Contract details card showing deployed contract address.
  - Recent Registrations feed showing the latest registered assets with "Yours" badges and copy buttons.
- **Action for Demo**: Connect MetaMask on Hardhat Localhost to demonstrate live wallet state updates.

---

## 3. Register Content Page (`/register`)
- **Visual Features**:
  - Two-column layout:
    - Left: Drag-and-drop file dropzone with instant image preview, file size, MIME type, and real-time SHA-256 computation time.
    - Right: Metadata form (Title, AI Origin dropdown e.g. Midjourney, DALL-E, ChatGPT, description).
  - "Register on Blockchain" button calling `contract.registerContent(hash, label)`.
  - Transaction confirmation receipt displaying transaction hash, block number, gas used, and timestamp.
  - Direct action button: "Verify This File Now".
- **Action for Demo**:
  1. Upload a sample image or text file.
  2. Enter title: `AI Synth Art #1` and select `Midjourney v6`.
  3. Click "Register on Blockchain" and approve the transaction in MetaMask.
  4. Point out the receipt card and newly minted block number.

---

## 4. Verify Content Page (`/verify`)
- **Visual Features**:
  - Three interactive tabs:
    1. **File Verification**: Upload a candidate file to test its on-chain registration status.
       - **VERIFIED AUTHENTIC**: Large green badge, registrar address, block timestamp, and metadata label.
       - **NOT REGISTERED**: Large red badge explaining potential reasons (unregistered or modified).
    2. **Integrity / Avalanche Demo**: Two text boxes comparing two nearly identical strings (e.g. `Prompt #101` vs `Prompt #102`) showing how 1 character flips the entire SHA-256 hash.
    3. **AI Perceptual Similarity Lab**: Two image upload zones computing 64-bit Average Perceptual Hash (aHash) and Hamming visual similarity score (0–100%).
- **Action for Demo**:
  1. Re-upload the exact file registered in Step 3 ➔ Watch the green **VERIFIED AUTHENTIC** badge appear instantly with zero gas cost.
  2. Open the file in an editor or image viewer, alter 1 pixel or letter, re-save, and re-upload ➔ Watch it immediately flip to **NOT REGISTERED / UNVERIFIED**. This visibly proves the Avalanche Effect!
  3. Switch to the **Integrity / Avalanche Demo** tab to explain the cryptographic theory.
  4. Switch to the **AI Perceptual Similarity Lab** tab to demonstrate how visual similarity differs from exact cryptographic hashing.

---

## 5. On-Chain Audit Records (`/history`)
- **Visual Features**:
  - Searchable, filterable audit table listing all registered content on the smart contract.
  - Search by Title, Hash, or Registrar address.
  - Filter by "All Records" or "My Registered Assets".
  - One-click "Export JSON Audit" button generating a downloadable `.json` audit report.
  - Individual "Verify File" action button per record.
- **Action for Demo**: Type a keyword into the search bar to demonstrate client-side filtering, then click "Export JSON Audit" to show how an auditor can download the proof log.

---

## 6. About & Architecture Page (`/about`)
- **Visual Features**:
  - Problem Statement and Motivations.
  - System Architecture diagram and data flow pipeline.
  - Comprehensive Technology Stack breakdown.
  - Critical Research Scope comparison table (What Blockchain Proves vs. What Blockchain Alone Cannot Prove).
  - Limitations & Future Scope (IPFS, C2PA, zk-SNARKs).
- **Action for Demo**: Use this page as an on-screen reference during your viva defense or presentation Q&A.

