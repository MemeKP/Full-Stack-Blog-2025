import { Link, useParams } from "react-router-dom";
import IKImageWrapper from "../components/IKImageWrapper";
import { LuMessageSquareMore } from "react-icons/lu";
import { format as formatDate } from 'date-fns';
import { PiHandsClappingDuotone } from "react-icons/pi";
import { FaFaceGrinHearts, FaFaceSadCry, FaFaceSurprise, FaFire } from "react-icons/fa6";
import { IoShareOutline } from "react-icons/io5";
import CommentSection from "../components/CommentSection";
import { post_tags } from "../config/category";
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useState } from "react";
import PostMenuActions from "../components/PostMenuActions";

//Fetch blog page
const fetchPost = async (blog_id) => {
  const res = axios.get(`${import.meta.env.VITE_API_URL}/posts/${blog_id}`);
  return (await res).data;
}

const SinglePostPage = () => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const { blog_id } = useParams()
  const [isLikedByUser, setIsLikedByUser] = useState(false)

  const { isPending, error, data } = useQuery({
    queryKey: ["post", blog_id],
    queryFn: () => fetchPost(blog_id),
  });

  if (isPending) {
    return "Loading..."
  }
  if (error) {
    return "Something went wrong... " + error.message;
  }
  if (!data) {
    return "Post not found!"
  }

  return (

    <main className="max-w-6xl mx-auto px-4 py-12">
      {/* META */}
      <div className="flex flex-col ">
        <div className="text-center text-gray-600 mb-4">
          <div className="py-2">{formatDate(new Date(data.
            publishedAt), "MMMM, d yyyy")}</div>
          <span>By <Link className=" hover:text-cyan-500 duration-200">{data.author.username}</Link></span>
        </div>

        {/* TITLE */}
        {/* Can AI See Beauty */}
        <h1 className="text-6xl font-extrabold text-center leading-tight bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent mb-4">{data.title}</h1>

        {/* VIEW & LIKES */}
        {isPending ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error loading post</div>
        ) : (
          <PostMenuActions post={data} />
        )}
      </div>

      {/* ARTICLE BODY */}
      <article>

        {/* DISCRIPTION */}
        <div className=" flex flex-col text-center my-8">
          <p>{data.desc}</p>
        </div>

        {/* IMAGE */}
        {
          data.banner && < img
            src={data.banner}
            alt="post image"
            className="w-full max-h-[450px] object-cover rounded-2xl shadow-md my-8"
          />
        }

        <article className="prose prose-lg max-w-none mt-10">
          <div dangerouslySetInnerHTML={{ __html: data.content }} />

        </article>

        <section className="relative group mb-4 flex flex-col ">
          {/* FLOATING COMMENT */}
          <button className="absolute top-0 right-0">
            <LuMessageSquareMore className="text-3xl text-gray-400 hover:text-black duration-200" />
          </button>
        </section>
      </article>

      {/* TAGS/CATEGORIES */}
      <div className="flex flex-wrap gap-3 pt-9">
        {post_tags.map((tag, i) => (
          <button
            key={i}
            className="px-3 py-1 rounded-full text-xs font-semibold border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-black transition-all duration-100 shadow-md"
          // className="px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 text-white hover:brightness-110 transition duration-200"
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* COMMENT & SHARE */}
      <div className="relative mt-6 border-t pt-6">
        <div className="flex flex-row md:flex-row gap-4">
          <div className="flex-1">
            <CommentSection postId={data._id} authorName={data.author.username} />
          </div>
          <div className="flex-none">
            <IoShareOutline className="absolute right-0 cursor-pointer hover:text-black duration-200  text-gray-600 text-3xl" />
          </div>
        </div>
      </div>
    </main>
  )
}

export default SinglePostPage

{/* EMOJI REACTION */ }
{/* จะเอาใส่กับ foalting comment */ }
{/* <div className="mt-16 border-t pt-6 flex items-center gap-4 text-xl">
        <LuMessageSquareMore /> :
        <span className="cursor-pointer hover:scale-110 transition-transform"><FaFaceGrinHearts/></span>
        <span className="cursor-pointer hover:scale-110 transition-transform"><FaFaceSadCry /></span>
        <span className="cursor-pointer hover:scale-110 transition-transform"><FaFaceSurprise /></span>
        <span className="cursor-pointer hover:scale-110 transition-transform"><PiHandsClappingDuotone /></span>
        <span className="cursor-pointer hover:scale-110 transition-transform"><FaFire /></span>
      </div>       */}

// CONTENT 
{/* <section className="relative group mb-4 flex flex-col py-4">
          <h1 className="text-2xl font-semibold">First Header</h1>
          <p className="text-lg leading-relaxed text-justify">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolore exercitationem iusto similique saepe minus a consequatur debitis quas molestias. Illum totam molestiae similique consequatur modi adipisci omnis, praesentium provident officiis?
            Lore facilmaiores possimus vel?
            Lorem ipsuit. Esse consequuntur blanditiis dolore perferendis eius error, corporis dicta eum voluptates possimus placeat mollitia oluptatum optio deserunt? Aliquid illum sunt repudiandae debitis soluta, aperiam assumenda molestiae. Quasi, accusamus. Commodi sit fugit facere, aperiam nisi dolorem quis neque. Laborum nesciunt, aut quam ratione ducimus aliquid nisi necessitatibus inventore, error voluptatibus soluta nihil cupiditate molestias delectus optio in quo consequuntur a. Necessitatibus incidunt, harum quasi praesentium itaque dolorum debitis ut pariatur veritatis?
          </p> */}
{/* FLOATING COMMENT */ }
{/* <button className="absolute top-0 right-0">
            <LuMessageSquareMore className="text-3xl text-gray-400 hover:text-black duration-200" />
          </button>
        </section> */}