# Smart Contract Specification & Technical Reference

**Contract Name**: `ContentRegistry.sol`  
**Solidity Version**: `^0.8.24`  
**License**: `MIT`  
**Network**: Ethereum / EVM Compatible  

---

## 1. Contract Overview

`ContentRegistry.sol` is an autonomous, decentralized registry for digital content fingerprints. It provides immutable timestamping and provenance records without requiring centralized administration or proprietary backends.

---

## 2. Storage Layout & Data Structures

### `ContentRecord` Struct
Represents the complete on-chain metadata associated with a registered content fingerprint:

```solidity
struct ContentRecord {
    address registrar; // Ethereum wallet address that submitted the registration
    uint256 timestamp; // Block timestamp (block.timestamp) when transaction was mined
    string label;      // Human-readable title or declared AI model metadata
    bool exists;       // Boolean existence flag for O(1) lookup
}
```

### State Variables

| Variable | Type | Visibility | Description |
| :--- | :--- | :--- | :--- |
| `records` | `mapping(bytes32 => ContentRecord)` | `private` | Primary key-value mapping storing records by their SHA-256 hash. |
| `registeredHashes` | `bytes32[]` | `private` | Dynamic array storing sequential registered hashes for enumeration. |
| `totalRegistrations` | `uint256` | `public` | Public counter tracking cumulative registrations. |

---

## 3. Events

### `ContentRegistered`
Emitted upon every successful content registration to allow off-chain indexers (and frontend event listeners) to track registrations.

```solidity
event ContentRegistered(
    bytes32 indexed contentHash,
    address indexed registrar,
    uint256 timestamp,
    string label
);
```
- `contentHash` (indexed): Enables filtering events by specific file fingerprint.
- `registrar` (indexed): Enables filtering all registrations submitted by a specific user wallet.
- `timestamp`: Block time.
- `label`: Metadata string.

---

## 4. Functions Specification

### 4.1 `registerContent`
```solidity
function registerContent(
    bytes32 contentHash,
    string calldata label
) external;
```
Registers a new content fingerprint into the blockchain state.

- **Parameters**:
  - `contentHash` (`bytes32`): 32-byte SHA-256 digest of the digital file.
  - `label` (`string calldata`): Descriptive metadata string (e.g. title, AI origin).
- **Requirements**:
  - `contentHash != bytes32(0)`: Reverts with `"Invalid content hash: zero hash not permitted"`.
  - `!records[contentHash].exists`: Reverts with `"Content already registered: duplicate registration rejected"`.
- **Gas Cost**: ~70,000 to 95,000 gas (depends on string length).

---

### 4.2 `verifyContent`
```solidity
function verifyContent(
    bytes32 contentHash
) external view returns (
    bool exists,
    address registrar,
    uint256 timestamp,
    string memory label
);
```
Queries the blockchain state for a candidate content hash.

- **Parameters**:
  - `contentHash` (`bytes32`): The hash to look up.
- **Returns**:
  - `exists` (`bool`): `true` if registered on-chain, `false` otherwise.
  - `registrar` (`address`): Wallet address of the registrar (or `0x0` if unregistered).
  - `timestamp` (`uint256`): Unix block timestamp of registration (or `0` if unregistered).
  - `label` (`string`): Metadata label attached at registration time.
- **Gas Cost**: **0 gas** when called off-chain via JSON-RPC `eth_call`.

---

### 4.3 `getRegistrationCount`
```solidity
function getRegistrationCount() external view returns (uint256);
```
Returns the total number of registered records on-chain.

---

### 4.4 `getAllRegisteredHashes`
```solidity
function getAllRegisteredHashes() external view returns (bytes32[] memory);
```
Returns an array of all registered hashes. Used by the dApp dashboard and audit log to enumerate historical records.

---

### 4.5 `getHashByIndex`
```solidity
function getHashByIndex(uint256 index) external view returns (bytes32);
```
Returns a registered hash by its sequential 0-based index. Reverts if `index >= registeredHashes.length`.

---

## 5. Security & Audit Checklist

- [x] **No Centralized Admin Keys**: Contract has no owner or pause mechanism, making it censorship-resistant.
- [x] **No External Calls / Reentrancy Safe**: Contract does not transfer ETH or interact with external untrusted contracts.
- [x] **Zero-Hash Validation**: Prevents null hash registrations.
- [x] **Strict Duplicate Prevention**: Protects original timestamp primacy.
- [x] **Input Data Optimization**: Uses `calldata` for string parameters to minimize memory allocations.

