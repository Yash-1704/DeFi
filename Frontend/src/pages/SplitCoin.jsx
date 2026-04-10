import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'

export default function SplitCoin() {
  const [activeTab, setActiveTab] = useState('dashboard') // dashboard, group, expense, balances, settlement
  const [expenses, setExpenses] = useState([
    { id: 1, title: 'Dinner at Britto\'s', paidBy: '0xABC...123', amount: 300, date: 'Today, 8:00 PM', split: 3 },
    { id: 2, title: 'Taxi to Airport', paidBy: '0xDEF...456', amount: 150, date: 'Yesterday, 10:00 AM', split: 3 },
  ])

  return (
    <div className="bg-[#131314] text-[#e5e2e3] min-h-screen">
      <TopBar />
      <Sidebar />

      <main className="md:ml-64 pt-24 px-6 pb-16">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold font-headline tracking-tighter text-[#e5e2e3]">SplitCoin</h1>
              <p className="text-sm text-neutral-400 mt-1 uppercase tracking-widest font-semibold">Prepaid Group Expense System</p>
            </div>
            <div className="flex bg-[#1c1b1c] p-1 rounded-lg border border-[#3b494c]/20">
              {['dashboard', 'group', 'expense', 'balances', 'settlement'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-md capitalize transition-all ${
                    activeTab === tab
                      ? 'bg-cyan-400/10 text-cyan-400'
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold font-headline">Your Groups</h3>
                  <button className="text-xs px-3 py-1.5 bg-cyan-400 text-[#00363d] font-bold uppercase tracking-widest rounded-lg hover:bg-cyan-300 transition-colors">Add Group</button>
                </div>
                <div className="bg-[#201f20] rounded-xl border border-[#3b494c]/10 hover:border-cyan-400/30 transition-all cursor-pointer p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/5 rounded-full blur-3xl" />
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-cyan-400/10 rounded-xl flex items-center justify-center text-cyan-400">
                        <span className="material-symbols-outlined text-2xl">flight_takeoff</span>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold font-headline">Goa Trip</h4>
                        <p className="text-xs text-neutral-500">3 Members</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-[#00e297]/10 text-[#00e297] text-xs font-bold uppercase rounded-md">Pool Funded</span>
                  </div>
                  <div className="flex justify-between items-end border-t border-neutral-800 pt-4">
                    <div>
                      <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-1">Total Pool Balance</p>
                      <h3 className="text-3xl font-black font-headline text-[#e5e2e3]">1.50 ETH</h3>
                    </div>
                    <button onClick={() => setActiveTab('group')} className="text-xs text-cyan-400 font-bold flex items-center gap-1 hover:underline">
                      View Details <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-xl font-bold font-headline">Total Balances</h3>
                <div className="bg-[#1c1b1c] rounded-xl p-6 border border-[#3b494c]/10 space-y-6">
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold">You will receive</p>
                    <h2 className="text-4xl font-extrabold font-headline text-[#00e297] mt-1">+0.42 ETH</h2>
                  </div>
                  <div className="border-t border-neutral-800 pt-4">
                    <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold">Total Spent</p>
                    <h2 className="text-2xl font-bold font-headline text-neutral-300 mt-1">1.08 ETH</h2>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'group' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 flex flex-col gap-6">
                <div className="p-8 bg-[#201f20] rounded-xl border border-[#3b494c]/10">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h2 className="text-3xl font-extrabold font-headline mb-2">Goa Trip</h2>
                      <p className="text-sm text-neutral-400">Manage pool funding and members</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest">Pool Amount</p>
                      <h3 className="text-4xl font-extrabold font-headline text-[#00daf3]">1.50 ETH</h3>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-4">Members & Funding Status</h4>
                  <div className="space-y-4">
                    {[
                      { name: 'You (0x12F)', status: 'Funded', amount: '0.50 ETH', color: 'text-[#00e297]', icon: 'check_circle' },
                      { name: 'Alice (0xABC)', status: 'Funded', amount: '0.50 ETH', color: 'text-[#00e297]', icon: 'check_circle' },
                      { name: 'Bob (0xDEF)', status: 'Pending Contribution', amount: '0.00 / 0.50 ETH', color: 'text-[#ffb4ab]', icon: 'pending' },
                    ].map((m, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-[#1c1b1c] rounded-xl border border-neutral-800">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-neutral-900 rounded-full flex items-center justify-center font-bold text-xs">
                            {m.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-[#e5e2e3]">{m.name}</p>
                            <p className={`text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 ${m.color}`}>
                              <span className="material-symbols-outlined text-[12px]">{m.icon}</span> {m.status}
                            </p>
                          </div>
                        </div>
                        <div className="text-right font-headline font-bold text-lg">{m.amount}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex justify-end gap-4">
                    <button className="px-6 py-3 bg-[#0e0e0f] text-neutral-300 font-bold rounded-lg border border-neutral-700 hover:bg-neutral-800 transition-colors uppercase text-xs tracking-widest">Add Member</button>
                    <button className="px-6 py-3 bg-gradient-to-br from-[#c3f5ff] to-[#00e5ff] text-[#00363d] font-bold rounded-lg uppercase text-xs tracking-widest hover:brightness-110 transition-all">Fund Pool</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'expense' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="p-8 bg-[#201f20] rounded-xl border border-[#3b494c]/10">
                <h3 className="text-2xl font-extrabold font-headline mb-6">Add Expense</h3>
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest block mb-2">Group</label>
                    <select className="w-full bg-[#1c1b1c] border border-neutral-800 rounded-xl py-3 px-4 text-[#e5e2e3] focus:border-cyan-400 outline-none transition-all appearance-none">
                      <option>Goa Trip</option>
                      <option>Weekend Gateways</option>
                      <option>Flatmates</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest block mb-2">Description</label>
                    <input type="text" className="w-full bg-[#1c1b1c] border border-neutral-800 rounded-xl py-3 px-4 text-[#e5e2e3] focus:border-cyan-400 outline-none transition-all" placeholder="E.g. Dinner, Taxi, Drinks" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest block mb-2">Amount (USDC equivalent)</label>
                    <input type="number" className="w-full bg-[#1c1b1c] border border-neutral-800 rounded-xl py-3 px-4 text-[#e5e2e3] focus:border-cyan-400 outline-none transition-all text-xl font-headline font-bold" placeholder="0.00" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest block mb-2">Paid By</label>
                    <select className="w-full bg-[#1c1b1c] border border-neutral-800 rounded-xl py-3 px-4 text-[#e5e2e3] focus:border-cyan-400 outline-none transition-all appearance-none">
                      <option>You (0x12F)</option>
                      <option>Alice (0xABC)</option>
                      <option>Bob (0xDEF)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest block mb-2">Split Among</label>
                    <div className="flex gap-2">
                      {['You', 'Alice', 'Bob'].map(p => (
                        <button key={p} className="flex-1 py-2 bg-cyan-400/20 text-cyan-400 border border-cyan-400/50 rounded-lg text-sm font-bold">{p}</button>
                      ))}
                    </div>
                  </div>
                  <button className="w-full py-4 mt-4 bg-[#00e297]/20 text-[#00e297] border border-[#00e297]/50 font-black rounded-xl uppercase tracking-widest hover:bg-[#00e297]/30 transition-all">Submit Expense</button>
                </div>
              </div>

              <div className="p-8 bg-[#1c1b1c] rounded-xl border border-[#3b494c]/10">
                <h3 className="text-2xl font-extrabold font-headline mb-6">Expense History</h3>
                <div className="space-y-4">
                  {expenses.map(ex => (
                    <div key={ex.id} className="flex justify-between items-center p-4 bg-[#201f20] hover:bg-[#2a2a2b] transition-colors rounded-xl border border-neutral-800">
                      <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-full bg-neutral-900 flex justify-center items-center">
                          <span className="material-symbols-outlined text-neutral-400 text-sm">receipt_long</span>
                        </div>
                        <div>
                          <p className="font-bold text-[#e5e2e3]">{ex.title}</p>
                          <p className="text-[10px] text-neutral-500 uppercase tracking-widest"><span className="text-cyan-400">Paid by {ex.paidBy}</span></p>
                          <p className="text-xs text-neutral-600 mt-1">{ex.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-headline font-bold text-xl">${ex.amount}</p>
                        <p className="text-[10px] text-neutral-500 mt-1">{ex.split} ways</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'balances' && (
            <div className="max-w-3xl mx-auto bg-[#201f20] rounded-xl p-8 border border-[#3b494c]/10">
              <h3 className="text-2xl font-extrabold font-headline mb-2 text-center text-[#e5e2e3]">Simplified Summary</h3>
              <p className="text-center text-neutral-500 text-sm mb-8">Who owes whom before settlement</p>
              
              <div className="space-y-6">
                {[
                  { from: 'Bob (0xDEF)', to: 'Alice (0xABC)', amount: '150 USDC', text: 'owes' },
                  { from: 'Bob (0xDEF)', to: 'You (0x12F)', amount: '50 USDC', text: 'owes' },
                ].map((debt, i) => (
                  <div key={i} className="flex items-center justify-between p-6 bg-[#1c1b1c] rounded-xl border border-neutral-800 relative overflow-hidden">
                    <div className="flex items-center gap-6 z-10 relative">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-neutral-900 rounded-full mx-auto flex items-center justify-center font-bold mb-2">{debt.from.charAt(0)}</div>
                        <p className="text-xs font-bold text-neutral-400">{debt.from}</p>
                      </div>
                      <div className="flex flex-col items-center px-4">
                        <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest mb-1">{debt.text}</span>
                        <div className="flex items-center gap-2 text-cyan-400">
                          <div className="w-16 h-[1px] bg-cyan-400/30"></div>
                          <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </div>
                        <span className="text-xl font-headline font-bold mt-1 text-[#e5e2e3]">{debt.amount}</span>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-neutral-900 rounded-full mx-auto flex items-center justify-center font-bold mb-2">{debt.to.charAt(0)}</div>
                        <p className="text-xs font-bold text-neutral-400">{debt.to}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settlement' && (
            <div className="max-w-2xl mx-auto bg-[#1c1b1c] rounded-2xl p-8 border border-red-500/20 relative overflow-hidden text-center">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
              
              <div className="mb-6 max-w-xs mx-auto text-left">
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest block mb-2 text-center">Select Group to Settle</label>
                <select className="w-full bg-[#0e0e0f] border border-neutral-800 rounded-xl py-3 px-4 text-[#e5e2e3] focus:border-red-500 outline-none transition-all appearance-none text-center font-bold">
                  <option>Goa Trip</option>
                  <option>Weekend Gateways</option>
                  <option>Flatmates</option>
                </select>
              </div>

              <div className="w-20 h-20 bg-red-500/10 rounded-full mx-auto flex flex-col justify-center items-center text-red-500 mb-6 border border-red-500/30">
                <span className="material-symbols-outlined text-4xl">gavel</span>
              </div>
              
              <h2 className="text-3xl font-extrabold font-headline mb-2 text-[#e5e2e3]">Final Settlement</h2>
              <p className="text-neutral-400 mb-8 max-w-sm mx-auto">This action will calculate the net balances off-chain and distribute the funds automatically on-chain from the pool.</p>
              
              <div className="bg-[#0e0e0f] rounded-xl p-6 text-left mb-8 space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-widest text-neutral-500 border-b border-neutral-800 pb-2">Final Balances to be Distributed</h4>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-300">You (0x12F)</span>
                  <span className="text-[#00e297] font-bold">+ 0.42 ETH</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-300">Alice (0xABC)</span>
                  <span className="text-[#00e297] font-bold">+ 0.28 ETH</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-300">Bob (0xDEF)</span>
                  <span className="text-neutral-500 font-bold">0.00 ETH (already paid via pool)</span>
                </div>
              </div>
              
              <button className="w-full py-5 bg-gradient-to-r from-red-600 to-red-500 text-white font-black rounded-xl uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(239,68,68,0.3)] hover:brightness-110 active:scale-95 transition-all">
                Settle Now
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
