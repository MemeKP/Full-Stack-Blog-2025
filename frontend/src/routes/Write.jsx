import { useEffect, useState } from 'react'
import PageEditor from '../components/Editor/PageEditor'
import AnimationWrapper from '../common/page-animation'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useAuth } from '../context/authContext/userAuthContext'
import { useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';
import { generateSlug } from '../utils/slugUtils';
import { IKContext, IKUpload } from 'imagekitio-react'

const authenticator = async () => {
  try {
    // Perform the request to the upload authentication endpoint.
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/upload-auth`);
    if (!response.ok) {
      // If the server response is not successful, extract the error text for debugging.
      const errorText = await response.text();
      throw new Error(`Request failed with status ${response.status}: ${errorText}`);
    }

    // Parse and destructure the response JSON for upload credentials.
    const data = await response.json();
    const { signature, expire, token, publicKey } = data;
    return { signature, expire, token, publicKey };
  } catch (error) {
    // Log the original error for debugging before rethrowing a new error.
    console.error("Authentication error:", error);
    throw new Error("Authentication request failed");
  }
};

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
  const [banner, setBanner] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [slug, setSlug] = useState('test-slug');
  const [postId, setPostId] = useState(null);
  const [cover, setCover] = useState(""); //ใช้กับ imageKit
  const [progress, setProgress] = useState(0)

  // Redirect if not logged in
  useEffect(() => {
    if (!userLoggedIn) {
      navigate('/login')
    }
  }, [userLoggedIn, navigate])

  useEffect(() => {
    console.log("userLoggedIn: ", userLoggedIn);

  }, [userLoggedIn]);

  // DRAFT SAVE
  const handleDraftSave = (e) => {
    e.preventDefault();

    let finalSlug = slug;
    if (!finalSlug || finalSlug === 'test-slug') {
      finalSlug = generateSlug(title);
      setSlug(finalSlug);
    }

    // ตรวจสอบ localStorage เผื่อ _id ยังไม่อยู่ใน state
    let savedId = null;
    try {
      const saved = JSON.parse(localStorage.getItem('draftPost'));
      savedId = saved?._id || null;
    } catch (e) {
      console.warn("Error reading draftPost", e);
    }

    const data = {
      _id: savedId,
      title,
      content,
      isPublishedAt: false, //publishedAt
      desc,
      category,
      tags,
      slug: finalSlug,
      author: currentUser?._id || '',
    };

    console.log("💾 Saving Draft:", data);
    mutation.mutate(data);
  };

  const handlePublish = async (e) => {
    //prevent toring the blog data twice
    if (e.target.className.includes('disable')) {
      return;
    }
    if (!title.length) {
      return toast.error("Please write some title.")
    }
    if (!desc.length) {
      return toast.error("Please write description about your blog.")
    }
    let loadingToast = toast.loading("Publishing...");

    e.target.classList.add('disable')

    let blogObj = {
      title,
      isPublishedAt: true,
      banner,
      desc,
      content,
      category,
      tags,
      draft: false,
      author: currentUser?._id || '',
    }

    const token = await getFirebaseToken();

    // console.log("banner right before submit:", banner);
    // console.log("posting to:", import.meta.env.VITE_API_URL + "/posts")
    // console.log("banner length", banner?.length || banner?.size);

    axios.post(import.meta.env.VITE_API_URL + "/api/posts",
      blogObj, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(() => {
        e.target.classList.remove('disable')
        toast.dismiss(loadingToast);
        toast.success("Published!");
        setTimeout(() => {
          navigate('/')
        }, 500)
      })
      .catch((err) => {
        e.target.classList.remove("disable");
        toast.dismiss(loadingToast);

        console.error("Post publish error:", err);
        const message = err?.response?.data?.error || "Something went wrong.";
        return toast.error(message);
      });

  }

  const mutation = useMutation({
    mutationFn: async (newPosts) => {
      const token = await getFirebaseToken();
      console.log("mutationFn received:", newPosts);
      // console.log("mutationFn received _id:", newPosts._id);
      // console.log("Firebase Token:", token);

      const url = newPosts._id
        ? `${import.meta.env.VITE_API_URL}/api/posts/${newPosts._id}` // PUT
        : `${import.meta.env.VITE_API_URL}/api/posts`;               // POST

      const method = newPosts._id ? 'put' : 'post';

      try {
        const res = await axios[method](url, newPosts, {
          headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
      } catch (err) {
        console.error("📛 Response Error:", err.response?.data);
        throw err;
      }
    },
    onSuccess: (res, variables) => {
      console.log('Post published!', res);

      // บันทึก _id ที่ได้กลับมาจาก backend
      if (!postId && res._id) {
        console.log("Set postId from response:", res._id);

        // อัปเดตลง localStorage ทันทีด้วย
        const savedDraft = localStorage.getItem('draftPost');
        const updated = savedDraft
          ? { ...JSON.parse(savedDraft), _id: res._id }
          : { _id: res._id };
        localStorage.setItem('draftPost', JSON.stringify(updated));
        setPostId(res._id);
      }

      toast.success(variables.isPublishedAt ? 'Post Published!' : 'Draft Saved!');

      if (variables.isPublishedAt) {
        navigate(`/${res.slug}`);
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
      const { title, desc, category, tags, content, slug, _id } = JSON.parse(savedDraft);
      setTitle(title)
      setDesc(desc)
      setCategory(category)
      setTags(tags)
      setContent(content)
      if (slug) setSlug(slug)
      if (_id) setPostId(_id)
    }
  }, [])

  useEffect(() => {
    const draft = { title, desc, category, tags, content, slug, _id: postId }
    localStorage.setItem('draftPost', JSON.stringify(draft))
  }, [title, desc, category, tags, content, slug, postId])

  const onError = (err) => {
    console.log(err)
    toast.error("image uploade fail.")
  }

  const onSuccess = (result) => {
    setBanner(result.url);
    setBannerPreview(result.url); // ใช้ url ของรูปจาก ImageKit
  };

  const onUploadProgress = (progress) => {
    console.log(progress)
    setProgress(Math.round((progress.loaded / progress.total) * 100))
  }

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
                onClick={() => document.getElementById('ik-upload-hidden')?.click()}
                className="w-full h-[250px] flex items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl text-gray-400 cursor-pointer hover:bg-gray-50 transition"
              >
                Click to upload image cover
              </div>
            )}

            {/* Hidden ImageKit Upload */}
            <IKContext
              publicKey={import.meta.env.VITE_IMAGEKIT_PUBLICKEY}
              urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
              authenticator={authenticator}
            >
              <IKUpload
                id="ik-upload-hidden"
                className="hidden"
                useUniqueFileName
                onError={onError}
                onSuccess={onSuccess}
                onUploadProgress={onUploadProgress}
              />
            </IKContext>

            {/* Change Cover Button */}
            {bannerPreview && (
              <button
                onClick={() => document.getElementById('ik-upload-hidden')?.click()}
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
              <option value="AI">AI</option>
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

        {/* Error Message */}
        {/* {mutation.isError && (
          <div className="text-red-600 text-sm font-medium px-2">
            {mutation.error.message}
          </div>
        )} */}

        {/* PUBLISH & SAVE */}
        <div className="sticky bottom-4 flex justify-end max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={handlePublish}
            className="bg-cyan-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-cyan-600 transition-all duration-150"
          >
            Publish
          </button>
          <button
            className='ml-4 bg-gray-200 text-gray-800 px-6 py-2 rounded-full shadow hover:bg-gray-300 transition-all duration-150'
            onClick={handleDraftSave}
          >
            Save Draft
          </button>
        </div>
      </AnimationWrapper>
    </>
  )
}

export default Write