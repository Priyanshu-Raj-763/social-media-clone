import { useSelector } from "react-redux"
import PostCard from "./PostCard"
import useGetAllPost from "@/hooks/useGetAllPost"
import { Spinner } from "./ui/spinner"

const Posts = () => {
  const loading = useGetAllPost()
  const { posts } = useSelector(state => state.post)
  if(loading){
    return(
      <div className="flex items-center justify-center">
      <Spinner className="size-8" />
    </div>
    )
  }
  return (
    <div className="">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}

    </div>
  )
}

export default Posts
