import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'

export default function Payments() {
  return (
    <div className="bg-[#131314] text-[#e5e2e3] min-h-screen">
      <TopBar showSearch />
      <Sidebar />

      <main className="md:ml-64 pt-24 px-6 pb-16">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* Header */}
          <section className="flex flex-col md:flex-row justify-between items-end gap-4">
            <div>
              <h2 className="text-4xl font-extrabold font-headline tracking-tighter text-[#e5e2e3]">Payments</h2>
              <p className="text-[#bac9cc] mt-1">Move capital with architectural precision.</p>
            </div>
            {/* Gas Tracker */}
            <div className="bg-[#1c1b1c] px-5 py-3 rounded-xl border border-[#3b494c]/10 flex items-center gap-6">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#00e297]">local_gas_station</span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#bac9cc]">Standard</p>
                  <p className="text-sm font-bold font-headline">18 Gwei</p>
                </div>
              </div>
              <div className="w-[1px] h-8 bg-[#3b494c]/20" />
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#00daf3]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#bac9cc]">Instant</p>
                  <p className="text-sm font-bold font-headline text-[#00daf3]">24 Gwei</p>
                </div>
              </div>
            </div>
          </section>

          {/* Grid */}
          <div className="grid grid-cols-12 gap-6 items-start">
            {/* Transfer Form */}
            <div className="col-span-12 lg:col-span-8 bg-[#1c1b1c] rounded-xl p-8 neon-glow border border-[#3b494c]/5">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold font-headline flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-[#00e5ff] rounded-full" />
                  Send Assets
                </h3>
                <button className="p-2 rounded-full hover:bg-[#c3f5ff]/10 transition-all text-[#00daf3]">
                  <span className="material-symbols-outlined">qr_code_scanner</span>
                </button>
              </div>

              <div className="space-y-6">
                {/* Asset Selector */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#bac9cc] mb-2 ml-1">Asset</label>
                  <div className="flex items-center justify-between p-4 bg-[#0e0e0f] rounded-lg border border-transparent hover:border-[#c3f5ff]/20 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center">
                        <span className="material-symbols-outlined text-blue-400">monetization_on</span>
                      </div>
                      <div>
                        <p className="font-bold text-[#e5e2e3]">USD Coin</p>
                        <p className="text-xs text-[#bac9cc]">Balance: 12,450.00 USDC</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#bac9cc]">expand_more</span>
                  </div>
                </div>

                {/* Recipient */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#bac9cc] mb-2 ml-1">Recipient Address or ENS</label>
                  <div className="relative">
                    <input
                      id="recipient-input"
                      className="w-full bg-[#0e0e0f] border-none rounded-lg p-4 font-mono text-sm focus:ring-1 focus:ring-[#c3f5ff]/40 placeholder:text-neutral-600 transition-all text-[#e5e2e3] outline-none"
                      placeholder="0x... or nexus.eth"
                      type="text"
                    />
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-neutral-600">contact_page</span>
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#bac9cc] mb-2 ml-1">Amount</label>
                  <div className="bg-[#0e0e0f] rounded-lg border border-transparent focus-within:border-[#c3f5ff]/20 transition-all p-4">
                    <div className="flex items-center justify-between gap-4">
                      <input
                        id="amount-input"
                        className="bg-transparent border-none p-0 text-3xl font-headline font-bold text-[#e5e2e3] focus:ring-0 placeholder:text-neutral-800 w-full outline-none"
                        placeholder="0.00"
                        type="number"
                      />
                      <button className="bg-[#c3f5ff]/10 text-[#00daf3] px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter hover:bg-[#c3f5ff]/20 transition-all">
                        MAX
                      </button>
                    </div>
                    <p className="text-xs text-[#bac9cc] mt-2">≈ $0.00 USD</p>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-[#201f20] p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#bac9cc]">Estimated Network Fee</span>
                    <span className="text-[#e5e2e3]">$2.45 (18 Gwei)</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#bac9cc]">Estimated Time</span>
                    <span className="text-[#00e297]">~30 seconds</span>
                  </div>
                </div>

                {/* Submit */}
                <button
                  id="authorize-transfer-btn"
                  className="w-full py-5 rounded-xl bg-gradient-to-r from-[#c3f5ff] to-[#00e5ff] text-[#00363d] font-black text-lg tracking-tight hover:scale-[1.01] active:scale-[0.98] transition-all uppercase"
                  style={{ boxShadow: '0 20px 40px rgba(0,229,255,0.1)' }}
                >
                  Authorize Transfer
                </button>
              </div>
            </div>

            {/* Right Column */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              {/* Recent Recipients */}
              <div className="bg-[#201f20] rounded-xl p-6 border border-[#3b494c]/5">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-[#bac9cc]">Recent Recipients</h4>
                  <button className="text-xs text-[#00daf3] font-bold hover:underline">View All</button>
                </div>
                <div className="space-y-1">
                  {[
                    { name: 'alex.nexus.eth', addr: '0x7a...4d32' },
                    { name: 'jordandao.eth', addr: '0x12...99ee' },
                    { name: 'sarah_vaults', addr: '0xee...a231' },
                  ].map((c, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#3a393a]/30 transition-all group cursor-pointer">
                      <div className="w-10 h-10 rounded-full bg-[#353436] border border-[#3b494c]/20 flex items-center justify-center font-bold text-cyan-400 text-sm">
                        {c.name[0].toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold">{c.name}</p>
                        <p className="text-[10px] text-[#bac9cc] font-mono">{c.addr}</p>
                      </div>
                      <span className="material-symbols-outlined text-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed border-[#3b494c]/30 text-[#bac9cc] hover:border-[#c3f5ff]/50 hover:text-[#c3f5ff] transition-all text-xs font-semibold">
                  <span className="material-symbols-outlined text-sm">add</span>Add New Recipient
                </button>
              </div>



              {/* USDC Liquidity Sparkline */}
              <div className="bg-[#201f20] rounded-xl p-6 border border-[#3b494c]/5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#bac9cc]">USDC Liquidity</p>
                    <p className="text-lg font-bold font-headline">$4.2B</p>
                  </div>
                  <span className="text-[#00e297] text-xs font-bold font-mono">+0.12%</span>
                </div>
                <div className="h-12 w-full flex items-end gap-1">
                  {[60,80,55,90,75,95,85,100].map((h, i) => (
                    <div key={i} className="flex-1 rounded-sm" style={{
                      height: `${h}%`,
                      background: `rgba(0,229,255,${0.2 + (i / 7) * 0.8})`,
                      boxShadow: i === 7 ? '0 0 10px rgba(0,229,255,0.4)' : 'none'
                    }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold font-headline">Recent Activity</h3>
              <button className="text-sm text-[#bac9cc] hover:text-cyan-400 transition-colors">See all transactions</button>
            </div>
            <div className="glass-panel rounded-xl overflow-hidden border border-[#3b494c]/15">
              {[
                { dir: 'north_east', color: 'text-[#ffb4ab]', bg: 'bg-[#93000a]/30', label: 'Sent to alex.nexus.eth', time: '2 hours ago • Ethereum', amount: '- 1,200.00 USDC', amountColor: 'text-[#e5e2e3]' },
                { dir: 'south_west', color: 'text-[#00e297]', bg: 'bg-[#00e297]/20', label: 'Received from Coinbase', time: '5 hours ago • Ethereum', amount: '+ 5,000.00 USDC', amountColor: 'text-[#00e297]' },
                { dir: 'swap_horiz', color: 'text-neutral-400', bg: 'bg-neutral-800', label: 'Swapped ETH for USDC', time: 'Yesterday • Nexus Swap', amount: '2.45 ETH → 5,420.00 USDC', amountColor: 'text-[#e5e2e3]' },
              ].map((tx, i) => (
                <div key={i} className={`flex items-center justify-between p-4 px-6 hover:bg-[#3a393a]/10 transition-colors ${i > 0 ? 'border-t border-[#3b494c]/10' : ''}`}>
                  <div className="flex items-center gap-6">
                    <div className={`w-10 h-10 rounded-full ${tx.bg} flex items-center justify-center ${tx.color}`}>
                      <span className="material-symbols-outlined">{tx.dir}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold">{tx.label}</p>
                      <p className="text-xs text-[#bac9cc]">{tx.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${tx.amountColor}`}>{tx.amount}</p>
                    <p className="text-xs text-[#bac9cc]">Completed</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
