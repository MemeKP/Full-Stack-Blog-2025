import React from 'react'
import { Link } from 'react-router-dom'
import IKImageWrapper from './IKImageWrapper';

const MinimalPost = ({ blog, index }) => {

    let { title, discription, blogId: id, author: { personalInfo: { fullname, username, profileImg } }, publishedAt } = blog;

    return (
        <Link to={`/blog/${id}`} className='flex gap-5 mb-4'>
            <div className='blog-flex justify-between items-center py-4'>
                <h1 className='text-5xl font-bold w-20 text-gray-300'>
                    {index < 10 ? '0' + (index + 1) : index}
                </h1>
            </div>

            <div>
                {/* TITLE */}
                <h1 className='blog-title'>{title}</h1>

                {/* DISCRIPTION */}
                <p>{discription}</p>

                {/* AUTHOR & DATE */}
                <div className='flex gap-2 items-center mb-7'>
                    <div className="flex items-center gap-4">
                        <IKImageWrapper
                            src={profileImg}
                            w='40'
                            className='w-10 h-10 rounded-full object-cover'
                        />
                    </div>

                </div>
            </div>
        </Link>
    )
}

export default MinimalPost