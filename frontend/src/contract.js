import { ethers } from "ethers";
import contractData from "./contractData.json";

export const CONTRACT_ADDRESS = contractData.address;
export const CONTRACT_ABI = contractData.abi;
export const TARGET_CHAIN_ID = contractData.chainId || 31337;
export const TARGET_CHAIN_ID_HEX = "0x" + TARGET_CHAIN_ID.toString(16);

/**
 * Returns an instance of the ContentRegistry contract.
 * @param {ethers.Signer|ethers.Provider} signerOrProvider 
 * @returns {ethers.Contract}
 */
export function getContract(signerOrProvider) {
  if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
    throw new Error("Contract address is not configured. Please deploy the smart contract first.");
  }
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerOrProvider);
}
