import { useSelector } from "react-redux"
import PostCard from "./PostCard"

const Posts = () => {
  const { posts } = useSelector(state => state.post)
  return (
    <div className="">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}

    </div>
  )
}

export default Posts
