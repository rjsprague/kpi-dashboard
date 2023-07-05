// app/layout.tsx
import '../globals.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false
import { AuthProvider } from '../context/AuthProvider';
import SideNav from '../components/SideNav'
import Header from '../components/Header'


export default function RootLayout({ children }) {
    return (
        <AuthProvider>
                <html lang="en">
                    <head />
                    <body className='absolute inset-0 h-screen max-h-screen overflow-hidden'>
                        <div className=''>
                            <SideNav />
                            <div className=''>
                                <Header />
                                {children}
                            </div>
                        </div>
                    </body>
                </html>
        </AuthProvider>
    )
}
