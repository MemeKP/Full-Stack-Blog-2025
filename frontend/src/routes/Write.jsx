import { useState } from 'react'
import PageEditor from '../components/Editor/PageEditor'
import AnimationWrapper from '../common/page-animation'

const Write = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const handlePublish = () => {
    console.log('Title:', title)
    console.log('Content:', content)
    // Send to backend
  }

  return (
    <AnimationWrapper>
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 min-h-screen">
        <input
          type="text"
          value={title}
          placeholder="Title"
          onChange={e => setTitle(e.target.value)}
          className="w-full text-4xl sm:text-5xl font-bold font-serif placeholder-gray-400 focus:outline-none bg-transparent"
        />

        <div className="min-h-[300px]">
          <PageEditor onChange={setContent} />
        </div>
      </main>

      <div className="sticky bottom-4 flex justify-end max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={handlePublish}
          className="bg-cyan-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-cyan-600 transition-all duration-150"
        >
          Publish
        </button>
      </div>
    </AnimationWrapper>
  )
}

export default Write
