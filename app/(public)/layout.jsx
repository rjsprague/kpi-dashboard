// app/layout.tsx
import '../globals.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false
import { AuthProvider } from '../context/AuthProvider';
import { ReduxProvider } from '../GlobalRedux/provider';


export default function RootLayout({ children }) {
    return (
        <AuthProvider>
            <html lang="en">
                <head />
                <body>
                    <ReduxProvider>
                        {children}
                    </ReduxProvider>
                </body>
            </html>
        </AuthProvider>
    )
}
