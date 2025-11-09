import { Link } from "react-router-dom"
import { format as formatDate } from 'date-fns';
import { useState } from "react"

const PostListItem = ({ post }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  if (!post || !post._id) return null;

  return (
    <div className=" py-4 mt-4 flex flex-col xl:flex-row gap-8">
      {/* image */}
      {post.banner && (
        <div className="w-full xl:w-1/2 relative ">
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
          className="text-xl xl:text-xl font-semibold leading-snug line-clamp-1"
        >
          {post.title}
        </Link>
        <div className="flex flex-wrap gap-2 text-sm">
          <span>Written By </span>
          {post.author && post.author.username ? (
            <Link className="text-cyan-600 hover:underline">
              {post.author.username}
            </Link>
          ) : (
            <span className="italic text-gray-400">anonymous</span>
          )}

          <span> on </span>
          <Link className="text-cyan-600 hover:underline">{post.category}</Link>
          <span>{formatDate(new Date(post.publishedAt), "MMMM, d yyyy")}</span>
        </div>
        <div className="text-sm">
          {post.desc}
        </div>
        <Link to={`/${post.blog_id || 'invalid'}`} className="text-cyan-600 text-sm hover:underline">Read More</Link>

      </div>
    </div>
  )
}

export default PostListItem
