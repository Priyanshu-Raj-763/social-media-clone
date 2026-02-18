import DisplayPost from '@/components/DisplayPost';
import MyAvatar from '@/components/MyAvatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';
import { myErrorRes } from '@/lib/utils';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

function Profile() {
    const params = useParams()
    const { user } = useSelector(s => s.auth)
    const username = params.id;
    const [userProfile, setuserProfile] = useState(null);
    const [selectedTab, setselectedTab] = useState("post");
    useEffect(() => {
        const getUserProfile = async () => {
            try {
                const res = await api.get(`/user/profile/${username}`);
                if (res.data.success) {
                    setuserProfile(res.data.data)
                }
            } catch (error) {
                myErrorRes(error)
            }
        }

        getUserProfile()
    }, [username]);
    return (
        <div className='min-h-screen text-foreground px-2'>
            <div className='max-w-4xl flex flex-col gap-6'>
                <section className='flex items-center gap-4 pt-10 md:pl-50'>
                    <MyAvatar className={"md:w-40 md:h-40 w-30 h-30"} src={userProfile?.profilePic?.url} />
                    <div className='flex flex-col gap-4 max-w-lg ml-5'>
                        <h1 className=' text-2xl md:text-4xl font-semibold'>{userProfile?.username}</h1>
                        <div className='flex gap-4 text-sm font-medium'>
                            <p><span className='font-semibold'>{userProfile?.posts?.length} </span>posts</p>
                            <p><span className='font-semibold'>{userProfile?.follower?.length} </span>follower</p>
                            <p><span className='font-semibold'>{userProfile?.following?.length} </span>following</p>
                        </div>
                        <h2 className='w-fit'>{userProfile?.bio || ".........................."}</h2>
                        <Badge className={"cursor-pointer w-fit"} variant='secondary'>
                            @{userProfile?.username}
                        </Badge>
                    </div>
                </section>
                <div className='flex justify-center gap-6'>
                    {
                        user?.username === username ? <Link to={"/account/edit"} className={"md:px-20 px-10 py-2 rounded-lg flex items-center bg-secondary text-secondary-foreground hover:bg-secondary/80"} >Edit profile</Link> : <Button className={"md:px-20 px-10 py-2 rounded-lg flex items-center bg-sky-600 text-white cursor-pointer hover:bg-sky-500"} >Follow</Button>
                    }
                    {
                        user?.username === username ?  <Link className={"md:px-20 px-10 py-2 rounded-lg flex items-center bg-secondary text-secondary-foreground hover:bg-secondary/80"} >View Archieve</Link> : <Button className={"md:px-20 px-10 py-2 rounded-lg flex items-center bg-emerald-600 text-white cursor-pointer hover:bg-emerald-500"} >Message</Button>
                    }
                   
                </div>
            </div>
            <div className='max-w-4xl mt-6'>
                <div className='flex items-center justify-center gap-4'>
                    <Button onClick={() => setselectedTab("post")} variant='link' className={`cursor-pointer transition-all duration-200 text-md p-2 text-secondary-foreground ${selectedTab === "post" && "font-semibold underline "}`}>Post</Button>
                    <Button onClick={() => setselectedTab("saved")} variant='link' className={`cursor-pointer transition-all duration-200 text-md p-2 text-secondary-foreground ${selectedTab === "saved" && "font-semibold underline "}`}>Saved</Button>
                </div>
                <div className='grid grid-cols-3 gap-1'>
                    {
                        selectedTab === "post" ? (userProfile?.posts?.map((post) => (
                            <DisplayPost key={post._id} post={post} />
                        ))) : (userProfile?.bookmark?.map((post) => (
                            <DisplayPost key={post._id} post={post} />
                        )))
                    }
                </div>
                <div>

                </div>

            </div>
        </div>
    )
}

export default Profile
