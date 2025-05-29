import React, { useState } from 'react'
import PostList from '../components/PostList'
import SideBar from '../components/SideBar'

const PostListPage = () => {

  const [open, setOpen] = useState(false);


  return (
    <div className='max-w-7xl mx-auto px-3 lg:grid-cols-2 gap-8'>
      <h1 className='mb-8 text-2xl'>Development Blog</h1>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className='border-b px-4 py-2 mb-4 md:hidden'
      >
        {open ? 'Close' : 'Filter or Search'}
      </button>
      <div className='flex flex-col-reverse gap-8 md:flex-row'>
        <div className=''>
          <PostList />
        </div>
        <div>
          <SideBar />
        </div>
      </div>
    </div>
  )
}

export default PostListPage