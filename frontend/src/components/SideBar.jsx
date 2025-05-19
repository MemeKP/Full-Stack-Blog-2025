import { Link } from "react-router-dom"

const SideBar = () => {

    const trending_mock_post = [
        { title: 'How AI is changing Everything' , author: 'John Doe' },
        { title: '10 CSS Tricks You Should Know' , author: 'Jane Smith' },
        { title: 'Designing for Accessibility' , author: 'Noon West' },
        { title: 'Can AI see Beauty' , author: 'Bow Reen' },

    ]

  return (
   
    <div className='min-w-[40%] lg:min-w-[400px] max-w-min border-l border-gray-200 pl-8 pt-3 max-md:hidden'>
        {/* RECOMMENDED */}
        <div className='flex flex-col gap-5'>
          <h1 className='font-bold text-lg'>Recommended topics</h1>
          <div className="flex flex-wrap gap-2">
            <span className="cursor-pointer bg-gray-200 px-3 py-3 rounded-full text-sm font-medium">Technology</span>
            <span className="cursor-pointer bg-gray-200 px-3 py-3 rounded-full text-sm font-medium">Web Dev</span>
            <span className="cursor-pointer bg-gray-200 px-3 py-3 rounded-full text-sm font-medium">AI</span>
            <span className="cursor-pointer bg-gray-200 px-3 py-3 rounded-full text-sm font-medium">Economics</span>
            <span className="cursor-pointer bg-gray-200 px-3 py-3 rounded-full text-sm font-medium">Programming</span>
          </div>
        </div>
        {/* TRENDING */}
        <div className="flex flex-col mt-10 gap-5 bg-gray-100 p-3 rounded-lg">
            <h1 className="font-bold text-lg mb-2">Trending</h1>
            <div className="flex flex-col divide-y divide-gray-400">
                {trending_mock_post.map((post, i) => (
                <div key={i} className="flex gap-4 py-4">
                    <div className="text-4xl font-bold w-20">
                        {String(i + 1).padStart(2 , '0')}
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
                ))}
            </div>
           
        </div>
    </div>
  )
}

export default SideBar