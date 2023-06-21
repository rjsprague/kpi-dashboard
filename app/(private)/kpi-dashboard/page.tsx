"use client"
import KpiDashboard from '../../components/KpiDashboard'
import withAuth from '../../lib/withAuth'
import LoadingQuotes from '../../components/LoadingQuotes'
import { Suspense, useEffect, useState } from 'react'

function KpiDashboardPage() {
    // const [loading, setLoading] = useState(true);
    // useEffect(() => {
    //     const timer = setTimeout(() => setLoading(false), 1500);
    //     return () => clearTimeout(timer);
    //   }, []);

    // if (loading) {
    //     return <LoadingQuotes mode={'dark'} />
    // }

    return (
        <Suspense fallback={<LoadingQuotes mode={'dark'} />}>
            <KpiDashboard />
        </Suspense>
    )
}

export default withAuth(KpiDashboardPage)

