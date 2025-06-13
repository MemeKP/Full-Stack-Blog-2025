import PostListItem from "./PostListItem"
import { useQuery, useInfiniteQuery } from "@tanstack/react-query"
import axios from "axios"
import InfiniteScroll from 'react-infinite-scroll-component';

const fetchPosts = async (pageParam) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
    params: { page: pageParam, limit: 2 },
  })
  return res.data;
};

const PostList = () => {

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => lastPage.hasMore ? pages.length + 1 : undefined,
  })

  console.log(data);

  if (status === "loading") return 'Loading...'

  if (status === 'error') return 'An error has occurred: ' + error.message

  const allPosts = data?.pages?.flatMap((page) => page.posts) || [];
  console.log(data); //ลองดูผลลัพธ์

  return (
    <InfiniteScroll
      dataLength={allPosts.length}
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={<h4>Loading more posts...</h4>}
      endMessage={
        <p style={{ textAlign: 'center' }}>
          <b>All posts loaded!</b>
        </p>
      }
    >
      {/* map ตาม array ให้ post แต่ละอันโชว์ <PostListItem /> */}
      {allPosts.map(post => (
        <PostListItem key={post._id} post={post} />
      ))}
    </InfiniteScroll>
  )
}

export default PostList

// const { isPending, error, data } = useQuery({
//   queryKey: ['repoData'],
//   queryFn: () => fetchPosts(),
// })
{/* <div className='flex flex-col gap-6  mb-8'>
    </div> */}