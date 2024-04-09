// app/layout.tsx
import '../globals.css'
import { AuthProvider } from '../context/AuthProvider';
import { Roboto_Flex } from 'next/font/google'
import SideNav from '../components/SideNav'
import Header from '../components/Header'
import { ReduxProvider } from '../GlobalRedux/provider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const roboto = Roboto_Flex({
    subsets: ['latin-ext'],

    display: 'swap',
    variable: '--font-roboto_flex'
})

export const fetchCache = 'force-no-store';

export default function RootLayout({ children }) {

    return (
        <AuthProvider>
            <html lang="en">
                <head>
                    <script
                        id="jira-service-desk-widget"
                        data-jsd-embedded data-key="1b3385f6-3fa9-43d0-8209-b36bcd93b5fd"
                        data-base-url="https://jsd-widget.atlassian.com"
                        src="https://jsd-widget.atlassian.com/assets/embed.js"
                    ></script>

                </head>
                <body className={`${roboto.variable} font-sans absolute bottom-0 right-0 h-screen max-h-screen overflow-hidden top-20 lg:left-20 left-0`}>
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
