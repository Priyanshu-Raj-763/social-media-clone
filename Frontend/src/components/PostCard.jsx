import { Bookmark, Heart, Send } from 'lucide-react'
import DialogBox from './DialogBox'
import CommentsDialog from './CommentsDialog'
import MyAvatar from './MyAvatar'
import { useDispatch, useSelector } from 'react-redux'
import { setPosts } from '@/store/postSlice'
import { useState } from 'react'
import axios from 'axios'
import { myErrorRes } from '@/lib/utils'
import api from '@/lib/axios'

const PostCard = ({ post }) => {
    const { user } = useSelector(state => state.auth)
    const { posts } = useSelector(state => state.post)
    const dispatch = useDispatch()
    const [liked, setliked] = useState(post.likes.includes(user._id) || false);
    const toggleLikeHandler = async () => {
        try {
            const res = await api.post(`/post/likeOrDislike/${post._id}`, {},)
            if (res.data.success) {
                setliked(!liked);
                const updatedPost = posts.map(p => p._id === post._id ? {
                    ...p,
                    likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
                } : p)
                dispatch(setPosts(updatedPost))
            }
        } catch (error) {
           myErrorRes(error)
        }
    }
    return (
        <div className='mb-5 text-foreground rounded-xl border-b-3 border-ring flex flex-col'>
            <div className='flex flex-1 justify-between items-center p-4 '>
                <div className='flex gap-3 items-center cursor-pointer'>
                    <MyAvatar src={post?.author?.profilePic?.url} />
                    <span className='text-sm md:text-md'>{post?.author?.username}</span>
                </div>
                <div>
                    <DialogBox post={post} />
                </div>
            </div>
            <div className='flex-2 max-w-270 overflow-hidden max-h-337.5' >
                <img className='w-full object-cover rounded-md' src={post?.image?.url} alt="" />
            </div>
            <div className=' p-3 '>
                <div className='flex justify-between'>
                    <div className='flex gap-3'>
                        <div className='flex gap-1'>
                            <Heart onClick={toggleLikeHandler} fill={liked ? "currentColor" : "none"}
                                stroke="currentColor"
                                className={`cursor-pointer transition-transform duration-200 ease-in-out ${liked ? "text-red-500" : "text-foreground"} hover:scale-110 active:scale-95`}
                            />
                            <span>{post.likes?.length}</span>
                        </div>
                        <div className='flex gap-1 items-center' >
                            <CommentsDialog post={post} />
                        <span>{post?.comments?.length}</span>
                        </div>
                        <div className='flex items-center' >
                        <Send  className='cursor-pointer hover:scale-110 active:scale-95 transition-colors duration-200' />
                        </div>
                        
                    </div>
                    <Bookmark className='cursor-pointer hover:scale-110 active:scale-95 transition-colors duration-200' />
                </div>
                <div className='space-x-2 mt-2'>
                    <span className='font-semibold text-sm md:text-md'>{post?.author?.username}</span>
                    <span className='text-sm md:text-md'> {post?.caption}</span>
                </div>
            </div>
        </div >
    )
}

export default PostCard
