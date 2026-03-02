'use client'
// app/ask/page.js — AI-Powered Q&A using local DeepSeek via LM Studio
import { useState, useRef, useEffect } from 'react'
import { supabase, formatKES } from '@/lib/supabase'

const SUGGESTED = [
  'Which candidate has received the most money?',
  'Who has donated the most to any candidate?',
  'Are there any foreign donations?',
  'Which candidate is closest to their spending limit?',
  'How many critical flags are there?',
  'Who are the top 3 biggest spenders on advertising?',
  'Which candidates have anonymous donations?',
  'Compare James Kariuki and Peter Odhiambo\'s funding',
]

async function fetchAllData() {
  const [
    { data: candidates },
    { data: contributions },
    { data: expenditures },
    { data: flags },
    { data: parties },
  ] = await Promise.all([
    supabase.from('candidates').select('*, political_parties(party_name, abbreviation)'),
    supabase.from('contributions').select('*, candidates(full_name)'),
    supabase.from('expenditures').select('*, candidates(full_name)'),
    supabase.from('flags_and_alerts').select('*, candidates(full_name)'),
    supabase.from('political_parties').select('*'),
  ])
  return { candidates, contributions, expenditures, flags, parties }
}

function buildContext(data) {
  const { candidates, contributions, expenditures, flags } = data

  const spent = {}
  for (const e of expenditures || []) {
    spent[e.candidate_id] = (spent[e.candidate_id] || 0) + e.amount_kes
  }

  const raised = {}
  for (const c of contributions || []) {
    raised[c.candidate_id] = (raised[c.candidate_id] || 0) + c.amount_kes
  }

  const candSummary = (candidates || []).map(c => ({
    name: c.full_name,
    party: c.political_parties?.abbreviation,
    election_type: c.election_type,
    county: c.county,
    spending_limit: c.declared_spending_limit,
    total_raised: raised[c.id] || 0,
    total_spent: spent[c.id] || 0,
    pct_of_limit: Math.round(((spent[c.id] || 0) / c.declared_spending_limit) * 100),
  }))

  const flagSummary = (flags || []).map(f => ({
    candidate: f.candidates?.full_name,
    type: f.flag_type,
    severity: f.severity,
    status: f.resolution_status,
    notes: f.notes,
  }))

  const contribSummary = (contributions || []).map(c => ({
    candidate: c.candidates?.full_name,
    donor: c.donor_name,
    type: c.donor_type,
    amount: c.amount_kes,
    date: c.contribution_date,
    flagged: c.flag_status !== 'clean',
  }))

  return JSON.stringify({ candidates: candSummary, contributions: contribSummary, flags: flagSummary }, null, 2)
}

export default function AskPage() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [dbData, setDbData] = useState(null)
  const inputRef = useRef()
  const bottomRef = useRef()

  useEffect(() => {
    fetchAllData().then(setDbData)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(question) {
    const q = question || input.trim()
    if (!q || loading) return
    setInput('')
    setLoading(true)

    const userMsg = { role: 'user', content: q }
    setMessages(prev => [...prev, userMsg])

    try {
      const context = dbData ? buildContext(dbData) : null

      // Build clean history for the API
      const history = messages.map(m => ({
        role: m.role,
        content: m.content,
      }))

      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...history, userMsg],
          context,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response')
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.content }])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: err.message || 'Sorry, I encountered an error. Make sure api  is working.',
        error: true,
      }])
    }
    setLoading(false)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <p className="section-title">AI Transparency Assistant</p>
        <h1>Ask About Campaign Finance</h1>
        <p className="text-gray-500 text-sm mt-1">
          Ask anything about the 2027 Kenya election campaign finances in plain English.
          Powered by DeepSeek AI and live CampaignWatch data.
        </p>
      </div>

      {/* Chat window */}
      <div className="card p-0 overflow-hidden flex flex-col" style={{ height: '520px' }}>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* Welcome message */}
          {messages.length === 0 && (
            <div className="text-center py-6">
              <div className="text-5xl mb-3">🤖</div>
              <h3 className="text-navy mb-1">The Samaritan AI</h3>
              <p className="text-gray-400 text-sm mb-6">
                Ask me anything about Kenya 2027 campaign finances.<br />
                I have access to all candidates, donations, spending, and flags.
              </p>

              {/* Suggested questions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left max-w-xl mx-auto">
                {SUGGESTED.map(q => (
                  <button key={q} onClick={() => sendMessage(q)}
                    className="text-xs text-left bg-ash hover:bg-navy/5 border border-ash-dark
                               hover:border-navy/30 rounded-xl px-3 py-2.5 transition-all text-gray-600 hover:text-navy">
                    💬 {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message bubbles */}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 bg-navy rounded-full flex items-center justify-center text-sm mr-2 shrink-0 mt-0.5">
                  🤖
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap
                ${msg.role === 'user'
                  ? 'bg-navy text-white rounded-tr-sm'
                  : msg.error
                    ? 'bg-alert/10 text-alert-dark rounded-tl-sm'
                    : 'bg-ash text-gray-800 rounded-tl-sm'}`}>
                {msg.content}
              </div>
            </div>
          ))}

          {/* Loading */}
          {loading && (
            <div className="flex justify-start">
              <div className="w-7 h-7 bg-navy rounded-full flex items-center justify-center text-sm mr-2 shrink-0">
                🤖
              </div>
              <div className="bg-ash rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-2 h-2 bg-navy/40 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="border-t border-ash-dark p-4">
          {messages.length > 0 && messages.length < 3 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {SUGGESTED.slice(0, 3).map(q => (
                <button key={q} onClick={() => sendMessage(q)}
                  className="text-xs bg-ash hover:bg-navy/5 border border-ash-dark rounded-full px-2.5 py-1 text-gray-500 hover:text-navy transition-colors">
                  {q}
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Ask about any candidate, donation, or spending…"
              disabled={loading || !dbData}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy
                         disabled:opacity-50"
            />
            <button onClick={() => sendMessage()} disabled={!input.trim() || loading || !dbData}
              className="bg-navy text-white px-4 py-2.5 rounded-xl font-semibold text-sm
                         hover:bg-navy-light transition-colors disabled:opacity-40">
              {loading ? '⏳' : '→'}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {!dbData ? '⏳ Loading database…' : '🔒 Powered by DeepSeek AI (Local) · Data from verified IEBC filings'}
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="card bg-ash border-ash-dark text-sm text-gray-500">
        <strong className="text-navy">ℹ️ About this tool:</strong> The Samaritan AI answers questions using data
        declared to the IEBC. It can only report what has been officially filed — it cannot verify undeclared
        activities. For suspected violations, please{' '}
        <a href="/tip-off" className="text-gold hover:underline">submit a confidential tip</a>.
      </div>
    </div>
  )
}
