"use client"
import LoadingQuotes from "../components/LoadingQuotes"

const Loading = () => {
    return (
      <div className='flex items-center justify-center w-full h-full mx-8 my-6'>
        <LoadingQuotes mode={"dark"} />
      </div>
    )
  }
  
  export default Loading