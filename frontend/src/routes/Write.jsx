import { useEffect, useState } from 'react'
import PageEditor from '../components/Editor/PageEditor'
import AnimationWrapper from '../common/page-animation'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useAuth } from '../context/authContext/userAuthContext'
import { useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';
import { generateSlug } from '../utils/slugUtils'

const Write = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { userLoggedIn, getFirebaseToken, currentUser } = useAuth();
  const [isPublished, setIsPublished] = useState(false);
  const navigate = useNavigate();
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('general');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [slug, setSlug] = useState('test-slug');

  // Redirect if not logged in
  useEffect(() => {
    if (!userLoggedIn) {
      navigate('/login')
    }
  }, [userLoggedIn, navigate])

  // console.log(userLoggedIn._id); // undefined

  useEffect(() => {
    console.log("userLoggedIn: ", userLoggedIn);

  }, [userLoggedIn]);

  const handlePublish = (isPublished) => async (e) => {
    e.preventDefault();
    setIsPublished(isPublished);

    let finalSlug = slug;    
    if (!finalSlug || finalSlug === 'test-slug') {
      finalSlug = generateSlug(title)
      setSlug(finalSlug)
    }

    /* Send to backend */
    const data = {
      title,
      content,
      isPublishedAt: isPublished,
      desc,
      category,
      tags,
      slug: finalSlug,
      author: currentUser?._id || '68416df480cba6d146f7b1e3', // FIX: ให้ใช้จาก _id ของ(ุ้ใช้ที่ loggin คนปัจจุบัน) userLoggedIn?._id || '68416df480cba6d146f7b1e3'
      blog_id: 'default-blog-id' // แก้ตามระบบ
      // อย่าลืมเพิ่ม field อื่น banner, tags, slug ฯลฯ ให้ครบ!! this might cause 500error
    }

    console.log("📤 Payload:", data);
    mutation.mutate(data);
  };

  const mutation = useMutation({
    mutationFn: async (newPosts) => {
      const token = await getFirebaseToken();
      // console.log("Firebase Token:", token);

      try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/posts`, newPosts, {
          headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
      } catch (err) {
        console.error("📛 Response Error:", err.response?.data);
        throw err;
      }
    },
    onSuccess: (res) => {
      console.log('Post published!', res); 
      toast.success(isPublished ? 'Post Published!' : 'Draft Saved!');
      localStorage.removeItem('draftPost')

      if (isPublished) {
        navigate(`/${res.slug}`);
      } else {
        navigate('/write') //อยากให้อยู่หน้าเดิม
      }
      
    },
    onError: (error) => {
      console.error("Error publishing full:", error, error.response?.data);
      toast.error(`Error: ${error.response?.data?.message || error.message}`);
    }
  })

  useEffect(() => {
    const savedDraft = localStorage.getItem('draftPost');
    if (savedDraft) {
      const { title, desc, category, tags, content } = JSON.parse(savedDraft);
      setTitle(title)
      setDesc(desc)
      setCategory(category)
      setTags(tags)
      setContent(content)
    }
  }, [])

  useEffect(() => {
    const draft = { title, desc, category, tags, content }
    localStorage.setItem('draftPost', JSON.stringify(draft))
  }, [title, desc, category, tags, content])

  const handleBannerUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  return (
    <>
      <Toaster position='top-center' />
      <AnimationWrapper>
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 min-h-screen">
          {/* BANNER */}
          <div className='w-full relative group'>
            {bannerPreview ? (
              <img
                src={bannerPreview}
                alt="Banner Preview"
                className='w-full max-h-[350px] object-cover rounded-2xl shadow-md transition-all duration-300'
              />
            ) : (
              <div
                onClick={() => document.getElementById('bannerUpload')?.click()}
                className="w-full h-[250px] flex items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl text-gray-400 cursor-pointer hover:bg-gray-50 transition"
              >

                Click or drag an image to upload cover
              </div>
            )}

            {/* Hidden File Input */}
            <input
              type='file'
              id='bannerUpload'
              accept='image/*'
              onChange={handleBannerUpload}
              className='hidden'
            />
            {bannerPreview && (
              <button
                onClick={() => document.getElementById('bannerUpload')?.click()}
                className="absolute top-4 right-4 bg-white/70 text-gray-800 px-4 py-1 rounded-full text-sm shadow hover:bg-white transition"
              >
                Change Cover
              </button>
            )}
          </div>

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
              onChange={(e) => setTagInput(e.target.value)}
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
            onClick={(e) => handlePublish(true)(e)}
            className="bg-cyan-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-cyan-600 transition-all duration-150"
          >
            Publish
          </button>
          <button
            className=''
            onClick={(e) => handlePublish(false)(e)}
          >
            Save Draft
          </button>
        </div>
      </AnimationWrapper>
    </>
  )
}

export default Write
