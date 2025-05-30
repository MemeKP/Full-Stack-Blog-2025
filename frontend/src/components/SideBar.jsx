import { Link } from "react-router-dom"
import { GoArrowRight } from "react-icons/go";
import { recommend_topic } from "../config/category";
import { useState } from "react";

const SideBar = ({ pageState, loadBlogByCategory }) => {

    const trending_mock_post = [
        { title: 'How AI is changing Everything', author: 'John Doe' },
        { title: '10 CSS Tricks You Should Know', author: 'Jane Smith' },
        { title: 'Designing for Accessibility', author: 'Noon West' },
        { title: 'Can AI see Beauty', author: 'Bow Reen' },

    ]

    const handleClick = (e) => {
        const category = e.target.innerText.toLowerCase();
        loadBlogByCategory(category)
    };

    return (

        <div className='min-w-[40%] lg:min-w-[400px] max-w-min border-l border-gray-200 pl-8 pt-3 max-md:hidden'>
            {/* RECOMMENDED */}
            <div className='flex flex-col gap-5'>
                <h1 className='font-bold text-lg'>Recommended topics</h1>
                <div className="flex flex-wrap gap-2">
                    {
                        recommend_topic.map((topic, i) => (
                            <button
                                onClick={handleClick}
                                className={`tag px-3 py-3 rounded-full text-sm font-medium transition-colors duration-200
                                            ${pageState === topic.toLowerCase()
                                        ? 'bg-cyan-500 text-white'
                                        : 'bg-gray-200 hover:bg-gray-300'}`}
                                key={i}
                            >
                                {topic}
                            </button>

                        ))
                    }
                </div>
            </div>
            {/* TRENDING */}
            <div className="flex flex-col mt-10 gap-5 bg-gray-100 p-3 rounded-lg">
                <h1 className="font-bold text-lg mb-2">Trending</h1>

                <div className="flex flex-col divide-y divide-gray-400">
                    {trending_mock_post.map((post, i) => (
                        <div key={i} className="flex justify-between items-center py-4">
                            <div className="flex gap-3">
                                <div className="text-4xl font-bold w-20">
                                    {String(i + 1).padStart(2, '0')}
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-700 hover:underline cursor-pointer">
                                        {post.title}
                                    </span>
                                    <span className="text-sm text-gray-500"> by
                                        <Link to={'/test'} className="cursor-pointer"> {post.author}</Link>
                                    </span>
                                </div>
                            </div>

                            <GoArrowRight className="text-xl" />

                        </div>
                    ))}
                </div>

            </div>


        </div>
    )
}

export default SideBar