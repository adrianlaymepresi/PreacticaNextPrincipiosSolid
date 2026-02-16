import './globals.css'

export const metadata = {
  title: 'Sistema de Gestión',
  description: 'Sistema integral de productos, estacionamiento y aves',
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
