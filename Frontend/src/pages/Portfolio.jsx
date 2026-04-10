import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import { useNavigate } from 'react-router-dom'

const holdings = [
  { name: 'Bitcoin', ticker: 'BTC', balance: '1.42 BTC', price: '$64,281.20', value: '$91,279.30', change: '+2.4%', positive: true, icon: 'currency_bitcoin', color: 'text-orange-400' },
  { name: 'Ethereum', ticker: 'ETH', balance: '42.8 ETH', price: '$3,420.15', value: '$146,382.42', change: '-0.8%', positive: false, icon: 'diamond', color: 'text-indigo-400' },
  { name: 'Solana', ticker: 'SOL', balance: '1,240 SOL', price: '$142.10', value: '$176,204.00', change: '+5.2%', positive: true, icon: 'toll', color: 'text-purple-400' },
]

export default function Portfolio() {
  const navigate = useNavigate()

  return (
    <div className="bg-[#131314] text-[#e5e2e3] min-h-screen">
      <TopBar />
      <Sidebar />

      <main className="md:ml-64 pt-24 px-6 pb-16">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold font-headline tracking-tighter text-[#e5e2e3] mb-2">Portfolio Overview</h1>
          <div className="flex items-baseline gap-4">
            <span className="text-5xl md:text-6xl font-bold font-headline text-[#00daf3] tracking-tighter">$428,942.50</span>
            <span className="text-[#00e297] flex items-center font-bold">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              +12.4%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chain Allocation Donut */}
          <div className="lg:col-span-5 bg-[#1c1b1c] rounded-xl p-8 relative overflow-hidden flex flex-col justify-center border border-[#3b494c]/10">
            <h3 className="text-xl font-bold font-headline mb-8 text-[#e5e2e3]">Asset Allocation by Chain</h3>
            <div className="flex items-center gap-8">
              <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
                <div className="absolute inset-0 rounded-full border-[12px] border-[#353436]" />
                <div className="absolute inset-0 rounded-full border-[12px] border-cyan-400 border-t-transparent border-l-transparent rotate-45" />
                <div className="absolute inset-0 rounded-full border-[12px] border-[#00e297] border-b-transparent border-r-transparent -rotate-12" />
                <div className="text-center">
                  <span className="block text-2xl font-bold font-headline">8</span>
                  <span className="text-[10px] uppercase tracking-widest text-[#bac9cc] font-label">Active Chains</span>
                </div>
              </div>
              <div className="space-y-3 flex-1">
                {[
                  { label: 'Ethereum', pct: '64%', color: 'bg-cyan-400' },
                  { label: 'Polygon', pct: '18%', color: 'bg-[#00e297]' },
                  { label: 'Solana', pct: '12%', color: 'bg-purple-500' },
                  { label: 'Others', pct: '6%', color: 'bg-[#353436]' },
                ].map(c => (
                  <div key={c.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${c.color}`} />
                      <span className="text-sm font-medium">{c.label}</span>
                    </div>
                    <span className="text-sm font-bold">{c.pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Staked / Liquid Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#201f20] rounded-xl p-6 flex flex-col justify-between border border-[#3b494c]/10 group hover:bg-[#3a393a] transition-colors duration-300">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="material-symbols-outlined text-[#d1bcff] p-2 bg-[#d1bcff]/10 rounded-lg">lock</span>
                  <span className="text-xs font-bold text-[#d1bcff] font-headline">STAKED ASSETS</span>
                </div>
                <h4 className="text-3xl font-bold font-headline mb-1">$284,102.00</h4>
                <p className="text-sm text-[#bac9cc]">Active in 4 protocols</p>
              </div>
              <div className="mt-6">
                <div className="h-1.5 w-full bg-[#353436] rounded-full overflow-hidden">
                  <div className="h-full bg-[#d1bcff] w-[66%]" />
                </div>
                <div className="flex justify-between mt-2 text-[10px] font-bold text-[#bac9cc] font-label">
                  <span>TOTAL CAP</span><span>66% OF PORTFOLIO</span>
                </div>
              </div>
            </div>

            <div className="bg-[#201f20] rounded-xl p-6 flex flex-col justify-between border border-[#3b494c]/10 group hover:bg-[#3a393a] transition-colors duration-300">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="material-symbols-outlined text-[#00daf3] p-2 bg-[#00daf3]/10 rounded-lg">water_drop</span>
                  <span className="text-xs font-bold text-[#00daf3] font-headline">LIQUID ASSETS</span>
                </div>
                <h4 className="text-3xl font-bold font-headline mb-1">$144,840.50</h4>
                <p className="text-sm text-[#bac9cc]">Immediately withdrawable</p>
              </div>
              <div className="mt-6">
                <div className="h-1.5 w-full bg-[#353436] rounded-full overflow-hidden">
                  <div className="h-full bg-[#00daf3] w-[34%]" />
                </div>
                <div className="flex justify-between mt-2 text-[10px] font-bold text-[#bac9cc] font-label">
                  <span>AVAILABLE</span><span>34% OF PORTFOLIO</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 bg-gradient-to-br from-[#00e5ff]/20 to-[#00ffab]/10 border border-[#00e5ff]/20 rounded-xl p-8 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold font-headline text-[#9cf0ff] tracking-tight">Expand your holdings</h3>
                <p className="text-[#bac9cc] max-w-md mt-2">Connect to Nexus Optimizer to find the best yields across decentralized liquidity pools.</p>
              </div>
              <button
                onClick={() => navigate('/staking')}
                className="px-8 py-3 bg-[#00e5ff] text-[#00363d] font-bold rounded-xl hover:scale-95 transition-transform whitespace-nowrap"
              >
                Launch Optimizer
              </button>
            </div>
          </div>

          {/* Holdings Table */}
          <div className="lg:col-span-12 bg-[#1c1b1c] rounded-xl overflow-hidden border border-[#3b494c]/10 mt-2">
            <div className="p-6 border-b border-[#3b494c]/10 flex justify-between items-center">
              <h3 className="text-xl font-bold font-headline text-[#e5e2e3]">Your Holdings</h3>
              <div className="flex gap-2">
                <button className="p-2 bg-[#353436] rounded-lg text-[#bac9cc] hover:text-[#e5e2e3] transition-colors">
                  <span className="material-symbols-outlined text-sm">search</span>
                </button>
                <button className="p-2 bg-[#353436] rounded-lg text-[#bac9cc] hover:text-[#e5e2e3] transition-colors">
                  <span className="material-symbols-outlined text-sm">filter_list</span>
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-bold font-label text-[#bac9cc] uppercase tracking-widest">
                    <th className="px-8 py-4">Asset</th>
                    <th className="px-6 py-4">Balance</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Value</th>
                    <th className="px-6 py-4">24h Change</th>
                    <th className="px-8 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3b494c]/5">
                  {holdings.map((h, i) => (
                    <tr key={i} className="hover:bg-[#201f20] transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center border border-[#3b494c]/20">
                            <span className={`material-symbols-outlined ${h.color}`}>{h.icon}</span>
                          </div>
                          <div>
                            <span className="block font-bold text-[#e5e2e3]">{h.name}</span>
                            <span className="text-xs text-[#bac9cc]">{h.ticker}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5"><span className="block font-semibold">{h.balance}</span></td>
                      <td className="px-6 py-5 font-medium text-[#bac9cc]">{h.price}</td>
                      <td className="px-6 py-5 font-bold text-[#e5e2e3]">{h.value}</td>
                      <td className="px-6 py-5">
                        <span className={`flex items-center font-bold ${h.positive ? 'text-[#00e297]' : 'text-[#ffb4ab]'}`}>
                          <span className="material-symbols-outlined text-sm">{h.positive ? 'arrow_drop_up' : 'arrow_drop_down'}</span>
                          {h.change}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="px-4 py-1.5 rounded-lg bg-[#353436] text-[#e5e2e3] text-xs font-bold hover:bg-[#00e5ff] hover:text-[#00363d] transition-all">Receive</button>
                          <button className="px-4 py-1.5 rounded-lg bg-[#353436] text-[#e5e2e3] text-xs font-bold hover:bg-[#00e5ff] hover:text-[#00363d] transition-all">Buy</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
