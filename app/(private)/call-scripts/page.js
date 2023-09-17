"use client"
import { useState } from 'react'
import NavigationBar from '@/components/NavigationBar'
import MyIframe from '@/components/MyIframe'
import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((res) => res.json())

export default function CallScriptsPage() {
    const [script, setScript] = useState([])

    const callScripts = ['Triage Call', 'Perfect Presentation']

    const { data: userData, error: userError } = useSWR('/auth/getUser', fetcher)
    
    if (!userData) return <div>Loading...</div>
    if (userError) return <div>Failed to load</div>

    const clientFolderID = userData?.settings?.google?.driveID && userData.settings.google.driveID;    
    
    const handleScriptChange = (script) => {
        setScript(script)
    }

    const renderScriptsSection = () => {
        switch (script) {
            case 'Triage Call':
                return (
                    <MyIframe
                    src={`https://scripts.reiautomated.io/callscripts/triagecall/?clientFolderID=${clientFolderID}`}
                    title="Triage Call"
                    />
                )
            case 'Perfect Presentation':
                return (
                    <MyIframe
                    src={`https://scripts.reiautomated.io/callscripts/perfectpresentation/?clientFolderID=${clientFolderID}`}
                    title="Perfect Presentation"
                    />
                )
            default:
                return (
                    <MyIframe
                    src={`https://scripts.reiautomated.io/callscripts/triagecall/?clientFolderID=${clientFolderID}`}
                    title="Triage Call"
                    />
                )
        }
    }

    return (
        <div className="absolute left-0 right-0 flex flex-col h-full pb-20 top-20 max-w-screen lg:left-20">
            <NavigationBar items={callScripts} onItemChange={handleScriptChange} initialActiveItem={callScripts[0]} />
            <div className="flex flex-col h-full px-3 pt-2 pb-2 overflow-y-auto">
                {renderScriptsSection()}
            </div>
        </div>
    )
}