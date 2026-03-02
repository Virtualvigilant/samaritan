'use client'
// app/community/page.js — Anonymous public comment section with @samaritan AI bot
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

function timeAgo(date) {
    const s = Math.floor((Date.now() - new Date(date)) / 1000)
    if (s < 60) return 'just now'
    if (s < 3600) return `${Math.floor(s / 60)}m ago`
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`
    return `${Math.floor(s / 86400)}d ago`
}

function Avatar({ isBot }) {
    if (isBot) {
        return (
            <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center text-white text-sm font-bold shrink-0">
                🤖
            </div>
        )
    }
    return (
        <div className="w-9 h-9 rounded-full bg-navy/20 flex items-center justify-center text-navy text-xs font-bold shrink-0">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z" />
            </svg>
        </div>
    )
}

function Comment({ comment, onReply, depth = 0 }) {
    const isBot = comment.is_bot
    const maxIndent = Math.min(depth, 4)

    return (
        <div style={{ marginLeft: `${maxIndent * 24}px` }}>
            <div className={`flex gap-3 py-3 ${depth > 0 ? 'border-l-2 border-ash-dark pl-4' : ''}`}>
                <Avatar isBot={isBot} />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-semibold text-sm ${isBot ? 'text-gold' : 'text-gray-500'}`}>
                            {isBot ? '@Samaritan' : 'Anonymous'}
                        </span>
                        {isBot && (
                            <span className="text-[10px] bg-gold/10 text-gold-dark px-1.5 py-0.5 rounded-full font-bold">BOT</span>
                        )}
                        <span className="text-xs text-gray-400">{timeAgo(comment.created_at)}</span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1 leading-relaxed whitespace-pre-wrap break-words">
                        {comment.content}
                    </p>
                    {!isBot && (
                        <button onClick={() => onReply(comment)}
                            className="text-xs text-gray-400 hover:text-navy font-medium mt-1.5 transition-colors">
                            ↩ Reply
                        </button>
                    )}
                </div>
            </div>

            {comment.replies?.map(reply => (
                <Comment key={reply.id} comment={reply} onReply={onReply} depth={depth + 1} />
            ))}
        </div>
    )
}

export default function CommunityPage() {
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)
    const [posting, setPosting] = useState(false)
    const [content, setContent] = useState('')
    const [replyTo, setReplyTo] = useState(null)

    const fetchComments = useCallback(async () => {
        const { data } = await supabase
            .from('community_comments')
            .select('*')
            .order('created_at', { ascending: true })

        const map = {}
        const roots = []
        for (const c of data || []) {
            c.replies = []
            map[c.id] = c
        }
        for (const c of data || []) {
            if (c.parent_id && map[c.parent_id]) {
                map[c.parent_id].replies.push(c)
            } else {
                roots.push(c)
            }
        }
        setComments(roots.reverse())
        setLoading(false)
    }, [])

    useEffect(() => { fetchComments() }, [fetchComments])

    async function handlePost() {
        const trimContent = content.trim()
        if (!trimContent || posting) return
        setPosting(true)

        const { data: newComment, error } = await supabase
            .from('community_comments')
            .insert({
                author_name: 'Anonymous',
                content: trimContent,
                parent_id: replyTo?.id || null,
                is_bot: false,
            })
            .select()
            .single()

        if (error) {
            console.error('Post error:', error)
            setPosting(false)
            return
        }

        setContent('')
        setReplyTo(null)

        // Check for @samaritan mention
        if (trimContent.toLowerCase().includes('@samaritan')) {
            try {
                const res = await fetch('/api/bot/respond', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ question: trimContent }),
                })
                const { content: aiReply } = await res.json()

                if (aiReply) {
                    await supabase.from('community_comments').insert({
                        author_name: 'Samaritan',
                        content: aiReply,
                        parent_id: newComment.id,
                        is_bot: true,
                    })
                }
            } catch (e) {
                console.error('Bot reply failed:', e)
            }
        }

        await fetchComments()
        setPosting(false)
    }

    const totalComments = comments.reduce((s, c) => s + 1 + (c.replies?.length || 0), 0)
    const botReplies = comments.reduce((s, c) => s + (c.replies?.filter(r => r.is_bot)?.length || 0), 0)

    return (
        <div className="max-w-3xl mx-auto space-y-6">

            {/* Header */}
            <div>
                <p className="section-title">Community Forum</p>
                <h1>Public Discussion</h1>
                <p className="text-gray-500 text-sm mt-1">
                    Share your thoughts on Kenya 2027 campaign finance.
                    Mention <strong className="text-gold">@samaritan</strong> to get an AI-powered answer.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
                <div className="card text-center py-3">
                    <p className="text-xl font-bold text-navy">{totalComments}</p>
                    <p className="text-xs text-gray-400">Comments</p>
                </div>
                <div className="card text-center py-3">
                    <p className="text-xl font-bold text-gold">{botReplies}</p>
                    <p className="text-xs text-gray-400">AI Replies</p>
                </div>
            </div>

            {/* Comment input */}
            <div className="card">
                {replyTo && (
                    <div className="flex items-center gap-2 mb-3 text-sm bg-ash rounded-lg px-3 py-2">
                        <span className="text-gray-500">Replying to a comment</span>
                        <button onClick={() => setReplyTo(null)} className="ml-auto text-gray-400 hover:text-alert text-xs">✕ Cancel</button>
                    </div>
                )}

                <div className="flex gap-3">
                    <Avatar isBot={false} />
                    <div className="flex-1 space-y-2">
                        <textarea
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) handlePost() }}
                            placeholder={replyTo
                                ? 'Write a reply... (mention @samaritan to ask AI)'
                                : 'What\'s on your mind? (mention @samaritan to ask AI)'
                            }
                            rows={3}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none
                         focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
                        />
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-400">
                                Anonymous · Ctrl+Enter to post
                            </p>
                            <button onClick={handlePost}
                                disabled={!content.trim() || posting}
                                className="bg-navy text-white px-5 py-2 rounded-xl text-sm font-semibold
                           hover:bg-navy-light transition-colors disabled:opacity-40">
                                {posting ? '⏳ Posting...' : replyTo ? '↩ Reply' : '💬 Post'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Comments feed */}
            <div className="card p-0">
                <div className="px-5 py-3 border-b border-ash-dark flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-navy">💬 Comments</h3>
                    <button onClick={fetchComments} className="text-xs text-gray-400 hover:text-navy transition-colors">
                        🔄 Refresh
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-gray-400 animate-pulse">Loading comments…</div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        <div className="text-4xl mb-3">💬</div>
                        <p className="font-semibold text-navy">No comments yet</p>
                        <p className="text-sm mt-1">Be the first to start the conversation!</p>
                    </div>
                ) : (
                    <div className="divide-y divide-ash-dark px-5">
                        {comments.map(comment => (
                            <Comment key={comment.id} comment={comment} onReply={setReplyTo} />
                        ))}
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="card bg-ash border-ash-dark text-sm text-gray-500">
                <strong className="text-navy">ℹ️ About:</strong> All comments are anonymous and public.
                Mention <span className="text-gold font-semibold">@samaritan</span> and the AI will answer
                using real campaign finance data. Be respectful and factual.
            </div>
        </div>
    )
}
