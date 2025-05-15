import React from 'react'
import AnimationWrapper from '../common/page-animation'
import { Link } from 'react-router-dom'
import InPageNavigation from '../components/InPageNavigation'

const Homepage = () => {
  return (
    <AnimationWrapper keyValue="homepage">
      <div className="mt-4 flex flex-col gap-4">
        {/* 1. BREADCRUMB */}
        <div className="flex gap-4">
          <Link to="/">Home</Link>
          <span className='font-bold'>•</span>
          <span className='text-cyan-600'>Blogs and Articles</span>
        </div>
      </div>

      {/* 2. INTRODUCTION */}
      <section className='py-14'>
        <div className="container mx-auto px-4 text-center">
          <h1 className='text-9xl font-semibold bg-gradient-to-r from-pink-600 to-cyan-600 bg-clip-text text-transparent'>Post Write</h1>
          <p className='text-3xl'>A place to share your thoughts.</p>
        </div>
      </section>

      {/* 3. Filter Tabs */}
      {/* 3.1) Latest blog and Trending */}
      <div className="w-full">
        <InPageNavigation routes={["home", "trending"]} defaultHidden={["trending"]}></InPageNavigation>
      </div>
      {/* FEATURE POST */}
      {/* POST LIST */}
      {/* load more post..ไม่แน่ใจว่าควรอยู่ในนี้ไหม*/}


    </AnimationWrapper>

  )
}

export default Homepage