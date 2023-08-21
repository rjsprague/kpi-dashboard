// app/layout.tsx
import '../globals.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false
import { AuthProvider } from '../context/AuthProvider';
import SideNav from '../components/SideNav'
import Header from '../components/Header'
import { ReduxProvider } from '../GlobalRedux/provider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({ children }) {

    return (
        <AuthProvider>
            <html lang="en">
                <head />
                <body className='absolute inset-0 h-screen max-h-screen'>
                    <ReduxProvider>
                        <div className=''>
                            <SideNav />
                            <div className='relative z-0 h-[90vh]'>
                                <Header />
                                {children}
                            </div>
                        </div>
                        <ToastContainer />
                        <div id="modal-root"></div>
                        <div id="root"></div>
                        <div id="loading-portal"></div>
                    </ReduxProvider>
                </body>
            </html>
        </AuthProvider>
    )
}
