import { motion } from "framer-motion"

const AnimationWrapper = ({children, keyValue, 
  initial = {opacity: 0},
  animate = {opacity: 1},
  transition = {opacity: 1}
}) => {
  return(
    <motion.div
      key={keyValue}
      initial={initial}
      animate={animate}
      transition={transition}
    >
      {children}
    </motion.div>
  )
}
export default AnimationWrapper