'use client'
// app/admin/comments/page.js — Admin comment moderation
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@/lib/supabaseAdmin'

export default function AdminCommentsPage() {
    const supabase = createBrowserClient()
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState(null)
    const [filter, setFilter] = useState('all') // all | bot | user

    async function fetchComments() {
        setLoading(true)
        let query = supabase
            .from('community_comments')
            .select('*')
            .order('created_at', { ascending: false })

        if (filter === 'bot') query = query.eq('is_bot', true)
        if (filter === 'user') query = query.eq('is_bot', false)

        const { data } = await query
        setComments(data || [])
        setLoading(false)
    }

    useEffect(() => { fetchComments() }, [filter])

    async function handleDelete(id) {
        if (!confirm('Delete this comment and all its replies?')) return
        setDeleting(id)
        await supabase.from('community_comments').delete().eq('id', id)
        await fetchComments()
        setDeleting(null)
    }

    async function handleDeleteAll() {
        if (!confirm('Delete ALL comments? This cannot be undone.')) return
        if (!confirm('Are you absolutely sure?')) return
        await supabase.from('community_comments').delete().neq('id', '00000000-0000-0000-0000-000000000000')
        await fetchComments()
    }

    function timeAgo(date) {
        const s = Math.floor((Date.now() - new Date(date)) / 1000)
        if (s < 60) return 'just now'
        if (s < 3600) return `${Math.floor(s / 60)}m ago`
        if (s < 86400) return `${Math.floor(s / 3600)}h ago`
        return new Date(date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
    }

    const userCount = comments.filter(c => !c.is_bot).length
    const botCount = comments.filter(c => c.is_bot).length

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-navy">💬 Community Comments</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {comments.length} total · {userCount} user · {botCount} bot replies
                    </p>
                </div>
                <div className="flex gap-2">
                    <button onClick={handleDeleteAll}
                        className="text-xs bg-alert/10 text-alert px-3 py-1.5 rounded-lg hover:bg-alert/20 transition-colors font-medium">
                        🗑️ Delete All
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                {[
                    { value: 'all', label: 'All Comments' },
                    { value: 'user', label: 'User Comments' },
                    { value: 'bot', label: 'Bot Replies' },
                ].map(f => (
                    <button key={f.value} onClick={() => setFilter(f.value)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors
              ${filter === f.value
                                ? 'bg-navy text-white'
                                : 'bg-ash text-gray-500 hover:bg-navy/10'}`}>
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Comments list */}
            {loading ? (
                <div className="text-center py-12 text-gray-400 animate-pulse">Loading…</div>
            ) : comments.length === 0 ? (
                <div className="card text-center py-12 text-gray-400">
                    <p className="text-4xl mb-2">💬</p>
                    <p>No comments found</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {comments.map(c => (
                        <div key={c.id}
                            className={`card flex gap-4 items-start ${c.is_bot ? 'border-l-4 border-gold' : ''}`}>
                            {/* Icon */}
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm shrink-0
                ${c.is_bot ? 'bg-gold text-white' : 'bg-navy/10 text-navy'}`}>
                                {c.is_bot ? '🤖' : '👤'}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className={`text-sm font-semibold ${c.is_bot ? 'text-gold' : 'text-navy'}`}>
                                        {c.is_bot ? '@Samaritan' : 'Anonymous'}
                                    </span>
                                    {c.is_bot && (
                                        <span className="text-[10px] bg-gold/10 text-gold-dark px-1.5 py-0.5 rounded-full font-bold">BOT</span>
                                    )}
                                    <span className="text-xs text-gray-400">{timeAgo(c.created_at)}</span>
                                    {c.parent_id && (
                                        <span className="text-[10px] bg-ash text-gray-400 px-1.5 py-0.5 rounded-full">reply</span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-700 mt-1 leading-relaxed whitespace-pre-wrap break-words">
                                    {c.content}
                                </p>
                            </div>

                            {/* Delete button */}
                            <button onClick={() => handleDelete(c.id)}
                                disabled={deleting === c.id}
                                className="text-xs text-gray-400 hover:text-alert transition-colors shrink-0 p-1">
                                {deleting === c.id ? '⏳' : '🗑️'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
