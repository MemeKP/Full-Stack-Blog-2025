import { motion } from 'framer-motion'
import IKImageWrapper from '../components/IKImageWrapper'

const About = () => {
  return (
    <section className="relative flex items-center justify-center min-h-screen py-20 px-6 sm:px-10 md:px-20 ">
      <motion.div
        className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 max-w-7xl w-full items-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* LEFT SIDE */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex justify-center md:justify-end"
        >
          <div className="w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 flex items-center justify-center drop-shadow-2xl">
            <IKImageWrapper
              src="https://ik.imagekit.io/496kiwiBird/Black%20and%20White%20Minimalist%20Cat%20Logo%20(2)%201.png?updatedAt=1762681951796"
              className="object-contain w-full h-full rounded-2xl"
            />
          </div>
        </motion.div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col justify-center text-gray-800 px-2 sm:px-4 md:px-0">
          <div className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-pink-500/80 mb-1">
            a bit
          </div>
          <h2 className="font-bold text-3xl sm:text-5xl md:text-6xl bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent leading-tight mb-4">
            About Me
          </h2>
          <p className="text-gray-700/90 leading-relaxed text-base sm:text-lg md:text-xl max-w-lg">
            This website is a personal full-stack project I developed to enhance my skills and explore modern web technologies. 
            It features a blogging platform with post creation, commenting, liking, bookmarking, and social sharing. 
            <br /><br />
            I built this project in my free time as a way to upskill and challenge myself to create something meaningful and functional.
          </p>
        </div>
      </motion.div>
    </section>
  )
}

export default About
