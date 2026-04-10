import { useNavigate, useLocation } from 'react-router-dom'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { path: '/payments', label: 'Payments', icon: 'payments' },
  { path: '/lending', label: 'Lending', icon: 'account_balance' },
  { path: '/staking', label: 'Staking', icon: 'currency_exchange' },
  { path: '/transactions', label: 'Transactions', icon: 'receipt_long' },
  { path: '/profile', label: 'Profile', icon: 'person' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 z-40 bg-neutral-900/60 backdrop-blur-2xl shadow-2xl flex flex-col pt-16 pb-8 gap-4 hidden md:flex">
      <div className="px-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c3f5ff] to-[#00e5ff] flex items-center justify-center">
            <span className="material-symbols-outlined text-[#00363d] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>architecture</span>
          </div>
          <div>
            <p className="text-xl font-black text-cyan-400 font-headline tracking-tighter">ZenETH</p>
            <p className="text-[10px] text-neutral-500 font-semibold uppercase tracking-widest">The Neon Architect</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map(({ path, label, icon }) => {
          const active = location.pathname === path
          return (
            <button
              key={path}
              id={`nav-${label.toLowerCase()}`}
              onClick={() => navigate(path)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-none font-headline text-sm font-semibold uppercase tracking-widest transition-colors duration-300 cursor-pointer text-left
                ${active
                  ? 'text-cyan-400 border-r-2 border-cyan-400 bg-cyan-400/5'
                  : 'text-neutral-500 hover:bg-neutral-800/50 hover:text-neutral-200'
                }`}
            >
              <span className="material-symbols-outlined">{icon}</span>
              {label}
            </button>
          )
        })}
      </nav>

      <div className="px-4 py-4 mx-4 bg-cyan-400/10 rounded-xl border border-cyan-400/20 mb-2">
        <p className="text-[10px] font-bold text-cyan-400 mb-1 font-headline uppercase tracking-widest">Pro Access</p>
        <p className="text-[10px] text-neutral-400 mb-3 leading-relaxed">Unlock advanced yield strategies and liquidation alerts.</p>
        <button className="w-full py-2 bg-cyan-400 text-[#00363d] text-[10px] font-black uppercase tracking-widest rounded-lg transition-transform active:scale-95 hover:bg-cyan-300">
          Yield Optimizer
        </button>
      </div>

      <div className="px-6 pt-2 border-t border-neutral-800/50">
        <button className="flex items-center gap-4 py-2 text-neutral-500 hover:text-neutral-200 transition-colors font-headline text-sm font-semibold uppercase tracking-widest w-full">
          <span className="material-symbols-outlined">settings</span>Settings
        </button>
        <button className="flex items-center gap-4 py-2 text-neutral-500 hover:text-neutral-200 transition-colors font-headline text-sm font-semibold uppercase tracking-widest w-full">
          <span className="material-symbols-outlined">help</span>Support
        </button>
      </div>
    </aside>
  )
}
