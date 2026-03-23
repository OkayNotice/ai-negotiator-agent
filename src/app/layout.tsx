import "./globals.css";

export const metadata = {
  title: 'ANCI Platform',
  description: 'AI Negotiation Commerce Infrastructure',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50">
        {children}
      </body>
    </html>
  )
}
