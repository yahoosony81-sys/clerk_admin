import { type Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { koKR } from '@clerk/localizations'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Clerk Admin Template',
  description: 'Next.js 15 + Clerk + Supabase Template',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider 
      localization={koKR}
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
    >
      <html lang="ko" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
