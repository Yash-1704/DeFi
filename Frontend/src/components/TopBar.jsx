import { useNavigate, useLocation } from 'react-router-dom'

const mobileNav = [
  { path: '/dashboard', label: 'Dash', icon: 'dashboard' },
  { path: '/staking', label: 'Stake', icon: 'currency_exchange' },
  { path: '/profile', label: 'Profile', icon: 'person' },
]

export default function TopBar({ title, subtitle, showSearch = false }) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <>
      {/* Top Nav */}
      <header className="fixed top-0 w-full z-50 bg-neutral-900/40 backdrop-blur-xl shadow-[0_0_50px_0_rgba(0,229,255,0.04)] flex justify-between items-center px-6 py-3">
        <div className="flex items-center gap-4 md:ml-64">
          {showSearch && (
            <div className="hidden md:flex items-center bg-neutral-800/50 rounded-full px-4 py-1.5 gap-2 focus-within:ring-1 ring-cyan-400/50 transition-all">
              <span className="material-symbols-outlined text-neutral-400 text-sm">search</span>
              <input
                className="bg-transparent border-none focus:outline-none text-sm text-[#e5e2e3] w-64 placeholder:text-neutral-500"
                placeholder="Search transactions..."
                type="text"
                id="search-input"
              />
            </div>
          )}
          {!showSearch && (
            <button
              className="md:hidden text-xl font-black text-cyan-400 font-headline tracking-tighter"
              onClick={() => navigate('/')}
            >
              ZenETH
            </button>
          )}
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-neutral-800/50 border border-[#3b494c]/15 text-neutral-400 rounded-full text-sm font-semibold hover:bg-cyan-400/10 hover:text-cyan-300 transition-all active:scale-95">
            <span className="material-symbols-outlined text-sm">account_balance_wallet</span>
            Ethereum
          </button>
          <button
            id="connect-wallet-btn"
            className="px-5 py-2 bg-gradient-to-br from-[#c3f5ff] to-[#00e5ff] text-[#00363d] rounded-full text-sm font-bold tracking-tight active:scale-90 transition-all duration-200 hover:opacity-90"
          >
            Connect Wallet
          </button>
          <button className="p-1 text-neutral-400 hover:text-cyan-400 transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-[#2a2a2b] border border-[#3b494c]/20 flex items-center justify-center text-cyan-400 font-bold text-xs font-headline">
            NX
          </div>
        </div>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-neutral-900/80 backdrop-blur-xl border-t border-neutral-800/50 flex justify-around py-3 px-2 z-50">
        {mobileNav.map(({ path, label, icon }) => {
          const active = location.pathname === path
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center gap-1 cursor-pointer ${active ? 'text-cyan-400' : 'text-neutral-500'}`}
            >
              <span className="material-symbols-outlined" style={active ? { fontVariationSettings: "'FILL' 1" } : {}}>{icon}</span>
              <span className="text-[10px] font-bold font-headline uppercase tracking-tighter">{label}</span>
            </button>
          )
        })}
      </nav>
    </>
  )
}
