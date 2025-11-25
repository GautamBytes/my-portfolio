import './globals.css'
import { Rubik, Special_Elite } from "next/font/google";
import StarBackground from './components/StarBackground';

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
  weight: ["400", "700", "900"],
  display: "swap"
});

const specialElite = Special_Elite({
  subsets: ["latin"],
  variable: "--font-typewriter",
  weight: "400",
  display: "swap"
});

export const metadata = {
  title: 'Gautam Manchandani - Portfolio',
  description: 'Personal portfolio of Gautam Manchandani, MLH Fellowship Candidate and AI Innovator',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${rubik.variable} ${specialElite.variable} antialiased`}>
        <StarBackground />
        <div className="app-bg">
          {children}
        </div>
      </body>
    </html>
  )
}
