'use client'
// components/ClientLayout.js — Client wrapper for splash screen + all client components
import SplashScreen from './SplashScreen'
import Navbar from './Navbar'
import Footer from './Footer'
import PrototypeBanner from './PrototypeBanner'
import AskAIButton from './AskAIButton'
import { usePathname } from 'next/navigation'

export default function ClientLayout({ children }) {
    const pathname = usePathname()
    // Hide default padding on the Ask API page for full-bleed mobile UI
    const isAskAI = pathname === '/ask'

    return (
        <SplashScreen>
            <Navbar />
            <PrototypeBanner />
            <main className={`${isAskAI ? 'w-full flex-1' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full'}`}>
                {children}
            </main>
            <Footer />
            <AskAIButton />
        </SplashScreen>
    )
}
