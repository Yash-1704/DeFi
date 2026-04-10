import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'

const pools = [
  {
    name: 'nETH Liquid Staking',
    apy: '4.2%',
    bonus: '+1.5% Bonus',
    tvl: '$1.2B',
    badge: 'Hot',
    badgeClass: 'bg-[#c3f5ff]/10 text-[#00daf3]',
    icons: ['E', 'n'],
    iconColors: ['bg-neutral-800', 'bg-cyan-900 text-cyan-400'],
  },
  {
    name: 'Nexus Stable Index',
    apy: '12.8%',
    bonus: 'Fixed',
    tvl: '$482M',
    badge: 'Stable',
    badgeClass: 'bg-neutral-800 text-neutral-400',
    icons: ['S', 'U'],
    iconColors: ['bg-blue-600 text-white', 'bg-green-600 text-white'],
  },
]

export default function Staking() {
  return (
    <div className="bg-[#131314] text-[#e5e2e3] min-h-screen">
      <TopBar />
      <Sidebar />

      <main className="md:ml-64 pt-24 px-6 pb-16">
        <div className="max-w-7xl mx-auto">

          {/* Hero Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* TVL */}
            <div className="p-8 bg-[#201f20] rounded-xl flex flex-col gap-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="material-symbols-outlined text-6xl">show_chart</span>
              </div>
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest font-label">Total Value Locked</span>
              <h3 className="text-3xl md:text-4xl font-headline font-extrabold text-[#00daf3] tracking-tight">$2,482,192,401</h3>
              <div className="flex items-center gap-2 mt-4">
                <span className="w-2 h-2 rounded-full bg-[#00e297]" style={{ boxShadow: '0 0 8px rgba(0,226,151,0.5)' }} />
                <span className="text-xs font-semibold text-[#00e297]">+12.4% vs last month</span>
              </div>
            </div>

            {/* APY */}
            <div className="p-8 bg-[#201f20] rounded-xl flex flex-col gap-2 border-l-4 border-[#00e5ff]">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest font-label">Net Projected APY</span>
              <h3 className="text-3xl md:text-4xl font-headline font-extrabold text-[#e5e2e3] tracking-tight">18.42%</h3>
              <div className="flex items-center gap-1 mt-4">
                <div className="h-1 flex-1 bg-[#353436] rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-[#c3f5ff] to-[#00e5ff]" />
                </div>
                <span className="text-[10px] font-bold text-[#c3f5ff] ml-2 uppercase">Optimal Range</span>
              </div>
            </div>

            {/* Claimable Rewards */}
            <div className="p-8 glass-panel rounded-xl border border-[#3b494c]/10 neon-glow-primary flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest font-label">Claimable Rewards</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <h3 className="text-3xl md:text-4xl font-headline font-extrabold text-[#e5e2e3] tracking-tight">2,482.12</h3>
                  <span className="text-sm font-bold text-neutral-500">NEXUS</span>
                </div>
                <p className="text-xs text-neutral-400 mt-1">≈ $12,492.00 USD</p>
              </div>
              <button
                id="harvest-rewards-btn"
                className="w-full mt-6 py-4 bg-[#c3f5ff] text-[#00363d] font-black rounded-full uppercase tracking-widest text-sm hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">energy_savings_leaf</span>
                Harvest Rewards
              </button>
            </div>
          </div>

          {/* Staking Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Panel */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="p-8 bg-[#2a2a2b] rounded-xl">
                <div className="flex gap-1 bg-[#0e0e0f] p-1 rounded-full mb-8">
                  <button className="flex-1 py-3 text-sm font-bold uppercase tracking-widest bg-[#2a2a2b] text-[#00daf3] rounded-full shadow-lg">Stake</button>
                  <button className="flex-1 py-3 text-sm font-bold uppercase tracking-widest text-neutral-500 hover:text-neutral-200 transition-colors">Unstake</button>
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Amount to Stake</label>
                      <span className="text-xs font-semibold text-neutral-400">Balance: 12.45 ETH</span>
                    </div>
                    <div className="relative">
                      <input
                        id="stake-amount-input"
                        className="w-full bg-[#0e0e0f] border-none rounded-2xl py-6 px-6 text-2xl font-headline font-bold text-[#e5e2e3] placeholder:text-neutral-700 focus:ring-2 focus:ring-[#00e5ff]/20 transition-all outline-none"
                        placeholder="0.00"
                        type="number"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                        <button className="px-3 py-1 bg-[#353436] text-[10px] font-bold text-[#00daf3] rounded-md hover:bg-neutral-800 transition-colors uppercase">Max</button>
                        <div className="flex items-center gap-2 px-3 py-1 bg-[#353436] rounded-md">
                          <span className="text-xs font-bold">ETH</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4 p-6 bg-[#0e0e0f]/50 rounded-2xl border border-[#3b494c]/10">
                    {[
                      ['You will receive', '12.41 nETH'],
                      ['Exchange Rate', '1 ETH = 0.996 nETH'],
                      ['Projected Monthly Yield', '+0.145 ETH'],
                    ].map(([k, v], i) => (
                      <div key={i} className="flex justify-between items-center">
                        <span className="text-sm text-neutral-400">{k}</span>
                        <span className={`text-sm font-bold ${i === 2 ? 'text-[#00e297]' : 'text-[#e5e2e3]'}`}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    id="confirm-staking-btn"
                    className="w-full py-5 bg-gradient-to-br from-[#00e5ff] to-[#c3f5ff] text-[#00363d] font-black rounded-xl uppercase tracking-[0.2em] hover:brightness-110 active:scale-[0.99] transition-all"
                    style={{ boxShadow: '0 20px 40px rgba(0,229,255,0.1)' }}
                  >
                    Confirm Staking
                  </button>
                </div>
              </div>

              {/* Audit Badge */}
              <div className="p-6 bg-[#1c1b1c] rounded-xl border-l-2 border-[#00e297]">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#00e297]/10 rounded-lg text-[#00e297]">
                    <span className="material-symbols-outlined">verified</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#e5e2e3] mb-1 font-headline">Audit Complete</h4>
                    <p className="text-xs text-neutral-400 leading-relaxed">Smart contracts have been audited by QuantStamp and PeckShield. Current health score: 98/100.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pools Grid */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <h2 className="text-2xl font-headline font-extrabold tracking-tight">Active Vaults</h2>
                  <p className="text-sm text-neutral-500">Explore optimized yield strategies</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 bg-[#201f20] rounded-lg text-neutral-400 hover:text-[#e5e2e3]">
                    <span className="material-symbols-outlined">filter_list</span>
                  </button>
                  <button className="p-2 bg-[#201f20] rounded-lg text-neutral-400 hover:text-[#e5e2e3]">
                    <span className="material-symbols-outlined">search</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pools.map((p, i) => (
                  <div key={i} className="p-6 bg-[#201f20] rounded-xl hover:bg-[#3a393a] transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex -space-x-2">
                        {p.icons.map((ic, j) => (
                          <div key={j} className={`w-10 h-10 rounded-full border-2 border-[#201f20] ${p.iconColors[j]} flex items-center justify-center text-xs font-bold`}>
                            {ic}
                          </div>
                        ))}
                      </div>
                      <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded ${p.badgeClass}`}>{p.badge}</span>
                    </div>
                    <h3 className="text-lg font-headline font-bold mb-1">{p.name}</h3>
                    <p className="text-xs text-neutral-500 mb-6 font-label uppercase tracking-wider">Projected Annual Yield</p>
                    <div className="flex items-baseline gap-2 mb-6">
                      <span className="text-3xl font-headline font-extrabold text-[#00daf3]">{p.apy}</span>
                      <span className="text-xs font-bold text-[#00e297]">{p.bonus}</span>
                    </div>
                    <div className="pt-6 border-t border-[#3b494c]/10 flex justify-between items-center">
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase font-bold">Total Staked</span>
                        <span className="block text-sm font-bold">{p.tvl}</span>
                      </div>
                      <span className="material-symbols-outlined text-neutral-600 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </div>
                  </div>
                ))}

                {/* Featured Pool */}
                <div className="md:col-span-2 p-8 bg-[#2a2a2b] rounded-xl relative overflow-hidden group hover:brightness-110 transition-all cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#00e5ff]/5 to-transparent opacity-50" />
                  <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                      <span className="px-2 py-1 bg-[#d1bcff]/20 text-[#d1bcff] text-[10px] font-black uppercase tracking-[0.2em] rounded-md mb-4 inline-block">Diversified</span>
                      <h3 className="text-2xl font-headline font-black mb-2">OmniYield Index</h3>
                      <p className="text-xs text-neutral-400 leading-relaxed">Auto-balancing basket of blue-chip DeFi protocols including Aave, Curve, and Convex.</p>
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest mb-1">Target Yield</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-headline font-extrabold text-[#00e5ff]">24.5%</span>
                        <span className="text-xs font-bold text-[#00e297]">Up 4%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-end">
                      <div className="text-right mr-6 hidden md:block">
                        <p className="text-[10px] text-neutral-500 uppercase font-bold mb-1">Current TVL</p>
                        <p className="text-xl font-bold font-headline">$84.2M</p>
                      </div>
                      <div className="p-4 bg-[#00e5ff] text-[#00363d] rounded-full shadow-lg group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined">add</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress pools */}
                {[
                  { icon: 'rocket_launch', color: 'text-[#00e297]', label: 'Growth Accelerator', pct: '67%', barColor: 'bg-[#00e297]', stat: 'Progress to Cap' },
                  { icon: 'shield', color: 'text-[#00daf3]', label: 'Delta Neutral', pct: '33%', barColor: 'bg-[#00daf3]', stat: 'Strategy Health', badge: 'Excellent' },
                ].map((pp, i) => (
                  <div key={i} className="p-6 bg-[#201f20] rounded-xl border border-[#3b494c]/5">
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`material-symbols-outlined ${pp.color}`}>{pp.icon}</span>
                      <h3 className="text-sm font-bold font-headline uppercase tracking-widest">{pp.label}</h3>
                    </div>
                    <div className="h-1 w-full bg-[#0e0e0f] rounded-full overflow-hidden mb-4">
                      <div className={`h-full ${pp.barColor}`} style={{ width: pp.pct }} />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-neutral-500 font-bold">{pp.stat}</span>
                      <span className={`text-xs font-bold ${pp.badge ? 'text-[#00e297]' : 'text-[#e5e2e3]'}`}>{pp.badge || `${pp.pct} full`}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
