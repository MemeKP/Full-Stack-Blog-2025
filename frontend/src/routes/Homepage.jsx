import AnimationWrapper from '../common/page-animation'
import { Link, useSearchParams } from 'react-router-dom'
import InPageNavigation from '../components/InPageNavigation'
import PostList from '../components/PostList'
import MainLayout from '../components/MainLayout'
import SideBar from '../components/SideBar'
import { useEffect, useState } from 'react'
import { mockBlogs as mock_trending_post } from '../config/trending-config'
import MinimalPost from '../components/MinimalPost'
import { activeTabRef } from '../components/InPageNavigation'
import NoDataMessage from '../components/NoDataMessage'
import { blog_data as allBlogs } from '../config/data-config'
import { useSearch } from '../context/SearchContext'

const Homepage = () => {

  const [blogs, setBlogs] = useState(null); //ใช้ใน sidebar
  const [trendingBlogs, setTrendingBlogs] = useState(null);

  // const { query } = useSearch();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("search") || '';
  const category = searchParams.get('category') || 'All Post'
  let [pageState, setPageState] = useState(category); 
  // const pageState = category ? capitalize(category) : 'All Post';
  const [filteredBlogs, setFilteredBlogs] = useState(allBlogs);
  // const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)

  useEffect(() => {
    setPageState(category)
  }, [category])

  const loadBlogByCategory = (category) => {
    setBlogs(null);
    if (pageState === category) {
      setPageState('All Post');
      return;
    }
    setPageState(category)
  }  

  /* fetchLastesBlogs function 
      fetch แล้วจะไปเก็บในตัวแปร blogs
  */
  /* fetchTrendingBlogs function */

  useEffect(() => {
    activeTabRef.current.click() //update hr ให้พอดีกับตนส
    if (pageState === 'All Post') {
      // fetchLastesBlogs();
      // setBlogs(allBlogs); // use mock data for testing UI
    }
    if (pageState === 'Trending') {
      // fetchTrendingBlogs();
    }
    // use mock data for testing UI
    setTrendingBlogs(mock_trending_post);
  }, [pageState])


  useEffect(() => {
    const lowerQuery = query.toLowerCase();
    const result = allBlogs.filter(blog => (
      blog.title.toLowerCase().includes(lowerQuery) ||
      blog.desc.toLowerCase().includes(lowerQuery) ||
      blog.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    ));

    setFilteredBlogs(result);
  }, [query])

  return (

    <AnimationWrapper keyValue="homepage">
      <div className="mt-4 flex flex-col gap-4">
        {/* 1. BREADCRUMB */}
        <div className="flex gap-4">
          <Link to="/">Home</Link>
          <span className='font-bold'>•</span>
          <span className='text-cyan-600'>Blogs and Articles</span>
        </div>
      </div>

      {/* 2. INTRODUCTION */}
      <section className='py-14'>
        <div className="container mx-auto px-4 text-center">
          <h1 className='text-9xl font-semibold bg-gradient-to-r from-pink-600 to-cyan-600 bg-clip-text text-transparent'>Post Write</h1>
          <p className='text-3xl'>A place to share your thoughts.</p>
        </div>
      </section>

      {/* 3. MAIN CONTENT + SIDEBAR */}
      {/* 3.1) Latest blog and Trending */}
      {/* "Content alignment with max-width container and auto margin" => max-w-6xl mx-auto px-4 */}
      <MainLayout
        sidebar={
          <SideBar
            pageState={pageState}
            loadBlogByCategory={loadBlogByCategory}
          />
        }
      >
        <div className="w-full">
          <InPageNavigation key={pageState} routes={[pageState, "Trending"]} defaultHidden={["Trending"]}>

            {/* LASTEST BLOG */}
            <>
              {/* POST LIST */}
              <PostList search={query} category={category}/>
              {/* {
                //blogs == null ? <Loader /> :
                blogs.map((blog, i) => {
                  return <AnimationWrapper transition={{duration: 1, delay: i*1}} key={i}>
                    <PostListItem content={blog} author={blog.author.personal_info} />
                  </AnimationWrapper>
                })
              }
              */}

              {/* TEST: Latest Blogs */}
              {/* {
                blogs == null ? (
                  // <Loading />
                  <p>Loading Lastest blogs...</p>
                ) : (
                  blogs.length ?
                    blogs.map((blog, i) => (
                      <AnimationWrapper transition={{ duration: 1, delay: i * 0.2 }} key={blog.blogId}>
                        <MinimalPost blog={blog} index={i} />
                      </AnimationWrapper>
                    ))
                    : <NoDataMessage message='No blog published' />
                )
              } */}
            </>

            {/* TRENDING BLOGS */}
            {/* {
              trendingBlogs == null ? <Loader /> : 
              trendingBlogs.map((blog,i) => {
                return <AnimationWrapper transition={{duration: 1, delay: i*1}} key={i}>
                  <MinimalPost />
                </AnimationWrapper>
              })
            } */}
           
            {/* TEST: Trending Blogs */}
            {
              trendingBlogs == null ? (
                // <Loading />
                <p>Loading trending blogs...</p>
              ) : (
                trendingBlogs.length ?
                  trendingBlogs
                    ?.filter(post => post && post._id && post.blog_id)
                    .map((blog, i) => (
                    <AnimationWrapper transition={{ duration: 1, delay: i * 0.2 }} key={blog.blogId}>
                      <MinimalPost blog={blog} index={i} />
                    </AnimationWrapper>
                  ))
                  : <NoDataMessage message='No blog published' />
              )
            }
            
          </InPageNavigation>
        </div>
         {/* TRENDING & FILTER BLOGS */}
         {/* <div>
          {
            filteredBlogs ? null (
              <p>Loading filtered blogs...</p>
            ) : (
              filteredBlogs.length ? 
              filteredBlogs
            )
          }
         </div> */}

      </MainLayout>

    </AnimationWrapper>
  )
}

export default Homepage