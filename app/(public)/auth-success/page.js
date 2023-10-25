"use client"
import { useEffect } from 'react';
import Image from 'next/image';

const AuthSuccess = () => {
  useEffect(() => {
    window.opener.postMessage({ type: 'PODIO_AUTH_SUCCESS' }, process.env.NEXT_PUBLIC_BASE_URL);
    window.close();
  }, []);

  return (
    <div className='flex items-center justify-center w-screen h-screen'>
      <Image src="/podio.svg" width={100} height={100} alt="Podio Logo" />
    </div>
  );
};

export default AuthSuccess;
