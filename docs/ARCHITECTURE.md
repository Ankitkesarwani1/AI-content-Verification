# System Architecture & Technical Design Document

**Project**: ContentProof – Blockchain-Based AI-Generated Content Provenance and Authenticity Verification  
**Author**: Ankit Kesarwani (B.Tech AI & Data Science)  
**Academic Year**: 2026  

---

## 1. System Overview

ContentProof is an end-to-end decentralized application (dApp) designed to provide cryptographic proof of existence, provenance, and bit-level integrity for digital and AI-generated content. The system replaces centralized, vulnerable metadata registries with an immutable Ethereum smart contract layer.

### Core Architectural Axiom:
> *Raw content files must never be uploaded to the blockchain or centralized servers. Privacy, bandwidth, and gas cost considerations dictate that all hashing occurs client-side, and only the 32-byte cryptographic digest is stored on-chain.*

---

## 2. Multi-Tier Architectural Model

```
+-----------------------------------------------------------------------------------------+
|                                    PRESENTATION TIER                                    |
|                                                                                         |
|   +---------------------------------------------------------------------------------+   |
|   |                        React 18 + Vite SPA (Client Browser)                     |   |
|   |   - Landing Page (Metrics & Overview)      - Register Page (Upload & Hashing)   |   |
|   |   - Dashboard (Wallet & On-Chain Stats)    - Verify Page (Consensus & Avalanche)|   |
|   |   - Audit History (Searchable Table)       - About Page (Architecture & Ethics) |   |
|   +---------------------------------------------------------------------------------+   |
+--------------------------------------------+--------------------------------------------+
                                             |
                                             v
+-----------------------------------------------------------------------------------------+
|                               CRYPTOGRAPHY & CLIENT TIER                                |
|                                                                                         |
|   +---------------------------------------------------------------------------------+   |
|   |   Web Cryptography API (SubtleCrypto)                                           |   |
|   |   - Algorithm: SHA-256 (FIPS 180-4 standard)                                    |   |
|   |   - Input: ArrayBuffer from File/Blob                                           |   |
|   |   - Output: 256-bit hexadecimal string prefixed with 0x (Solidity bytes32)      |   |
|   |                                                                                 |   |
|   |   Perceptual Image Hash Lab (Experimental aHash)                                |   |
|   |   - 8x8 Grayscale normalisation, average luminance threshold, 64-bit digest     |   |
|   |   - Hamming Distance similarity computation (0-100%)                            |   |
|   +---------------------------------------------------------------------------------+   |
+--------------------------------------------+--------------------------------------------+
                                             |
                                             v
+-----------------------------------------------------------------------------------------+
|                               WEB3 PROVIDER & SIGNER TIER                               |
|                                                                                         |
|   +---------------------------------------------------------------------------------+   |
|   |   MetaMask (EIP-1193 Non-Custodial Provider)                                    |   |
|   |   - Key Management: Secp256k1 Elliptic Curve Signatures                         |   |
|   |   - Network: Ethereum Localhost (Chain ID: 31337, RPC: http://127.0.0.1:8545)   |   |
|   |                                                                                 |   |
|   |   Ethers.js v6 Library                                                          |   |
|   |   - BrowserProvider, Signer, Contract Abstraction Layer                         |   |
|   +---------------------------------------------------------------------------------+   |
+--------------------------------------------+--------------------------------------------+
                                             |
                                             v JSON-RPC calls over HTTP
+-----------------------------------------------------------------------------------------+
|                              BLOCKCHAIN & CONSENSUS TIER                                |
|                                                                                         |
|   +---------------------------------------------------------------------------------+   |
|   |   Hardhat Local EVM Execution Environment (Solidity 0.8.24)                     |   |
|   |                                                                                 |   |
|   |   Contract: ContentRegistry.sol                                                 |   |
|   |   - Storage: mapping(bytes32 => ContentRecord) private records                  |   |
|   |   - Storage: bytes32[] private registeredHashes (enumeration array)             |   |
|   |   - Storage: uint256 public totalRegistrations (counter)                        |   |
|   |   - Method: registerContent(bytes32, string) external [State-modifying]         |   |
|   |   - Method: verifyContent(bytes32) external view returns (...) [Zero-gas]       |   |
|   |   - Method: getAllRegisteredHashes() external view returns (bytes32[])          |   |
|   |   - Event: ContentRegistered(bytes32 indexed, address indexed, uint256, string) |   |
|   +---------------------------------------------------------------------------------+   |
+-----------------------------------------------------------------------------------------+
```

---

## 3. Data Flow Workflows

### 3.1 Content Registration Workflow
1. **User Action**: The user drops an asset (image, PDF, document, audio) onto the dropzone in `/register`.
2. **Local Hashing**: The browser's native `crypto.subtle.digest('SHA-256', arrayBuffer)` processes the binary data in memory.
3. **Form Attestation**: The user provides an asset title and specifies the AI model provenance (e.g. Midjourney v6, DALL-E 3).
4. **Transaction Preparation**: Ethers.js formats the function call `registerContent(contentHash, compositeLabel)`.
5. **Wallet Signature**: MetaMask prompts the user with gas estimate and asks to sign the transaction.
6. **EVM Execution**:
   - The contract verifies `contentHash != bytes32(0)` (guards against zero-hash bugs).
   - The contract checks `!records[contentHash].exists` (guards against duplicates).
   - Writes `ContentRecord` to state storage.
   - Pushes hash to `registeredHashes` array and increments `totalRegistrations`.
   - Emits the `ContentRegistered` event containing indexed parameters.
7. **Client Feedback**: Receipt with transaction hash, block number, and gas consumed is rendered on-screen.

### 3.2 Content Verification Workflow
1. **Candidate Ingestion**: The verifier uploads a file to be authenticated in `/verify`.
2. **Digest Computation**: Client computes SHA-256 digest in sub-millisecond time.
3. **Smart Contract Read**: Ethers.js executes `contract.verifyContent(candidateHash)`.
   - Since `verifyContent` is declared as a `view` function, this call is executed as an eth_call without mining a new block, requiring **zero gas fees**.
4. **Consensus Evaluation**:
   - If `exists == true`: Renders the **VERIFIED** badge, displaying original registrar address, block timestamp, and declared provenance label.
   - If `exists == false`: Renders the **NOT REGISTERED** warning, detailing that the bitstream does not match any record.

---

## 4. Security Considerations & Defensive Patterns

1. **Avalanche Effect for Tamper Detection**:
   The SHA-256 algorithm guarantees high diffusion. If an attacker modifies even a single byte or EXIF tag in a verified image, the resulting hash is completely uncorrelated, immediately failing verification.

2. **Zero-Hash & Empty String Defense**:
   `require(contentHash != bytes32(0), "Invalid content hash")` prevents uninitialized variables from populating registry storage.

3. **Front-Running & Duplicate Rejection**:
   `require(!records[contentHash].exists, "Content already registered")` ensures that a secondary party cannot register an identical hash to overwrite original authorship.

4. **Gas Optimization**:
   The contract uses `string calldata label` for registration inputs to prevent memory allocation overhead.

