
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Loader2, MoreHorizontal } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { removePost } from '@/store/postSlice.js';
import { toast } from 'sonner';
import api from '@/lib/axios';

const DialogBox = ({ post }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setloading] = useState(false);
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const deleteHandler = async () => {
        try {
            setloading(true)
            const response = await api.delete(`/post/delete/${post?._id}`,)
            if (response.data.success) {
                dispatch(removePost(post._id));
                toast.success(response.data.message)
                setIsOpen(false)
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(
                    error.response?.data?.message || "Something went wrong"
                );
            } else {
                toast.error("Unexpected error");
            }
        } finally {
            setloading(false)
        }
    }
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild >
                <MoreHorizontal className='cursor-pointer' />
            </DialogTrigger>
            <DialogContent className={"text-foreground p-0 w-md rounded-xl border-none gap-0"} onInteractOutside={() => setIsOpen(false)} showCloseButton={false}>
                <DialogHeader className={"sr-only"}>
                    <DialogTitle></DialogTitle>
                    <DialogDescription> </DialogDescription>
                </DialogHeader>
                <div className='text-md md:text-lg text-red-500 w-full p-4  font-semibold text-center cursor-pointer border-b border-border active:bg-secondary transition-colors duration-200 '>Unfollow</div>
                <div className='w-full p-4 text-md md:text-lg font-semibold text-center cursor-pointer border-b border-border active:bg-secondary transition-colors duration-200'>Add to Favourite</div>
                {user && user?._id === post?.author?._id && <div onClick={deleteHandler} className='text-red-500 w-full p-4 text-md md:text-lg font-semibold cursor-pointer border-b border-border active:bg-secondary transition-colors duration-200 flex justify-center'>{loading ? (<Loader2 className='animate-spin' />) : "Delete"}</div>}
                <div className='w-full p-4 text-md md:text-lg font-semibold text-center cursor-pointer border-b border-border active:bg-secondary transition-colors duration-200'>About This Account</div>
                <div onClick={() => setIsOpen(false)} className='w-full p-4 text-md md:text-lg font-semibold text-center cursor-pointer active:bg-secondary transition-colors duration-200'>Cancel</div>
            </DialogContent>
        </Dialog>
    )
}

export default DialogBox
