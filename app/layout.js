import './globals.css'
import localFont from "next/font/local";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap"
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap"
});

export const metadata = {
  title: 'Gautam Manchandani - Portfolio',
  description: 'Personal portfolio of Gautam Manchandani, MLH Fellowship Candidate and AI Innovator',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* global wrapper provides the grid background and subtle vignette */}
        <div className="app-bg min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}
