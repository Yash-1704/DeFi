import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { SEPOLIA_CHAIN_ID } from '../services/contractService';

export const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const [walletAddress, setWalletAddress] = useState('');
  const [provider, setProvider]           = useState(null);
  const [signer, setSigner]               = useState(null);
  const [isConnected, setIsConnected]     = useState(false);
  const [balance, setBalance]             = useState('0.0000');
  const [connectError, setConnectError]   = useState('');

  // ── Helpers ────────────────────────────────────────────────────
  const fetchBalance = useCallback(async (prov, address) => {
    try {
      const raw = await prov.getBalance(address);
      setBalance(parseFloat(ethers.utils.formatEther(raw)).toFixed(4));
    } catch {
      setBalance('0.0000');
    }
  }, []);

  const checkNetwork = async (prov) => {
    const network = await prov.getNetwork();
    if (network.chainId !== SEPOLIA_CHAIN_ID) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xaa36a7' }], // Sepolia hex
        });
      } catch {
        throw new Error('Please switch to the Sepolia test network in MetaMask.');
      }
    }
  };

  // ── Connect ────────────────────────────────────────────────────
  const connectWallet = async () => {
    setConnectError('');
    if (!window.ethereum) {
      setConnectError('MetaMask is not installed. Please install it to continue.');
      return;
    }
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      await checkNetwork(web3Provider);
      const web3Signer  = web3Provider.getSigner();
      const address     = await web3Signer.getAddress();

      setProvider(web3Provider);
      setSigner(web3Signer);
      setWalletAddress(address);
      setIsConnected(true);
      await fetchBalance(web3Provider, address);
    } catch (err) {
      if (err.code === 4001) {
        setConnectError('Connection rejected. Please approve the MetaMask request.');
      } else {
        setConnectError(err.message || 'Failed to connect wallet.');
      }
    }
  };

  // ── Disconnect ─────────────────────────────────────────────────
  const disconnectWallet = () => {
    setWalletAddress('');
    setProvider(null);
    setSigner(null);
    setIsConnected(false);
    setBalance('0.0000');
  };

  // ── Auto-reconnect on page load ────────────────────────────────
  useEffect(() => {
    const tryAutoConnect = async () => {
      if (!window.ethereum) return;
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length === 0) return;
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        const network      = await web3Provider.getNetwork();
        if (network.chainId !== SEPOLIA_CHAIN_ID) return; // don't auto-reconnect on wrong network
        const web3Signer   = web3Provider.getSigner();
        const address      = await web3Signer.getAddress();
        setProvider(web3Provider);
        setSigner(web3Signer);
        setWalletAddress(address);
        setIsConnected(true);
        await fetchBalance(web3Provider, address);
      } catch {
        // silent — user just isn't connected
      }
    };
    tryAutoConnect();
  }, [fetchBalance]);

  // ── MetaMask event listeners ───────────────────────────────────
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== walletAddress) {
        // re-init with new account
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        const web3Signer   = web3Provider.getSigner();
        setProvider(web3Provider);
        setSigner(web3Signer);
        setWalletAddress(accounts[0]);
        setIsConnected(true);
        fetchBalance(web3Provider, accounts[0]);
      }
    };

    const handleChainChanged = () => window.location.reload();

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);
    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [walletAddress, fetchBalance]);

  const value = {
    walletAddress,
    provider,
    signer,
    isConnected,
    balance,
    connectError,
    setConnectError,
    connectWallet,
    disconnectWallet,
    fetchBalance: () => provider && walletAddress && fetchBalance(provider, walletAddress),
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWalletContext = () => useContext(WalletContext);
