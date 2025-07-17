import './globals.css' // 이미 있음

export const metadata = {
  title: 'Au Revoir - Shopping Mall',
  description: 'Elegance Redefined',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        {children}
      </body>
    </html>
  )
}