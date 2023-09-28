"use client"
import KpiDashboard from '../../components/KpiDashboard'
import withAuth from '../../lib/withAuth'
import LoadingQuotes from '../../components/LoadingQuotes'
import { useEffect } from 'react'
import useSWR from 'swr'
import { useRouter } from 'next/navigation'
import { setSpaceId } from '../../GlobalRedux/Features/client/clientSlice'
import { useDispatch } from 'react-redux';

function KpiDashboardPage() {
    const { data: user, error: userError } = useSWR('/auth/getUser')
    console.log(user)
    const router = useRouter()
    const dispatch = useDispatch();

    useEffect(() => {
        if (userError) {
            router.push('/login')
        }
        if (user && user.settings.podio.spacesID === 8108305) {
            dispatch(setSpaceId(Number(process.env.NEXT_PUBLIC_ACQUISITIONS_SPACEID)))
        } else if (user && user.isAdmin === true && user.settings.podio.spacesID === 0) {
            dispatch(setSpaceId(Number(process.env.NEXT_PUBLIC_ACQUISITIONS_SPACEID)))
        } else if (user) {
            dispatch(setSpaceId(user.settings.podio.spacesID))
        }
        if (user && user.settings && !user.settings.timezone && user.settings.podio.userID !== 0) {
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
                <KpiDashboard user={user} />}
        </>
    )
}

export default withAuth(KpiDashboardPage)

