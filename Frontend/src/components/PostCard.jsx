import { Bookmark, Heart, Send } from 'lucide-react'
import DialogBox from './DialogBox'
import CommentsDialog from './CommentsDialog'
import MyAvatar from './MyAvatar'
import { useDispatch, useSelector } from 'react-redux'
import { setPosts } from '@/store/postSlice'
import { useEffect, useState } from 'react'
import { myErrorRes } from '@/lib/utils'
import api from '@/lib/axios'
import { Link } from 'react-router-dom'
import { setLoggedInUser } from '@/store/authSlice'

const PostCard = ({ post }) => {
    const { user } = useSelector(state => state.auth)
    const { posts } = useSelector(state => state.post)
    const dispatch = useDispatch()
    const [liked, setLiked] = useState(post.likes.includes(user?._id) ??false);
    const [isBookmarked, setIsBookmarked] = useState(user?.bookmark?.includes(post?._id) ?? false);
    // console.log(liked , isBookmarked)

    // useEffect(() => {
    //     setLiked(post?.likes?.includes(user?._id) ?? false);
    // }, [post?.likes, user?._id]);

    // useEffect(() => {
    //     setIsBookmarked(user?.bookmark?.includes(post?._id) ?? false);
    // }, [user?.bookmark, post?._id]);


    const toggleLikeHandler = async () => {
        if (!post?._id) return;
        try {
            const res = await api.post(`/post/likeOrDislike/${post?._id}`);

            if (res.data.success) {
                setLiked(!liked);
                const updatedPost = posts.map(p =>
                    p?._id === post?._id
                        ? {
                            ...p,
                            likes: liked
                                ? p.likes.filter(id => id !== user?._id)
                                : [...p.likes, user?._id]
                        }
                        : p
                );
                dispatch(setPosts(updatedPost));
            }
        } catch (error) {
            myErrorRes(error);
        }
    };

    const toggleBookmarkHandler = async () => {
        if (!post?._id) return;
        try {
            const res = await api.patch(`/post/bookmark/${post?._id}`)
            if (res.data.success) {
                setIsBookmarked(!isBookmarked)
                const currentBookmarks = user?.bookmark || [];
                const updatedUser = {
                    ...user,
                    bookmark: isBookmarked
                        ? currentBookmarks.filter(id => id !== post._id)
                        : [...currentBookmarks, post._id]
                };
                dispatch(setLoggedInUser(updatedUser))
            }
        } catch (error) {
            myErrorRes(error)
        }
    }
    return (
        <div className='mb-5 text-foreground rounded-xl border-b-3 border-t-3 border-ring flex flex-col shadow-2xl'>
            <div className='flex flex-1 justify-between items-center p-4 '>
                <div className='flex gap-3 items-center cursor-pointer'>
                    <MyAvatar src={post?.author?.profilePic?.url} />
                    <Link to={`/profile/${post?.author?.username}`} className='text-sm md:text-md'>{post?.author?.username}</Link>
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
                            <Send className='cursor-pointer hover:scale-110 active:scale-95 transition-colors duration-200' />
                        </div>

                    </div>
                    <Bookmark onClick={toggleBookmarkHandler} stroke='currentColor' fill={isBookmarked ? "currentColor" : "none"} className='cursor-pointer hover:scale-110 active:scale-95 transition-colors duration-200' />
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
