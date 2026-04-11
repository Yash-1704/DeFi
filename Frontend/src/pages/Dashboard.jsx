import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import { useWallet } from '../hooks/useWallet'
import { useContract } from '../hooks/useContract'
import { getTransactions } from '../services/api'

const truncate = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '—'

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
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Hero Balance */}
          <section className="relative overflow-hidden bg-[#1c1b1c] rounded-xl p-8 border border-[#3b494c]/15 group">
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
            {/* Sparkline bars */}
            <div className="mt-12 h-32 w-full flex items-end gap-1 opacity-40">
              {[50,65,50,75,100,80,85,50,100,80,100].map((h, i) => (
                <div key={i} className="flex-1 bg-[#c3f5ff] rounded-t-sm transition-all"
                  style={{ height: `${h}%`, opacity: 0.2 + (i / 10) * 0.8, boxShadow: i === 10 ? '0 0 15px rgba(0,229,255,0.3)' : 'none' }} />
              ))}
            </div>
          </section>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Wallet ETH */}
            <div className="bg-[#201f20] rounded-xl p-6 border border-[#3b494c]/5 relative overflow-hidden group hover:bg-[#3a393a] transition-colors">
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
                  { name: 'Ethereum', ticker: 'ETH/USDC', change: '+8.2%', price: '$2,942.50', icon: 'diamond', color: 'text-indigo-400', graph: [20, 30, 40, 35, 55, 70, 90], isUp: true },
                  { name: 'Nexus Token', ticker: 'NEX/ETH', change: '+24.8%', price: '$1.24', icon: 'token', color: 'text-cyan-400', graph: [10, 15, 30, 45, 60, 80, 100], isUp: true },
                  { name: 'Wrapped BTC', ticker: 'WBTC/USD', change: '-2.4%', price: '$58,100.00', icon: 'currency_bitcoin', color: 'text-orange-400', graph: [80, 75, 85, 60, 50, 45, 40], isUp: false },
                ].map((asset, i) => (
                  <div key={i} className="bg-[#201f20] rounded-xl p-5 border border-[#3b494c]/10 hover:border-[#c3f5ff]/30 transition-all flex flex-col gap-4 group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center border border-neutral-700">
                        <span className={`material-symbols-outlined ${asset.color}`}>{asset.icon}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-[#e5e2e3]">{asset.name}</p>
                        <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">{asset.ticker}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${asset.isUp ? 'text-[#00e297]' : 'text-[#ffb4ab]'}`}>{asset.change}</p>
                        <p className="text-xl font-black text-[#e5e2e3] font-headline">{asset.price}</p>
                      </div>
                    </div>
                    <div className="h-10 w-full flex items-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      {asset.graph.map((val, j) => (
                        <div key={j} className="flex-1 rounded-sm transition-all" style={{
                           height: `${val}%`,
                           backgroundColor: asset.isUp ? '#00e297' : '#ffb4ab',
                           opacity: 0.3 + (j / asset.graph.length) * 0.7
                        }} />
                      ))}
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
