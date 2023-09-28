"use client"
import { useState, useEffect } from 'react'
import NavigationBar from '@/components/NavigationBar'
import MyIframe from '@/components/MyIframe'
import Script from 'next/script';
import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((res) => res.json())

export default function CallScriptsPage() {
    const [script, setScript] = useState([])
    const [isScaling, setIsScaling] = useState(false);
    const [isProfessional, setIsProfessional] = useState(false);
    const [isStarter, setIsStarter] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [clientFolderID, setClientFolderID] = useState('');


    const callScripts = ['Triage Call', 'Perfect Presentation']

    const { data: user, error: userError } = useSWR('/auth/getUser', fetcher)

    useEffect(() => {
        if (user && user.isScaling) {
            setClientFolderID(user.settings.google.rootFolderID)
            setIsScaling(true);
        } else if (user && user.isProfessional) {
            setClientFolderID(user.settings.google.propertyFolderID);
            setIsProfessional(true);
        } else if (user && user.isStarter) {
            setIsStarter(true);
        }

        if (user && user.isAdmin) {
            setIsAdmin(true);
        }
    }, [user])

    if (!user || !clientFolderID && user && !user.isAdmin) return <div>Loading...</div>
    if (userError) return <div>Failed to load</div>

    const handleScriptChange = (script) => {
        setScript(script)
    }

    const renderScriptsSection = () => {
        switch (script) {
            case 'Triage Call':
                return (
                    <MyIframe
                        src={`https://scripts.reiautomated.io/callscripts/triagecall/?clientFolderID=${clientFolderID}&user=${user.email}`}
                        title="Triage Call"
                    />
                )
            case 'Perfect Presentation':
                return (
                    <MyIframe
                        src={`https://scripts.reiautomated.io/callscripts/perfectpresentation/?clientFolderID=${clientFolderID}&user=${user.email}`}
                        title="Perfect Presentation"
                    />
                )
            default:
                return (
                    <MyIframe
                        src={`https://scripts.reiautomated.io/callscripts/triagecall/?clientFolderID=${clientFolderID}&user=${user.email}`}
                        title="Triage Call"
                    />
                )
        }
    }

    return (
        <div className="absolute left-0 right-0 flex flex-col h-full pb-20 top-20 max-w-screen lg:left-20">
            <Script src="//scripts.reiautomated.io/wp-content/plugins/gravity-forms-iframe-master/assets/scripts/gfembed.min.js"></Script>
            <NavigationBar items={callScripts} onItemChange={handleScriptChange} initialActiveItem={callScripts[0]} />
            <div className="flex flex-col h-full px-3 pt-2 pb-2 overflow-y-auto">
                {renderScriptsSection()}
            </div>
        </div>

    )
}