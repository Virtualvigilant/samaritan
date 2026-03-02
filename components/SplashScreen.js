'use client'
// components/SplashScreen.js — Professional landing splash with T&C modal
import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function SplashScreen({ children }) {
    const [phase, setPhase] = useState('loading') // loading | terms | fadingOut | done
    const [accepted, setAccepted] = useState(false)

    useEffect(() => {
        // Check if user already accepted this session
        const alreadyAccepted = sessionStorage.getItem('samaritan_terms_accepted')
        if (alreadyAccepted) {
            setPhase('done')
            return
        }

        // Show splash for 2.5 seconds, then show T&C
        const timer = setTimeout(() => setPhase('terms'), 2500)
        return () => clearTimeout(timer)
    }, [])

    function handleAccept() {
        sessionStorage.setItem('samaritan_terms_accepted', 'true')
        setPhase('fadingOut')
        setTimeout(() => setPhase('done'), 800)
    }

    if (phase === 'done') return children

    return (
        <>
            {/* Splash overlay */}
            <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center
        bg-gradient-to-br from-[#0f1a30] via-navy to-[#1a2d4d] transition-opacity duration-700
        ${phase === 'fadingOut' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>

                {/* Animated background accents */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-gold/5 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-[15%] right-[8%] w-80 h-80 bg-gold/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                    <div className="absolute top-[40%] right-[20%] w-40 h-40 bg-safe/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }} />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg">

                    {/* Logo — large */}
                    <div className={`transition-all duration-1000 ${phase === 'loading' ? 'scale-100 opacity-100' : 'scale-90 opacity-90'}`}>
                        <Image
                            src="/img.png"
                            alt="The Samaritan"
                            width={280}
                            height={280}
                            className="object-contain drop-shadow-2xl"
                            priority
                        />
                    </div>

                    {/* Brand text */}
                    <div className="mt-4 space-y-2">
                        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                            The <span className="text-gold">Samaritan</span>
                        </h1>
                        <p className="text-gray-400 text-sm sm:text-base font-medium">
                            Protecting Democracy Through Transparency
                        </p>
                    </div>

                    {/* Tagline */}
                    <div className="mt-6 space-y-1">
                        <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold">
                            Kenya 2027 Campaign Finance Monitor
                        </p>
                        <div className="flex items-center justify-center gap-2 mt-2">
                            <span className="h-px w-8 bg-gold/40" />
                            <span className="text-gold text-xs font-bold">🇰🇪</span>
                            <span className="h-px w-8 bg-gold/40" />
                        </div>
                    </div>

                    {/* Loading indicator (before T&C) */}
                    {phase === 'loading' && (
                        <div className="mt-8 flex items-center gap-2">
                            <div className="flex gap-1">
                                {[0, 1, 2].map(i => (
                                    <div key={i} className="w-2 h-2 bg-gold rounded-full animate-bounce"
                                        style={{ animationDelay: `${i * 0.15}s` }} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer credits */}
                <div className="absolute bottom-6 text-center space-y-2 px-6">
                    <div className="flex items-center justify-center gap-3 text-gray-500 text-[10px] uppercase tracking-wider">
                        <span>Transparency International Kenya</span>
                        <span className="text-gold/40">•</span>
                        <span>KISP Programme</span>
                        <span className="text-gold/40">•</span>
                        <span>FCDO Supported</span>
                    </div>
                    <p className="text-gray-600 text-[10px]">
                        © {new Date().getFullYear()} The Samaritan · Electoral Campaign Finance Act, 2013
                    </p>
                </div>
            </div>

            {/* T&C Modal */}
            {phase === 'terms' && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

                    {/* Modal */}
                    <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto animate-slideUp">

                        {/* Header */}
                        <div className="text-center mb-5">
                            <div className="w-14 h-14 bg-navy rounded-xl flex items-center justify-center mx-auto mb-3">
                                <Image src="/img.png" alt="Logo" width={40} height={40} className="object-contain" />
                            </div>
                            <h2 className="text-xl font-bold text-navy">Terms & Conditions</h2>
                            <p className="text-gray-400 text-xs mt-1">Please review before proceeding</p>
                        </div>

                        {/* T&C Content */}
                        <div className="bg-ash rounded-xl p-4 text-xs text-gray-600 space-y-3 max-h-48 overflow-y-auto leading-relaxed">
                            <p><strong className="text-navy">1. Purpose:</strong> The Samaritan is a civic technology platform built to promote transparency in Kenya&apos;s 2027 General Election campaign financing. It is developed under the Kenya Integrity and Security Programme (KISP) in partnership with Transparency International Kenya and supported by FCDO.</p>

                            <p><strong className="text-navy">2. Data Sources:</strong> All campaign finance data presented is sourced from publicly available declarations filed with the Independent Electoral and Boundaries Commission (IEBC) under the Electoral Campaign Financing Act, 2013. While we strive for accuracy, data may be incomplete or delayed.</p>

                            <p><strong className="text-navy">3. No Political Affiliation:</strong> This platform is independent of all political parties, candidates, and government bodies. It does not endorse, support, or oppose any candidate or party.</p>

                            <p><strong className="text-navy">4. AI Disclaimer:</strong> The AI assistant (&quot;@Samaritan&quot;) provides answers based on available data and may occasionally produce inaccurate or incomplete responses. It should not be relied upon as the sole source of information for legal or electoral decisions.</p>

                            <p><strong className="text-navy">5. Community Guidelines:</strong> Public comments and tip-offs must be factual, respectful, and lawful. Defamatory, threatening, or misleading content will be removed. Anonymous submissions are welcomed but must be made in good faith.</p>

                            <p><strong className="text-navy">6. Privacy:</strong> We do not collect personal data from visitors unless voluntarily submitted through tip-off forms. Anonymous comments do not require any personal information.</p>

                            <p><strong className="text-navy">7. Liability:</strong> The Samaritan team, Transparency International Kenya, and FCDO accept no liability for decisions made based on information presented on this platform.</p>
                        </div>

                        {/* Accept checkbox */}
                        <label className="flex items-start gap-3 mt-5 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={accepted}
                                onChange={e => setAccepted(e.target.checked)}
                                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-navy focus:ring-navy cursor-pointer"
                            />
                            <span className="text-sm text-gray-600 group-hover:text-navy transition-colors">
                                I have read and agree to the Terms & Conditions and understand that this is a transparency monitoring tool.
                            </span>
                        </label>

                        {/* Accept button */}
                        <button
                            onClick={handleAccept}
                            disabled={!accepted}
                            className="w-full mt-5 bg-navy text-white py-3 rounded-xl font-semibold text-sm
                         hover:bg-navy-light transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                            Enter The Samaritan
                        </button>

                        <p className="text-center text-[10px] text-gray-400 mt-3">
                            By continuing, you acknowledge this is a prototype for public interest research.
                        </p>
                    </div>
                </div>
            )}
        </>
    )
}
