import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, getContract, TARGET_CHAIN_ID, TARGET_CHAIN_ID_HEX } from '../contract';

const Web3Context = createContext();

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [network, setNetwork] = useState(null);
  const [balance, setBalance] = useState('0');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [hasMetaMask, setHasMetaMask] = useState(false);

  // Check if MetaMask or compatible wallet is injected
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      setHasMetaMask(true);
      const initProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(initProvider);

      // Check if already authorized
      window.ethereum.request({ method: 'eth_accounts' })
        .then(async (accounts) => {
          if (accounts && accounts.length > 0) {
            await handleAccountsChanged(accounts);
          }
        })
        .catch(console.error);

      // Event listeners
      const onAccountsChanged = (accounts) => handleAccountsChanged(accounts);
      const onChainChanged = () => window.location.reload();

      window.ethereum.on('accountsChanged', onAccountsChanged);
      window.ethereum.on('chainChanged', onChainChanged);

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', onAccountsChanged);
          window.ethereum.removeListener('chainChanged', onChainChanged);
        }
      };
    } else {
      setHasMetaMask(false);
    }
  }, []);

  const handleAccountsChanged = async (accounts) => {
    if (accounts.length === 0) {
      setAccount(null);
      setSigner(null);
      setContract(null);
      setBalance('0');
      setError('Please connect your MetaMask wallet.');
    } else {
      try {
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        const currentSigner = await browserProvider.getSigner();
        const currentNetwork = await browserProvider.getNetwork();
        const rawBalance = await browserProvider.getBalance(accounts[0]);

        setProvider(browserProvider);
        setAccount(accounts[0]);
        setSigner(currentSigner);
        setNetwork({
          name: currentNetwork.name === 'unknown' ? 'Local Hardhat' : currentNetwork.name,
          chainId: Number(currentNetwork.chainId)
        });
        setBalance(ethers.formatEther(rawBalance));

        const contractInstance = getContract(currentSigner);
        setContract(contractInstance);
        setError(null);
      } catch (err) {
        console.error('Error setting up account:', err);
        setError(err.message || 'Failed to initialize account.');
      }
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('MetaMask is not installed. Please install MetaMask to use ContentProof.');
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      await handleAccountsChanged(accounts);
    } catch (err) {
      console.error('User rejected connection:', err);
      if (err.code === 4001) {
        setError('Wallet connection rejected by user.');
      } else {
        setError(err.message || 'Failed to connect wallet.');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const switchToLocalhost = async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: TARGET_CHAIN_ID_HEX }]
      });
    } catch (switchError) {
      // Chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: TARGET_CHAIN_ID_HEX,
                chainName: 'Hardhat Localhost 8545',
                rpcUrls: ['http://127.0.0.1:8545'],
                nativeCurrency: {
                  name: 'Ethereum',
                  symbol: 'ETH',
                  decimals: 18
                }
              }
            ]
          });
        } catch (addError) {
          setError('Failed to add Hardhat network to MetaMask.');
        }
      } else {
        setError('Failed to switch network in MetaMask.');
      }
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setSigner(null);
    setContract(null);
    setBalance('0');
  };

  return (
    <Web3Context.Provider
      value={{
        account,
        signer,
        provider,
        contract,
        network,
        balance,
        isConnected: !!account,
        isConnecting,
        hasMetaMask,
        error,
        contractAddress: CONTRACT_ADDRESS,
        connectWallet,
        disconnectWallet,
        switchToLocalhost
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
