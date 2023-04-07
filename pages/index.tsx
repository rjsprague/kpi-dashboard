import Head from 'next/head'
import TopNav from '../components/TopNav'
import SideNav from '../components/SideNav'
import Login from '../components/Login'
import KpiDashboard from '../components/KpiDashboard'


export default function Home() {
  return (
    <div>

      <Head>
        <title>REI Automated Test App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className='relative flex flex-col w-full gap-0'>
        <SideNav />
        <div className='absolute left-0 right-0 flex flex-col lg:left-72'>
          <TopNav />
          <KpiDashboard />
        </div>
      </main>
      
      <footer>
      </footer>

    </div>
  )
}
