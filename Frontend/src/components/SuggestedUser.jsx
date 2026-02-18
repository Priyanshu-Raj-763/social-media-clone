import { myErrorRes } from '@/lib/utils';
import axios from 'axios';
import { useEffect, useState } from 'react'
import MyAvatar from './MyAvatar';
import { Link } from 'react-router-dom';

function SuggestedUser({suggestedUsers}) {
   
    return (
        <div>
            <div className='text-sm flex gap-4'>
                <h2 className='font-semibold'>Suggested for you</h2>
                <span className='font-medium cursor-pointer'>See all.</span>
            </div>
            {
                suggestedUsers?.length > 0 && (
                    suggestedUsers.map((user) => (
                        <div key={user._id} >
                            <Link className=' p-4 flex gap-4 items-center' to={`/profile/${user?.username}`}>
                                <MyAvatar className={"w-10 h-10"} src={user?.profilePic?.url} />
                                <span>{user?.username}</span>
                            </Link>
                        </div>
                    ))
                )
            }
        </div>
    )
}

export default SuggestedUser
