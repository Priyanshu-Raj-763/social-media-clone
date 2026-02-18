import { Heart, MessageCircle } from 'lucide-react'
import React from 'react'

const DisplayPost = ({post}) => {
    return (
        <div className='overflow-hidden bg-primary-foreground aspect-square relative cursor-pointer group flex items-center'>
            <div className='flex items-center gap-6 justify-center bg-black/70 absolute opacity-0 group-hover:opacity-100 inset-0 transition-opacity duration-200'>
                <span className='flex gap-2 items-center'><Heart />{post?.likes.length}</span>
                <span className='flex gap-2 items-center'><MessageCircle /> {post?.comments?.length}</span>
            </div>
            <img src={post?.image?.url} alt="post_image" />
        </div>
    )
}

export default DisplayPost
