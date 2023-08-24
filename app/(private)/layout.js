// app/layout.tsx
import '../globals.css'
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
                <body className='absolute inset-0 h-screen max-h-screen overflow-hidden'>
                    <ReduxProvider>
                        <div className=''>
                            <SideNav />
                            <div className='relative top-0 z-0 h-screen'>
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
