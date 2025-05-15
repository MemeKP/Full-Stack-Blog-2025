import React, { useEffect } from 'react'
import { useState, useRef } from 'react'

const InPageNavigation = ({ routes, defaultHidden = [], defaultActiveIndex = 0 }) => {

  let activeTabLineRef = useRef();
  let [inPageNavIndex, setinPageNavIndex] = useState(defaultActiveIndex);
  let activeTabRef = useRef();

  const changePageState = (btn, i) => {
    console.log(btn, i);
    let { offsetWidth, offsetLeft } = btn;

    activeTabLineRef.current.style.width = offsetWidth + "px";
    activeTabLineRef.current.style.left = offsetLeft + "px";

    //เป็นการอัพเดต index ว่าตอนนี้เราอยู่ที่หน้าไหน ถ้าไม่มีตรงนี้เวลาคลิกหน้านั้นๆแล้วตัวหนังสือจะไม่เปลี่ยนเป็นสีดำตาม condition ที่เราตั้งไว้
    setinPageNavIndex(i);
  }

  /*ใช้ useEffect hook ให้มัน run it self after rerending เพื่อให้ทุกครั้งที่รีหน้า page ใหม่แล้วยังมีเส้น hr สีดำอยู่ (คล้ายๆกับทำให้มันเป็นactive)
  * เพราะในตอนแรก function นี้จะทำงานเมื่อเราคลิกเท่านั้น ยังไม่ได้เป็น default 
  */
  useEffect(() => {
    changePageState( activeTabRef.current, defaultActiveIndex); //we have to call this function when we render it for one time
  }, [])


  return (
    <>
      <div className='relative border-b border-gray-200 flex flex-nowrap overflow-x-auto'>
        {
          routes.map((route, i) => {
            return (
              /* In jsx is the variable so it should be in {} 
                  Active route = the first element of the root to be active
                  and the first element in array is "home", So home will be the active route.
                */
              <button
                ref={i == defaultActiveIndex ? activeTabRef : null}
                key={i}
                className={'p-4 px-5 font-medium capitalize ' + (inPageNavIndex == i ? 'text-black' : 'text-gray-500')
                  + (defaultHidden.includes(route) ? " md:hidden" : "") // checking if the root is inside the defaultHidden or not. (return value: true/false)
                }
                onClick={(e) => { changePageState(e.target, i) }}
              >

                {route}
              </button>
            )
          })
        }
        <hr ref={activeTabLineRef} className='absolute border-black bottom-0 duration-300' />
      </div>
    </>
  )
}

export default InPageNavigation