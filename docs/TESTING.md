# Testing Strategy & Automated Test Suite Documentation

**Project**: ContentProof  
**Test Suite**: Hardhat + Mocha + Chai  
**Location**: `test/ContentRegistry.test.js`  

---

## 1. Testing Methodology

The testing framework employs Hardhat's in-memory local EVM node using `@nomicfoundation/hardhat-network-helpers` (`loadFixture`) for snapshot isolation. Before each test block, a clean genesis state is loaded, ensuring independent test repeatability.

---

## 2. Test Execution Command

Run the automated test suite from the project root:

```bash
npx hardhat test
```

### Actual Execution Output:
```
  ContentRegistry Smart Contract
    Deployment & Initial State
      √ should deploy with 0 initial registrations (2490ms)
    Registration Functionality
      √ should successfully register new content and emit ContentRegistered event (63ms)
      √ should reject registration with bytes32(0) hash (58ms)
      √ should reject duplicate registration of the same content hash
    Verification Functionality
      √ should verify existing content and return correct registrar, timestamp, and label (51ms)
      √ should return exists = false and empty fields for unregistered hash
      √ should confirm that modifying content alters hash and fails verification
    Enumeration & History
      √ should allow enumerating registered hashes by index (74ms)
      √ should revert if querying out of bounds hash index

  9 passing (3s)
```

---

## 3. Test Cases Breakdown

### Group 1: Deployment & Initial State
- **Test 1**: `should deploy with 0 initial registrations`
  - *Objective*: Confirm that a freshly deployed contract has `totalRegistrations == 0` and `getAllRegisteredHashes().length == 0`.
  - *Assertion*: `expect(await registry.getRegistrationCount()).to.equal(0)`.

### Group 2: Registration Functionality
- **Test 2**: `should successfully register new content and emit ContentRegistered event`
  - *Objective*: Test happy-path registration by `user1`. Verify that the transaction emits `ContentRegistered` with the exact hash, registrar address, block timestamp, and label.
  - *Assertion*: `expect(tx).to.emit(registry, "ContentRegistered").withArgs(...)`.

- **Test 3**: `should reject registration with bytes32(0) hash`
  - *Objective*: Test boundary safety when passing `ethers.ZeroHash`.
  - *Assertion*: `expect(...).to.be.revertedWith("Invalid content hash: zero hash not permitted")`.

- **Test 4**: `should reject duplicate registration of the same content hash`
  - *Objective*: Register a hash with `user1`, then attempt to register the exact same hash with `user2`.
  - *Assertion*: `expect(...).to.be.revertedWith("Content already registered: duplicate registration rejected")`.

### Group 3: Verification Functionality
- **Test 5**: `should verify existing content and return correct registrar, timestamp, and label`
  - *Objective*: Call `verifyContent` on a registered hash and assert all return values match the recorded data.
  - *Assertion*: `expect(exists).to.be.true; expect(registrar).to.equal(user1.address);`.

- **Test 6**: `should return exists = false and empty fields for unregistered hash`
  - *Objective*: Call `verifyContent` on a random unregistered hash.
  - *Assertion*: `expect(exists).to.be.false; expect(registrar).to.equal(ethers.ZeroAddress);`.

- **Test 7**: `should confirm that modifying content alters hash and fails verification`
  - *Objective*: Hash `Original Content String`, register it, then hash `Original Content String.` (with an added period). Verify that the original succeeds while the modified hash returns `exists = false`.
  - *Assertion*: Proves the cryptographic avalanche effect for tamper detection.

### Group 4: Enumeration & History
- **Test 8**: `should allow enumerating registered hashes by index`
  - *Objective*: Register two distinct hashes and retrieve them via `getHashByIndex(0)` and `getHashByIndex(1)`.
  - *Assertion*: Both hashes match the inputs and `getAllRegisteredHashes().length == 2`.

- **Test 9**: `should revert if querying out of bounds hash index`
  - *Objective*: Call `getHashByIndex(0)` when the registry is empty.
  - *Assertion*: `expect(...).to.be.revertedWith("Index out of bounds")`.

