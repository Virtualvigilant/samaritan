'use client'
// components/AskAIButton.js — Fixed floating button bottom-right
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AskAIButton() {
    const pathname = usePathname()

    // Hide on admin pages and on the /ask page itself
    if (pathname?.startsWith('/admin') || pathname === '/ask') return null

    return (
        <Link href="/ask"
            className="fixed bottom-20 lg:bottom-6 right-4 z-40 group"
            title="Ask AI">
            <span className="flex items-center gap-2 bg-navy text-white pl-3 pr-4 py-3 rounded-full
                        shadow-lg shadow-navy/30 hover:bg-navy-light transition-all 
                        hover:shadow-xl hover:scale-105">
                <span className="w-8 h-8 bg-gold rounded-full flex items-center justify-center text-base">
                    🤖
                </span>
                <span className="text-sm font-semibold hidden sm:inline">Ask AI</span>
            </span>
        </Link>
    )
}
