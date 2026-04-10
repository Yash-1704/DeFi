# DeFi Platform

A simplified **Decentralized Finance (DeFi)** platform that enables users to interact with blockchain-based financial services through an intuitive and user-friendly web interface.

---

## Overview

This application allows users to securely access financial features using their crypto wallet (e.g., MetaMask), eliminating the need for traditional authentication systems.

Users can:
- Transfer ETH directly to other wallets  
- Deposit funds into a smart contract-based pool  
- Earn interest on deposits  
- Stake assets for additional rewards  
- Track all activities via a real-time dashboard  

---

## Key Features

- **Wallet-Based Authentication**  
  Connect using MetaMask - no passwords required  

- **Peer-to-Peer Transfers**  
  Send ETH directly between wallet addresses  

- **Deposit & Earn Interest**  
  Store ETH in a smart contract pool and earn rewards  

- **Staking Mechanism**  
  Lock funds to gain additional returns  

- **Real-Time Dashboard**  
  View balances, deposits, staking, and earnings  

- **User Profiles (Web2 Layer)**  
  Manage user data and activity logs  

---

## Architecture
Frontend(React) **-->** Web3 Layer(thirdweb) **-->** Smart Contracts(Solidity) **-->** Blockchain(Sepolia Testnet) **-->** Backend(Node.js) **-->** Dtabase(MongoDB)


---

## Tech Stack

- Frontend: React.js, Tailwind CSS  
- Web3: thirdweb SDK, MetaMask  
- Smart Contracts: Solidity (Ethereum Sepolia Testnet)  
- Backend: Node.js, Express  
- Database: MongoDB 

---

## How It Works

1. User connects wallet via MetaMask  
2. Chooses an action (transfer, deposit, stake)  
3. Transaction is signed and sent to the blockchain  
4. Smart contract executes the logic  
5. Dashboard updates with latest data  

---

## Core Principles

- **Decentralization** → Funds are managed by smart contracts  
- **Security** → No private data stored, wallet-based access  
- **Transparency** → All transactions are recorded on-chain  
- **User Experience** → Backend enhances performance and usability  

---

## Conclusion

This platform showcases a complete **Web3 + Web2 hybrid architecture**, delivering secure, transparent, and user-friendly decentralized financial services in a simplified manner.

---
