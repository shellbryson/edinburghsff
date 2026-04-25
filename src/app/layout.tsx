import type { Metadata } from 'next'
import { Inter, Inter_Tight } from 'next/font/google'
import './globals.css'

const inter = Inter({
  variable: '--font-body',
  subsets: ['latin'],
})

const interTight = Inter_Tight({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: {
    default: 'Edinburgh SFF',
    template: '%s | Edinburgh SFF',
  },
  description: 'Resources and community for science fiction and fantasy writers in Edinburgh.',
  openGraph: {
    siteName: 'Edinburgh SFF',
    locale: 'en_GB',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${inter.variable} ${interTight.variable} h-full antialiased`}>
      <body className="h-full flex flex-col">
        {children}
      </body>
    </html>
  )
}
