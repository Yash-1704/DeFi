import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import { useWallet } from '../hooks/useWallet'
import { useContract } from '../hooks/useContract'
import { getTransactions } from '../services/api'

const truncate = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '—'

const marketBubbles = [
  { name: 'Ethereum', ticker: 'ETH', change: '+8.2%', isUp: true, left: '8%', top: '16%', size: '96px', icon: 'diamond', color: '#7c3aed' },
  { name: 'Bitcoin', ticker: 'BTC', change: '-1.6%', isUp: false, left: '62%', top: '10%', size: '88px', icon: 'currency_bitcoin', color: '#f59e0b' },
  { name: 'USD Coin', ticker: 'USDC', change: '+0.9%', isUp: true, left: '30%', top: '60%', size: '78px', icon: 'paid', color: '#22c55e' },
  { name: 'Dai', ticker: 'DAI', change: '-0.3%', isUp: false, left: '74%', top: '48%', size: '64px', icon: 'shield', color: '#38bdf8' },
  { name: 'Solana', ticker: 'SOL', change: '+4.5%', isUp: true, left: '52%', top: '40%', size: '72px', icon: 'bolt', color: '#14b8a6' },
  { name: 'Chainlink', ticker: 'LINK', change: '+2.1%', isUp: true, left: '20%', top: '30%', size: '70px', icon: 'link', color: '#0ea5e9' },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const { walletAddress, signer, isConnected, balance } = useWallet()
  const { contractData, fetchContractData } = useContract(signer)

  const [recentTxs, setRecentTxs]     = useState([])
  const [txLoading, setTxLoading]     = useState(false)

  // Fetch contract data + transactions whenever wallet connects
  useEffect(() => {
    if (!isConnected || !walletAddress) return
    fetchContractData(walletAddress)

    setTxLoading(true)
    getTransactions(walletAddress)
      .then(data => setRecentTxs(Array.isArray(data) ? data.slice(0, 5) : []))
      .catch(() => setRecentTxs([]))
      .finally(() => setTxLoading(false))
  }, [isConnected, walletAddress]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="bg-[#131314] text-[#e5e2e3] min-h-screen">
      <TopBar />
      <Sidebar />

      <main className="md:ml-64 pt-24 px-6 pb-16">
        <div className="max-w-[90rem] mx-auto space-y-8 px-4 sm:px-6 lg:px-8">

          {/* Hero Balance */}
          <section className="relative overflow-hidden bg-[#1c1b1c] rounded-xl p-8 border border-[#3b494c]/15 group min-h-[330px]">
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 80 Q 25 50 50 70 T 100 20" fill="none" stroke="url(#grad)" strokeWidth="2" />
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#c3f5ff" />
                    <stop offset="100%" stopColor="#00e5ff" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-8">
              <div className="space-y-2">
                <p className="text-neutral-500 text-sm font-semibold uppercase tracking-widest">Wallet Balance</p>
                <h2 className="text-5xl md:text-6xl font-extrabold tracking-tighter font-headline text-[#e5e2e3]">
                  {isConnected ? (
                    <>{balance}<span className="text-[#00daf3]"> ETH</span></>
                  ) : (
                    <span className="text-neutral-500 text-3xl">Not connected</span>
                  )}
                </h2>
                {isConnected && walletAddress && (
                  <p className="text-neutral-400 text-xs font-mono mt-2">{truncate(walletAddress)}</p>
                )}
              </div>
              <div className="flex gap-2 bg-[#0e0e0f] p-1 rounded-lg border border-[#3b494c]/10">
                <button className="px-4 py-1 text-xs font-bold text-[#00363d] bg-[#00e5ff] rounded-md">Live</button>
              </div>
            </div>
            {/* Floating market bubbles */}
            <div className="absolute inset-0 pointer-events-none">
              {marketBubbles.map((bubble, i) => (
                <div
                  key={i}
                  className="group pointer-events-auto absolute flex items-center justify-center rounded-full transition-all duration-300 ease-out opacity-20 blur-[2px] hover:opacity-100 hover:blur-0 hover:-translate-y-2 hover:scale-[1.15] animate-[float_6s_ease-in-out_infinite]"
                  style={{
                    width: bubble.size,
                    height: bubble.size,
                    left: bubble.left,
                    top: bubble.top,
                  }}
                >
                  {/* Outer glow */}
                  <div className="absolute inset-0 rounded-full border border-white/10 bg-white/5 shadow-[0_0_30px_rgba(255,255,255,0.08)] backdrop-blur-sm transition-all duration-300 group-hover:bg-white/15" />

                  {/* Inner ring */}
                  <div className="absolute inset-3 rounded-full border border-white/20 bg-black/10 transition-all duration-300 group-hover:border-white/30 group-hover:bg-black/20" />

                  {/* Icon */}
                  <div
                    className="relative z-10 flex h-full w-full items-center justify-center rounded-full text-white/80 transition-all duration-300 group-hover:shadow-[0_0_40px_rgba(0,229,255,0.35)]"
                    style={{
                      boxShadow: `0 0 30px ${bubble.color}20`,
                    }}
                  >
                    <div className="flex flex-col items-center justify-center gap-1">
                      <span
                        className="material-symbols-outlined text-2xl transition-colors duration-300"
                        style={{ color: bubble.color }}
                      >
                        {bubble.icon}
                      </span>
                      <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/60 transition-colors duration-300 group-hover:text-white">
                        {bubble.ticker}
                      </span>
                    </div>
                  </div>

                  {/* Tooltip */}
                  <div
                    className="absolute left-1/2 -bottom-14 -translate-x-1/2 rounded-full bg-[#0e0e0f]/95 px-3 py-1 text-xs text-[#d1d5db] opacity-0 translate-y-2 scale-95 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:-translate-y-1 group-hover:scale-100 whitespace-nowrap border border-white/10 shadow-lg"
                  >
                    <span
                      className={`material-symbols-outlined text-[14px] mr-1 ${bubble.isUp ? 'text-[#00e297]' : 'text-[#ff6b6b]'}`}
                    >
                      {bubble.isUp ? 'north' : 'south'}
                    </span>
                    <span className={bubble.isUp ? 'text-[#00e297]' : 'text-[#ff6b6b]'}>
                      {bubble.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Wallet ETH */}
            <div className="bg-[#201f20] rounded-xl p-6 border border-[#3b494c]/5 relative overflow-hidden group hover:bg-[#3a393a] transition-colors">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute left-6 top-8 w-16 h-16 rounded-full bg-[#f59e0b]/20 blur-sm opacity-20 transition-all duration-300" />
                <div className="absolute right-10 top-6 w-14 h-14 rounded-full bg-[#7c3aed]/20 blur-sm opacity-20 transition-all duration-300" />
                <div className="absolute left-1/2 top-16 w-12 h-12 -translate-x-1/2 rounded-full bg-[#14b8a6]/20 blur-sm opacity-20 transition-all duration-300" />
                <div className="absolute right-16 bottom-16 w-14 h-14 rounded-full bg-[#22c55e]/20 blur-sm opacity-18 transition-all duration-300" />
              </div>

              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute left-6 top-8 group pointer-events-auto flex items-center justify-center rounded-full transition-all duration-300 opacity-20 blur-sm hover:opacity-95 hover:blur-none hover:scale-110 hover:shadow-[0_0_18px_rgba(0,229,255,0.26)]"
                  style={{ width: '64px', height: '64px' }}>
                  <span className="material-symbols-outlined text-3xl text-[#f59e0b]">currency_bitcoin</span>
                  <div className="absolute left-1/2 -bottom-12 -translate-x-1/2 rounded-full bg-[#0e0e0f]/95 px-2 py-1 text-[10px] text-white opacity-0 transition-all duration-300 group-hover:opacity-100 whitespace-nowrap border border-white/10">
                    BTC +1.6%
                  </div>
                </div>
                <div className="absolute right-10 top-6 group pointer-events-auto flex items-center justify-center rounded-full transition-all duration-300 opacity-20 blur-sm hover:opacity-95 hover:blur-none hover:scale-110 hover:shadow-[0_0_18px_rgba(0,229,255,0.26)]"
                  style={{ width: '56px', height: '56px' }}>
                  <span className="material-symbols-outlined text-3xl text-[#7c3aed]">diamond</span>
                  <div className="absolute left-1/2 -bottom-12 -translate-x-1/2 rounded-full bg-[#0e0e0f]/95 px-2 py-1 text-[10px] text-white opacity-0 transition-all duration-300 group-hover:opacity-100 whitespace-nowrap border border-white/10">
                    ETH +8.2%
                  </div>
                </div>
                <div className="absolute left-1/2 top-16 -translate-x-1/2 group pointer-events-auto flex items-center justify-center rounded-full transition-all duration-300 opacity-20 blur-sm hover:opacity-95 hover:blur-none hover:scale-110 hover:shadow-[0_0_18px_rgba(0,229,255,0.26)]"
                  style={{ width: '52px', height: '52px' }}>
                  <span className="material-symbols-outlined text-3xl text-[#14b8a6]">bolt</span>
                  <div className="absolute left-1/2 -bottom-12 -translate-x-1/2 rounded-full bg-[#0e0e0f]/95 px-2 py-1 text-[10px] text-white opacity-0 transition-all duration-300 group-hover:opacity-100 whitespace-nowrap border border-white/10">
                    SOL +4.5%
                  </div>
                </div>
                <div className="absolute right-16 bottom-16 group pointer-events-auto flex items-center justify-center rounded-full transition-all duration-300 opacity-20 blur-sm hover:opacity-95 hover:blur-none hover:scale-110 hover:shadow-[0_0_18px_rgba(0,229,255,0.26)]"
                  style={{ width: '56px', height: '56px' }}>
                  <span className="material-symbols-outlined text-3xl text-[#22c55e]">paid</span>
                  <div className="absolute left-1/2 -bottom-12 -translate-x-1/2 rounded-full bg-[#0e0e0f]/95 px-2 py-1 text-[10px] text-white opacity-0 transition-all duration-300 group-hover:opacity-100 whitespace-nowrap border border-white/10">
                    USDC +0.9%
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-start mb-4">
                <span className="material-symbols-outlined text-[#00daf3] bg-[#00daf3]/10 p-2 rounded-lg">account_balance_wallet</span>
              </div>
              <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-1">Wallet Balance</p>
              <h3 className="text-3xl font-black font-headline text-[#e5e2e3]">
                {isConnected ? `${balance} ETH` : '—'}
              </h3>
            </div>

            {/* Deposited */}
            <div className="bg-[#201f20] rounded-xl p-6 border border-[#3b494c]/5 relative overflow-hidden group hover:bg-[#3a393a] transition-colors">
              <div className="flex justify-between items-start mb-4">
                <span className="material-symbols-outlined text-[#00e297] bg-[#00e297]/10 p-2 rounded-lg">upload</span>
              </div>
              <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-1">Deposited</p>
              <h3 className="text-3xl font-black font-headline text-[#e5e2e3]">
                {isConnected ? `${contractData.depositedBalance} ETH` : '—'}
              </h3>
            </div>

            {/* Rewards */}
            <div className="bg-[#201f20] rounded-xl p-6 border border-[#3b494c]/5 relative overflow-hidden group hover:bg-[#3a393a] transition-colors">
              <div className="flex justify-between items-start mb-4">
                <span className="material-symbols-outlined text-[#ffb4ab] bg-[#ffb4ab]/10 p-2 rounded-lg">stars</span>
              </div>
              <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-1">Accrued Reward</p>
              <h3 className="text-3xl font-black font-headline text-[#e5e2e3]">
                {isConnected ? `${contractData.reward} ETH` : '—'}
              </h3>
            </div>

            {/* Staked */}
            <div className="bg-[#201f20] rounded-xl p-6 border border-[#3b494c]/5 relative overflow-hidden group hover:bg-[#3a393a] transition-colors">
              <div className="flex justify-between items-start mb-4">
                <span className="material-symbols-outlined text-[#d1bcff] bg-[#d1bcff]/10 p-2 rounded-lg">lock</span>
              </div>
              <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-1">Staked</p>
              <h3 className="text-3xl font-black font-headline text-[#00daf3]">
                {isConnected ? `${contractData.stakeAmount} ETH` : '—'}
              </h3>
              {isConnected && contractData.stakeStartTime && (
                <p className="text-[10px] text-neutral-500 mt-1">Since {contractData.stakeStartTime}</p>
              )}
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Transactions */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center px-2">
                <h4 className="font-headline font-bold text-xl">Recent Transactions</h4>
                <button onClick={() => navigate('/transactions')} className="text-xs text-[#00daf3] font-bold hover:underline">View All</button>
              </div>
              <div className="bg-[#1c1b1c] rounded-xl overflow-hidden border border-[#3b494c]/10">
                {txLoading ? (
                  <div className="p-8 text-center text-neutral-500 text-sm">Loading transactions...</div>
                ) : recentTxs.length === 0 ? (
                  <div className="p-8 text-center text-neutral-500 text-sm">
                    {isConnected ? 'No transactions found.' : 'Connect wallet to see transactions.'}
                  </div>
                ) : recentTxs.map((tx, i) => (
                  <div key={tx._id || i} className={`flex items-center justify-between p-5 hover:bg-[#201f20] transition-colors ${i > 0 ? 'border-t border-[#3b494c]/5' : ''}`}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#353436] flex items-center justify-center text-[#00daf3]">
                        <span className="material-symbols-outlined">
                          {tx.type === 'send' ? 'north_east' : tx.type === 'receive' ? 'south_west' : 'swap_horiz'}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-[#e5e2e3] capitalize">{tx.type || 'Transaction'}</p>
                        <p className="text-xs text-neutral-500">
                          {tx.timestamp ? new Date(tx.timestamp).toLocaleString() : '—'} •{' '}
                          <span className="text-[#00e297]">Recorded</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-headline font-bold text-[#e5e2e3]">{tx.amount} ETH</p>
                      <p className="text-xs text-neutral-500 font-mono">{truncate(tx.to || tx.recipient)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Trends */}
            <div className="space-y-6">
              <div className="flex justify-between items-center px-2">
                <h4 className="font-headline font-bold text-xl">Market Trends</h4>
                <span className="material-symbols-outlined text-neutral-500 cursor-pointer">more_vert</span>
              </div>
              <div className="space-y-4">
                {[
                  { name: 'Ethereum', ticker: 'ETH', change: '+8.2%', price: '$2,942.50', icon: 'diamond', color: 'text-indigo-400', isUp: true },
                  { name: 'Bitcoin', ticker: 'BTC', change: '-1.6%', price: '$58,100', icon: 'currency_bitcoin', color: 'text-orange-400', isUp: false },
                  { name: 'USD Coin', ticker: 'USDC', change: '+0.9%', price: '$1.00', icon: 'account_balance_wallet', color: 'text-cyan-400', isUp: true },
                ].map((asset, i) => (
                  <div key={i} className="bg-[#201f20] rounded-xl p-5 border border-[#3b494c]/10 hover:border-[#c3f5ff]/30 transition-all flex items-center justify-between gap-4 group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#111314] flex items-center justify-center border border-neutral-700 text-white/90">
                        <span className={`material-symbols-outlined ${asset.color}`}>{asset.icon}</span>
                      </div>
                      <div>
                        <p className="font-bold text-[#e5e2e3]">{asset.name}</p>
                        <p className="text-xs text-neutral-500 uppercase tracking-widest font-semibold">{asset.ticker}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-[#e5e2e3] font-headline">{asset.price}</p>
                      <div className={`inline-flex items-center gap-1 mt-1 text-sm font-semibold ${asset.isUp ? 'text-[#00e297]' : 'text-[#ff6b6b]'}`}>
                        <span className="material-symbols-outlined text-[18px]">{asset.isUp ? 'north' : 'south'}</span>
                        <span>{asset.change}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FAB */}
      <button
        id="fab-new-tx"
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-[#c3f5ff] to-[#00e5ff] text-[#00363d] rounded-full flex items-center justify-center transition-transform active:scale-90 z-50 group"
        style={{ boxShadow: '0 10px 30px rgba(0,229,255,0.3)' }}
        onClick={() => navigate('/payments')}
      >
        <span className="material-symbols-outlined transition-transform group-hover:rotate-90">add</span>
        <span className="absolute right-full mr-4 bg-[#353436] text-[#e5e2e3] px-4 py-2 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-[#3b494c]/20">
          New Transaction
        </span>
      </button>
    </div>
  )
}
