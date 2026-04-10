import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'

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
          <div className="flex items-center gap-4">
            <button className="bg-[#2a2a2b] px-4 py-2 rounded-full border border-[#3b494c]/15 flex items-center gap-2 hover:bg-[#3a393a] transition-all">
              <span className="material-symbols-outlined text-sm">public</span>
              <span className="text-sm font-label font-semibold">Ethereum</span>
            </button>
            <button
              id="lending-connect-wallet"
              className="bg-gradient-to-br from-[#c3f5ff] to-[#00e5ff] text-[#00363d] font-label font-bold px-6 py-2.5 rounded-xl hover:scale-[1.02] active:scale-95 transition-all"
              style={{ boxShadow: '0 0 20px 0 rgba(0,229,255,0.2)' }}
            >
              Connect Wallet
            </button>
            <button className="w-10 h-10 rounded-full bg-[#2a2a2b] flex items-center justify-center text-[#bac9cc] hover:text-[#c3f5ff] transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
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
              <div>
                <p className="text-xs font-label uppercase tracking-widest text-[#bac9cc] mb-2">Total Collateral</p>
                <p className="text-3xl font-headline font-extrabold tracking-tight">$142,500.00</p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00e297]" style={{ boxShadow: '0 0 10px #00e297' }} />
                  <span className="text-xs font-label text-[#00e297]">+2.4% Net APY</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-label uppercase tracking-widest text-[#bac9cc] mb-2">Borrowed Amount</p>
                <p className="text-3xl font-headline font-extrabold tracking-tight text-neutral-400">$45,210.00</p>
                <p className="mt-4 text-xs font-label text-[#bac9cc]">31.7% LTV Ratio</p>
              </div>
              <div className="bg-[#0e0e0f]/50 rounded-lg p-6 flex flex-col justify-center border border-[#3b494c]/10">
                <p className="text-xs font-label uppercase tracking-widest text-[#bac9cc] mb-4">Health Factor</p>
                <div className="flex items-end justify-between mb-2">
                  <span className="text-2xl font-headline font-bold text-[#00e297]">2.84</span>
                  <span className="text-xs font-label text-[#00e297] font-bold uppercase">Safe</span>
                </div>
                <div className="w-full h-1 bg-[#353436] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#ffb4ab] via-yellow-400 to-[#00e297]" style={{ width: '85%' }} />
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
                    <button className="px-4 py-2 bg-[#353436] text-xs font-label font-bold rounded-lg hover:bg-[#c3f5ff]/10 hover:text-[#c3f5ff] transition-all">Supply</button>
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
                  <button className="bg-gradient-to-br from-[#c3f5ff] to-[#00e5ff] text-[#00363d] text-xs font-label font-black px-6 py-2 rounded-lg hover:opacity-90 transition-all">Borrow</button>
                </div>
              </div>
            ))}
          </div>
        </section>

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
