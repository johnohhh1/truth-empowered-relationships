import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Truth Empowered Relationships',
  description: 'Transform reactive patterns into conscious connection',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  )
}
