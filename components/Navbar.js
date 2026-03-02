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
        id: 'more', label: 'More',
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
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
            <nav className={`bg-navy shadow-lg sticky top-0 z-50 ${pathname === '/ask' ? 'hidden lg:block' : ''}`}>
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
            {!isAdmin && pathname !== '/ask' && (
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
                            if (tab.id === 'more') {
                                return (
                                    <button key={tab.id} onClick={() => setExploreOpen(!exploreOpen)}
                                        className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-lg min-w-0 flex-1 transition-colors
                                            ${exploreOpen ? 'text-gold' : 'text-gray-400'}`}>
                                        {tab.icon}
                                        <span className="text-[10px] font-medium mt-0.5 truncate">{tab.label}</span>
                                        {exploreOpen && <span className="w-4 h-0.5 bg-gold rounded-full mt-0.5" />}
                                    </button>
                                )
                            }
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

            {/* Mobile "More" Menu Drawer */}
            {exploreOpen && !isAdmin && (
                <div className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setExploreOpen(false)}>
                    <div className="absolute bottom-16 left-0 right-0 bg-navy border-t border-navy-light rounded-t-2xl shadow-2xl p-4 animate-slideUpMenu" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h3 className="text-white font-bold text-lg">Explore Platform</h3>
                            <button onClick={() => setExploreOpen(false)} className="text-gray-400 p-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* Main Explore Links */}
                        <div className="grid grid-cols-1 gap-2 mb-6">
                            {exploreLinks.map(l => (
                                <Link key={l.href} href={l.href}
                                    onClick={() => setExploreOpen(false)}
                                    className={`flex items-center gap-3 p-4 rounded-xl transition-colors
                                        ${pathname === l.href ? 'bg-white/10 text-gold' : 'bg-navy-dark text-gray-300 hover:bg-navy-light hover:text-white'}`}>
                                    <span className="text-xl">{l.label.split(' ')[0]}</span>
                                    <span className="font-semibold text-sm">{l.label.substring(l.label.indexOf(' ') + 1)}</span>
                                </Link>
                            ))}
                        </div>

                        {/* Footer / Extra Links (Mobile Only) */}
                        <div className="px-2 space-y-6 max-h-[40vh] overflow-y-auto pb-4 custom-scrollbar">

                            {/* Data & Legal */}
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-widest text-gold mb-3">Data & Legal</h4>
                                <ul className="space-y-3">
                                    <li>
                                        <Link href="/reports" onClick={() => setExploreOpen(false)} className="text-gray-400 text-xs hover:text-white transition-colors">
                                            Methodology & Sources
                                        </Link>
                                    </li>
                                    <li>
                                        <a href="https://www.iebc.or.ke" target="_blank" rel="noopener noreferrer" className="text-gray-400 text-xs hover:text-white transition-colors inline-flex items-center gap-1">
                                            IEBC Official Portal
                                            <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://kenyalaw.org" target="_blank" rel="noopener noreferrer" className="text-gray-400 text-xs hover:text-white transition-colors inline-flex items-center gap-1">
                                            Kenya Law
                                            <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                        </a>
                                    </li>
                                    <li><Link href="/reports" onClick={() => setExploreOpen(false)} className="text-gray-400 text-xs hover:text-white transition-colors">Legal Framework (ECF Act 2013)</Link></li>
                                    <li><Link href="/reports" onClick={() => setExploreOpen(false)} className="text-gray-400 text-xs hover:text-white transition-colors">Privacy Policy</Link></li>
                                    <li><Link href="/reports" onClick={() => setExploreOpen(false)} className="text-gray-400 text-xs hover:text-white transition-colors">Terms of Use</Link></li>
                                </ul>
                            </div>

                            {/* Partners & Contact */}
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-widest text-gold mb-3">Partners & Contact</h4>
                                <ul className="space-y-1.5 mb-4">
                                    {['TI Kenya', 'KISP Programme', 'ELGIA', 'URAI Trust', 'CMD Kenya'].map(p => (
                                        <li key={p} className="text-gray-400 text-xs">{p}</li>
                                    ))}
                                </ul>
                                <div className="space-y-1.5">
                                    <p className="text-xs">
                                        <a href="mailto:report@campaignwatch.or.ke" className="text-gray-400 hover:text-white transition-colors">report@campaignwatch.or.ke</a>
                                    </p>
                                    <p className="text-xs">
                                        <a href="tel:+25471234567" className="text-gray-400 hover:text-white transition-colors">+254 712 345 67</a>
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
                @keyframes slideUpMenu {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-slideUpMenu {
                    animation: slideUpMenu 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </>
    )
}
