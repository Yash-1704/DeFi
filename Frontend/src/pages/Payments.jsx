import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import { useWallet } from '../hooks/useWallet'
import { addTransaction, getTransactions } from '../services/api'

export default function Payments() {
  const { walletAddress, isConnected } = useWallet()

  const [recipient,  setRecipient]  = useState('')
  const [amount,     setAmount]     = useState('')
  const [sending,    setSending]    = useState(false)
  const [txMsg,      setTxMsg]      = useState({ type: '', text: '' })
  const [recentTxs,  setRecentTxs]  = useState([])
  const [txLoading,  setTxLoading]  = useState(false)

  const loadActivity = () => {
    if (!walletAddress) return
    setTxLoading(true)
    getTransactions(walletAddress)
      .then(data => setRecentTxs(Array.isArray(data) ? data.slice(0, 5) : []))
      .catch(() => setRecentTxs([]))
      .finally(() => setTxLoading(false))
  }

  useEffect(() => { loadActivity() }, [walletAddress]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSend = async (e) => {
    e.preventDefault()
    if (!isConnected)  { setTxMsg({ type: 'error', text: 'Please connect your wallet first.' }); return }
    if (!recipient)    { setTxMsg({ type: 'error', text: 'Please enter a recipient address.' }); return }
    if (!amount || parseFloat(amount) <= 0) { setTxMsg({ type: 'error', text: 'Please enter a valid amount.' }); return }

    setSending(true)
    setTxMsg({ type: '', text: '' })
    try {
      await addTransaction({
        walletAddress,
        to: recipient,
        amount: parseFloat(amount),
        type: 'send',
        timestamp: new Date().toISOString(),
      })
      setTxMsg({ type: 'success', text: `Sent ${amount} ETH to ${recipient.slice(0, 10)}...` })
      setRecipient('')
      setAmount('')
      loadActivity()
    } catch (err) {
      setTxMsg({ type: 'error', text: err.message || 'Transaction failed.' })
    } finally {
      setSending(false)
    }
  }

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

              <form onSubmit={handleSend} className="space-y-6">
                {/* Asset selector (static display) */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#bac9cc] mb-2 ml-1">Asset</label>
                  <div className="flex items-center justify-between p-4 bg-[#0e0e0f] rounded-lg border border-transparent hover:border-[#c3f5ff]/20 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center">
                        <span className="material-symbols-outlined text-indigo-400">diamond</span>
                      </div>
                      <div>
                        <p className="font-bold text-[#e5e2e3]">Ethereum</p>
                        <p className="text-xs text-[#bac9cc]">ETH</p>
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
                      value={recipient}
                      onChange={e => setRecipient(e.target.value)}
                    />
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-neutral-600">contact_page</span>
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#bac9cc] mb-2 ml-1">Amount (ETH)</label>
                  <div className="bg-[#0e0e0f] rounded-lg border border-transparent focus-within:border-[#c3f5ff]/20 transition-all p-4">
                    <div className="flex items-center justify-between gap-4">
                      <input
                        id="amount-input"
                        className="bg-transparent border-none p-0 text-3xl font-headline font-bold text-[#e5e2e3] focus:ring-0 placeholder:text-neutral-800 w-full outline-none"
                        placeholder="0.00"
                        type="number"
                        min="0"
                        step="0.001"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                      />
                      <button
                        type="button"
                        className="bg-[#c3f5ff]/10 text-[#00daf3] px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter hover:bg-[#c3f5ff]/20 transition-all"
                      >
                        MAX
                      </button>
                    </div>
                    <p className="text-xs text-[#bac9cc] mt-2">≈ ${amount ? (parseFloat(amount) * 2942.5).toFixed(2) : '0.00'} USD</p>
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

                {/* Status message */}
                {txMsg.text && (
                  <div className={`px-4 py-3 rounded-lg text-sm font-semibold ${
                    txMsg.type === 'success' ? 'bg-[#00e297]/10 text-[#00e297] border border-[#00e297]/20'
                    : 'bg-[#ffb4ab]/10 text-[#ffb4ab] border border-[#ffb4ab]/20'
                  }`}>
                    {txMsg.text}
                  </div>
                )}

                {/* Submit */}
                <button
                  id="authorize-transfer-btn"
                  type="submit"
                  disabled={sending}
                  className="w-full py-5 rounded-xl bg-gradient-to-r from-[#c3f5ff] to-[#00e5ff] text-[#00363d] font-black text-lg tracking-tight hover:scale-[1.01] active:scale-[0.98] transition-all uppercase disabled:opacity-50"
                  style={{ boxShadow: '0 20px 40px rgba(0,229,255,0.1)' }}
                >
                  {sending ? 'Recording...' : 'Authorize Transfer'}
                </button>
              </form>
            </div>

            {/* Right Column */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              {/* Recent Recipients */}
              <div className="bg-[#201f20] rounded-xl p-6 border border-[#3b494c]/5">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-[#bac9cc]">Recent Recipients</h4>
                </div>
                <div className="space-y-1">
                  {recentTxs.filter(tx => tx.type === 'send').slice(0, 3).map((tx, i) => (
                    <div
                      key={tx._id || i}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#3a393a]/30 transition-all group cursor-pointer"
                      onClick={() => setRecipient(tx.to || '')}
                    >
                      <div className="w-10 h-10 rounded-full bg-[#353436] border border-[#3b494c]/20 flex items-center justify-center font-bold text-cyan-400 text-sm">
                        {(tx.to || '?').slice(2, 4).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold font-mono text-[#e5e2e3]">{(tx.to || '').slice(0, 6)}...{(tx.to || '').slice(-4)}</p>
                        <p className="text-[10px] text-[#bac9cc]">{tx.amount} ETH</p>
                      </div>
                      <span className="material-symbols-outlined text-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                    </div>
                  ))}
                  {recentTxs.filter(tx => tx.type === 'send').length === 0 && (
                    <p className="text-xs text-neutral-500 text-center py-4">No recent recipients</p>
                  )}
                </div>
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
            </div>
            <div className="glass-panel rounded-xl overflow-hidden border border-[#3b494c]/15">
              {txLoading ? (
                <div className="p-8 text-center text-neutral-500 text-sm">Loading activity...</div>
              ) : recentTxs.length === 0 ? (
                <div className="p-8 text-center text-neutral-500 text-sm">
                  {isConnected ? 'No transactions recorded yet.' : 'Connect wallet to see activity.'}
                </div>
              ) : recentTxs.map((tx, i) => (
                <div key={tx._id || i} className={`flex items-center justify-between p-4 px-6 hover:bg-[#3a393a]/10 transition-colors ${i > 0 ? 'border-t border-[#3b494c]/10' : ''}`}>
                  <div className="flex items-center gap-6">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'send' ? 'bg-[#93000a]/30 text-[#ffb4ab]' : 'bg-[#00e297]/20 text-[#00e297]'}`}>
                      <span className="material-symbols-outlined">{tx.type === 'send' ? 'north_east' : 'south_west'}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold capitalize">{tx.type === 'send' ? `Sent to ${(tx.to || '').slice(0, 10)}...` : `Received`}</p>
                      <p className="text-xs text-[#bac9cc]">{tx.timestamp ? new Date(tx.timestamp).toLocaleString() : '—'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${tx.type === 'send' ? 'text-[#e5e2e3]' : 'text-[#00e297]'}`}>
                      {tx.type === 'send' ? '-' : '+'}{tx.amount} ETH
                    </p>
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
