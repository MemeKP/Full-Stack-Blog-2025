import { Link } from "react-router-dom"
import IKImageWrapper from "./IKImageWrapper"
import { format } from "timeago.js"
import { useState } from "react"

const PostListItem = ({ post }) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div className=" py-4 mt-4 flex flex-col xl:flex-row gap-8">
      {/* image */}
      {post.banner && (
        <div className="w-full xl:w-1/3 relative ">
          {!imgLoaded && (
            <div className="absolute top-0 left-0 w-full h-48 bg-gray-200 animate-pulse rounded-2xl" />
          )}
          <img
            src={post.banner}
            alt="post image"
            className={`rounded-2xl object-cover w-full h-48 transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"
              }`}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgLoaded(true)} // กันภาพพังแล้ว skeleton ไม่หาย
          />
          </div>
        )}

      {/* details */}
      <div className="flex flex-col gap-3 xl:w-2/3">
        <Link
          to='/test'
          className="text-4xl xl:text-3xl font-semibold leading-snug line-clamp-1"
        >
          {post.title}
        </Link>
        <div>
          <span>Written By </span>
          <Link className="text-cyan-600 hover:underline">kageyama tobio</Link>
          <span> on </span>
          <Link className="text-cyan-600 hover:underline">Web Design </Link>
          <span>{format(post.publishedAt)}</span>
        </div>
        <p>
          {post.desc}
        </p>
        <div>
          <Link to={`/${post.blog_id}`} className="text-cyan-600 hover:underline">Read More</Link>
        </div>

      </div>
    </div>
  )
}

export default PostListItem
