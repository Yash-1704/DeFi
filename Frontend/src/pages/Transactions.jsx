import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'

const txData = [
  { status: 'Success', statusColor: 'text-[#00e297]', method: 'Swap', methodIcon: 'swap_horiz', methodColor: 'text-cyan-400', methodBg: 'bg-cyan-400/10', asset: 'ETH → USDC', amount: '1.45 ETH', usd: '$3,420.12', to: '0x71C...3E4d', date: 'Oct 24, 2023', time: '14:22:10 PM', hash: '0x4a2...8f1' },
  { status: 'Failed', statusColor: 'text-[#ffb4ab]', method: 'Sent', methodIcon: 'send', methodColor: 'text-red-400', methodBg: 'bg-red-400/10', asset: 'WBTC', amount: '0.05 WBTC', usd: '$1,750.00', to: '0x12A...9B2c', date: 'Oct 23, 2023', time: '09:15:44 AM', hash: '0x8d3...1e2' },
  { status: 'Success', statusColor: 'text-[#00e297]', method: 'Staked', methodIcon: 'lock', methodColor: 'text-emerald-400', methodBg: 'bg-emerald-400/10', asset: 'DOT', amount: '500.00 DOT', usd: '$2,100.50', to: 'Nexus Pool v3', date: 'Oct 21, 2023', time: '22:01:05 PM', hash: '0xf41...a2d' },
  { status: 'Success', statusColor: 'text-[#00e297]', method: 'Received', methodIcon: 'download', methodColor: 'text-blue-400', methodBg: 'bg-blue-400/10', asset: 'USDC', amount: '+ 10,000 USDC', usd: '$10,000.00', to: '0x49B...1F2a', date: 'Oct 20, 2023', time: '11:45:12 AM', hash: '0x2b5...3c8' },
]

export default function Transactions() {
  const [filter, setFilter] = useState('All')
  const filters = ['All', 'Outgoing', 'Incoming']

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
              <p className="text-[#bac9cc] font-body">Real-time chronicle of your on-chain interactions across the Nexus ecosystem.</p>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Total Volume', value: '$1,284,592.00', sub: '+12.4%', subColor: 'text-[#00e297]', subIcon: 'trending_up' },
              { label: 'Successful TXs', value: '482', sub: '99.8% Success Rate', subColor: 'text-neutral-500' },
              { label: 'Gas Expended', value: '0.42 ETH', sub: 'Avg. 12 Gwei', subColor: 'text-neutral-500' },
              { label: 'Nexus Reputation', value: '924', sub: null, subColor: null, isReputation: true },
            ].map((s, i) => (
              <div key={i} className={`bg-[#201f20] rounded-xl p-6 relative overflow-hidden group ${s.isReputation ? 'border border-cyan-400/10' : ''}`}>
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className={`text-[10px] font-bold uppercase tracking-widest mb-4 ${s.isReputation ? 'text-cyan-400' : 'text-neutral-500'}`}>{s.label}</div>
                <div className={`text-3xl font-bold tracking-tighter ${s.isReputation ? 'text-cyan-400' : 'text-[#e5e2e3]'}`}>{s.value}</div>
                {s.sub && !s.isReputation && (
                  <div className={`flex items-center gap-1 text-xs mt-2 font-bold ${s.subColor}`}>
                    {s.subIcon && <span className="material-symbols-outlined text-sm">{s.subIcon}</span>}
                    {s.sub}
                  </div>
                )}
                {s.isReputation && (
                  <div className="mt-3 w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-cyan-400 to-[#00e297] h-full w-[92%]" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="bg-[#0e0e0f] rounded-xl overflow-hidden shadow-2xl border border-[#3b494c]/10">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#2a2a2b]/50">
                  <tr>
                    {['Status', 'Method', 'Asset', 'Amount', 'To / From', 'Date & Time', 'Hash'].map((h, i) => (
                      <th key={i} className={`px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-neutral-500 ${i === 6 ? 'text-right' : ''}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/30">
                  {txData.map((tx, i) => (
                    <tr key={i} className="hover:bg-[#3a393a]/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className={`flex items-center gap-2 ${tx.statusColor}`}>
                          <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                            {tx.status === 'Success' ? 'check_circle' : 'cancel'}
                          </span>
                          <span className="text-xs font-bold uppercase tracking-wider">{tx.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg ${tx.methodBg} flex items-center justify-center`}>
                            <span className={`material-symbols-outlined ${tx.methodColor} text-sm`}>{tx.methodIcon}</span>
                          </div>
                          <span className="text-sm font-semibold text-[#e5e2e3]">{tx.method}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-neutral-800 overflow-hidden flex items-center justify-center">
                            <span className="material-symbols-outlined text-[#00daf3] text-xs">token</span>
                          </div>
                          <span className="text-sm font-medium">{tx.asset}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-[#e5e2e3]">{tx.amount}</div>
                        <div className="text-[10px] text-neutral-500">{tx.usd}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 font-mono text-xs text-[#bac9cc]">
                          {tx.to}
                          <span className="material-symbols-outlined text-[10px] cursor-pointer hover:text-cyan-400">content_copy</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-[#e5e2e3] font-medium">{tx.date}</div>
                        <div className="text-[10px] text-neutral-500">{tx.time}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <a className="text-cyan-400 hover:text-cyan-200 transition-colors inline-flex items-center gap-1 text-xs font-bold cursor-pointer">
                          {tx.hash} <span className="material-symbols-outlined text-xs">open_in_new</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="bg-[#2a2a2b]/30 px-6 py-4 flex items-center justify-between">
              <div className="text-xs text-neutral-500 font-medium">Showing 1-10 of 482 transactions</div>
              <div className="flex items-center gap-2">
                <button className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-500 hover:bg-neutral-800 hover:text-[#e5e2e3] transition-all">
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                {[1, 2, 3].map(n => (
                  <button key={n} className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${n === 1 ? 'bg-cyan-400 text-[#00363d]' : 'text-neutral-400 hover:bg-neutral-800'}`}>{n}</button>
                ))}
                <button className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-500 hover:bg-neutral-800 hover:text-[#e5e2e3] transition-all">
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
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
              <div className="relative z-10 mt-6 pt-6 border-t border-neutral-800/50">
                <div className="flex items-center justify-between text-xs font-bold text-neutral-500">
                  <span>LAST EXPORT</span>
                  <span className="text-cyan-400">2 DAYS AGO</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
