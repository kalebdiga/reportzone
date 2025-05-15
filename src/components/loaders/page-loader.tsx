'use client'

import PuffLoader from 'react-spinners/PuffLoader'

const PageLoader = () => {
  return (
    <div className='flex min-h-screen flex-col items-center pt-[10%] '>
      <PuffLoader color={'#675cd8'} size={100} loading={true} aria-label='Loading Spinner' data-testid='loader' />
    </div>
  )
}

export default PageLoader
