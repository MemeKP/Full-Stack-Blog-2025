import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { GoArrowRight } from "react-icons/go";
import { recommend_topic, sort_options } from "../config/category";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const SideBar = ({ pageState, loadBlogByCategory }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate()

  const { data: trending } = useQuery({
    queryKey: ["trending"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts?sort=trending&limit=5&noLimit=true`)
      return res.data.posts; // หรือ res.data แล้ว map .posts
    }
  })

  const handleFilterChange = (e) => {
    const category = e.target.innerText.toLowerCase();
    const currentCategory = searchParams.get("category") || "";
    const newCategory = currentCategory === category ? "" : category;

    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (newCategory === "") {
        newParams.delete("category");
      } else {
        newParams.set("category", newCategory);
      }
      return newParams;
    });
  };

  const handleSortChange = (e) => {
    if (searchParams.get('sort') !== e.target.value) {
      setSearchParams({
        ...Object.fromEntries(searchParams.entries()),
        sort: e.target.value
      })
    }
  };

  //ติดตาม param แล้วโหลด blog ใหม่
  useEffect(() => {
    const categoryFromParam = searchParams.get("category") || "All Post";
    const sortFromParam = searchParams.get('sort') || 'newest'
    loadBlogByCategory(categoryFromParam, sortFromParam); // จะยังคง animation/tab ทำงานได้ตามเดิม
  }, [searchParams]); //ห้ามลืมใส่

  return (
    <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-gray-200 pl-8 pt-3 max-md:hidden">
      {/* RECOMMENDED */}
      <div className="flex flex-col gap-5 ">
        <h1 className="font-bold text-base mb-2 ">Recommended topics</h1>
        <div className="flex flex-wrap gap-2">
          {recommend_topic.map((topic, i) => (
            <button
              name="category"
              onClick={handleFilterChange}
              className={`tag px-2 py-2 rounded-full text-xs font-medium transition-colors duration-200 ${pageState === topic.toLowerCase()
                  ? "bg-cyan-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
                }`}
              key={i}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>
      {/* SORT */}
      <div className="flex flex-col mt-10 gap-2">
        <h2 className="text-base font-semibold mb-2">Sort by</h2>
        <div className="flex flex-col gap-2">
          {sort_options.map((sort) => (
            <label
              key={sort}
              className="flex items-center gap-2 cursor-pointer text-xs font-medium "
            >
              <input
                type="radio"
                name="sort"
                value={sort.toLowerCase()}
                checked={searchParams.get("sort") === sort.toLowerCase()}
                onChange={handleSortChange}
                className="appearance-none w-3 h-3 border border-gray-300 rounded-full checked:bg-cyan-600 checked:border-transparent transition duration-150"
              />
              <span className="capitalize">{sort}</span>
            </label>
          ))}
        </div>
      </div>
      {/* TRENDING */}
      <div className="flex flex-col mt-10 gap-5 bg-white shadow-sm border border-gray-200 p-4 rounded-lg">
        <h1 className="font-bold text-base mb-2">Trending</h1>
        <div className="flex flex-col divide-y divide-gray-400">
          {trending
            ?.filter(post => post && post.blog_id)
            .map((post, i) => (
              <div key={post.blog_id} className="flex justify-between items-center py-4">
                <div className="flex gap-3">
                  <div className="text-3xl font-bold min-w-[4rem] ">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="flex flex-col">
                    <span
                      className="font-semibold text-sm text-gray-700 cursor-pointer line-clamp-2 break-words hover:text-cyan-500 transition-all duration-200"
                      onClick={() => navigate(`/posts/${post.blog_id}`)}
                    >
                      {post.title}
                    </span>
                    <span className="text-xs text-gray-500">
                      {" "}
                      by
                      <Link to={"/test"} className="cursor-pointer truncate max-w-[150px]">
                        {" "}
                        {post.author?.username || 'Unknown'}
                      </Link>
                    </span>
                  </div>
                </div>

                <GoArrowRight
                  className="text-xl cursor-pointer hover:translate-x-1 transition-all duration-200 hover:text-cyan-500"
                  onClick={() => navigate(`/posts/${post.blog_id}`)}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
