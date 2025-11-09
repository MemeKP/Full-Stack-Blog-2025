import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import InPageNavigation from '../components/InPageNavigation';

const auth = getAuth();

const fetchUser = async (uid, idToken) => {
  if (!idToken) {
    throw new Error("Missing authentication token for protected route.");
  }
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/${uid}`, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    }
  });
  return res.data;
}

const fetchUserPosts = async (uid, category, idToken) => {
  console.log("Fetching posts for category:", category);

  if (!idToken) {
    throw new Error("Missing authentication token");
  }

  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/users/${uid}/posts?category=${category}`,
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        }
      }
    );
    console.log("API Response for", category, ":", res.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching user posts:", error.response?.data || error.message);
    throw error;
  }
};

const ProfilePage = () => {
  const { userId } = useParams();
  const [idToken, setIdToken] = useState(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || 'mypost';
  const [pageState, setPageState] = useState(category);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          setIdToken(token);
        } catch (e) {
          console.error("Failed to get Firebase ID Token:", e);
          setIdToken(null);
        }
      } else {
        setIdToken(null);
      }
      setIsAuthChecking(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setPageState(category);
  }, [category]);

  const { isPending, error, data } = useQuery({
    queryKey: ["user", userId, idToken],
    queryFn: () => fetchUser(userId, idToken),
    enabled: !!idToken && !isAuthChecking,
  });

  const {
    isPending: isBlogsPending,
    error: blogsError,
    data: userPosts
  } = useQuery({
    queryKey: ["userPosts", userId, pageState, idToken],
    queryFn: () => fetchUserPosts(userId, pageState, idToken),
    enabled: !!idToken && !isAuthChecking && !!pageState,
  });

  /** Debug Log */
  // useEffect(() => {
  //   console.log("Current pageState:", pageState);
  //   console.log("User Posts data:", userPosts);
  //   console.log("Blogs Error:", blogsError);
  // }, [pageState, userPosts, blogsError]);

  if (isAuthChecking) {
    return "Checking authentication...";
  }
  if (isPending) {
    return "Loading..."
  }
  if (error) {
    return "Something went wrong... " + error.message;
  }
  if (!data) {
    return "User not found!"
  }

  return (
    <div className="min-h-screen ">
      <div className="relative w-full">
        {/* Header/Banner */}
        <div
          className="w-full h-60 bg-cover bg-center bg-gradient-to-r from-[#A78BFA] to-pink-200"
        ></div>
        <div className="absolute top-40 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          {data.profile_img ? (
            <img
              src={data.profile_img}
              alt="Profile"
              className="w-40 h-40 rounded-full border-4 bg-gradient-to-b from-pink-500 to-cyan-500 border-white shadow-lg"
            />
          ) : (
            <div className='w-40 h-40 rounded-full border-4 bg-gradient-to-b from-lime-300 to-cyan-300 border-white shadow-lg'></div>
          )}
          <h1 className="text-2xl font-bold mt-4 text-gray-900">{data.username}</h1>
          <p className="text-gray-600">{data.email}</p>
        </div>
      </div>

      {/* MY POSTS & BOOKMARKS */}
      <div className="mt-36">
        <InPageNavigation
          routes={['mypost', 'bookmark']}
          defaultActiveIndex={category === 'bookmark' ? 1 : 0}
          onTabChange={(tabName) => {
            setSearchParams({ category: tabName });
          }}
        >
          {/* MY POSTS Tab */}
          <div>
            {isBlogsPending && pageState === 'mypost' ? (
              <p>Loading my posts...</p>
            ) : blogsError ? (
              <p className="text-red-500">Error loading posts: {blogsError.message}</p>
            ) : userPosts && userPosts.length > 0 ? (
              userPosts.map(blog => (
                <Link to={`/${blog.blog_id}`} key={blog._id}>
                  <div className='p-4 border rounded-lg mt-4 bg-white shadow-sm'>
                    <h1 className='text-xl font-semibold'>{blog.title}</h1>
                    <p className='text-base font-light'>{blog.desc}</p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-center py-10 text-gray-500">You haven't created any posts yet.</p>
            )}
          </div>

          {/* BOOKMARKED Tab */}
          <div>
            {isBlogsPending && pageState === 'bookmark' ? (
              <p>Loading bookmarked posts...</p>
            ) : blogsError ? (
              <p className="text-red-500">Error loading bookmarks: {blogsError.message}</p>
            ) : userPosts && userPosts.length > 0 ? (
              userPosts.map(blog => (
                <Link to={`/${blog.blog_id}`} key={blog._id}>
                  <div className='p-4 border rounded-lg mt-4 bg-white shadow-sm'>
                    <h1 className='text-xl font-semibold'>{blog.title}</h1>
                    <p className='text-base font-light'>{blog.desc}</p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-center py-10 text-gray-500">You haven't bookmarked any posts yet.</p>
            )}
          </div>
        </InPageNavigation>
      </div>
    </div>
  );
}

export default ProfilePage;