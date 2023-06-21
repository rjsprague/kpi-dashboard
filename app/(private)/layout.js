// app/layout.tsx
import '../globals.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false
import { AuthProvider } from '../context/AuthProvider';
import SideNav from '../components/SideNav'
import TopNav from '../components/TopNav'


export default function RootLayout({ children }) {
    return (
        <AuthProvider>
                <html lang="en">
                    <head />
                    <body>
                        <div className='relative flex flex-col w-full gap-0'>
                            <SideNav />
                            <div className='absolute left-0 right-0 flex flex-col lg:left-72'>
                                <TopNav />
                                {children}
                            </div>
                        </div>
                    </body>
                </html>
        </AuthProvider>
    )
}
