import { motion } from 'framer-motion'

const ThreeDotLoader = () => {
  return (
    <div className='flex space-x-2'>
      {[0, 1, 2].map(index => (
        <motion.span
          key={index}
          className='w-3 h-3 bg-blue-500 rounded-full'
          animate={{
            opacity: [0.3, 1, 0.3],
            y: [-3, 3, -3]
          }}
          transition={{
            repeat: Infinity,
            duration: 1,
            delay: index * 0.2,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  )
}

export default ThreeDotLoader
