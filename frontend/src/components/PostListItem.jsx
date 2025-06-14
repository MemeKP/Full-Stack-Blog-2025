import { Link, useParams } from "react-router-dom"
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
          to={`${post.blog_id}`}
          className="text-4xl xl:text-3xl font-semibold leading-snug line-clamp-1"
        >
          {post.title}
        </Link>
        <div className="flex flex-wrap gap-2">
          <span>Written By </span>
          {post.author && post.author.username ? (
            <Link className="text-cyan-600 hover:underline">
              {post.author.username}
            </Link>
          ) : (
            <span className="italic text-gray-400">Unknown author</span>
          )}

          <span> on </span>
          <Link className="text-cyan-600 hover:underline">{post.category}</Link>
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
