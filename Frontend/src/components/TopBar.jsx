import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useWallet } from '../hooks/useWallet'
import { getPendingGroupInvites, confirmGroupInvite, declineGroupInvite } from '../services/api'

const truncate = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : ''

const mobileNav = [
  { path: '/dashboard', label: 'Dash', icon: 'dashboard' },
  { path: '/splitcoin', label: 'SplitCoin', icon: 'call_split' },
  { path: '/profile', label: 'Profile', icon: 'person' },
]

export default function TopBar({ title, subtitle, showSearch = false }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { walletAddress, isConnected, disconnectWallet } = useWallet()

  const [pendingInvites, setPendingInvites] = useState([])
  const [showInvites, setShowInvites] = useState(false)
  const [inviteLoading, setInviteLoading] = useState(false)

  const fetchInvites = async () => {
    if (!isConnected || !walletAddress) {
      setPendingInvites([])
      return
    }
    setInviteLoading(true)
    try {
      const invites = await getPendingGroupInvites(walletAddress)
      setPendingInvites(invites)
    } catch (err) {
      setPendingInvites([])
    } finally {
      setInviteLoading(false)
    }
  }

  useEffect(() => {
    fetchInvites()
  }, [isConnected, walletAddress])

  const handleWalletBtn = () => {
    if (isConnected) {
      disconnectWallet()
      navigate('/')
    } else {
      navigate('/')
    }
  }

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
          {isConnected ? (
            <button
              id="wallet-connected-btn"
              onClick={handleWalletBtn}
              title="Click to disconnect"
              className="px-5 py-2 bg-green-500 text-white rounded-full text-sm font-bold tracking-tight active:scale-90 transition-all duration-200 hover:opacity-90"
            >
              {truncate(walletAddress)}
            </button>
          ) : (
            <button
              id="connect-wallet-btn"
              onClick={handleWalletBtn}
              className="px-5 py-2 bg-gradient-to-br from-[#c3f5ff] to-[#00e5ff] text-[#00363d] rounded-full text-sm font-bold tracking-tight active:scale-90 transition-all duration-200 hover:opacity-90"
            >
              Connect Wallet
            </button>
          )}
          <div className="relative">
            <button
              onClick={() => setShowInvites(prev => !prev)}
              className="p-1 text-neutral-400 hover:text-cyan-400 transition-colors"
            >
              <span className="material-symbols-outlined">notifications</span>
              {pendingInvites.length > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#00e297] text-[10px] text-[#031b14] font-bold px-1">
                  {pendingInvites.length}
                </span>
              )}
            </button>
            {showInvites && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#0f1011] border border-[#3b494c]/30 shadow-[0_15px_40px_rgba(0,0,0,0.25)] text-sm z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-[#3b494c]/20 bg-[#141517] font-semibold text-neutral-200">Group Invites</div>
                <div className="max-h-72 overflow-y-auto">
                  {inviteLoading ? (
                    <div className="px-4 py-4 text-neutral-500">Loading invites...</div>
                  ) : pendingInvites.length === 0 ? (
                    <div className="px-4 py-4 text-neutral-500">No pending invites.</div>
                  ) : (
                    pendingInvites.map(invite => (
                      <div key={invite._id} className="px-4 py-3 border-b border-[#3b494c]/20 last:border-b-0">
                        <p className="text-sm font-semibold text-[#e5e2e3]">{invite.name}</p>
                        <p className="text-[11px] text-neutral-500 truncate">Invite to join {invite.name}</p>
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={async () => {
                              try {
                                await confirmGroupInvite(invite._id, walletAddress)
                                await fetchInvites()
                              } catch (err) {
                                console.error(err)
                              }
                            }}
                            className="flex-1 px-3 py-2 text-xs font-bold uppercase tracking-widest rounded-lg bg-[#00daf3]/10 text-[#00daf3] hover:bg-[#00daf3]/20 transition-colors"
                          >
                            Accept
                          </button>
                          <button
                            onClick={async () => {
                              try {
                                await declineGroupInvite(invite._id, walletAddress)
                                await fetchInvites()
                              } catch (err) {
                                console.error(err)
                              }
                            }}
                            className="flex-1 px-3 py-2 text-xs font-bold uppercase tracking-widest rounded-lg bg-[#ffb4ab]/10 text-[#ffb4ab] hover:bg-[#ffb4ab]/20 transition-colors"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
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
