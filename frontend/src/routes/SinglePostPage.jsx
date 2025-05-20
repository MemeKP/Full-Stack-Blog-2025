import { GoHeartFill } from "react-icons/go";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { Link } from "react-router-dom";
import IKImageWrapper from "../components/IKImageWrapper";
import { LuMessageSquareMore } from "react-icons/lu";
import { PiHandsClappingDuotone } from "react-icons/pi";
import { FaFaceGrinHearts, FaFaceSadCry, FaFaceSurprise, FaFire } from "react-icons/fa6";
import { IoBookmarksOutline, IoShareOutline } from "react-icons/io5";

const SinglePostPage = () => {
  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      {/* META */}
      <div className="flex flex-col ">
        <div className="text-center text-gray-600 mb-4">
        <div className="py-2">May 20, 2025 </div>
        <span>By <Link className=" hover:text-cyan-500 duration-200">Kageyama Tobio</Link></span>
      </div>

      {/* TITLE */}
      <h1 className="text-7xl font-extrabold text-center leading-tight bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent mb-4">Can AI See Beauty</h1>

      {/* VIEW & LIKES */}
      <div className="flex items-center justify-center gap-6">
        <span className="flex items-center">
          <MdOutlineRemoveRedEye className="text-2xl text-gray-500 gap-1" />
          <span className="px-2 text-gray-600">1001</span>
        </span>
        <span className="flex items-center">
          <GoHeartFill className="text-2xl text-red-500 cursor-pointer hover:scale-110 transition-transform" />
          <span className="px-2 text-gray-600">218</span>
        </span>
        <span>
          <IoBookmarksOutline className="text-xl text-gray-600 cursor-pointer hover:scale-110 transition-transform"/>
        </span>
      </div>
      </div>
      
      {/* ARTICLE BODY */}
      <article>

        {/* DISCRIPTION */}
        <div className=" flex flex-col text-center py-4">
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Perferendis, mia vel obcaecati voluptatibus placeat. Blanditiis molestiae deserunt tenetur architecto qui fugiat modi!</p>
        </div>

         {/* IMAGE */}
        <IKImageWrapper 
          src=''
          className=''
          w=''
        />
        
          <section className="relative group mb-4 flex flex-col py-4">
            <h1 className="text-2xl font-semibold">First Header</h1>
            <p className="text-lg leading-relaxed text-justify">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolore exercitationem iusto similique saepe minus a consequatur debitis quas molestias. Illum totam molestiae similique consequatur modi adipisci omnis, praesentium provident officiis?
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit iusto doloremque reprehenderit unde nostrum incidunt, dolores tenetur totam est facilis sequi magni delectus officia ad aut non maiores possimus vel?
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse consequuntur blanditiis dolore perferendis eius error, corporis dicta eum voluptates possimus placeat mollitia voluptate pariatur assumenda dolores necessitatibus, asperiores omnis dolor iure et sequi voluptatibus? Animi rerum magni vitae omnis. Inventore accusamus sed saepe sunt non ipsam dolores rerum hic expedita quo ab rem, harum quas sint, ducimus quibusdam cum dignissimos corrupti nihil minima. Fugit totam quod sint minus, neque fugiat minima tempora illum corrupti, iste accusantium et, corporis quis dolore magni laudantium ea voluptate itaque cumque est eaque earum sapiente! Deleniti molestias error fugit magnam reiciendis deserunt accusamus quasi asperiores nihil obcaecati blanditiis eos, provident, atque nulla ab, sapiente dolores eligendi? Autem ex temporibus quibusdam pariatur! Aliquam dolore sunt enim corrupti iusto consequuntur ut, maxime maiores alias consectetur quae labore illum quibusdam magni quidem totam animi facilis dignissimos itaque voluptate asperiores, magnam deleniti ex sequi. Sequi cum facere dignissimos sapiente accusantium laudantium aspernatur ducimus commodi nam illo, sint soluta aliquam porro consequuntur, ipsa harum obcaecati. Nulla quaerat voluptas quidem est asperiores consectetur, blanditiis soluta dolores, magni deleniti nemo distinctio quibusdam nihil omnis ipsam unde in vero repudiandae cupiditate. Dolor nam sapiente similique veritatis consequuntur placeat eum tenetur eius consequatur facilis. Ipsam, vel autem ipsum culpa, eligendi necessitatibus sapiente similique omnis laborum tempore quisquam blanditiis neque expedita soluta cum! Error rerum saepe id pariatur, ipsam beatae. Sed nemo autem possimus exercitationem odit delectus. Dolor exercitationem, perspiciatis eos omnis nulla obcaecati aperiam qui, harum repellendus, ut voluptatum optio deserunt? Aliquid illum sunt repudiandae debitis soluta, aperiam assumenda molestiae. Quasi, accusamus. Commodi sit fugit facere, aperiam nisi dolorem quis neque. Laborum nesciunt, aut quam ratione ducimus aliquid nisi necessitatibus inventore, error voluptatibus soluta nihil cupiditate molestias delectus optio in quo consequuntur a. Necessitatibus incidunt, harum quasi praesentium itaque dolorum debitis ut pariatur veritatis?
            </p>
            {/* FLOATING COMMENT */}
            <button className="absolute top-0 right-0">
              <LuMessageSquareMore className="text-3xl text-gray-400 hover:text-black duration-200"/>
            </button>
          </section>

          <section className="relative group mb-4 flex flex-col ">
            <h1 className="text-2xl font-semibold">1. Title</h1>
            <p className="text-lg leading-relaxed text-justify">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quidem et delectus odit, aspernatur consequatur, reiciendis repudiandae illo temporibus impedit, minus consequuntur ipsam provident doloremque. Aliquid quaerat dolorem nemo quae illum.</p>
           {/* FLOATING COMMENT */}
            <button className="absolute top-0 right-0">
              <LuMessageSquareMore className="text-3xl text-gray-400 hover:text-black duration-200"/>
            </button>
          </section>
          
      
      </article>
    
      {/* EMOJI REACTION */}
      {/* จะเอาใส่กับ foalting comment */}
      {/* <div className="mt-16 border-t pt-6 flex items-center gap-4 text-xl">
        <LuMessageSquareMore /> :
        <span className="cursor-pointer hover:scale-110 transition-transform"><FaFaceGrinHearts/></span>
        <span className="cursor-pointer hover:scale-110 transition-transform"><FaFaceSadCry /></span>
        <span className="cursor-pointer hover:scale-110 transition-transform"><FaFaceSurprise /></span>
        <span className="cursor-pointer hover:scale-110 transition-transform"><PiHandsClappingDuotone /></span>
        <span className="cursor-pointer hover:scale-110 transition-transform"><FaFire /></span>
      </div>       */}

      {/* SHARE & COMMENT*/}
      <div className="mt-16 border-t pt-6 flex items-center gap-4 text-xl">
        <span className="cursor-pointer hover:scale-110 transition-transform">
          <IoShareOutline  className="cursor-pointer hover:text-black duration-200  text-gray-600 text-3xl"/>
        </span>
      </div>
    </main>
  )
}

export default SinglePostPage