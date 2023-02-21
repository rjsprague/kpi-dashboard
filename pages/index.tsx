import Head from 'next/head'
import { InferGetServerSidePropsType } from 'next'
import KpiDashboard from '../components/KpiDashboard'
import TopNav from '../components/TopNav'
import SideNav from '../components/SideNav'
import Login from '../components/Login'


export default function Home() {
  return (
    <div>

      <Head>
        <title>REI Automated Test App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className='flex lg:flex-row flex-col gap-0 w-fit'>
        <SideNav />
        <div className='flex flex-col'>
          <TopNav />
          <KpiDashboard />
        </div>
      </main>
      
      <footer>
      </footer>

    </div>
  )
}
