import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HireFlow — Find Your Dream Job',
  description: 'AI-powered job board connecting top talent with great companies',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
