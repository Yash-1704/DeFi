import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import { useWallet } from '../hooks/useWallet'
import { useContract } from '../hooks/useContract'

const assets = [
  { name: 'USDC', sub: 'USD Coin', apy: '4.12%', liquidity: '$84.2M', balance: '12,400.00', icon: 'monetization_on', iconColor: 'text-blue-400', iconBg: 'bg-blue-500/10', iconBorder: 'border-blue-500/20' },
  { name: 'WETH', sub: 'Wrapped Ethereum', apy: '2.85%', liquidity: '$112.5M', balance: '4.21', icon: 'diamond', iconColor: 'text-purple-400', iconBg: 'bg-purple-500/10', iconBorder: 'border-purple-500/20' },
  { name: 'WBTC', sub: 'Wrapped Bitcoin', apy: '1.92%', liquidity: '$42.1M', balance: '0.12', icon: 'currency_bitcoin', iconColor: 'text-orange-400', iconBg: 'bg-orange-500/10', iconBorder: 'border-orange-500/20' },
]

const borrowAssets = [
  { name: 'USDT', rate: '5.21%', available: '$4.2M', icon: 'savings' },
  { name: 'DAI', rate: '4.88%', available: '$2.1M', icon: 'account_balance_wallet' },
]

export default function Lending() {
  const { walletAddress, signer, isConnected } = useWallet()
  const {
    contractData, loading, txStatus, txMessage,
    fetchContractData, deposit, stake, unstake, withdraw, clearTxStatus,
  } = useContract(signer)

  const [depositAmt,  setDepositAmt]  = useState('')
  const [stakeAmt,    setStakeAmt]    = useState('')
  const [withdrawAmt, setWithdrawAmt] = useState('')
  const [supplyAmt,   setSupplyAmt]   = useState('')
  const [selectedPool, setSelectedPool] = useState(null)
  const [selectedBorrowAsset, setSelectedBorrowAsset] = useState(null)
  const [borrowAmount, setBorrowAmount] = useState('')
  const [collateralAmount, setCollateralAmount] = useState('')
  const [borrowMessage, setBorrowMessage] = useState('')
  const [totalBorrowed, setTotalBorrowed] = useState('0.00')
  const [totalCollateral, setTotalCollateral] = useState('0.00')
  const [supplyMessage, setSupplyMessage] = useState('')

  useEffect(() => {
    if (isConnected && walletAddress) fetchContractData(walletAddress)
  }, [isConnected, walletAddress]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleDeposit  = async () => { if (!depositAmt)  return; await deposit(depositAmt,   walletAddress); setDepositAmt('') }
  const handleStake    = async () => { if (!stakeAmt)    return; await stake(stakeAmt,       walletAddress); setStakeAmt('') }
  const handleUnstake  = async () => { await unstake(walletAddress) }
  const handleWithdraw = async () => { if (!withdrawAmt) return; await withdraw(withdrawAmt, walletAddress); setWithdrawAmt('') }

  const openBorrowModal = (asset) => {
    setSelectedBorrowAsset(asset)
    setBorrowAmount('')
    setCollateralAmount('')
    setBorrowMessage('')
  }

  const closeBorrowModal = () => {
    setSelectedBorrowAsset(null)
    setBorrowAmount('')
    setCollateralAmount('')
    setBorrowMessage('')
  }

  const handleBorrow = () => {
    if (!selectedBorrowAsset) return

    const collateral = Number(collateralAmount)
    const borrow = Number(borrowAmount)
    const maxAllowed = collateral * 0.6

    if (!collateralAmount || !borrowAmount || collateral <= 0 || borrow <= 0) {
      setBorrowMessage('Enter valid collateral and borrow amounts.')
      return
    }

    if (borrow > maxAllowed) {
      setBorrowMessage(`Cannot borrow more than 60% of collateral. Max ${maxAllowed.toFixed(2)} ${selectedBorrowAsset.name}.`)
      return
    }

    const newBorrowed = parseFloat(totalBorrowed) + borrow
    const newCollateral = parseFloat(totalCollateral) + collateral

    setTotalBorrowed(newBorrowed.toFixed(2))
    setTotalCollateral(newCollateral.toFixed(2))
    setBorrowMessage(`Successfully borrowed ${borrow.toFixed(2)} ${selectedBorrowAsset.name}.`)
    setBorrowAmount('')
    setCollateralAmount('')

    window.setTimeout(() => {
      closeBorrowModal()
    }, 1200)
  }

  const openSupplyModal = (asset) => {
    setSelectedPool(asset)
    setSupplyAmt('')
    setSupplyMessage('')
  }

  const closeSupplyModal = () => {
    setSelectedPool(null)
    setSupplyAmt('')
    setSupplyMessage('')
  }

  const handleSupply = async () => {
    if (!selectedPool) return
    if (!isConnected) {
      setSupplyMessage('Connect your wallet to invest in this pool.')
      return
    }
    if (!supplyAmt || Number(supplyAmt) <= 0) {
      setSupplyMessage('Please enter an amount to invest.')
      return
    }

    setSupplyMessage('Confirm this transaction in your wallet...')
    const success = await deposit(supplyAmt, walletAddress)

    if (success) {
      setSupplyMessage(`Invested ${supplyAmt} ETH in ${selectedPool.name}.`)
      setSupplyAmt('')
      window.setTimeout(() => {
        closeSupplyModal()
      }, 900)
    } else {
      setSupplyMessage(txMessage || 'Transaction failed. Please try again.')
    }
  }

  return (
    <div className="bg-[#131314] text-[#e5e2e3] min-h-screen">
      <TopBar />
      <Sidebar />

      <main className="md:ml-64 pt-24 px-8 pb-16">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <h2 className="text-4xl font-headline font-bold tracking-tight text-[#e5e2e3]">Lending Market</h2>
            <p className="text-[#bac9cc] font-body mt-1">Deploy capital and architect your liquidity strategy.</p>
          </div>
        </header>

        {/* My Positions Bento */}
        <div className="grid grid-cols-12 gap-6 mb-12">
          <div className="col-span-12 lg:col-span-8 glass-panel rounded-xl p-8 border border-[#3b494c]/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#c3f5ff]/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
            <h3 className="text-lg font-headline font-bold mb-6 text-[#e5e2e3] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#c3f5ff]">analytics</span>
              My Positions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[#0e0e0f]/50 rounded-lg p-6 flex flex-col justify-center border border-[#3b494c]/10">
                <p className="text-xs font-label uppercase tracking-widest text-[#bac9cc] mb-2">Total Investment</p>
                <p className="text-3xl font-headline font-extrabold tracking-tight">{contractData.depositedBalance} ETH</p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00e297]" style={{ boxShadow: '0 0 10px #00e297' }} />
                  <span className="text-xs font-label text-[#00e297]">Supplied liquidity</span>
                </div>
              </div>
              <div className="bg-[#0e0e0f]/50 rounded-lg p-6 flex flex-col justify-center border border-[#3b494c]/10">
                <p className="text-xs font-label uppercase tracking-widest text-[#bac9cc] mb-2">Total Borrowed</p>
                <p className="text-3xl font-headline font-extrabold tracking-tight text-neutral-400">{totalBorrowed}</p>
                <p className="mt-4 text-xs font-label text-[#bac9cc]">Outstanding loan balance</p>
              </div>
              <div className="bg-[#0e0e0f]/50 rounded-lg p-6 flex flex-col justify-center border border-[#3b494c]/10">
                <p className="text-xs font-label uppercase tracking-widest text-[#bac9cc] mb-4">Total Collateral</p>
                <div className="flex items-end justify-between mb-2">
                  <span className="text-2xl font-headline font-bold text-[#d1bcff]">{totalCollateral} ETH</span>
                  <span className="text-xs font-label text-[#d1bcff] font-bold uppercase">Secured</span>
                </div>
                <div className="w-full h-1 bg-[#353436] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#d1bcff] via-[#00e297] to-[#00e297]" style={{ width: '75%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Boosted Pool */}
          <div className="col-span-12 lg:col-span-4">
            <div className="h-full glass-panel rounded-xl p-6 border border-[#3b494c]/10 group cursor-pointer hover:border-[#c3f5ff]/20 transition-all">
              <div className="flex justify-between items-start mb-6">
                <div className="p-2 rounded-lg bg-[#c3f5ff]/10">
                  <span className="material-symbols-outlined text-[#c3f5ff]">bolt</span>
                </div>
                <span className="text-[10px] font-label font-black text-[#c3f5ff] px-2 py-0.5 border border-[#c3f5ff]/20 rounded uppercase">Incentivized</span>
              </div>
              <h4 className="text-sm font-headline font-bold text-[#bac9cc] mb-1">Boosted Pool Yield</h4>
              <p className="text-2xl font-headline font-black text-[#e5e2e3]">Nexus-ETH LP</p>
              <p className="text-3xl font-headline font-black text-[#c3f5ff] mt-2">
                12.42% <span className="text-xs font-label text-[#bac9cc]">APR</span>
              </p>
            </div>
          </div>
        </div>

        {/* Assets to Supply */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-headline font-bold text-[#e5e2e3]">Assets to Supply</h3>
            <div className="flex gap-4">
              <button className="px-4 py-2 bg-[#201f20] text-xs font-label font-bold rounded-lg border border-[#3b494c]/10 hover:bg-[#3a393a] transition-all">All Markets</button>
              <button className="px-4 py-2 bg-[#2a2a2b] text-[#c3f5ff] text-xs font-label font-bold rounded-lg border border-[#c3f5ff]/20 hover:bg-[#c3f5ff]/10 transition-all">Stablecoins</button>
            </div>
          </div>
          <div className="bg-[#1c1b1c] rounded-xl overflow-hidden border border-[#3b494c]/10 shadow-2xl">
            <div className="grid grid-cols-12 gap-4 px-8 py-4 bg-[#2a2a2b]/50 text-[10px] font-label font-black uppercase tracking-[0.2em] text-[#bac9cc]">
              <div className="col-span-4">Asset</div>
              <div className="col-span-2 text-right">Supply APY</div>
              <div className="col-span-2 text-right">Total Liquidity</div>
              <div className="col-span-2 text-right">Wallet Balance</div>
              <div className="col-span-2" />
            </div>
            <div className="divide-y divide-[#3b494c]/5">
              {assets.map((a, i) => (
                <div key={i} className="grid grid-cols-12 gap-4 px-8 py-6 items-center hover:bg-[#3a393a]/20 transition-all cursor-pointer">
                  <div className="col-span-4 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full ${a.iconBg} flex items-center justify-center border ${a.iconBorder}`}>
                      <span className={`material-symbols-outlined ${a.iconColor}`}>{a.icon}</span>
                    </div>
                    <div>
                      <p className="text-sm font-headline font-bold text-[#e5e2e3]">{a.name}</p>
                      <p className="text-[10px] font-label text-[#bac9cc]">{a.sub}</p>
                    </div>
                  </div>
                  <div className="col-span-2 text-right">
                    <p className="text-sm font-headline font-bold text-[#00e297]">{a.apy}</p>
                    <p className="text-[10px] font-label text-[#bac9cc]">Variable</p>
                  </div>
                  <div className="col-span-2 text-right">
                    <p className="text-sm font-headline font-bold">{a.liquidity}</p>
                  </div>
                  <div className="col-span-2 text-right">
                    <p className="text-sm font-headline font-bold">{a.balance}</p>
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <button onClick={() => openSupplyModal(a)} className="px-4 py-2 bg-[#353436] text-xs font-label font-bold rounded-lg hover:bg-[#c3f5ff]/10 hover:text-[#c3f5ff] transition-all">Supply</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Assets to Borrow */}
        <section className="mb-12">
          <h3 className="text-2xl font-headline font-bold text-[#e5e2e3] mb-6">Assets to Borrow</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {borrowAssets.map((b, i) => (
              <div key={i} className="bg-[#201f20] rounded-xl p-6 border border-[#3b494c]/10 flex items-center justify-between hover:-translate-y-1 transition-transform">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#c3f5ff]">{b.icon}</span>
                  </div>
                  <div>
                    <p className="text-sm font-headline font-bold">{b.name}</p>
                    <p className="text-xs font-label text-[#00e297]">Borrow APR: {b.rate}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="text-xs font-label text-[#bac9cc]">Available: {b.available}</p>
                  <button onClick={() => openBorrowModal(b)} className="bg-gradient-to-br from-[#c3f5ff] to-[#00e5ff] text-[#00363d] text-xs font-label font-black px-6 py-2 rounded-lg hover:opacity-90 transition-all">Borrow</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── DeFi Contract Section ─────────────────────────────────── */}
        <section className="mb-12">
          <h3 className="text-2xl font-headline font-bold text-[#e5e2e3] mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00daf3]">hub</span>
            DeFi Contract
          </h3>

          {!isConnected ? (
            <div className="bg-[#1c1b1c] rounded-xl p-8 border border-[#3b494c]/10 text-center text-neutral-500">
              Connect your wallet to interact with the DeFi contract.
            </div>
          ) : (
            <div className="space-y-6">
              {/* Status banner */}
              {txStatus !== 'idle' && (
                <div className={`flex items-center justify-between gap-4 px-5 py-4 rounded-xl border text-sm font-semibold
                  ${ txStatus === 'loading' ? 'bg-[#00daf3]/10 border-[#00daf3]/30 text-[#00daf3]'
                    : txStatus === 'success' ? 'bg-[#00e297]/10 border-[#00e297]/30 text-[#00e297]'
                    : 'bg-[#ffb4ab]/10 border-[#ffb4ab]/30 text-[#ffb4ab]' }`}>
                  <span>{txMessage}</span>
                  <button onClick={clearTxStatus} className="text-xs opacity-60 hover:opacity-100">✕</button>
                </div>
              )}

              {/* Contract overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#201f20] rounded-xl p-6 border border-[#3b494c]/5">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#bac9cc] mb-2">Deposited Balance</p>
                  <p className="text-3xl font-headline font-extrabold tracking-tight">{contractData.depositedBalance} <span className="text-[#00daf3] text-xl">ETH</span></p>
                </div>
                <div className="bg-[#201f20] rounded-xl p-6 border border-[#3b494c]/5">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#bac9cc] mb-2">Accrued Reward</p>
                  <p className="text-3xl font-headline font-extrabold tracking-tight text-[#00e297]">{contractData.reward} <span className="text-xl">ETH</span></p>
                  <p className="text-xs text-neutral-500 mt-1">Rate: {contractData.interestRate} basis pts</p>
                </div>
                <div className="bg-[#201f20] rounded-xl p-6 border border-[#3b494c]/5">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#bac9cc] mb-2">Staked Amount</p>
                  <p className="text-3xl font-headline font-extrabold tracking-tight text-[#d1bcff]">{contractData.stakeAmount} <span className="text-xl">ETH</span></p>
                  {contractData.stakeStartTime && (
                    <p className="text-xs text-neutral-500 mt-1">Since {contractData.stakeStartTime}</p>
                  )}
                </div>
              </div>

              {/* Action cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {/* Deposit */}
                <div className="bg-[#1c1b1c] rounded-xl p-6 border border-[#3b494c]/10 flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#00daf3] text-lg">savings</span>
                    <h4 className="font-headline font-bold text-sm">Deposit ETH</h4>
                  </div>
                  <input
                    type="number" min="0" step="0.001"
                    value={depositAmt}
                    onChange={e => setDepositAmt(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-[#0e0e0f] border border-[#3b494c]/20 rounded-lg px-4 py-3 text-sm font-mono focus:ring-1 focus:ring-[#00daf3]/40 outline-none transition-all"
                  />
                  <button
                    onClick={handleDeposit}
                    disabled={loading || !depositAmt}
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-[#c3f5ff] to-[#00e5ff] text-[#00363d] font-black text-xs uppercase tracking-widest hover:opacity-90 disabled:opacity-40 transition-all"
                  >
                    {loading ? 'Pending...' : 'Deposit'}
                  </button>
                </div>

                {/* Stake */}
                <div className="bg-[#1c1b1c] rounded-xl p-6 border border-[#3b494c]/10 flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#d1bcff] text-lg">lock</span>
                    <h4 className="font-headline font-bold text-sm">Stake ETH</h4>
                  </div>
                  <input
                    type="number" min="0" step="0.001"
                    value={stakeAmt}
                    onChange={e => setStakeAmt(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-[#0e0e0f] border border-[#3b494c]/20 rounded-lg px-4 py-3 text-sm font-mono focus:ring-1 focus:ring-[#d1bcff]/40 outline-none transition-all"
                  />
                  <button
                    onClick={handleStake}
                    disabled={loading || !stakeAmt}
                    className="w-full py-3 rounded-lg bg-[#d1bcff]/20 border border-[#d1bcff]/30 text-[#d1bcff] font-black text-xs uppercase tracking-widest hover:bg-[#d1bcff]/30 disabled:opacity-40 transition-all"
                  >
                    {loading ? 'Pending...' : 'Stake'}
                  </button>
                </div>

                {/* Unstake */}
                <div className="bg-[#1c1b1c] rounded-xl p-6 border border-[#3b494c]/10 flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#00e297] text-lg">lock_open</span>
                    <h4 className="font-headline font-bold text-sm">Unstake All</h4>
                  </div>
                  <p className="text-xs text-neutral-500 flex-1">
                    Currently staked: <span className="text-[#d1bcff] font-bold">{contractData.stakeAmount} ETH</span>
                  </p>
                  <button
                    onClick={handleUnstake}
                    disabled={loading || contractData.stakeAmount === '0.0000'}
                    className="w-full py-3 rounded-lg bg-[#00e297]/20 border border-[#00e297]/30 text-[#00e297] font-black text-xs uppercase tracking-widest hover:bg-[#00e297]/30 disabled:opacity-40 transition-all"
                  >
                    {loading ? 'Pending...' : 'Unstake All'}
                  </button>
                </div>

                {/* Withdraw */}
                <div className="bg-[#1c1b1c] rounded-xl p-6 border border-[#3b494c]/10 flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#ffb4ab] text-lg">download</span>
                    <h4 className="font-headline font-bold text-sm">Withdraw ETH</h4>
                  </div>
                  <input
                    type="number" min="0" step="0.001"
                    value={withdrawAmt}
                    onChange={e => setWithdrawAmt(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-[#0e0e0f] border border-[#3b494c]/20 rounded-lg px-4 py-3 text-sm font-mono focus:ring-1 focus:ring-[#ffb4ab]/40 outline-none transition-all"
                  />
                  <button
                    onClick={handleWithdraw}
                    disabled={loading || !withdrawAmt}
                    className="w-full py-3 rounded-lg bg-[#ffb4ab]/20 border border-[#ffb4ab]/30 text-[#ffb4ab] font-black text-xs uppercase tracking-widest hover:bg-[#ffb4ab]/30 disabled:opacity-40 transition-all"
                  >
                    {loading ? 'Pending...' : 'Withdraw'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Supply modal */}
        {selectedPool && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-3xl border border-[#3b494c]/30 bg-[#131314] p-8 shadow-2xl">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs font-label uppercase tracking-[0.25em] text-[#bac9cc] mb-2">Invest in pool</p>
                  <h3 className="text-2xl font-headline font-bold text-[#e5e2e3]">{selectedPool.name} Supply</h3>
                </div>
                <button onClick={closeSupplyModal} className="text-neutral-400 hover:text-white text-2xl leading-none">×</button>
              </div>

              <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2">
                <div className="rounded-2xl bg-[#1c1b1c] p-4 border border-[#3b494c]/15">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#bac9cc] mb-2">Asset</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl ${selectedPool.iconBg} flex items-center justify-center border ${selectedPool.iconBorder}`}>
                      <span className={`material-symbols-outlined ${selectedPool.iconColor}`}>{selectedPool.icon}</span>
                    </div>
                    <div>
                      <p className="font-headline font-bold text-[#e5e2e3]">{selectedPool.name}</p>
                      <p className="text-xs font-label text-[#bac9cc]">{selectedPool.sub}</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl bg-[#1c1b1c] p-4 border border-[#3b494c]/15">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#bac9cc] mb-2">Supply APY</p>
                  <p className="text-2xl font-headline font-bold text-[#00e297]">{selectedPool.apy}</p>
                  <p className="text-xs text-[#bac9cc] mt-2">Total liquidity: {selectedPool.liquidity}</p>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-xs font-bold uppercase tracking-[0.24em] text-[#bac9cc]">Investment amount</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={supplyAmt}
                  onChange={(e) => setSupplyAmt(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-[#0e0e0f] border border-[#3b494c]/20 rounded-2xl px-4 py-4 text-sm font-mono outline-none focus:ring-1 focus:ring-[#00daf3]/40 transition-all"
                />

                {supplyMessage && (
                  <p className="text-sm text-[#c3f5ff]">{supplyMessage}</p>
                )}

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                  <button onClick={closeSupplyModal} className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-[#3b494c]/15 text-sm font-bold text-[#bac9cc] hover:border-[#c3f5ff]/40 hover:text-white transition-all">Cancel</button>
                  <button
                    onClick={handleSupply}
                    disabled={loading || !supplyAmt}
                    className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-br from-[#c3f5ff] to-[#00e5ff] text-[#00363d] text-sm font-black uppercase tracking-widest hover:opacity-90 disabled:opacity-40 transition-all"
                  >
                    {loading ? 'Pending...' : 'Invest'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Borrow modal */}
        {selectedBorrowAsset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-3xl border border-[#3b494c]/30 bg-[#131314] p-8 shadow-2xl">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs font-label uppercase tracking-[0.25em] text-[#bac9cc] mb-2">Borrow asset</p>
                  <h3 className="text-2xl font-headline font-bold text-[#e5e2e3]">{selectedBorrowAsset.name}</h3>
                </div>
                <button onClick={closeBorrowModal} className="text-neutral-400 hover:text-white text-2xl leading-none">×</button>
              </div>

              <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2">
                <div className="rounded-2xl bg-[#1c1b1c] p-4 border border-[#3b494c]/15">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#bac9cc] mb-2">Asset</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl bg-[#0e0e0f] flex items-center justify-center`}>
                      <span className="material-symbols-outlined text-[#c3f5ff]">{selectedBorrowAsset.icon || 'savings'}</span>
                    </div>
                    <div>
                      <p className="font-headline font-bold text-[#e5e2e3]">{selectedBorrowAsset.name}</p>
                      <p className="text-xs font-label text-[#00e297]">Borrow APR: {selectedBorrowAsset.rate}</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl bg-[#1c1b1c] p-4 border border-[#3b494c]/15">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#bac9cc] mb-2">Available</p>
                  <p className="text-2xl font-headline font-bold text-[#00e297]">{selectedBorrowAsset.available}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid gap-2">
                  <label className="text-xs font-bold uppercase tracking-[0.24em] text-[#bac9cc]">Collateral amount</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={collateralAmount}
                    onChange={(e) => setCollateralAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-[#0e0e0f] border border-[#3b494c]/20 rounded-2xl px-4 py-4 text-sm font-mono outline-none focus:ring-1 focus:ring-[#d1bcff]/40 transition-all"
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-xs font-bold uppercase tracking-[0.24em] text-[#bac9cc]">Borrow amount</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={borrowAmount}
                    onChange={(e) => setBorrowAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-[#0e0e0f] border border-[#3b494c]/20 rounded-2xl px-4 py-4 text-sm font-mono outline-none focus:ring-1 focus:ring-[#00daf3]/40 transition-all"
                  />
                </div>

                <p className="text-xs text-[#bac9cc]">
                  Max borrow allowed: {(Number(collateralAmount) * 0.6 || 0).toFixed(2)} {selectedBorrowAsset.name}
                </p>

                {borrowMessage && (
                  <p className="text-sm text-[#c3f5ff]">{borrowMessage}</p>
                )}

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                  <button onClick={closeBorrowModal} className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-[#3b494c]/15 text-sm font-bold text-[#bac9cc] hover:border-[#c3f5ff]/40 hover:text-white transition-all">Cancel</button>
                  <button
                    onClick={handleBorrow}
                    className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-br from-[#c3f5ff] to-[#00e5ff] text-[#00363d] text-sm font-black uppercase tracking-widest hover:opacity-90 transition-all"
                  >
                    Borrow
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Risk Warning */}
        <div className="bg-[#0e0e0f] border border-[#ffb4ab]/20 rounded-xl p-6 flex items-center gap-6 relative overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-1 bg-[#ffb4ab]" />
          <div className="w-12 h-12 rounded-full bg-[#ffb4ab]/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[#ffb4ab]">warning</span>
          </div>
          <div className="flex-1">
            <h4 className="font-headline font-bold text-[#e5e2e3]">Market Volatility Warning</h4>
            <p className="text-sm font-body text-[#bac9cc]">High ETH volatility detected. Ensure your health factor remains above 1.5 to avoid automated liquidation cycles.</p>
          </div>
          <button className="px-6 py-2 bg-[#353436] text-[#ffb4ab] text-xs font-label font-bold rounded-lg border border-[#ffb4ab]/20 whitespace-nowrap hover:bg-[#ffb4ab]/10 transition-all">Manage Collateral</button>
        </div>
      </main>
    </div>
  )
}
