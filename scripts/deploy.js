const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying ContentRegistry to network:", hre.network.name);

  const ContentRegistry = await hre.ethers.getContractFactory("ContentRegistry");
  const registry = await ContentRegistry.deploy();

  await registry.waitForDeployment();

  const address = await registry.getAddress();
  console.log("==================================================");
  console.log("✅ ContentRegistry deployed successfully!");
  console.log("📍 Contract Address:", address);
  console.log("==================================================");

  // Read ABI from compiled artifacts
  const artifactPath = path.join(__dirname, "../artifacts/contracts/ContentRegistry.sol/ContentRegistry.json");
  if (fs.existsSync(artifactPath)) {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    const frontendDir = path.join(__dirname, "../frontend/src");
    
    if (!fs.existsSync(frontendDir)) {
      fs.mkdirSync(frontendDir, { recursive: true });
    }

    const deployData = {
      address: address,
      network: hre.network.name,
      chainId: hre.network.config.chainId || 31337,
      abi: artifact.abi,
      deployedAt: new Date().toISOString()
    };

    const targetFile = path.join(frontendDir, "contractData.json");
    fs.writeFileSync(targetFile, JSON.stringify(deployData, null, 2));
    console.log("📁 Synchronized contract address and ABI to frontend/src/contractData.json");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
