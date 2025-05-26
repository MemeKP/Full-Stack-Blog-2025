import {useState} from 'react'
import Tiptap from '../components/Editor/Tiptap'

const Write = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const handlePublish = () => {
    console.log('Title:', title)
    console.log('Content:', content)
    // ส่งไป backend 
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <input
        type="text"
        value={title}
        placeholder='Title'
        onChange={e => setTitle(e.target.value)}
        className="w-full text-7xl font-semibold font-serif focus:outline-none placeholder-gray-300 bg-transparent"
      />

      <Tiptap onChange={setContent}/>

      <div className="flex justify-end">
        <button onClick={handlePublish} className="bg-cyan-500 text-white px-6 py-2 rounded-md hover:bg-cyan-600 duration-100">
          Publish
        </button>
      </div>
    </main>
  )
}
export default Write