import { useState, useEffect, useMemo } from 'react'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import { useWallet } from '../hooks/useWallet'
import { getTransactions } from '../services/api'

const METHOD_MAP = {
  send:    { icon: 'send',       color: 'text-red-400',     bg: 'bg-red-400/10',     label: 'Sent' },
  receive: { icon: 'download',   color: 'text-blue-400',    bg: 'bg-blue-400/10',    label: 'Received' },
  stake:   { icon: 'lock',       color: 'text-emerald-400', bg: 'bg-emerald-400/10', label: 'Staked' },
  unstake: { icon: 'lock_open',  color: 'text-cyan-400',    bg: 'bg-cyan-400/10',    label: 'Unstaked' },
  deposit: { icon: 'savings',    color: 'text-indigo-400',  bg: 'bg-indigo-400/10',  label: 'Deposited' },
  withdraw:{ icon: 'upload',     color: 'text-orange-400',  bg: 'bg-orange-400/10',  label: 'Withdrawn' },
  swap:    { icon: 'swap_horiz', color: 'text-cyan-400',    bg: 'bg-cyan-400/10',    label: 'Swap' },
}
const defaultMethod = { icon: 'receipt_long', color: 'text-neutral-400', bg: 'bg-neutral-800', label: 'TX' }

export default function Transactions() {
  const { walletAddress, isConnected } = useWallet()
  const [allTxs,   setAllTxs]   = useState([])
  const [loading,  setLoading]  = useState(false)
  const [filter,   setFilter]   = useState('All')
  const filters = ['All', 'Outgoing', 'Incoming']

  useEffect(() => {
    if (!walletAddress) return
    setLoading(true)
    getTransactions(walletAddress)
      .then(data => setAllTxs(Array.isArray(data) ? data : []))
      .catch(() => setAllTxs([]))
      .finally(() => setLoading(false))
  }, [walletAddress])

  const filtered = useMemo(() => {
    if (filter === 'Outgoing') return allTxs.filter(t => t.type === 'send' || t.type === 'deposit' || t.type === 'stake')
    if (filter === 'Incoming') return allTxs.filter(t => t.type === 'receive' || t.type === 'withdraw' || t.type === 'unstake')
    return allTxs
  }, [allTxs, filter])

  const totalVolume = useMemo(() =>
    allTxs.reduce((acc, t) => acc + (parseFloat(t.amount) || 0), 0).toFixed(4),
  [allTxs])

  const successCount = allTxs.length

  return (
    <div className="bg-[#131314] text-[#e5e2e3] min-h-screen">
      <TopBar showSearch />
      <Sidebar />

      <main className="md:ml-64 pt-24 px-6 pb-16">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#e5e2e3] mb-2">Transactions</h1>
              <p className="text-[#bac9cc] font-body">Real-time chronicle of your on-chain interactions.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 bg-[#1c1b1c] p-1 rounded-full">
              {filters.map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${filter === f ? 'bg-[#c3f5ff] text-[#00363d]' : 'text-neutral-500 hover:text-[#e5e2e3]'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { label: 'Total Volume', value: `${totalVolume} ETH`, sub: `${allTxs.length} transactions`, subColor: 'text-neutral-500', subIcon: null },
              { label: 'Successful TXs', value: successCount.toString(), sub: successCount > 0 ? '100% Success Rate' : 'No transactions yet', subColor: 'text-neutral-500' },
              { label: 'Wallet', value: isConnected ? `${walletAddress.slice(0,6)}...${walletAddress.slice(-4)}` : '—', sub: isConnected ? 'Connected' : 'Not connected', subColor: isConnected ? 'text-[#00e297]' : 'text-neutral-500' },
            ].map((s, i) => (
              <div key={i} className="bg-[#201f20] rounded-xl p-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-[10px] font-bold uppercase tracking-widest mb-4 text-neutral-500">{s.label}</div>
                <div className="text-3xl font-bold tracking-tighter text-[#e5e2e3]">{s.value}</div>
                <div className={`flex items-center gap-1 text-xs mt-2 font-bold ${s.subColor}`}>
                  {s.subIcon && <span className="material-symbols-outlined text-sm">{s.subIcon}</span>}
                  {s.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="bg-[#0e0e0f] rounded-xl overflow-hidden shadow-2xl border border-[#3b494c]/10">
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-12 text-center text-neutral-500">Loading transactions...</div>
              ) : !isConnected ? (
                <div className="p-12 text-center text-neutral-500">Connect your wallet to view transactions.</div>
              ) : filtered.length === 0 ? (
                <div className="p-12 text-center text-neutral-500">No transactions found.</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#2a2a2b]/50">
                    <tr>
                      {['Status', 'Method', 'Amount', 'To / From', 'Date & Time', 'Hash'].map((h, i) => (
                        <th key={i} className={`px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-neutral-500 ${i === 5 ? 'text-right' : ''}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/30">
                    {filtered.map((tx, i) => {
                      const m = METHOD_MAP[tx.type] || defaultMethod
                      return (
                        <tr key={tx._id || i} className="hover:bg-[#3a393a]/20 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-[#00e297]">
                              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                              <span className="text-xs font-bold uppercase tracking-wider">Success</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-lg ${m.bg} flex items-center justify-center`}>
                                <span className={`material-symbols-outlined ${m.color} text-sm`}>{m.icon}</span>
                              </div>
                              <span className="text-sm font-semibold text-[#e5e2e3]">{m.label}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-bold text-[#e5e2e3]">{tx.amount} ETH</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 font-mono text-xs text-[#bac9cc]">
                              {tx.to ? `${tx.to.slice(0, 6)}...${tx.to.slice(-4)}` : '—'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-xs text-[#e5e2e3] font-medium">
                              {tx.timestamp ? new Date(tx.timestamp).toLocaleDateString() : '—'}
                            </div>
                            <div className="text-[10px] text-neutral-500">
                              {tx.timestamp ? new Date(tx.timestamp).toLocaleTimeString() : ''}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-cyan-400 text-xs font-bold font-mono">
                              {tx.txHash ? `${tx.txHash.slice(0, 10)}...` : tx._id ? `${tx._id.slice(-8)}` : '—'}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
            {/* Pagination info */}
            <div className="bg-[#2a2a2b]/30 px-6 py-4 flex items-center justify-between">
              <div className="text-xs text-neutral-500 font-medium">
                Showing {filtered.length} of {allTxs.length} transactions
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Asset Velocity Chart */}
            <div className="bg-[#201f20] rounded-xl p-8 border border-[#3b494c]/10">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-cyan-400">insights</span>
                Asset Velocity
              </h3>
              <div className="h-48 flex items-end justify-between gap-2">
                {[40, 65, 30, 85, 50, 75, 100].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-lg" style={{
                    height: `${h}%`,
                    background: `rgba(0,229,255,${0.1 + (i / 6) * 0.9})`,
                    boxShadow: i === 6 ? '0 0 20px rgba(0,229,255,0.3)' : 'none',
                  }} />
                ))}
              </div>
              <div className="flex justify-between mt-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <span key={d}>{d}</span>)}
              </div>
            </div>

            {/* Export */}
            <div className="bg-[#201f20] rounded-xl p-8 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-transparent" />
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">Export History</h3>
                <p className="text-[#bac9cc] text-sm mb-6">Download your complete transaction records for tax compliance or portfolio analysis.</p>
                <div className="grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center gap-2 py-3 bg-[#2a2a2b] rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#3a393a] transition-all">
                    <span className="material-symbols-outlined text-sm">table_view</span> CSV Export
                  </button>
                  <button className="flex items-center justify-center gap-2 py-3 bg-[#2a2a2b] rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#3a393a] transition-all">
                    <span className="material-symbols-outlined text-sm">picture_as_pdf</span> PDF Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
