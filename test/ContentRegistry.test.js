const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time, loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("ContentRegistry Smart Contract", function () {
  // Fixture to deploy a fresh contract before each test
  async function deployContentRegistryFixture() {
    const [owner, user1, user2] = await ethers.getSigners();
    const ContentRegistryFactory = await ethers.getContractFactory("ContentRegistry");
    const registry = await ContentRegistryFactory.deploy();
    await registry.waitForDeployment();

    const sampleHash1 = ethers.keccak256(ethers.toUtf8Bytes("AI Generative Artwork #1"));
    const sampleHash2 = ethers.keccak256(ethers.toUtf8Bytes("AI Research Paper v1.0"));
    const sampleLabel1 = "AI Synth Artwork";
    const sampleLabel2 = "Research Draft 2026";

    return { registry, owner, user1, user2, sampleHash1, sampleHash2, sampleLabel1, sampleLabel2 };
  }

  describe("Deployment & Initial State", function () {
    it("should deploy with 0 initial registrations", async function () {
      const { registry } = await loadFixture(deployContentRegistryFixture);
      expect(await registry.getRegistrationCount()).to.equal(0);
      expect(await registry.totalRegistrations()).to.equal(0);
      const hashes = await registry.getAllRegisteredHashes();
      expect(hashes.length).to.equal(0);
    });
  });

  describe("Registration Functionality", function () {
    it("should successfully register new content and emit ContentRegistered event", async function () {
      const { registry, user1, sampleHash1, sampleLabel1 } = await loadFixture(deployContentRegistryFixture);

      const tx = await registry.connect(user1).registerContent(sampleHash1, sampleLabel1);
      const receipt = await tx.wait();
      const block = await ethers.provider.getBlock(receipt.blockNumber);

      await expect(tx)
        .to.emit(registry, "ContentRegistered")
        .withArgs(sampleHash1, user1.address, block.timestamp, sampleLabel1);

      expect(await registry.getRegistrationCount()).to.equal(1);
    });

    it("should reject registration with bytes32(0) hash", async function () {
      const { registry, user1 } = await loadFixture(deployContentRegistryFixture);
      const zeroHash = ethers.ZeroHash;

      await expect(
        registry.connect(user1).registerContent(zeroHash, "Invalid Zero Content")
      ).to.be.revertedWith("Invalid content hash: zero hash not permitted");
    });

    it("should reject duplicate registration of the same content hash", async function () {
      const { registry, user1, user2, sampleHash1, sampleLabel1 } = await loadFixture(deployContentRegistryFixture);

      // First registration succeeds
      await registry.connect(user1).registerContent(sampleHash1, sampleLabel1);

      // Duplicate registration attempt from user2 must fail
      await expect(
        registry.connect(user2).registerContent(sampleHash1, "Duplicate Attempt")
      ).to.be.revertedWith("Content already registered: duplicate registration rejected");

      // Count remains 1
      expect(await registry.getRegistrationCount()).to.equal(1);
    });
  });

  describe("Verification Functionality", function () {
    it("should verify existing content and return correct registrar, timestamp, and label", async function () {
      const { registry, user1, sampleHash1, sampleLabel1 } = await loadFixture(deployContentRegistryFixture);

      const tx = await registry.connect(user1).registerContent(sampleHash1, sampleLabel1);
      const receipt = await tx.wait();
      const block = await ethers.provider.getBlock(receipt.blockNumber);

      const [exists, registrar, timestamp, label] = await registry.verifyContent(sampleHash1);

      expect(exists).to.be.true;
      expect(registrar).to.equal(user1.address);
      expect(timestamp).to.equal(block.timestamp);
      expect(label).to.equal(sampleLabel1);
    });

    it("should return exists = false and empty fields for unregistered hash", async function () {
      const { registry } = await loadFixture(deployContentRegistryFixture);
      const unknownHash = ethers.keccak256(ethers.toUtf8Bytes("Unregistered Document"));

      const [exists, registrar, timestamp, label] = await registry.verifyContent(unknownHash);

      expect(exists).to.be.false;
      expect(registrar).to.equal(ethers.ZeroAddress);
      expect(timestamp).to.equal(0);
      expect(label).to.equal("");
    });

    it("should confirm that modifying content alters hash and fails verification", async function () {
      const { registry, user1 } = await loadFixture(deployContentRegistryFixture);
      const originalText = "Original Content String";
      const modifiedText = "Original Content String."; // subtle dot change

      const originalHash = ethers.keccak256(ethers.toUtf8Bytes(originalText));
      const modifiedHash = ethers.keccak256(ethers.toUtf8Bytes(modifiedText));

      await registry.connect(user1).registerContent(originalHash, "Original Document");

      const [origExists] = await registry.verifyContent(originalHash);
      const [modExists] = await registry.verifyContent(modifiedHash);

      expect(origExists).to.be.true;
      expect(modExists).to.be.false;
    });
  });

  describe("Enumeration & History", function () {
    it("should allow enumerating registered hashes by index", async function () {
      const { registry, user1, user2, sampleHash1, sampleHash2, sampleLabel1, sampleLabel2 } = await loadFixture(deployContentRegistryFixture);

      await registry.connect(user1).registerContent(sampleHash1, sampleLabel1);
      await registry.connect(user2).registerContent(sampleHash2, sampleLabel2);

      expect(await registry.getRegistrationCount()).to.equal(2);
      expect(await registry.getHashByIndex(0)).to.equal(sampleHash1);
      expect(await registry.getHashByIndex(1)).to.equal(sampleHash2);

      const allHashes = await registry.getAllRegisteredHashes();
      expect(allHashes.length).to.equal(2);
      expect(allHashes[0]).to.equal(sampleHash1);
      expect(allHashes[1]).to.equal(sampleHash2);
    });

    it("should revert if querying out of bounds hash index", async function () {
      const { registry } = await loadFixture(deployContentRegistryFixture);
      await expect(registry.getHashByIndex(0)).to.be.revertedWith("Index out of bounds");
    });
  });
});
