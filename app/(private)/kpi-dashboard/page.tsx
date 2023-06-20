"use client"
import KpiDashboard from '../../components/KpiDashboard'
import withAuth from '../../lib/withAuth'

function KpiDashboardPage() {
    return (
            <KpiDashboard />
    )
}

export default withAuth(KpiDashboardPage)