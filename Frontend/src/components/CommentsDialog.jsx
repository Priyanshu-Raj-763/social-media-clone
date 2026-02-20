import { MessageCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Separator } from "@/components/ui/separator"
import { useEffect, useState } from 'react';
import MyAvatar from './MyAvatar';
import { Input } from './ui/input';
import { Button } from './ui/button';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/store/postSlice';
import { myErrorRes } from '@/lib/utils';
import api from '@/lib/axios';

const CommentsDialog = ({ post }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [comments, setcomments] = useState([]);
    const { posts } = useSelector(s => s.post)
    const dispatch = useDispatch()
    const [text, setText] = useState("");
    useEffect(() => {
        if (isOpen) {
            getCommentsHandler()
        }
    }, [isOpen]);
    const getCommentsHandler = async () => {
        try {
            const res = await api.get(`/post/getcomment/${post._id}`, { withCredentials: true })
            if (res.data.success) {
                setcomments(res.data.data)
                const updatedPost = posts.map(p => p._id === post._id ? {
                    ...p,
                    comments: res.data.data
                } : p)
                dispatch(setPosts(updatedPost))
            }
        } catch (error) {
            myErrorRes(error)
        }
    }
    const addCommentHandler = async () => {
        try {
            const res = await axios.post(`http://localhost:3000/api/v1/post/create/comment/${post._id}`, { text }, { withCredentials: true })
            if (res.data.success) {
                const newList = [res.data.data, ...comments]
                setcomments(newList)
                const updatedPost = posts.map(p => p._id === post._id ? {
                    ...p,
                    comments: newList
                } : p);
                dispatch(setPosts(updatedPost))
                setText("")
            }
        } catch (error) {

        }
    }
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <MessageCircle className='cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200' onClick={() => setIsOpen(true)} />
            <DialogContent className={"p-0 h-4/5 min-w-3xl rounded-xl border-none"} onInteractOutside={() => setIsOpen(false)} showCloseButton={false}>
                <DialogHeader className={"sr-only"}>
                    <DialogTitle> Post Comments</DialogTitle>
                    <DialogDescription> View and add comments</DialogDescription>
                </DialogHeader>
                <div className='flex h-full bg-background'>
                    <div className='w-1/2 flex items-center border-r border-border'>
                        <img className='h-fit w-full' src={post?.image?.url} alt="post_image" />
                    </div>
                    <div className='w-1/2  text-foreground flex flex-col'>
                        <div className='flex items-center justify-start gap-2 p-4'>
                            <MyAvatar src={post?.author?.profilePic?.url} />
                            <span className='font-bold'>{post?.author?.username}</span>
                        </div>
                        <Separator />
                        {/* <div className='flex justify-start items-center gap-2 p-4 '>
                            <MyAvatar src={post?.author?.profilePicUrl} />
                            <span className='font-bold'>{post?.author?.username}</span>
                            <p className=' line-clamp-1 w-1/2'>{post?.caption}</p>
                        </div> */}
                        <div className='grow'>
                            {
                                comments?.map((c) => (
                                    <div className='flex justify-start items-center gap-2 px-4 py-2' key={c?._id}>
                                        <MyAvatar src={c.author?.profilePic?.url} />
                                        <span className='font-semibold text-md'> {c.author?.username}</span>
                                        <span className='text-sm'>{c?.text}</span>
                                    </div>
                                ))
                            }
                        </div>
                        <div className='mx-2 w-full flex items-center gap-2 justify-center p-3'>
                            <Input placeholder={"Add a comment.."} value={text} onChange={(e) => setText(e.target.value)} className={""} />
                            <Button className={"cursor-pointer"} onClick={addCommentHandler}>Post</Button>
                        </div>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    )
}

export default CommentsDialog
