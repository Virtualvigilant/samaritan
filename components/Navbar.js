'use client'
// components/Navbar.js — Clean navbar with grouped links + mobile bottom tabs
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'

// ── Site Logo ───────────────────────────────────────────────────
export function SiteLogo({ size = 40, className = '' }) {
    return (
        <Image
            src="/img.png"
            alt="The Samaritan Logo"
            width={size}
            height={size}
            className={`object-contain ${className}`}
            priority
        />
    )
}

// Primary links (always visible)
const mainLinks = [
    { href: '/', label: 'Dashboard' },
    { href: '/candidates', label: 'Candidates' },
    { href: '/watch-list', label: 'Watch List' },
    { href: '/community', label: 'Forum' },
]

// "Explore" dropdown links
const exploreLinks = [
    { href: '/compare', label: '⚖️ Compare Candidates' },
    { href: '/community-reports', label: '📢 Verified Reports' },
    { href: '/reports', label: '📄 Docs' },
]

// Mobile bottom tabs
const mobileTabs = [
    {
        href: '/', label: 'Home',
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" /></svg>
    },
    {
        href: '/candidates', label: 'Candidates',
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    },
    {
        href: '/community', label: 'Forum',
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
    },
    {
        href: '/community-reports', label: 'Reports',
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
    },
    {
        href: '/ask', label: 'Ask AI',
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
    },
]

export default function Navbar() {
    const pathname = usePathname()
    const [exploreOpen, setExploreOpen] = useState(false)
    const dropdownRef = useRef(null)
    const isAdmin = pathname?.startsWith('/admin')

    // Close dropdown on outside click
    useEffect(() => {
        function handleClick(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setExploreOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [])

    // Close dropdown on route change
    useEffect(() => { setExploreOpen(false) }, [pathname])

    const isExploreActive = exploreLinks.some(l => pathname === l.href)

    return (
        <>
            {/* ── Top Navbar ────────────────────────────────────────── */}
            <nav className="bg-navy shadow-lg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2.5">
                            <SiteLogo size={100} />
                            <span className="leading-tight">
                                <span className="text-gold font-bold text-base block">The Samaritan</span>
                                <span className="text-gray-400 text-[10px] font-medium tracking-wide">
                                    Protecting Democracy Through Transparency
                                </span>
                            </span>
                        </Link>

                        {/* Desktop nav */}
                        <div className="hidden lg:flex items-center gap-1">
                            {/* Main links */}
                            {mainLinks.map(l => {
                                const active = pathname === l.href
                                return (
                                    <Link key={l.href} href={l.href}
                                        className={`px-3 py-2 text-sm font-medium transition-colors relative
                      ${active ? 'text-gold' : 'text-gray-300 hover:text-white hover:bg-white/5 rounded-lg'}`}>
                                        {l.label}
                                        {active && <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gold rounded-full" />}
                                    </Link>
                                )
                            })}

                            {/* Explore dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <button onClick={() => setExploreOpen(!exploreOpen)}
                                    className={`px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1 relative
                    ${isExploreActive ? 'text-gold' : 'text-gray-300 hover:text-white hover:bg-white/5 rounded-lg'}`}>
                                    Explore
                                    <svg className={`w-3.5 h-3.5 transition-transform ${exploreOpen ? 'rotate-180' : ''}`}
                                        fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                    {isExploreActive && <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gold rounded-full" />}
                                </button>

                                {exploreOpen && (
                                    <div className="absolute top-full right-0 mt-1 w-52 bg-navy-dark border border-navy-light rounded-xl shadow-xl py-1 z-50">
                                        {exploreLinks.map(l => (
                                            <Link key={l.href} href={l.href}
                                                className={`block px-4 py-2.5 text-sm transition-colors
                          ${pathname === l.href
                                                        ? 'text-gold bg-white/5'
                                                        : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
                                                {l.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Report button */}
                            <Link href="/tip-off"
                                className="ml-3 bg-alert text-white text-sm font-semibold px-4 py-2 rounded-lg
                           hover:bg-alert-dark transition-colors">
                                🛡️ Report
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* ── Mobile Bottom Tab Bar ─────────────────────────────── */}
            {!isAdmin && (
                <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-navy border-t border-navy-light safe-bottom">
                    <div className="flex items-center justify-around px-1 py-1">
                        {mobileTabs.slice(0, 2).map(tab => {
                            const active = pathname === tab.href
                            return (
                                <Link key={tab.href} href={tab.href}
                                    className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-lg min-w-0 flex-1 transition-colors
                    ${active ? 'text-gold' : 'text-gray-400'}`}>
                                    {tab.icon}
                                    <span className="text-[10px] font-medium mt-0.5 truncate">{tab.label}</span>
                                    {active && <span className="w-4 h-0.5 bg-gold rounded-full mt-0.5" />}
                                </Link>
                            )
                        })}

                        {/* Center Report button */}
                        <Link href="/tip-off" className="flex flex-col items-center justify-center -mt-5">
                            <span className="bg-alert w-12 h-12 rounded-full flex items-center justify-center shadow-lg shadow-alert/30 border-4 border-navy">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </span>
                            <span className="text-[9px] font-bold text-alert mt-0.5">Report</span>
                        </Link>

                        {mobileTabs.slice(2).map(tab => {
                            const active = pathname === tab.href
                            return (
                                <Link key={tab.href} href={tab.href}
                                    className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-lg min-w-0 flex-1 transition-colors
                    ${active ? 'text-gold' : 'text-gray-400'}`}>
                                    {tab.icon}
                                    <span className="text-[10px] font-medium mt-0.5 truncate">{tab.label}</span>
                                    {active && <span className="w-4 h-0.5 bg-gold rounded-full mt-0.5" />}
                                </Link>
                            )
                        })}
                    </div>
                </div>
            )}
        </>
    )
}
