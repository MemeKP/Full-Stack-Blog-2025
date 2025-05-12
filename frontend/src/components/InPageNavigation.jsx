import React from 'react'
import { useState, useRef } from 'react'

const InPageNavigation = ({ routes }) => {
  
  let [ inPageNavIndex, setinPageNavIndex ] = useState(0);

  return (
    <>
      <div className='relative border-b border-gray-200 flex flex-nowrap overflow-x-auto'>
        {
          routes.map((route, i)=>{
            return (
              <button key={i} className='p-4 px-5 capitalize'>
                {/* In jsx is the variable so it should be in {} 
                  Active route = the first element of the root to be active
                  and the first element in array is "home", So home will be the active route.
                */}
                { route } 
              </button>
            )
          })
        }
      </div>
    </>
  )
}

export default InPageNavigation