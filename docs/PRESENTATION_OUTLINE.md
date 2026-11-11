# 8-Slide Presentation Outline & Viva Defense Script

**Project Title**: ContentProof: Blockchain-Based AI-Generated Content Provenance and Authenticity Verification  
**Presenter**: Ankit Kesarwani (B.Tech AI & Data Science)  
**Duration**: 10–12 Minutes + Q&A  

---

## Slide 1: Title & Introduction
- **Slide Title**: ContentProof: Decentralized Content Authenticity & Cryptographic Provenance
- **Key Points**:
  - College Mini-Project | Third-Year B.Tech AI & Data Science
  - Student: Ankit Kesarwani
  - Tech Stack: Solidity 0.8.24 | Hardhat | Ethereum | React 18 | Ethers.js v6
- **Speaker Notes**:
  > "Good morning respected faculty members and examiners. Today, I am presenting 'ContentProof', a blockchain-based protocol designed to verify the provenance and authenticity of AI-generated and digital content through client-side cryptographic hashing and Ethereum smart contracts."

---

## Slide 2: The Problem Statement
- **Slide Title**: The AI Generative Dilemma & Forgery Crisis
- **Key Points**:
  - Proliferation of generative AI (Midjourney, DALL-E, Stable Diffusion, LLMs) creates realistic synthetic media in seconds.
  - Vulnerability to tampering, deepfakes, copyright plagiarism, and backdating.
  - Centralized databases represent single points of failure and can be edited arbitrarily.
  - Existing verification tools require uploading confidential files to third-party servers.
- **Speaker Notes**:
  > "As generative AI accelerates, proving that a specific digital asset existed at a given point in time without alteration has become critical. Centralized databases can be quietly altered by administrators, while traditional watermarks are easily stripped. We need an immutable, decentralized solution."

---

## Slide 3: Proposed Solution
- **Slide Title**: ContentProof: Zero-Trust Cryptographic Provenance
- **Key Points**:
  - **Client-Side Hashing**: SubtleCrypto generates SHA-256 digests in-browser; files never leave the device.
  - **Ethereum Consensus**: Only the 32-byte hash (`bytes32`) is committed to `ContentRegistry.sol`.
  - **Zero-Gas Verification**: Public verification executes via constant-time read queries (`view` functions).
  - **Duplicate Tamper Prevention**: The smart contract rejects duplicate hash entries to protect original authorship primacy.
- **Speaker Notes**:
  > "ContentProof bridges this gap by decoupling the file from its proof. The user hashes their file client-side. The 32-byte digest is registered on Ethereum with a block timestamp and the registrar's cryptographic signature. Anyone can verify authenticity in milliseconds without paying gas."

---

## Slide 4: System Architecture & Data Flow
- **Slide Title**: High-Level Architectural Pipeline
- **Key Points**:
  - Four Tiers: React 18 UI ➔ Browser Web Crypto API ➔ Ethers.js / MetaMask ➔ Ethereum Hardhat EVM.
  - Flow: Ingest File ➔ Compute SHA-256 ➔ Sign Transaction ➔ Store in `mapping(bytes32 => ContentRecord)` ➔ Emit Event.
  - Verification: Upload candidate file ➔ Query `verifyContent(hash)` ➔ Instant match or failure report.
- **Speaker Notes**:
  > "Here is our four-tier architecture. Notice that the raw file is never uploaded to the blockchain—that would be cost-prohibitive. Storing a 32-byte hash costs less than 90,000 gas units, making it extremely efficient."

---

## Slide 5: Smart Contract Design & Implementation
- **Slide Title**: `ContentRegistry.sol` Deep Dive
- **Key Points**:
  - Solidity `0.8.24` with native overflow safety.
  - Struct `ContentRecord`: stores `registrar`, `timestamp`, `label`, and `exists` flag.
  - Security guards:
    - `require(contentHash != bytes32(0))` - Prevents null hash entry.
    - `require(!records[contentHash].exists)` - Rejects duplicate registrations.
  - Dual access structure: mapping for $O(1)$ verification, dynamic array for audit enumeration.
- **Speaker Notes**:
  > "Our contract is deliberately lean and censorship-resistant. There are no owner backdoors or admin keys. The mapping guarantees $O(1)$ lookup time, while an auxiliary array allows our frontend to enumerate recent registrations for public auditing."

---

## Slide 6: Experimental AI Similarity Lab (Perceptual Hashing)
- **Slide Title**: Cryptographic Verification vs. AI Perceptual Similarity
- **Key Points**:
  - **Cryptographic SHA-256**: High diffusion / Avalanche Effect. A 1-bit change produces a completely new hash (tamper detection).
  - **Perceptual aHash (64-bit)**: Converts images to $8 \times 8$ grayscale luminance; measures visual similarity via Hamming distance.
  - Enables creators to detect cropped, resized, or visually derivative AI adaptations.
- **Speaker Notes**:
  > "A key contribution of this project is demonstrating the difference between exact cryptographic integrity and visual similarity. SHA-256 proves exact bit-level truth. Our perceptual hashing module provides an off-chain heuristic to detect visual plagiarism or scaled derivatives."

---

## Slide 7: Automated Testing & Evaluation Results
- **Slide Title**: Verification Results & Test Bench
- **Key Points**:
  - 9 out of 9 Hardhat Mocha/Chai automated tests passing.
  - Test coverage: genesis state, event parameters, duplicate prevention, zero-hash safety, avalanche effect, and index boundaries.
  - Performance: Client hashing < 15ms; on-chain verification latency < 20ms on local testnet.
- **Speaker Notes**:
  > "We subjected our smart contract to rigorous automated testing. All 9 test cases passed, confirming duplicate rejection, event emissions, and zero-hash rejection. In our live demonstration, modifying a single byte immediately triggers the 'NOT REGISTERED' status."

---

## Slide 8: Conclusion & Future Scope
- **Slide Title**: Conclusion & Future Roadmap
- **Key Points**:
  - **Conclusion**: Successfully engineered an end-to-end, functional, privacy-preserving provenance dApp for AI content.
  - **Future Scope**:
    - Integration with IPFS / Filecoin for optional decentralized storage.
    - Zero-Knowledge Proofs (zk-SNARKs) for selective document redaction.
    - Alignment with emerging C2PA content credential standards.
- **Speaker Notes**:
  > "To conclude, ContentProof provides a demonstrable, production-grade foundation for digital provenance. In future work, we plan to incorporate Zero-Knowledge Proofs and C2PA standard integration. Thank you, and I now welcome your questions."

