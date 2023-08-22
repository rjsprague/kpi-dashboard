"use client"
import KpiDashboard from '../../components/KpiDashboard'
import withAuth from '../../lib/withAuth'
import LoadingQuotes from '../../components/LoadingQuotes'
import { Suspense, useEffect, useState } from 'react'
import useSWR from 'swr'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

function KpiDashboardPage() {
    const { data: user, error: userError } = useSWR('/auth/getUser')
    const router = useRouter()

    useEffect(() => {
        if (user && user.settings && user.settings.timezone == '' && !toast.isActive('timezone-not-set')) {
            toast.info('Please set your timezone in settings to see your KPIs', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 10000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                toastId: 'timezone-not-set'
            })
            router.push('/user-profile')
        }
    }, [user])

    return (
        <KpiDashboard />
    )
}

export default withAuth(KpiDashboardPage)

