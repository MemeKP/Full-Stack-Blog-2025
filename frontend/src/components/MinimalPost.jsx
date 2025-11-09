import React from 'react'
import { Link } from 'react-router-dom'
import IKImageWrapper from './IKImageWrapper';

const MinimalPost = ({ blog, index }) => {
    let {
        title,
        desc,
        blog_id: id,
        author,
        publishedAt
    } = blog;

    console.log('Full blog data:', blog);
    console.log('Author data:', author);
    console.log('Author structure:', {
        username: author?.username,
        profile_img: author?.profile_img,
        uid: author?.uid,
        fullObject: author
    });

    const { username, profile_img, uid } = author;
  
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <Link to={`/${id}`} className='flex gap-5 mb-4'>
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
                    <p className='leading-snug line-clamp-4'>{desc}</p>

                    {/* AUTHOR */}
                    <div className="items-center gap-4 flex ">
                        <IKImageWrapper
                            src={profile_img}
                            className='w-10 h-10  rounded-full object-cover'
                        />
                        <div className='py-2 text-sm'>
                            <Link to='/profile' className="font-medium hover:underline">
                                {username}
                            </Link>
                            <div className="font-light text-gray-500">{formatDate(publishedAt)}</div>
                        </div>
                    </div>

                </div>
            </div>
        </Link>
    )
}

export default MinimalPost