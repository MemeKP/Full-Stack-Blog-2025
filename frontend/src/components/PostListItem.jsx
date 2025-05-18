import { Link } from "react-router-dom"
import IKImageWrapper from "./IKImageWrapper"

const PostListItem = () => {
  return (
    <div className="flex flex-col xl:flex-row gap-8">
      {/* image */}
      <div className="w-full xl:w-1/3">
        <IKImageWrapper 
        src='post2.jpg' 
        className="rounded-2xl object-cover w-full h-48 "
        // w='800' fix width when user upload the image
        alt='post image'
        />
      </div>

      {/* details */}
      <div className="flex flex-col gap-4 xl:w-2/3">
        <Link 
        to='/test' 
        className="text-4xl xl:text-3xl font-semibold leading-snug line-clamp-1"
        >
          Lorem ipsum, dolor sit amet consectetur adipisicing elit.
        </Link>
        <div>
          <span>Written By </span>
          <Link className="text-cyan-600 hover:underline">Kaeyama Tobio</Link>
          <span> on </span>
          <Link className="text-cyan-600 hover:underline">Web Design </Link>
          <span>2 days ago</span>
        </div>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. 
          Maiores libero repudiandae beatae, suscipit voluptatum est aliquam sunt assumenda, 
          fugiat quibusdam quis eaque unde!
          Mollitia sunt eligendi deserunt libero harum odio?
        </p>
        <div>
          <Link to='/test' className="text-cyan-600 hover:underline">Read More</Link>
        </div>
        
      </div>
    </div>
  )
}

export default PostListItem