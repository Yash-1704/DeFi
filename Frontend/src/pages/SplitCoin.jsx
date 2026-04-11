import React, { useState, useEffect, useCallback, useMemo } from 'react'
import Sidebar   from '../components/Sidebar'
import TopBar    from '../components/TopBar'
import { ethers } from 'ethers'
import { useWallet } from '../hooks/useWallet'
import {
  createGroup, getGroups, getGroupById,
  addGroupMember, fundGroupPool, deleteGroup,
  addExpense, getGroupExpenses,
} from '../services/api'
import { calculateBalances, simplifyDebts, truncAddr, fmtDate } from '../services/splitService'

// ── helpers ───────────────────────────────────────────────────────
const safe = (n) => (isNaN(parseFloat(n)) ? 0 : parseFloat(n))

export default function SplitCoin() {
  const { walletAddress, signer, isConnected } = useWallet()

  // ── tab ──────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('dashboard')

  // ── group / balances tab ─────────────────────────────────────────
  const [groups,         setGroups]         = useState([])
  const [activeGroupId,  setActiveGroupId]  = useState('')
  const [activeGroup,    setActiveGroup]    = useState(null)
  const [activeExpenses, setActiveExpenses] = useState([])

  // ── expense tab ───────────────────────────────────────────────────
  const [expGroupId,   setExpGroupId]   = useState('')
  const [expGroupData, setExpGroupData] = useState(null)
  const [expHistory,   setExpHistory]   = useState([])
  const [expDesc,      setExpDesc]      = useState('')
  const [expAmount,    setExpAmount]    = useState('')
  const [expPaidBy,    setExpPaidBy]    = useState('')
  const [expSplit,     setExpSplit]     = useState([])  // array of addresses

  // ── settlement tab ────────────────────────────────────────────────
  const [settleGroupId,   setSettleGroupId]   = useState('')
  const [settleGroupData, setSettleGroupData] = useState(null)
  const [settleExpenses,  setSettleExpenses]  = useState([])

  // ── status / loading ──────────────────────────────────────────────
  const [loading,   setLoading]   = useState(false)
  const [txLoading, setTxLoading] = useState(false)
  const [status,    setStatus]    = useState({ type: '', text: '' })  // type: success|error|info

  // ── computed ──────────────────────────────────────────────────────
  const activeBalances  = useMemo(() =>
    calculateBalances(activeExpenses,  activeGroup?.members  || []),
    [activeExpenses,  activeGroup])

  const settleBalances  = useMemo(() =>
    calculateBalances(settleExpenses,  settleGroupData?.members || []),
    [settleExpenses, settleGroupData])

  const simplifiedDebts = useMemo(() =>
    simplifyDebts(activeBalances),
    [activeBalances])

  // Settlement-tab specific computed values
  const settleDebts    = useMemo(() => simplifyDebts(settleBalances), [settleBalances])
  const mySettleDebts  = useMemo(() =>
    settleDebts.filter(d => d.from.toLowerCase() === walletAddress?.toLowerCase()),
    [settleDebts, walletAddress])
  const totalIOwe      = useMemo(() => mySettleDebts.reduce((s, d) => s + d.amount, 0), [mySettleDebts])
  const totalOweMe     = useMemo(() =>
    settleDebts.filter(d => d.to.toLowerCase() === walletAddress?.toLowerCase())
      .reduce((s, d) => s + d.amount, 0),
    [settleDebts, walletAddress])

  const userNetBalance = useMemo(() => {
    if (!walletAddress || !activeBalances) return 0
    return activeBalances[walletAddress.toLowerCase()] || 0
  }, [activeBalances, walletAddress])

  const dashTotalPool = useMemo(() =>
    groups.reduce((s, g) => s + safe(g.totalPool), 0),
    [groups])

  const dashUserContrib = useMemo(() => {
    if (!walletAddress) return 0
    const key = walletAddress.toLowerCase()
    return groups.reduce((sum, g) => {
      const c = g.contributions
      if (!c) return sum
      // Map (Mongoose in-memory) → use .get()
      if (typeof c.get === 'function') return sum + (c.get(key) || 0)
      // Plain object (JSON-serialized from API) → direct key access
      if (typeof c === 'object') return sum + (c[key] || 0)
      return sum
    }, 0)
  }, [groups, walletAddress])

  // ── status helpers ────────────────────────────────────────────────
  const ok  = (text) => setStatus({ type: 'success', text })
  const err = (text) => setStatus({ type: 'error',   text })
  const clr = ()     => setStatus({ type: '', text: '' })

  // ── data loaders ──────────────────────────────────────────────────
  const loadGroups = useCallback(async () => {
    if (!walletAddress) return
    try {
      const data = await getGroups()
      setGroups(Array.isArray(data) ? data : [])
    } catch (e) { err(e.message) }
  }, [walletAddress])

  const loadActiveGroup = useCallback(async (id) => {
    if (!id) return
    try {
      const [grp, exps] = await Promise.all([
        getGroupById(id),
        getGroupExpenses(id),
      ])
      setActiveGroup(grp)
      setActiveExpenses(Array.isArray(exps) ? exps : [])
    } catch (e) { err(e.message) }
  }, [])

  const loadExpGroup = useCallback(async (id) => {
    if (!id) return
    try {
      const [grp, exps] = await Promise.all([
        getGroupById(id),
        getGroupExpenses(id),
      ])
      setExpGroupData(grp)
      setExpHistory(Array.isArray(exps) ? exps : [])
      // Default paidBy to current user, select all members
      setExpPaidBy(walletAddress?.toLowerCase() || '')
      setExpSplit(grp.members || [])
    } catch (e) { err(e.message) }
  }, [walletAddress])

  const loadSettleGroup = useCallback(async (id) => {
    if (!id) return
    try {
      const [grp, exps] = await Promise.all([
        getGroupById(id),
        getGroupExpenses(id),
      ])
      setSettleGroupData(grp)
      setSettleExpenses(Array.isArray(exps) ? exps : [])
    } catch (e) { err(e.message) }
  }, [])

  // Load groups on wallet connect
  useEffect(() => { loadGroups() }, [loadGroups])

  // Reload active group when id changes
  useEffect(() => { if (activeGroupId) loadActiveGroup(activeGroupId) }, [activeGroupId, loadActiveGroup])

  // Reload expense group when id changes
  useEffect(() => { if (expGroupId) loadExpGroup(expGroupId) }, [expGroupId, loadExpGroup])

  // Reload settle group when id changes
  useEffect(() => { if (settleGroupId) loadSettleGroup(settleGroupId) }, [settleGroupId, loadSettleGroup])

  // ── action: create group ──────────────────────────────────────────
  const handleCreateGroup = async () => {
    if (!isConnected) { err('Connect your wallet first.'); return }
    const name = window.prompt('Enter group name:')
    if (!name?.trim()) return
    setLoading(true); clr()
    try {
      const grp = await createGroup({ name: name.trim(), creator: walletAddress.toLowerCase() })
      setGroups(prev => [grp, ...prev])
      setActiveGroupId(grp._id)
      setActiveGroup(grp)
      setActiveExpenses([])
      ok(`Group "${grp.name}" created!`)
      setActiveTab('group')
    } catch (e) { err(e.message) }
    finally { setLoading(false) }
  }

  // ── action: add member ────────────────────────────────────────────
  const handleAddMember = async () => {
    if (!activeGroupId) { err('No group selected.'); return }
    const addr = window.prompt('Enter member wallet address (0x...):')
    if (!addr?.trim()) return
    if (!ethers.utils.isAddress(addr.trim())) { err('Invalid Ethereum address.'); return }
    setLoading(true); clr()
    try {
      const updated = await addGroupMember(activeGroupId, addr.trim())
      setActiveGroup(updated)
      setGroups(prev => prev.map(g => g._id === activeGroupId ? updated : g))
      ok(`Member ${truncAddr(addr.trim())} added!`)
    } catch (e) { err(e.message) }
    finally { setLoading(false) }
  }

  // ── action: fund pool ─────────────────────────────────────────────
  const handleFundPool = async () => {
    if (!isConnected) { err('Connect your wallet first.'); return }
    if (!activeGroupId) { err('No group selected.'); return }
    const amtStr = window.prompt('Enter ETH amount to contribute to the pool:')
    if (!amtStr?.trim()) return
    const amount = parseFloat(amtStr)
    if (isNaN(amount) || amount <= 0) { err('Enter a valid positive amount.'); return }
    setLoading(true); clr()
    try {
      const updated = await fundGroupPool(activeGroupId, {
        walletAddress: walletAddress.toLowerCase(),
        amount,
      })
      setActiveGroup(updated)
      setGroups(prev => prev.map(g => g._id === activeGroupId ? updated : g))
      ok(`Contributed ${amount} ETH to pool!`)
    } catch (e) { err(e.message) }
    finally { setLoading(false) }
  }

  // ── action: add expense ───────────────────────────────────────────
  // ── action: delete group ────────────────────────────────────
  const handleDeleteGroup = async (id, name) => {
    if (!window.confirm(`Delete group "${name}"? This cannot be undone.`)) return
    setLoading(true); clr()
    try {
      await deleteGroup(id)
      setGroups(prev => prev.filter(g => g._id !== id))
      if (activeGroupId === id) { setActiveGroupId(''); setActiveGroup(null); setActiveExpenses([]) }
      if (settleGroupId === id) { setSettleGroupId(''); setSettleGroupData(null); setSettleExpenses([]) }
      ok(`Group "${name}" deleted.`)
    } catch (e) { err(e.message) }
    finally { setLoading(false) }
  }

  const handleAddExpense = async () => {
    if (!expGroupId) { err('Select a group first.'); return }
    if (!expDesc.trim()) { err('Add a description.'); return }
    if (!expAmount || safe(expAmount) <= 0) { err('Enter a valid amount.'); return }
    if (expSplit.length === 0) { err('Select at least one person to split with.'); return }
    const paidBy = expPaidBy || walletAddress?.toLowerCase()
    if (!paidBy) { err('Select who paid.'); return }
    setLoading(true); clr()
    try {
      await addExpense({
        groupId:     expGroupId,
        description: expDesc.trim(),
        amount:      safe(expAmount),
        paidBy:      paidBy.toLowerCase(),
        splitAmong:  expSplit.map(a => a.toLowerCase()),
      })
      // Reload history
      const updated = await getGroupExpenses(expGroupId)
      setExpHistory(Array.isArray(updated) ? updated : [])
      // If this group is also the active group, sync it
      if (expGroupId === activeGroupId) {
        setActiveExpenses(Array.isArray(updated) ? updated : [])
      }
      // Clear form
      setExpDesc(''); setExpAmount(''); setExpSplit(expGroupData?.members || [])
      ok('Expense added!')
    } catch (e) { err(e.message) }
    finally { setLoading(false) }
  }

  // ── action: settle group ──────────────────────────────────────────
  const handleSettle = async () => {
    if (!isConnected) { err('Connect your wallet first.'); return }
    if (!settleGroupId || !settleGroupData) { err('Select a group to settle.'); return }
    if (!signer) { err('Wallet signer not available.'); return }

    const debts = simplifyDebts(settleBalances)
    const myDebts = debts.filter(
      d => d.from.toLowerCase() === walletAddress.toLowerCase()
    )

    if (myDebts.length === 0) {
      ok('You have nothing to pay! All settled from your side.')
      return
    }

    setTxLoading(true); clr()
    try {
      for (const debt of myDebts) {
        setStatus({ type: 'info', text: `Sending ${debt.amount} ETH to ${truncAddr(debt.to)}...` })
        const tx = await signer.sendTransaction({
          to:    debt.to,
          value: ethers.utils.parseEther(debt.amount.toString()),
        })
        await tx.wait()
      }
      ok(`Settlement complete! Sent ETH to ${myDebts.length} member(s).`)
      // Reload data
      await loadSettleGroup(settleGroupId)
      if (settleGroupId === activeGroupId) await loadActiveGroup(activeGroupId)
    } catch (e) {
      if (e.code === 4001) err('Transaction rejected by user.')
      else err(e.message || 'Settlement failed.')
    } finally { setTxLoading(false) }
  }

  // ── split-among toggle ────────────────────────────────────────────
  const toggleSplit = (addr) => {
    const a = addr.toLowerCase()
    setExpSplit(prev =>
      prev.map(p => p.toLowerCase()).includes(a)
        ? prev.filter(p => p.toLowerCase() !== a)
        : [...prev, a]
    )
  }

  // ── member contribution status helper ─────────────────────────────
  const getMemberContrib = (group, addr) => {
    if (!group?.contributions) return 0
    // contributions is a Map or plain object from backend
    if (typeof group.contributions.get === 'function') {
      return group.contributions.get(addr.toLowerCase()) || 0
    }
    return group.contributions[addr.toLowerCase()] || 0
  }

  // ─────────────────────────────────────────────────────────────────
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
                  onClick={() => { setActiveTab(tab); clr() }}
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

          {/* Status banner — logic-driven, no structural change to existing tabs */}
          {status.text && (
            <div className={`flex items-center justify-between gap-4 px-5 py-3 rounded-xl border text-sm font-semibold
              ${status.type === 'success' ? 'bg-[#00e297]/10 border-[#00e297]/30 text-[#00e297]'
              : status.type === 'error'   ? 'bg-[#ffb4ab]/10 border-[#ffb4ab]/30 text-[#ffb4ab]'
              :                             'bg-[#00daf3]/10 border-[#00daf3]/30 text-[#00daf3]'}`}>
              <span>{status.text}</span>
              <button onClick={clr} className="text-xs opacity-60 hover:opacity-100 font-bold">✕</button>
            </div>
          )}

          {/* ── DASHBOARD TAB ─────────────────────────────────────── */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold font-headline">Your Groups</h3>
                  <button
                    onClick={handleCreateGroup}
                    disabled={loading}
                    className="text-xs px-3 py-1.5 bg-cyan-400 text-[#00363d] font-bold uppercase tracking-widest rounded-lg hover:bg-cyan-300 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : 'Add Group'}
                  </button>
                </div>

                {groups.length === 0 ? (
                  <div className="bg-[#201f20] rounded-xl border border-[#3b494c]/10 p-8 text-center text-neutral-500">
                    {isConnected ? 'No groups yet. Create one to get started!' : 'Connect your wallet to see groups.'}
                  </div>
                ) : groups.map(group => (
                  <div key={group._id} className="bg-[#201f20] rounded-xl border border-[#3b494c]/10 hover:border-cyan-400/30 transition-all cursor-pointer p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/5 rounded-full blur-3xl" />
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-cyan-400/10 rounded-xl flex items-center justify-center text-cyan-400">
                          <span className="material-symbols-outlined text-2xl">flight_takeoff</span>
                        </div>
                        <div>
                          <h4 className="text-xl font-bold font-headline">{group.name}</h4>
                          <p className="text-xs text-neutral-500">{group.members?.length || 0} Members</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 text-xs font-bold uppercase rounded-md ${
                          safe(group.totalPool) > 0
                            ? 'bg-[#00e297]/10 text-[#00e297]'
                            : 'bg-neutral-800 text-neutral-500'
                        }`}>
                          {safe(group.totalPool) > 0 ? 'Pool Funded' : 'Not Funded'}
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteGroup(group._id, group.name) }}
                          disabled={loading}
                          title="Delete group"
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#ffb4ab]/10 text-[#ffb4ab] border border-[#ffb4ab]/20 hover:bg-[#ffb4ab]/20 transition-colors disabled:opacity-40"
                        >
                          <span className="material-symbols-outlined text-[14px]">delete</span>
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-end border-t border-neutral-800 pt-4">
                      <div>
                        <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-1">Total Pool Balance</p>
                        <h3 className="text-3xl font-black font-headline text-[#e5e2e3]">{safe(group.totalPool).toFixed(4)} ETH</h3>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); setActiveGroupId(group._id); setActiveGroup(group); setActiveTab('group'); }}
                          disabled={loading}
                          className="text-xs px-3 py-1.5 bg-[#00daf3]/10 text-[#00daf3] border border-[#00daf3]/20 font-bold uppercase tracking-widest rounded-lg hover:bg-[#00daf3]/20 transition-colors disabled:opacity-40"
                        >
                          Fund Pool
                        </button>
                        <button
                          onClick={() => { setActiveGroupId(group._id); setActiveGroup(group); setActiveTab('group') }}
                          className="text-xs text-cyan-400 font-bold flex items-center gap-1 hover:underline"
                        >
                          View Details <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-bold font-headline">Total Balances</h3>
                <div className="bg-[#1c1b1c] rounded-xl p-6 border border-[#3b494c]/10 space-y-6">
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold">
                      {userNetBalance >= 0 ? 'You will receive' : 'You owe'}
                    </p>
                    <h2 className={`text-4xl font-extrabold font-headline mt-1 ${userNetBalance >= 0 ? 'text-[#00e297]' : 'text-[#ffb4ab]'}`}>
                      {userNetBalance >= 0 ? '+' : ''}{userNetBalance.toFixed(4)} ETH
                    </h2>
                  </div>
                  <div className="border-t border-neutral-800 pt-4">
                    <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold">Your Contributions</p>
                    <h2 className="text-2xl font-bold font-headline text-neutral-300 mt-1">{dashUserContrib.toFixed(4)} ETH</h2>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── GROUP TAB ─────────────────────────────────────────── */}
          {activeTab === 'group' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 flex flex-col gap-6">
                <div className="p-8 bg-[#201f20] rounded-xl border border-[#3b494c]/10">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h2 className="text-3xl font-extrabold font-headline mb-2">
                        {activeGroup?.name || 'Select a group from Dashboard'}
                      </h2>
                      <p className="text-sm text-neutral-400">Manage pool funding and members</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest">Pool Amount</p>
                      <h3 className="text-4xl font-extrabold font-headline text-[#00daf3]">
                        {safe(activeGroup?.totalPool).toFixed(4)} ETH
                      </h3>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-4">Members &amp; Funding Status</h4>
                  <div className="space-y-4">
                    {(activeGroup?.members || []).length === 0 ? (
                      <p className="text-neutral-500 text-sm">No members yet.</p>
                    ) : (activeGroup?.members || []).map((addr, i) => {
                      const contrib  = getMemberContrib(activeGroup, addr)
                      const funded   = contrib > 0
                      const isMe     = addr.toLowerCase() === walletAddress?.toLowerCase()
                      return (
                        <div key={i} className="flex items-center justify-between p-4 bg-[#1c1b1c] rounded-xl border border-neutral-800">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-neutral-900 rounded-full flex items-center justify-center font-bold text-xs">
                              {addr.slice(2, 4).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-[#e5e2e3]">
                                {isMe ? `You (${truncAddr(addr)})` : truncAddr(addr)}
                              </p>
                              <p className={`text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 ${funded ? 'text-[#00e297]' : 'text-[#ffb4ab]'}`}>
                                <span className="material-symbols-outlined text-[12px]">
                                  {funded ? 'check_circle' : 'pending'}
                                </span>
                                {funded ? 'Funded' : 'Pending Contribution'}
                              </p>
                            </div>
                          </div>
                          <div className="text-right font-headline font-bold text-lg">
                            {contrib.toFixed(4)} ETH
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="mt-8 flex justify-end gap-4">
                    <button
                      onClick={() => handleDeleteGroup(activeGroupId, activeGroup?.name)}
                      disabled={loading || !activeGroupId}
                      className="px-6 py-3 bg-[#ffb4ab]/10 text-[#ffb4ab] font-bold rounded-lg border border-[#ffb4ab]/20 hover:bg-[#ffb4ab]/20 transition-colors uppercase text-xs tracking-widest disabled:opacity-50 flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                      {loading ? 'Wait...' : 'Delete Group'}
                    </button>
                    <button
                      onClick={handleAddMember}
                      disabled={loading || !activeGroupId}
                      className="px-6 py-3 bg-[#0e0e0f] text-neutral-300 font-bold rounded-lg border border-neutral-700 hover:bg-neutral-800 transition-colors uppercase text-xs tracking-widest disabled:opacity-50"
                    >
                      {loading ? 'Wait...' : 'Add Member'}
                    </button>
                    <button
                      onClick={handleFundPool}
                      disabled={loading || !activeGroupId}
                      className="px-6 py-3 bg-gradient-to-br from-[#c3f5ff] to-[#00e5ff] text-[#00363d] font-bold rounded-lg uppercase text-xs tracking-widest hover:brightness-110 transition-all disabled:opacity-50"
                    >
                      {loading ? 'Wait...' : 'Fund Pool'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── EXPENSE TAB ───────────────────────────────────────── */}
          {activeTab === 'expense' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="p-8 bg-[#201f20] rounded-xl border border-[#3b494c]/10">
                <h3 className="text-2xl font-extrabold font-headline mb-6">Add Expense</h3>
                <div className="space-y-6">
                  {/* Group selector */}
                  <div>
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest block mb-2">Group</label>
                    <select
                      value={expGroupId}
                      onChange={e => setExpGroupId(e.target.value)}
                      className="w-full bg-[#1c1b1c] border border-neutral-800 rounded-xl py-3 px-4 text-[#e5e2e3] focus:border-cyan-400 outline-none transition-all appearance-none"
                    >
                      <option value="">Select a group...</option>
                      {groups.map(g => (
                        <option key={g._id} value={g._id}>{g.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest block mb-2">Description</label>
                    <input
                      type="text"
                      value={expDesc}
                      onChange={e => setExpDesc(e.target.value)}
                      className="w-full bg-[#1c1b1c] border border-neutral-800 rounded-xl py-3 px-4 text-[#e5e2e3] focus:border-cyan-400 outline-none transition-all"
                      placeholder="E.g. Dinner, Taxi, Drinks"
                    />
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest block mb-2">Amount (ETH)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.001"
                      value={expAmount}
                      onChange={e => setExpAmount(e.target.value)}
                      className="w-full bg-[#1c1b1c] border border-neutral-800 rounded-xl py-3 px-4 text-[#e5e2e3] focus:border-cyan-400 outline-none transition-all text-xl font-headline font-bold"
                      placeholder="0.00"
                    />
                  </div>

                  {/* Paid by */}
                  <div>
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest block mb-2">Paid By</label>
                    <select
                      value={expPaidBy}
                      onChange={e => setExpPaidBy(e.target.value)}
                      className="w-full bg-[#1c1b1c] border border-neutral-800 rounded-xl py-3 px-4 text-[#e5e2e3] focus:border-cyan-400 outline-none transition-all appearance-none"
                    >
                      <option value="">Select payer...</option>
                      {(expGroupData?.members || []).map(addr => (
                        <option key={addr} value={addr}>
                          {addr.toLowerCase() === walletAddress?.toLowerCase()
                            ? `You (${truncAddr(addr)})`
                            : truncAddr(addr)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Split among */}
                  <div>
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest block mb-2">
                      Split Among ({expSplit.length} selected)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(expGroupData?.members || []).length === 0 ? (
                        <p className="text-neutral-500 text-xs">Select a group first</p>
                      ) : (expGroupData?.members || []).map(addr => {
                        const selected = expSplit.map(a => a.toLowerCase()).includes(addr.toLowerCase())
                        const isMe     = addr.toLowerCase() === walletAddress?.toLowerCase()
                        return (
                          <button
                            key={addr}
                            type="button"
                            onClick={() => toggleSplit(addr)}
                            className={`flex-1 py-2 border rounded-lg text-sm font-bold transition-all ${
                              selected
                                ? 'bg-cyan-400/20 text-cyan-400 border-cyan-400/50'
                                : 'bg-[#0e0e0f] text-neutral-500 border-neutral-700 hover:border-neutral-500'
                            }`}
                          >
                            {isMe ? 'You' : truncAddr(addr)}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <button
                    onClick={handleAddExpense}
                    disabled={loading}
                    className="w-full py-4 mt-4 bg-[#00e297]/20 text-[#00e297] border border-[#00e297]/50 font-black rounded-xl uppercase tracking-widest hover:bg-[#00e297]/30 transition-all disabled:opacity-50"
                  >
                    {loading ? 'Submitting...' : 'Submit Expense'}
                  </button>
                </div>
              </div>

              {/* Expense history */}
              <div className="p-8 bg-[#1c1b1c] rounded-xl border border-[#3b494c]/10">
                <h3 className="text-2xl font-extrabold font-headline mb-6">Expense History</h3>
                <div className="space-y-4">
                  {expHistory.length === 0 ? (
                    <p className="text-neutral-500 text-sm">
                      {expGroupId ? 'No expenses yet for this group.' : 'Select a group to see expenses.'}
                    </p>
                  ) : expHistory.map(ex => (
                    <div key={ex._id} className="flex justify-between items-center p-4 bg-[#201f20] hover:bg-[#2a2a2b] transition-colors rounded-xl border border-neutral-800">
                      <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-full bg-neutral-900 flex justify-center items-center">
                          <span className="material-symbols-outlined text-neutral-400 text-sm">receipt_long</span>
                        </div>
                        <div>
                          <p className="font-bold text-[#e5e2e3]">{ex.description || 'Expense'}</p>
                          <p className="text-[10px] text-neutral-500 uppercase tracking-widest">
                            <span className="text-cyan-400">Paid by {truncAddr(ex.paidBy)}</span>
                          </p>
                          <p className="text-xs text-neutral-600 mt-1">{fmtDate(ex.createdAt)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-headline font-bold text-xl">{safe(ex.amount).toFixed(4)} ETH</p>
                        <p className="text-[10px] text-neutral-500 mt-1">{ex.splitAmong?.length || 1} ways</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── BALANCES TAB ──────────────────────────────────────── */}
          {activeTab === 'balances' && (
            <div className="max-w-3xl mx-auto bg-[#201f20] rounded-xl p-8 border border-[#3b494c]/10">
              <h3 className="text-2xl font-extrabold font-headline mb-2 text-center text-[#e5e2e3]">Simplified Summary</h3>
              <p className="text-center text-neutral-500 text-sm mb-8">
                {activeGroup?.name
                  ? `Who owes whom in "${activeGroup.name}" before settlement`
                  : 'Select a group from the Dashboard to view balances.'}
              </p>

              {simplifiedDebts.length === 0 ? (
                <div className="text-center text-neutral-500 text-sm py-8">
                  {activeGroupId
                    ? 'All settled — no outstanding debts! 🎉'
                    : 'Go to Dashboard → View Details on a group first.'}
                </div>
              ) : (
                <div className="space-y-6">
                  {simplifiedDebts.map((debt, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-[#1c1b1c] rounded-xl border border-neutral-800 relative overflow-hidden">
                      <div className="flex items-center gap-6 z-10 relative">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-neutral-900 rounded-full mx-auto flex items-center justify-center font-bold mb-2">
                            {debt.from.slice(2, 4).toUpperCase()}
                          </div>
                          <p className="text-xs font-bold text-neutral-400">
                            {debt.from.toLowerCase() === walletAddress?.toLowerCase()
                              ? `You (${truncAddr(debt.from)})`
                              : truncAddr(debt.from)}
                          </p>
                        </div>
                        <div className="flex flex-col items-center px-4">
                          <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest mb-1">owes</span>
                          <div className="flex items-center gap-2 text-cyan-400">
                            <div className="w-16 h-[1px] bg-cyan-400/30"></div>
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                          </div>
                          <span className="text-xl font-headline font-bold mt-1 text-[#e5e2e3]">
                            {debt.amount.toFixed(4)} ETH
                          </span>
                        </div>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-neutral-900 rounded-full mx-auto flex items-center justify-center font-bold mb-2">
                            {debt.to.slice(2, 4).toUpperCase()}
                          </div>
                          <p className="text-xs font-bold text-neutral-400">
                            {debt.to.toLowerCase() === walletAddress?.toLowerCase()
                              ? `You (${truncAddr(debt.to)})`
                              : truncAddr(debt.to)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── SETTLEMENT TAB ────────────────────────────────────── */}
          {activeTab === 'settlement' && (
            <div className="max-w-3xl mx-auto space-y-6">

              {/* Header card */}
              <div className="bg-[#1c1b1c] rounded-2xl p-8 border border-[#3b494c]/10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20">
                    <span className="material-symbols-outlined text-red-400 text-3xl">gavel</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-extrabold font-headline text-[#e5e2e3]">Final Settlement</h2>
                    <p className="text-neutral-400 text-sm">Net balances calculated off-chain · ETH sent directly wallet-to-wallet</p>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest block mb-2">Select Group to Settle</label>
                  <select
                    value={settleGroupId}
                    onChange={e => setSettleGroupId(e.target.value)}
                    className="w-full bg-[#0e0e0f] border border-neutral-800 rounded-xl py-3 px-4 text-[#e5e2e3] focus:border-red-500 outline-none transition-all appearance-none font-bold"
                  >
                    <option value="">Choose group...</option>
                    {groups.map(g => (
                      <option key={g._id} value={g._id}>{g.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {settleGroupId && (
                <>
                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-[#201f20] rounded-xl p-5 border border-[#3b494c]/10 text-center">
                      <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-2">You Owe</p>
                      <p className="text-2xl font-black font-headline text-[#ffb4ab]">{totalIOwe.toFixed(4)} ETH</p>
                    </div>
                    <div className="bg-[#201f20] rounded-xl p-5 border border-[#3b494c]/10 text-center">
                      <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-2">You Receive</p>
                      <p className="text-2xl font-black font-headline text-[#00e297]">{totalOweMe.toFixed(4)} ETH</p>
                    </div>
                    <div className="bg-[#201f20] rounded-xl p-5 border border-[#3b494c]/10 text-center">
                      <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-2">Transactions</p>
                      <p className="text-2xl font-black font-headline text-[#e5e2e3]">{settleDebts.length}</p>
                    </div>
                  </div>

                  {/* Payment plan */}
                  {settleDebts.length === 0 ? (
                    <div className="bg-[#201f20] rounded-2xl p-16 text-center border border-[#00e297]/20">
                      <span className="material-symbols-outlined text-[#00e297] text-6xl mb-4 block">check_circle</span>
                      <h3 className="text-2xl font-extrabold font-headline text-[#00e297] mb-2">All Settled!</h3>
                      <p className="text-neutral-500 text-sm">No outstanding debts in this group. Everyone is square.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500 px-1">
                        Payment Plan — {settleDebts.length} transaction{settleDebts.length !== 1 ? 's' : ''} to settle
                      </h4>
                      {settleDebts.map((debt, i) => {
                        const isMyDebt = debt.from.toLowerCase() === walletAddress?.toLowerCase()
                        const isToMe   = debt.to.toLowerCase()   === walletAddress?.toLowerCase()
                        return (
                          <div key={i} className={`p-5 rounded-xl border transition-all ${
                            isMyDebt ? 'bg-[#ffb4ab]/5 border-[#ffb4ab]/20'
                            : isToMe  ? 'bg-[#00e297]/5 border-[#00e297]/20'
                            : 'bg-[#201f20] border-neutral-800/60'
                          }`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="text-center">
                                  <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-xs ${
                                    isMyDebt ? 'bg-[#ffb4ab]/20 text-[#ffb4ab]' : 'bg-neutral-800 text-neutral-300'
                                  }`}>
                                    {isMyDebt
                                      ? <span className="material-symbols-outlined text-base">account_circle</span>
                                      : debt.from.slice(2, 4).toUpperCase()}
                                  </div>
                                  <p className="text-[9px] text-neutral-500 font-bold mt-1 uppercase tracking-widest">
                                    {isMyDebt ? 'YOU' : truncAddr(debt.from)}
                                  </p>
                                </div>
                                <div className="flex flex-col items-center px-3">
                                  <span className="text-[9px] text-neutral-600 uppercase font-bold mb-1">pays</span>
                                  <div className="flex items-center gap-1 text-neutral-600">
                                    <div className="w-8 h-px bg-neutral-700"></div>
                                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                                    <div className="w-8 h-px bg-neutral-700"></div>
                                  </div>
                                  <span className="font-headline font-bold text-base mt-1 text-[#e5e2e3]">
                                    {debt.amount.toFixed(4)} ETH
                                  </span>
                                </div>
                                <div className="text-center">
                                  <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-xs ${
                                    isToMe ? 'bg-[#00e297]/20 text-[#00e297]' : 'bg-neutral-800 text-neutral-300'
                                  }`}>
                                    {isToMe
                                      ? <span className="material-symbols-outlined text-base">account_circle</span>
                                      : debt.to.slice(2, 4).toUpperCase()}
                                  </div>
                                  <p className="text-[9px] text-neutral-500 font-bold mt-1 uppercase tracking-widest">
                                    {isToMe ? 'YOU' : truncAddr(debt.to)}
                                  </p>
                                </div>
                              </div>
                              <div>
                                {isMyDebt && (
                                  <span className="px-3 py-1.5 bg-[#ffb4ab]/10 text-[#ffb4ab] border border-[#ffb4ab]/30 rounded-full text-[9px] font-bold uppercase tracking-widest">You Pay</span>
                                )}
                                {isToMe && (
                                  <span className="px-3 py-1.5 bg-[#00e297]/10 text-[#00e297] border border-[#00e297]/30 rounded-full text-[9px] font-bold uppercase tracking-widest">Incoming</span>
                                )}
                                {!isMyDebt && !isToMe && (
                                  <span className="px-3 py-1.5 bg-neutral-800/60 text-neutral-500 border border-neutral-700/60 rounded-full text-[9px] font-bold uppercase tracking-widest">Peer</span>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Action area */}
                  {mySettleDebts.length > 0 ? (
                    <button
                      onClick={handleSettle}
                      disabled={txLoading || !isConnected}
                      className="w-full py-5 bg-gradient-to-r from-red-600 to-red-500 text-white font-black rounded-xl uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(239,68,68,0.3)] hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                    >
                      {txLoading
                        ? 'Sending ETH...'
                        : `Settle My Debts — ${mySettleDebts.length} Payment${mySettleDebts.length !== 1 ? 's' : ''} · ${totalIOwe.toFixed(4)} ETH`}
                    </button>
                  ) : settleDebts.length > 0 && (
                    <div className="text-center py-4 bg-[#00e297]/5 border border-[#00e297]/20 rounded-xl">
                      <span className="material-symbols-outlined text-[#00e297] text-lg align-middle mr-2">check_circle</span>
                      <span className="text-[#00e297] font-bold text-sm">You have no debts to pay in this group!</span>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
