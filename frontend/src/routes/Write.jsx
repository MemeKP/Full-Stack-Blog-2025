import { useEffect, useState } from 'react'
import PageEditor from '../components/Editor/PageEditor'
import AnimationWrapper from '../common/page-animation'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useAuth } from '../context/authContext/userAuthContext'
import { useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';

const Write = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { userLoggedIn, getFirebaseToken } = useAuth();
  const [isPublished, setIsPublished] = useState(false);
  const navigate = useNavigate();
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('general');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  // Redirect if not logged in
  useEffect(() => {
    if (!userLoggedIn) {
      navigate('/login')
    }
  }, [userLoggedIn, navigate])

  const handlePublish = (isPublished) => (e) => {
    e.preventDefault();
    setIsPublished(isPublished);
    const formData = new FormData();

    const data = {
      title: formData.get('title'),
      desc: formData.get('category'),
      tags: formData.get('tags'),
      content: content,
    }
    /* Send to backend */
    // mutation.mutate({
    //   title,
    //   content,
    //   // isPublishedAt: published,
    //   desc,
    //   category,
    //   tags,
    // // เพิ่ม field อื่น เช่น banner, tags, slug ฯลฯ
    // })

    console.log(data)
  }

  const mutation = useMutation({
    mutationFn: async (newPosts) => {
      const token = await getFirebaseToken();
      return axios.post('/posts', newPosts, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
    },
    onSuccess: () => {
      console.log('Post published!')
      toast.success(isPublished ? 'Post Published!' : 'Draft Saved!');
      // navigate("/your-posts") 
    },
    onError: (error) => {
      console.error('Error publishing:', error)
      toast.error(`Something went wrong: ${error.message}`)
    }
  })

  return (
    <AnimationWrapper>
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 min-h-screen">
        {/* TITLE */}
        <input
          type="text"
          value={title}
          placeholder="Title"
          onChange={e => setTitle(e.target.value)}
          className="w-full text-4xl sm:text-5xl font-bold font-serif placeholder-gray-400 focus:outline-none bg-transparent"
        />

        {/* SHORT DESCRIPTION */}
        <textarea 
          type='text'
          value={desc}
          placeholder='Write Short description'
          maxLength={200}
          onChange={e => setDesc(e.target.value)}
          className='w-full mt-2 bg-inherit rounded-xl p-4 text-lg text-center placeholder-gray-400 focus:outline-none bg-white shadow-md'
        />

        {/* CATEGORY SELECT */}
        <div className='mt-4'>
          <label 
            className='block mb-1 text-gray-700 font-medium'
          >
            Category
          </label>
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className='border border-gray-300 rounded-xl px-3 py-1 text-base bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400'
          >
            <option value="general">General</option>
            <option value="technology">Technology</option>
            <option value="lifestlye">Lifestlye</option>
            <option value="education">Education</option>
            <option value="travel">Travel</option>
          </select>
        </div>

        {/* TAGS INPUT  */}
        <div className='mt-4'>
          <label className="block mb-1 text-gray-700 font-medium">Tags</label>
          <div className='flex items-center gap-2 flex-wrap'>
            {tags.map((tag, i) => (
              <span
                key={i}
                className='bg-cyan-100 text-cyan-700 rounded-full px-3 py-1 text-base flex items-center gap-2'
              >
                {tag}
                <button
                  onClick={() => setTags(tags.filter((_, i) => i !== i))}
                  className='text-cyan-700 hover:text-red-500'
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
          <input 
            type="text" 
            value={tagInput}
            onChange={(e)=> setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && tagInput.trim() !== '') {
                e.preventDefault();
                if (!tags.includes(tagInput.trim())) {
                  setTags([...tags, tagInput.trim()]);
                }
                setTagInput('');
              }
            }}
            placeholder='Press Enter to add tag'
            className='w-full mt-2 border border-gray-300 rounded-xl px-3 py-1 text-base focus:outline-none focus:ring-1 focus:ring-cyan-400'
          />
        </div>

        {/* RICH TEXT EDITOR */}
        <div className="min-h-[300px]">
          <PageEditor content={content} onChange={setContent} />
        </div>
      </main>

        {/* PUBLISH & SAVE */}
      <div className="sticky bottom-4 flex justify-end max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={handlePublish(true)}
          className="bg-cyan-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-cyan-600 transition-all duration-150"
        >
          Publish
        </button>
        <button
          className=''
          onClick={handlePublish(false)}
        >
          Save Draft
        </button>
      </div>
    </AnimationWrapper>
  )
}

export default Write
