// app/layout.tsx
import '../globals.css'
import { AuthProvider } from '../context/AuthProvider';
import SideNav from '../components/SideNav'
import Header from '../components/Header'
import { ReduxProvider } from '../GlobalRedux/provider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Script from 'next/script';
import Head from 'next/head';

export const fetchCache = 'force-no-store';

export default function RootLayout({ children }) {

    return (
        <AuthProvider>
            <head>
                <script
                    id="jira-service-desk-widget"
                    data-jsd-embedded data-key="1b3385f6-3fa9-43d0-8209-b36bcd93b5fd"
                    data-base-url="https://jsd-widget.atlassian.com"
                    src="https://jsd-widget.atlassian.com/assets/embed.js"
                    ></script>
            </head>
            <html lang="en">
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
                <Script src="//scripts.reiautomated.io/wp-content/plugins/gravity-forms-iframe-master/assets/scripts/gfembed.min.js"></Script>

            </html>
        </AuthProvider>
    )
}
