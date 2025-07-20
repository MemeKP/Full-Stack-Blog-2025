import PostListItem from "./PostListItem";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { useLocation, useSearchParams } from "react-router-dom";

const fetchPosts = async (
  pageParam,
  searchQuery,
  pathname,
  categoryQuery,
  sortQuery
) => {
  console.log("➡️ fetching posts with:", {
    pageParam,
    searchQuery,
    pathname,
    categoryQuery,
  });
  //`${import.meta.env.VITE_API_URL}/posts`
  const res = await axios.get(`/api/posts`, {
    params: {
      page: pageParam,
      limit: pathname === "/" ? 2 : 10,
      search: searchQuery || "",
      category: categoryQuery || "", //ส่วน filter
      sort: sortQuery,
    },
  });
  console.log("📦 response.data:", res.data); // สำคัญ!
  return res.data;
};

const PostList = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "newest";

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["posts", searchQuery, category, sort],
    queryFn: ({ pageParam = 1 }) =>
      fetchPosts(pageParam, searchQuery, location.pathname, category, sort),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMore ? pages.length + 1 : undefined,
  });

  console.log(data);

  if (status === "loading") return "Loading...";

  if (status === "error") return "An error has occurred: " + error.message;

  // const allPosts = data?.pages?.flatMap((page) => page.posts) || [];
  const allPosts = data?.pages
  ?.flatMap((page) => Array.isArray(page?.posts) ? page.posts : [])
  .filter(post => post && post._id) || [];

  console.log("pages:", data?.pages)
  console.log(data); //ลองดูผลลัพธ์
  console.log("allPosts = ", allPosts);
  allPosts.forEach((p, i) => {
    if (!p || !p._id) {
      console.warn(`⚠️ Problem at index ${i}:`, p);
    }
  });

  return (
    <InfiniteScroll
      dataLength={allPosts.length}
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={<h4>Loading more posts...</h4>}
      endMessage={
        <p style={{ textAlign: "center" }}>
          <b>All posts loaded!</b>
        </p>
      }
    >
      {/* map ตาม array ให้ post แต่ละอันโชว์ <PostListItem /> */}
      {allPosts
        .filter((post) => post && post._id && post.blog_id) // กรองเฉพาะ post ที่ไม่ null และมี _id
        .map((post) => (
          <PostListItem key={post._id} post={post} />
        ))}
    </InfiniteScroll>
  );
};

export default PostList;

// const { isPending, error, data } = useQuery({
//   queryKey: ['repoData'],
//   queryFn: () => fetchPosts(),
// })
{
  /* <div className='flex flex-col gap-6  mb-8'>
    </div> */
}
