import './globals.css'
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Providers } from "@/components/redux/provider";
import { ProvidersTheme } from './providers';
import Navbar, { TabletNavbar } from './root-components/Header';

const pjs = Plus_Jakarta_Sans({ subsets: ['latin'], display: 'swap', })

export const metadata = {
  title: 'Kanban Task Management',
  description: 'Effortlessly manage tasks and boost productivity with our intuitive Kanban Management App. Streamline your workflow and collaborate effectively. Try it now!',
  icons: {
    icon: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={pjs.className}>
    
      <body className='pb-24 bg-white dark:bg-very-dark-grey h-screen overflow-hidden'>
        <Providers>
        <ProvidersTheme>
          <Navbar/>
          <TabletNavbar/>
          {children}
        </ProvidersTheme>
        </Providers>
      </body>
    
    </html>
  )
}
