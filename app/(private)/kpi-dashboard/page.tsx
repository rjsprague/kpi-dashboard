"use client"
import KpiDashboard from '../../components/KpiDashboard'
import withAuth from '../../lib/withAuth'
import LoadingQuotes from '../../components/LoadingQuotes'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { setSpaceId } from '../../GlobalRedux/Features/client/clientSlice'
import { useDispatch } from 'react-redux';
import useAuth from '@/hooks/useAuth';

function KpiDashboardPage() {   
    const { user, loading, logout } = useAuth();    
    const router = useRouter()
    const dispatch = useDispatch();

    useEffect(() => {
        if (!user && !loading) {
            logout();
        }
        if (user && user.settings.podio.spacesID === 8108305) {
            dispatch(setSpaceId(Number(process.env.NEXT_PUBLIC_ACQUISITIONS_SPACEID)))
        } else if (user && user.isAdmin === true && user.settings.podio.spacesID === 0) {
            dispatch(setSpaceId(Number(process.env.NEXT_PUBLIC_ACQUISITIONS_SPACEID)))
        } else if (user) {
            // console.log(user.settings.podio.spacesID)
            dispatch(setSpaceId(user.settings.podio.spacesID))
        }
        if (user && user.settings && !user.settings.timezone && user.settings.podio.userID !== 0) {
            router.push('/user-profile')
        }
    }, [user, loading])

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

