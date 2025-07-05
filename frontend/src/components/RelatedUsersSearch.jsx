import { useSearchParams } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';

const RelatedUsersMock = () => {
    //   const { query } = useSearch();
    const [searchParams] = useSearchParams();
    const query = searchParams.get("search") || "";

    const mockUsers = [
        {
            _id: "u1",
            fullname: "Jane Doe",
            username: "jane.dev",
            profileImg: "https://i.pravatar.cc/150?img=1",
            bio: "Frontend dev who loves React and design systems.",
            commonTags: ["react", "frontend", "tailwind"],
            postCount: 12,
            isFollowing: false,
        },
        {
            _id: "u2",
            fullname: "John Smith",
            username: "john.js",
            profileImg: "https://i.pravatar.cc/150?img=2",
            bio: "JavaScript junkie and contributor to open-source.",
            commonTags: ["react", "javascript", "performance"],
            postCount: 27,
            isFollowing: true,
        },
    ];

    return (
        <div className="w-full max-w-sm flex flex-col gap-4">
            <h2 className="text-xl font-semibold">
                Users related to “{query || '...'}”
            </h2>

            {mockUsers.map(user => (
                <div
                    key={user._id}
                    className="flex gap-4 p-4 border rounded-xl shadow-sm hover:shadow-md transition"
                >
                    <img
                        src={user.profileImg}
                        alt={user.fullname}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-medium leading-tight">{user.fullname}</p>
                                <p className="text-sm text-gray-500">@{user.username}</p>
                            </div>
                            <button className="text-sm px-3 py-1 rounded-full border text-blue-600 hover:bg-blue-50">
                                {user.isFollowing ? "Following" : "Follow"}
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {user.bio}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {user.commonTags.map(tag => (
                                <span
                                    key={tag}
                                    className="bg-gray-100 text-xs px-2 py-1 rounded-full text-gray-600"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RelatedUsersMock
