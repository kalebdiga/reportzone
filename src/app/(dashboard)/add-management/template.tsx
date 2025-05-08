import Tabs from '@/views/admanagement/Tabs'

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className='my-[3%]'>
        <Tabs />
      </div>

      {children}
    </>
  )
}
