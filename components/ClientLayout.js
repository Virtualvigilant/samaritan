'use client'
// components/ClientLayout.js — Client wrapper for splash screen + all client components
import SplashScreen from './SplashScreen'
import Navbar from './Navbar'
import Footer from './Footer'
import PrototypeBanner from './PrototypeBanner'
import AskAIButton from './AskAIButton'

export default function ClientLayout({ children }) {
    return (
        <SplashScreen>
            <Navbar />
            <PrototypeBanner />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
                {children}
            </main>
            <Footer />
            <AskAIButton />
        </SplashScreen>
    )
}
