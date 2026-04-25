import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
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
    <html lang="en-GB" className={`${geist.variable} h-full antialiased`}>
      <body className="h-full flex flex-col">
        {children}
      </body>
    </html>
  )
}
