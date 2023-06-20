"use client"
import withAuth from '../lib/withAuth'

function Home() {

  return (
    <>
      <main>
        <h1>HOME</h1>
      </main>
    </>
  )
}

export default withAuth(Home)