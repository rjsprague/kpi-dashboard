"use client"
import { useEffect, useState } from 'react'
import NavigationBar from '@/components/NavigationBar'
import MyIframe from '@/components/MyIframe'
import Script from 'next/script';
import useAuth from '@/hooks/useAuth';
import withAuth from '@/lib/withAuth';
import EllipsisLoader from '@/components/EllipsisLoader';


function CallScriptsPage() {
    const { user, loading, logout } = useAuth();
    const [script, setScript] = useState('Triage Call');
    const [clientFolderID, setClientFolderID] = useState('');

    const callScripts = ['Triage Call', 'Perfect Presentation', 'Post-Contract']

    useEffect(() => {
        if (user && user.isScaling) {
            setClientFolderID(user.settings.google.rootFolderID);
        } else if (user && user.isProfessional) {
            setClientFolderID(user.settings.google.propertyFolderID);
        }

        if (!user && !loading) {
            logout(); // If the user is not logged in, log them out
        }
    }, [user, loading]);

    const handleScriptChange = (script) => {
        setScript(script)
    }
    const renderScriptsSection = () => {
        if (!user) {
            return <EllipsisLoader />;
        }
        let srcBase = '';
        if (script === 'Triage Call' || script === 'Perfect Presentation') {
            srcBase = `https://scripts.reiautomated.io/callscripts/${script.toLowerCase().replace(' ', '')}/?clientFolderID=${clientFolderID}&user=${user.email}`;
        } else if (script === 'Post-Contract') {
            srcBase = `https://scripts.reiautomated.io/callscripts/${script.toLowerCase()}/`;
        }
        return <MyIframe src={srcBase} title={script} />;
    }

    return (
        <div className="absolute left-0 right-0 flex flex-col h-full pb-20 top-20 max-w-screen lg:left-20">
            <Script src="//scripts.reiautomated.io/wp-content/plugins/gravity-forms-iframe-master/assets/scripts/gfembed.min.js"></Script>
            <NavigationBar items={callScripts} onItemChange={handleScriptChange} initialActiveItem={script} />
            <div className="flex flex-col h-full px-3 pt-2 pb-2 overflow-y-auto">
                {renderScriptsSection()}
            </div>
        </div>
    )
}

export default withAuth(CallScriptsPage)
