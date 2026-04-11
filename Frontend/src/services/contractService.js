export const CONTRACT_ADDRESS = "0xc2EB1D64f9BDF7a39ff84DF4CCC7548Bd9Ac9ec4";

export const CONTRACT_ABI = [
  "function deposit() payable",
  "function stake(uint256 amount)",
  "function unstake()",
  "function withdraw(uint256 amount)",
  "function balances(address) view returns (uint256)",
  "function calculateReward(address) view returns (uint256)",
  "function interestRate() view returns (uint256)",
  "function stakes(address) view returns (uint256 amount, uint256 startTime)"
];

export const SEPOLIA_CHAIN_ID = 11155111;
