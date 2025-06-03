import React from 'react'
import { Link } from 'react-router-dom'
import IKImageWrapper from './IKImageWrapper';

const MinimalPost = ({ blog, index }) => {

    let { title, discription, blogId: id, author: { personalInfo: { fullname, username, profileImg } }, date } = blog;

    return (
        <Link to={`/blog/${id}`} className='flex gap-5 mb-4'>
            <div className='flex justify-between items-center py-4'>
                <div className='flex'>
                    <h1 className='text-5xl font-bold w-20 text-gray-300'>
                        {index < 10 ? '0' + (index + 1) : index}
                    </h1>
                </div>


                <div>
                    {/* TITLE */}
                    <h1 className='blog-title text-2xl font-semibold line-clamp-1'>{title}</h1>

                    {/* DISCRIPTION */}
                    <p className='leading-snug line-clamp-4'>{discription}</p>

                    {/* AUTHOR */}
                    <div className="items-center gap-4 flex ">
                        <IKImageWrapper
                            src={profileImg}
                            w='40'
                            className='w-10 h-10  rounded-full object-cover'
                        />
                        <div className='py-2 text-sm'>
                            <Link to='/profile' className="font-medium hover:underline">
                            {username}
                        </Link>
                        <div className="font-light text-gray-500">{date}</div>
                        </div>
                        
                    </div>

                </div>
            </div>


        </Link>
    )
}

export default MinimalPost