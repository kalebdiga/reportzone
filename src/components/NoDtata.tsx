import Image from 'next/image'
import Nofile from './../../public/images/avatars/Nofile1.jpg'
function Nodatafound() {
  return (
    <div className='border-b border-gray-200 dark:text-[black] dark:border-white bg-divansparent dark:bg-secondary bg-white  h-fit w-[100%]'>
      <div className=''>
        <div className=' inset-0 flex items-center mt-5 justify-center'>
          <div className='text-center'>
            <Image src={Nofile} alt='No Data Found' width={300} height={300} />
            <p className=' h-[48px] mx-auto text-[1.2rem] text-[#060691] font-[600]'>No Data Found </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Nodatafound
