import Head from 'next/head'
import { InferGetServerSidePropsType } from 'next'
import KpiDashboard from '../components/KpiDashboard-test'
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

      <main className='flex flex-col w-full gap-0 lg:flex-row'>
        <SideNav />
        <div className='flex flex-col sm:w-full w-fit'>
          <TopNav />
          <KpiDashboard />
        </div>
      </main>
      
      <footer>
      </footer>

    </div>
  )
}
