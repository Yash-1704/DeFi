import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'

export default function Profile() {
  const [activeTheme, setActiveTheme] = useState('Obsidian')

  useEffect(() => {
    document.body.classList.remove('theme-light', 'theme-ocean')
    if (activeTheme === 'Neon White') {
      document.body.classList.add('theme-light')
    } else if (activeTheme === 'Cyber Ocean') {
      document.body.classList.add('theme-ocean')
    }
  }, [activeTheme])
  return (
    <div className="bg-[#131314] text-[#e5e2e3] min-h-screen">
      <TopBar showSearch />
      <Sidebar />

      <main className="md:ml-64 pt-24 px-8 pb-16 min-h-screen">

        {/* Profile Hero */}
        <section className="relative mb-16">
          <div className="h-48 rounded-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#353436] to-[#0e0e0f]" />
            <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at top right, rgba(0,229,255,0.1) 0%, transparent 60%)' }} />
          </div>
          <div className="absolute -bottom-10 left-10 flex items-end gap-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-[#00e5ff] blur-xl opacity-20 group-hover:opacity-40 transition-opacity rounded-xl" />
              <div className="w-32 h-32 rounded-xl relative border-4 border-[#131314] z-10 bg-gradient-to-br from-[#2a2a2b] to-[#353436] flex items-center justify-center">
                <span className="material-symbols-outlined text-cyan-400 text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
              </div>
              <button className="absolute bottom-2 right-2 bg-[#00e5ff] text-[#00363d] w-8 h-8 rounded-lg flex items-center justify-center z-20 shadow-lg hover:brightness-110 transition-all">
                <span className="material-symbols-outlined text-sm">edit</span>
              </button>
            </div>
            <div className="mb-4">
              <h2 className="text-4xl font-headline font-extrabold tracking-tighter text-[#e5e2e3]">architect.eth</h2>
              <p className="text-[#bac9cc] font-medium flex items-center gap-2">
                0x71C...4921
                <span className="material-symbols-outlined text-sm cursor-pointer hover:text-[#c3f5ff] transition-colors">content_copy</span>
              </p>
            </div>
          </div>
          <div className="absolute -bottom-6 right-0">
            <button className="bg-[#2a2a2b] hover:bg-[#3a393a] px-6 py-3 rounded-full text-sm font-semibold flex items-center gap-2 transition-all">
              <span className="material-symbols-outlined">share</span> Share Profile
            </button>
          </div>
        </section>

        {/* Bento Settings Grid */}
        <div className="grid grid-cols-12 gap-6">

          {/* Linked Wallets */}
          <div className="col-span-12 bg-[#1c1b1c] rounded-xl p-8 border border-[#3b494c]/15">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-headline font-bold">Linked Wallets</h3>
              <button className="text-[#00daf3] text-sm font-bold flex items-center gap-1 hover:text-[#c3f5ff] transition-colors">
                <span className="material-symbols-outlined text-base">add</span> Link New
              </button>
            </div>
            <div className="space-y-4">
              {[
                { name: 'MetaMask', addr: '0x4a2...98f1 • Primary', iconColor: 'text-orange-400', icon: 'account_balance_wallet', connected: true },
                { name: 'Coinbase Wallet', addr: 'nexus.cb.id', iconColor: 'text-blue-400', icon: 'token', connected: false },
              ].map((w, i) => (
                <div key={i} className="flex items-center justify-between p-5 bg-[#201f20] rounded-lg group hover:bg-[#2a2a2b] transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center border border-[#3b494c]/20">
                      <span className={`material-symbols-outlined ${w.iconColor}`} style={{ fontVariationSettings: "'FILL' 1" }}>{w.icon}</span>
                    </div>
                    <div>
                      <p className="font-bold text-[#e5e2e3]">{w.name}</p>
                      <p className="text-xs text-[#bac9cc]">{w.addr}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {w.connected && (
                      <span className="bg-[#00e297]/10 text-[#00e297] text-[10px] px-2 py-1 rounded font-black tracking-widest uppercase">Connected</span>
                    )}
                    <span className="material-symbols-outlined text-[#bac9cc] cursor-pointer hover:text-[#e5e2e3] transition-colors">more_vert</span>
                  </div>
                </div>
              ))}
            </div>
          </div>


          {/* Notification Settings */}
          <div className="col-span-12 lg:col-span-6 bg-[#1c1b1c] rounded-xl p-8 border border-[#3b494c]/15">
            <h3 className="text-xl font-headline font-bold mb-8">Notification Settings</h3>
            <div className="space-y-6">
              {[
                { label: 'Transaction Alerts', sub: 'Get notified on confirmed transfers', on: true },
                { label: 'Price Volatility', sub: 'Notify when assets shift +/- 5%', on: false },
                { label: 'Email Summaries', sub: 'Weekly digest of portfolio health', on: true },
              ].map((n, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-[#e5e2e3]">{n.label}</p>
                    <p className="text-xs text-[#bac9cc]">{n.sub}</p>
                  </div>
                  <div className={`w-12 h-6 ${n.on ? 'bg-[#00e5ff]' : 'bg-[#353436]'} rounded-full relative cursor-pointer transition-all hover:opacity-80`}>
                    <div className={`absolute top-1 ${n.on ? 'right-1 bg-[#00363d]' : 'left-1 bg-[#bac9cc]'} w-4 h-4 rounded-full transition-all`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security */}
          <div className="col-span-12 lg:col-span-6 bg-[#1c1b1c] rounded-xl p-8 border border-[#3b494c]/15">
            <h3 className="text-xl font-headline font-bold mb-8">Security & Access</h3>
            <div className="space-y-4">
              {[
                { icon: 'verified_user', iconColor: 'text-[#00daf3]', label: 'Two-Factor Authentication', sub: 'ACTIVE', subColor: 'text-[#00e297]', action: 'Manage' },
                { icon: 'key', iconColor: 'text-[#bac9cc]', label: 'Passkeys', sub: 'Biometric login for devices', subColor: 'text-[#bac9cc]', action: 'Setup' },
                { icon: 'devices', iconColor: 'text-[#bac9cc]', label: 'Session Manager', sub: '3 active devices', subColor: 'text-[#bac9cc]', action: null, chevron: true },
              ].map((s, i) => (
                <div key={i} className="p-4 bg-[#201f20] rounded-lg border border-[#00daf3]/10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className={`material-symbols-outlined ${s.iconColor}`}>{s.icon}</span>
                    <div>
                      <p className="text-sm font-bold">{s.label}</p>
                      <p className={`text-[10px] uppercase tracking-widest font-black ${s.subColor}`}>{s.sub}</p>
                    </div>
                  </div>
                  {s.chevron
                    ? <span className="material-symbols-outlined text-[#bac9cc]">chevron_right</span>
                    : <button className={`text-xs font-bold bg-[#3a393a] px-4 py-2 rounded-lg hover:bg-neutral-800 transition-colors ${i === 0 ? 'text-[#e5e2e3]' : 'text-[#00daf3]'}`}>{s.action}</button>
                  }
                </div>
              ))}
            </div>
          </div>

          {/* Interface Preferences */}
          <div className="col-span-12 bg-[#1c1b1c] rounded-xl p-8 border border-[#3b494c]/15 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div>
                <h3 className="text-xl font-headline font-bold">Interface Preferences</h3>
                <p className="text-sm text-[#bac9cc]">Customize the visual architecture of your dashboard.</p>
              </div>
              <div className="h-12 w-px bg-[#3b494c]/20" />
              <div className="flex items-center gap-4">
                {[
                  { theme: 'Obsidian', icon: 'dark_mode', bg: 'bg-neutral-900', iconColor: 'text-[#00e5ff]' },
                  { theme: 'Neon White', icon: 'light_mode', bg: 'bg-neutral-100', iconColor: 'text-neutral-900' },
                  { theme: 'Cyber Ocean', icon: 'palette', bg: 'bg-gradient-to-br from-neutral-900 to-cyan-900', iconColor: 'text-cyan-200' },
                ].map((t, i) => {
                  const isActive = activeTheme === t.theme
                  return (
                    <div key={i} onClick={() => setActiveTheme(t.theme)} className={`flex flex-col items-center gap-2 group cursor-pointer ${!isActive ? 'opacity-40 hover:opacity-100 transition-opacity' : ''}`}>
                      <div className={`w-16 h-12 ${t.bg} border-2 ${isActive ? 'border-[#00e5ff]' : 'border-[#3b494c]/20'} rounded-lg flex items-center justify-center`}>
                        <span className={`material-symbols-outlined ${t.iconColor}`}>{t.icon}</span>
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-[#00e5ff]' : ''}`}>{t.theme}</span>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-[#bac9cc]">Compact View</span>
              <div className="w-12 h-6 bg-[#353436] rounded-full relative cursor-pointer hover:opacity-80 transition-all">
                <div className="absolute left-1 top-1 bg-[#bac9cc] w-4 h-4 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer / Danger Zone */}
        <div className="mt-12 flex justify-between items-center px-4">
          <p className="text-xs text-[#bac9cc] font-medium">Nexus Protocol v4.2.1 • Built on Ethereum L2</p>
          <button className="text-[#ffb4ab] text-xs font-bold flex items-center gap-2 hover:bg-[#93000a]/20 px-4 py-2 rounded-lg transition-all">
            <span className="material-symbols-outlined text-base">logout</span> Disconnect All Sessions
          </button>
        </div>
      </main>
    </div>
  )
}
