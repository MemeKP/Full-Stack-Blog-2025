import React from 'react'
import Login from '../components/auth/Login'
import AnimationWrapper from '../common/page-animation'

const LoginPage = () => {
  return (
    <div>
      <AnimationWrapper
        keyValue="login"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Login />
      </AnimationWrapper>

    </div>
  )
}

export default LoginPage