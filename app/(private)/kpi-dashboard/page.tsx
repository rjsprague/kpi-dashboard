"use client"
import KpiDashboard from '../../components/KpiDashboard'
import withAuth from '../../lib/withAuth'
import LoadingQuotes from '../../components/LoadingQuotes'
import { Suspense, useEffect, useState } from 'react'
import useSWR from 'swr'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { setSpaceId } from '../../GlobalRedux/Features/client/clientSlice'
import { useDispatch } from 'react-redux';

function KpiDashboardPage() {
    const { data: user, error: userError } = useSWR('/auth/getUser')
    // console.log(user)
    const router = useRouter()
    const dispatch = useDispatch();

    useEffect(() => {
        if (userError) {
            router.push('/login')
        }
        if (user && user.isAdmin === true && user.settings.podio.spacesID === 0) {
            dispatch(setSpaceId(Number(process.env.NEXT_PUBLIC_ACQUISITIONS_SPACEID)))
        } else if (user) {
            dispatch(setSpaceId(user.settings.podio.spacesID))
        }
        if (user && user.settings && !user.settings.timezone) {
            if (!toast.isActive('timezone-not-set')) {
                toast.info('Please set your timezone in settings to see your KPIs', {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 10000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    toastId: 'timezone-not-set'
                })
            }
            router.push('/user-profile')
        }
    }, [user])

    return (
        <>
            {!user ?
                (
                    <div className="flex items-center justify-center w-full h-full">
                        <LoadingQuotes mode={"dark"} />
                    </div>
                )
                :
                <KpiDashboard isAdmin={user.isAdmin} />}
        </>
    )
}

export default withAuth(KpiDashboardPage)

