// app/layout.js
import './globals.css';
import { AuthProvider } from './contexts/AuthContext';

export const metadata = {
  title: 'Au Revoir - Shopping Mall',
  description: 'Elegance Redefined',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}