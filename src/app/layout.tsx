import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from "@/components/redux/provider";
import { ProvidersTheme } from './providers';
import ThemeSwitcher from './ThemeSwitcher';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Kanban Task Management',
  description: 'Effortlessly manage tasks and boost productivity with our intuitive Kanban Management App. Streamline your workflow and collaborate effectively. Try it now!',

}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
        <ProvidersTheme>
          <ThemeSwitcher/>
          {children}
        </ProvidersTheme>
        </Providers>
      </body>
    </html>
  )
}
