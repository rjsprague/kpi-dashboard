"use client"
import KpiDashboard from '../../components/KpiDashboard'
import withAuth from '../../lib/withAuth'
import LoadingQuotes from '../../components/LoadingQuotes'
import { Suspense, useEffect, useState } from 'react'

function KpiDashboardPage() {
  
    return (
        <KpiDashboard />
    )
}

export default withAuth(KpiDashboardPage)

