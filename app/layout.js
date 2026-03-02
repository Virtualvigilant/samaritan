// app/layout.js
import { Inter } from 'next/font/google'
import './globals.css'
import ClientLayout from '@/components/ClientLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'The Samaritan — Campaign Finance Watch Kenya 🇰🇪',
  description: 'Tracking political campaign finance integrity ahead of Kenya 2027 Elections — Transparency International Kenya / KISP Programme',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-ash min-h-screen flex flex-col`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
