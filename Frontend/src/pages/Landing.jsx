import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAddress, useConnect, metamaskWallet } from '@thirdweb-dev/react'
import logoUrl from '../assets/Logo.jpeg'

const metamaskConfig = metamaskWallet()

export default function Landing() {
  const navigate = useNavigate()
  const address = useAddress()
  const connect = useConnect()

  const [showLogin, setShowLogin] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (address) {
      setShowLogin(false)
      navigate('/dashboard')
    }
  }, [address, navigate])

  const handleWalletConnect = async () => {
    try {
      setError('');
      setLoading(true);
      await connect(metamaskConfig);
    } catch (err) {
      setError("Failed to connect wallet");
    } finally {
      setLoading(false);
    }
  }

  const handleConnectClick = (e) => {
    if (e) e.stopPropagation();
    if (address) {
      navigate('/dashboard')
    } else {
      setShowLogin(true)
    }
  }

  return (
    <div className="bg-[#131314] text-[#e5e2e3] min-h-screen font-body selection:bg-[#00e5ff]/30 selection:text-[#e5e2e3]">
      {showLogin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1c1b1c] p-8 rounded-xl border border-[#3b494c]/30 shadow-2xl w-full max-w-md mx-4">
            <h3 className="text-2xl font-headline font-bold mb-6 text-[#e5e2e3]">Connect Wallet</h3>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div className="text-[#bac9cc] text-sm mb-4">
                Securely connect to your Web3 wallet to access the dashboard.
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setShowLogin(false); }}
                  className="px-4 py-2 text-[#bac9cc] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleWalletConnect}
                  disabled={loading}
                  className="px-6 py-2 bg-gradient-to-br from-[#c3f5ff] to-[#00e5ff] text-[#00363d] rounded-lg font-bold font-headline hover:opacity-90 transition-opacity"
                >
                  {loading ? "Connecting..." : "Connect"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Top Nav */}
      <nav className="fixed top-0 w-full z-50 bg-[#131314]/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,229,255,0.04)]">
        <div className="flex justify-between items-center px-10 py-6 max-w-[1440px] mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center border border-[#00e5ff]/20">
              <img src={logoUrl} alt="ZenETH" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-bold tracking-tighter text-[#c3f5ff] font-headline uppercase">ZenETH</span>
          </div>
          <div className="hidden md:flex items-center space-x-10 font-headline tracking-tight font-semibold">
            <a className="text-[#bac9cc] hover:text-[#00E5FF] transition-colors duration-300 cursor-pointer">Lend</a>
            <a className="text-[#bac9cc] hover:text-[#00E5FF] transition-colors duration-300 cursor-pointer">Borrow</a>
            <a className="text-[#bac9cc] hover:text-[#00E5FF] transition-colors duration-300 cursor-pointer">Explore</a>
            <a className="text-[#bac9cc] hover:text-[#00E5FF] transition-colors duration-300 cursor-pointer">Docs</a>
          </div>
          {address ? (
            <button
              id="landing-wallet-connected-btn"
              onClick={() => navigate('/dashboard')}
              className="px-8 py-3 bg-green-500 text-white rounded-xl font-headline font-bold text-sm tracking-tight active:scale-95 duration-200 cursor-pointer shadow-lg hover:opacity-90"
            >
              Wallet connected
            </button>
          ) : (
            <button
              id="landing-connect-btn"
              onClick={handleConnectClick}
              className="bg-gradient-to-br from-[#c3f5ff] to-[#00e5ff] text-[#00363d] px-8 py-3 rounded-xl font-headline font-bold text-sm tracking-tight active:scale-95 duration-200 cursor-pointer shadow-lg shadow-[#c3f5ff]/10 hover:opacity-90"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative min-h-screen flex flex-col items-center justify-center pt-24 px-6 overflow-hidden"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(108,0,247,0.08) 0%, rgba(19,19,20,1) 70%), radial-gradient(circle at 80% 20%, rgba(0,229,255,0.05) 0%, transparent 50%)`
        }}>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#d1bcff]/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#00daf3]/5 blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-5xl w-full text-center z-10 space-y-10">
          <div className="space-y-6">
            <h1 className="text-6xl md:text-8xl font-extrabold font-headline tracking-tighter text-[#e5e2e3] leading-[1.05] animate-fade-in">
              The Future of Finance, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c3f5ff] via-[#00e5ff] to-[#d1bcff]">Architected.</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#bac9cc] font-light max-w-2xl mx-auto tracking-wide animate-fade-in-delay">
              Experience the next generation of decentralized capital through a lens of absolute precision.
            </p>
          </div>

          <div className="flex flex-col items-center gap-8 animate-fade-in-delay2">
            <button
              id="hero-launch-btn"
              onClick={handleConnectClick}
              className="group relative px-12 py-6 bg-gradient-to-br from-[#c3f5ff] to-[#00e5ff] rounded-xl overflow-hidden transition-all duration-500 hover:scale-[1.02] active:scale-95"
              style={{ boxShadow: '0 0 60px -15px rgba(0, 229, 255, 0.4)' }}
            >
              <span className="relative z-10 text-[#00363d] font-headline font-extrabold text-xl tracking-tight">Connect Wallet</span>
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
            <div className="flex items-center gap-4 text-[#bac9cc]/60 font-label text-xs uppercase tracking-[0.2em]">
              <span className="w-12 h-[1px] bg-[#3b494c]/30" />
              <span>No registration required</span>
              <span className="w-12 h-[1px] bg-[#3b494c]/30" />
            </div>
          </div>
        </div>

        <div className="absolute bottom-12 flex flex-col items-center gap-4 opacity-40">
          <span className="text-[10px] uppercase tracking-[0.3em] font-label">Scroll to explore</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-[#c3f5ff] to-transparent" />
        </div>
      </main>

      {/* Philosophy Section */}
      <section className="py-32 px-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
          <div className="space-y-8">
            <span className="text-[#00daf3] font-label text-xs font-bold uppercase tracking-widest">Philosophy</span>
            <h2 className="text-4xl md:text-5xl font-headline font-bold leading-tight">Clarity over Complexity.</h2>
            <p className="text-[#bac9cc] text-lg leading-relaxed">
              We believe decentralized finance shouldn't feel like a cockpit. By abstracting technical debt into elegant architectural patterns, we allow you to focus on what matters: your capital's growth.
            </p>
            <div className="pt-4">
              <button onClick={handleConnectClick} className="inline-flex items-center gap-2 text-[#c3f5ff] hover:gap-4 transition-all duration-300 font-headline font-bold">
                Explore the dashboard
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-4 bg-[#00e5ff]/10 rounded-xl blur-2xl group-hover:bg-[#00e5ff]/20 transition-colors duration-500" />
            <div className="relative aspect-square rounded-xl bg-[#1c1b1c] overflow-hidden border border-[#3b494c]/10">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#c3f5ff]/20 to-[#00e5ff]/20 flex items-center justify-center border border-[#00e5ff]/20">
                    <span className="material-symbols-outlined text-[#00daf3] text-5xl">architecture</span>
                  </div>
                  <p className="text-[#bac9cc] text-sm font-label">Precision-built DeFi Architecture</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem Bento Grid */}
      <section className="py-32 px-10 max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-headline font-bold tracking-tight">The Ecosystem Pillars</h2>
          <p className="text-[#bac9cc] font-body">Four modules. Infinite possibilities.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          {/* Bento 1 */}
          <div className="md:col-span-2 relative group bg-[#1c1b1c] rounded-xl overflow-hidden p-8 flex flex-col justify-end border border-[#3b494c]/5 hover:border-[#c3f5ff]/10 transition-all cursor-pointer" onClick={handleConnectClick}>
            <div className="absolute top-0 right-0 p-8">
              <span className="material-symbols-outlined text-[#00daf3] text-4xl">account_balance_wallet</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#131314]/80 to-transparent" />
            <div className="relative z-10 space-y-2">
              <h3 className="text-2xl font-headline font-bold">Liquidity Vaults</h3>
              <p className="text-[#bac9cc] max-w-md">Institutional-grade yield optimization through algorithmic balancing.</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#00e5ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Bento 2 */}
          <div className="relative group bg-[#2a2a2b] rounded-xl overflow-hidden p-8 flex flex-col justify-between border border-[#3b494c]/5">
            <span className="material-symbols-outlined text-[#d1bcff] text-4xl">shield_with_heart</span>
            <div className="space-y-2">
              <h3 className="text-xl font-headline font-bold">Security First</h3>
              <p className="text-[#bac9cc] text-sm">Triple-audited smart contracts with real-time threat detection.</p>
            </div>
          </div>

          {/* Bento 3 */}
          <div className="relative group bg-[#353436] rounded-xl overflow-hidden p-8 flex flex-col justify-between border border-[#3b494c]/5">
            <span className="material-symbols-outlined text-[#00daf3] text-4xl">token</span>
            <div className="space-y-2">
              <h3 className="text-xl font-headline font-bold">Governance</h3>
              <p className="text-[#bac9cc] text-sm">Direct ownership and voting rights for all NEX holders.</p>
            </div>
          </div>

          {/* Bento 4 */}
          <div className="md:col-span-2 relative group bg-[#1c1b1c] rounded-xl overflow-hidden p-8 flex flex-col justify-end border border-[#3b494c]/5 hover:border-[#c3f5ff]/10 transition-all cursor-pointer" onClick={handleConnectClick}>
            <div className="absolute top-0 right-0 p-8">
              <span className="material-symbols-outlined text-[#00e297] text-4xl">monitoring</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#131314]/80 to-transparent" />
            <div className="relative z-10 space-y-2">
              <h3 className="text-2xl font-headline font-bold">Asset Management</h3>
              <p className="text-[#bac9cc] max-w-md">A unified interface for cross-chain capital deployment.</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#00e297]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8">
          <button
            id="landing-enter-app-btn"
            onClick={handleConnectClick}
            className="px-16 py-5 bg-gradient-to-br from-[#c3f5ff] to-[#00e5ff] text-[#00363d] font-headline font-black text-lg tracking-tight rounded-xl hover:scale-[1.02] active:scale-95 transition-all duration-200"
            style={{ boxShadow: '0 0 40px -10px rgba(0, 229, 255, 0.4)' }}
          >
            Enter App
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-24 border-t border-[#c3f5ff]/15 bg-[#131314]">
        <div className="flex flex-col md:flex-row justify-between items-center px-10 max-w-7xl mx-auto gap-12">
          <div className="flex flex-col items-center md:items-start gap-4">
            <span className="text-lg font-black text-[#c3f5ff] font-headline uppercase">ZenETH</span>
            <p className="font-label text-xs uppercase tracking-widest text-[#bac9cc]">© 2024 ZenETH. Built for the Neon Architect.</p>
          </div>
          <div className="flex gap-10 font-label text-xs uppercase tracking-widest text-[#bac9cc]">
            <a className="hover:text-white transition-opacity duration-300 opacity-80 hover:opacity-100 cursor-pointer">Terms</a>
            <a className="hover:text-white transition-opacity duration-300 opacity-80 hover:opacity-100 cursor-pointer">Privacy</a>
            <a className="hover:text-white transition-opacity duration-300 opacity-80 hover:opacity-100 cursor-pointer">Twitter</a>
            <a className="hover:text-white transition-opacity duration-300 opacity-80 hover:opacity-100 cursor-pointer">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
