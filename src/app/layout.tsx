import './globals.css'

export const metadata = {
  title: 'Supermercado SOLID',
  description: 'Demostración de Principios SOLID con Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
