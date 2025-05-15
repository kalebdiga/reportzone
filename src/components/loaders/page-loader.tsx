'use client'
import Image from 'next/image'
import ClipLoader from 'react-spinners/ClipLoader'
import PuffLoader from 'react-spinners/PuffLoader'

const PageLoader = () => {
  return (
    <div className='flex min-h-screen flex-col items-center pt-[10%] '>
      {/* <Image src={'./ss'} w alt='Ethio Minerals Logo' priority className='h-16 object-contain' /> */}
      {/* <ClipLoader color={'#033373'} loading={true} aria-label='Loading Spinner' data-testid='loader' /> */}
      <PuffLoader color={'#033373'} loading={true} aria-label='Loading Spinner' data-testid='loader' />
    </div>
  )
}

export default PageLoader
