import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../services/contractService';

const EMPTY_DATA = {
  depositedBalance: '0.0000',
  reward:           '0.0000',
  interestRate:     '0',
  stakeAmount:      '0.0000',
  stakeStartTime:   null,
};

export function useContract(signer) {
  const [contractData, setContractData] = useState(EMPTY_DATA);
  const [loading,      setLoading]      = useState(false);
  const [txStatus,     setTxStatus]     = useState('idle'); // idle | loading | success | error
  const [txMessage,    setTxMessage]    = useState('');

  // ── Helpers ────────────────────────────────────────────────────
  const getContract = useCallback(() => {
    if (!signer) throw new Error('Wallet not connected.');
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  }, [signer]);

  const setStatus = (status, message = '') => {
    setTxStatus(status);
    setTxMessage(message);
  };

  // ── Read contract data ─────────────────────────────────────────
  const fetchContractData = useCallback(async (address) => {
    if (!signer || !address) return;
    try {
      const contract = getContract();
      const [rawBalance, rawReward, rawRate, rawStake] = await Promise.all([
        contract.balances(address),
        contract.calculateReward(address),
        contract.interestRate(),
        contract.stakes(address),
      ]);

      const stakeTimestamp = rawStake.startTime?.toNumber?.() ?? 0;

      setContractData({
        depositedBalance: parseFloat(ethers.utils.formatEther(rawBalance)).toFixed(4),
        reward:           parseFloat(ethers.utils.formatEther(rawReward)).toFixed(6),
        interestRate:     rawRate.toString(),
        stakeAmount:      parseFloat(ethers.utils.formatEther(rawStake.amount)).toFixed(4),
        stakeStartTime:   stakeTimestamp > 0
          ? new Date(stakeTimestamp * 1000).toLocaleString()
          : null,
      });
    } catch (err) {
      console.error('fetchContractData error:', err);
    }
  }, [signer, getContract]);

  // ── Write helpers ──────────────────────────────────────────────
  const runTx = async (txFn, successMsg, address) => {
    setLoading(true);
    setStatus('loading', 'Transaction pending...');
    try {
      const tx = await txFn();
      await tx.wait();
      setStatus('success', successMsg);
      await fetchContractData(address);
    } catch (err) {
      const msg = err.code === 4001
        ? 'Transaction rejected by user.'
        : (err.reason || err.message || 'Transaction failed.');
      setStatus('error', msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Actions ────────────────────────────────────────────────────
  const deposit = async (ethAmount, address) => {
    const contract = getContract();
    await runTx(
      () => contract.deposit({ value: ethers.utils.parseEther(ethAmount) }),
      `Deposited ${ethAmount} ETH successfully.`,
      address
    );
  };

  const stake = async (amount, address) => {
    const contract = getContract();
    await runTx(
      () => contract.stake(ethers.utils.parseEther(amount)),
      `Staked ${amount} ETH successfully.`,
      address
    );
  };

  const unstake = async (address) => {
    const contract = getContract();
    await runTx(
      () => contract.unstake(),
      'Unstaked successfully.',
      address
    );
  };

  const withdraw = async (amount, address) => {
    const contract = getContract();
    await runTx(
      () => contract.withdraw(ethers.utils.parseEther(amount)),
      `Withdrew ${amount} ETH successfully.`,
      address
    );
  };

  const clearTxStatus = () => setStatus('idle', '');

  return {
    contractData,
    loading,
    txStatus,
    txMessage,
    fetchContractData,
    deposit,
    stake,
    unstake,
    withdraw,
    clearTxStatus,
  };
}
