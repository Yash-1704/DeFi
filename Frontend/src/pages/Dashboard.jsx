import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate()

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
                <p className="text-neutral-500 text-sm font-semibold uppercase tracking-widest">Total Balance</p>
                <h2 className="text-5xl md:text-6xl font-extrabold tracking-tighter font-headline text-[#e5e2e3]">
                  $1,284,592<span className="text-[#00daf3]">.42</span>
                </h2>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-1 text-[#00e297] text-sm font-bold bg-[#00e297]/10 px-3 py-1 rounded-full">
                    <span className="material-symbols-outlined text-sm">trending_up</span>
                    +12.4%
                  </div>
                  <p className="text-neutral-400 text-xs">Past 30 days performance</p>
                </div>
              </div>
              <div className="flex gap-2 bg-[#0e0e0f] p-1 rounded-lg border border-[#3b494c]/10">
                <button className="px-4 py-1 text-xs font-bold text-[#00363d] bg-[#00e5ff] rounded-md">24h</button>
                <button className="px-4 py-1 text-xs font-bold text-neutral-500 hover:text-[#e5e2e3] transition-colors">1w</button>
                <button className="px-4 py-1 text-xs font-bold text-neutral-500 hover:text-[#e5e2e3] transition-colors">1m</button>
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

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Active Yield */}
            <div className="bg-[#201f20] rounded-xl p-6 relative overflow-hidden group hover:bg-[#3a393a] transition-colors">
              <div className="flex justify-between items-start mb-4">
                <span className="material-symbols-outlined text-[#00e297] bg-[#00e297]/10 p-2 rounded-lg">electric_bolt</span>
                <p className="text-xs font-bold text-[#00e297] uppercase">Live</p>
              </div>
              <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-1">Active Yield (APR)</p>
              <h3 className="text-4xl font-black font-headline text-[#e5e2e3] mb-4">18.42%</h3>
              <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#00e297] to-[#00e5ff] w-[75%]" />
              </div>
            </div>

            {/* Debt Ratio */}
            <div className="bg-[#201f20] rounded-xl p-6 relative overflow-hidden group hover:bg-[#3a393a] transition-colors">
              <div className="flex justify-between items-start mb-4">
                <span className="material-symbols-outlined text-[#ffb4ab] bg-[#ffb4ab]/10 p-2 rounded-lg">speed</span>
                <span className="material-symbols-outlined text-neutral-500 text-sm">info</span>
              </div>
              <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-1">Debt Ratio</p>
              <div className="flex items-center gap-4">
                <h3 className="text-4xl font-black font-headline text-[#e5e2e3]">32.1%</h3>
                <p className="text-xs text-neutral-400 font-semibold italic">Healthy</p>
              </div>
              <div className="mt-4 flex gap-1">
                <div className="h-1.5 w-1/4 bg-[#00e297] rounded-full" />
                <div className="h-1.5 w-1/4 bg-[#00e297] rounded-full" />
                <div className="h-1.5 w-1/4 bg-neutral-800 rounded-full" />
                <div className="h-1.5 w-1/4 bg-neutral-800 rounded-full" />
              </div>
            </div>

            {/* Next Reward */}
            <div className="bg-[#201f20] rounded-xl p-6 relative overflow-hidden group hover:bg-[#3a393a] transition-colors">
              <div className="flex justify-between items-start mb-4">
                <span className="material-symbols-outlined text-[#d1bcff] bg-[#d1bcff]/10 p-2 rounded-lg">update</span>
                <div className="animate-pulse flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#d1bcff]" />
                  <span className="text-[10px] text-[#d1bcff] font-bold">Syncing</span>
                </div>
              </div>
              <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-1">Next Reward Drop</p>
              <h3 className="text-4xl font-black font-headline text-[#e5e2e3]">14:22<span className="text-xl text-neutral-500">:08</span></h3>
              <p className="text-[10px] text-neutral-500 mt-4">ESTIMATED YIELD: <span className="text-[#e5e2e3] font-bold">124.50 NEX</span></p>
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
                {[
                  { icon: 'swap_horiz', color: '#00daf3', bg: '#00daf3', title: 'Swap ETH for NEX', time: 'Today, 2:45 PM', status: 'Completed', amount: '-1.42 ETH', usd: '≈ $4,203.12', amountColor: '#e5e2e3' },
                  { icon: 'download', color: '#00e297', bg: '#00e297', title: 'Staking Reward', time: 'Yesterday, 11:12 PM', status: 'Completed', amount: '+42.08 NEX', usd: '≈ $154.22', amountColor: '#00e297' },
                  { icon: 'upload', color: '#ffb4ab', bg: '#ffb4ab', title: 'Lending Withdrawal', time: 'Oct 24, 9:00 AM', status: 'Completed', amount: '-10,000 USDC', usd: '≈ $10,000.00', amountColor: '#e5e2e3' },
                ].map((tx, i) => (
                  <div key={i} className={`flex items-center justify-between p-5 hover:bg-[#201f20] transition-colors ${i > 0 ? 'border-t border-[#3b494c]/5' : ''}`}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#353436] flex items-center justify-center" style={{ color: tx.color }}>
                        <span className="material-symbols-outlined">{tx.icon}</span>
                      </div>
                      <div>
                        <p className="font-bold text-[#e5e2e3]">{tx.title}</p>
                        <p className="text-xs text-neutral-500">{tx.time} • <span className="text-[#00e297]">{tx.status}</span></p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-headline font-bold" style={{ color: tx.amountColor }}>{tx.amount}</p>
                      <p className="text-xs text-neutral-500">{tx.usd}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Assets */}
            <div className="space-y-6">
              <div className="flex justify-between items-center px-2">
                <h4 className="font-headline font-bold text-xl">Top Assets</h4>
                <span className="material-symbols-outlined text-neutral-500 cursor-pointer">more_vert</span>
              </div>
              <div className="space-y-4">
                {[
                  { name: 'Ethereum', ticker: 'ETH/USDC', change: '+8.2%', price: '$2,942.50', icon: 'diamond', color: 'text-indigo-400' },
                  { name: 'Nexus Token', ticker: 'NEX/ETH', change: '+24.8%', price: '$1.24', icon: 'token', color: 'text-cyan-400' },
                  { name: 'Tether', ticker: 'USDT/DAI', change: '0.0%', price: '$1.00', icon: 'savings', color: 'text-green-400' },
                ].map((asset, i) => (
                  <div key={i} className="bg-[#201f20] rounded-xl p-5 border border-[#3b494c]/10 hover:border-[#c3f5ff]/30 transition-all">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center border border-neutral-700">
                        <span className={`material-symbols-outlined ${asset.color}`}>{asset.icon}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-[#e5e2e3]">{asset.name}</p>
                        <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">{asset.ticker}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-[#00e297]">{asset.change}</p>
                        <p className="text-[10px] text-neutral-500 uppercase font-bold">24H</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-[#3b494c]/5">
                      <div className="flex -space-x-2">
                        {['A', 'C'].map(l => (
                          <div key={l} className="w-6 h-6 rounded-full bg-[#353436] border border-[#131314] flex items-center justify-center text-[8px] font-bold">{l}</div>
                        ))}
                      </div>
                      <p className="text-xs font-black text-[#e5e2e3]">{asset.price}</p>
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
