// app/layout.tsx
import '../globals.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false
import { AuthProvider } from '../context/AuthProvider';
import { ReduxProvider } from '../GlobalRedux/provider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({ children }) {
    return (
        <AuthProvider>
            <html lang="en">
                <head />
                <body>
                    <ReduxProvider>
                        {children}
                        <ToastContainer />
                    </ReduxProvider>
                </body>
            </html>
        </AuthProvider>
    )
}
