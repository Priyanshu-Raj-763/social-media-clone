import { useDispatch, useSelector } from 'react-redux'
import MyAvatar from './MyAvatar'
import SuggestedUser from './SuggestedUser'
import axios from 'axios';
import { useEffect } from 'react'
import { setSuggestedUsers } from '@/store/authSlice';
import api from '@/lib/axios';

const RightSideBar = () => {
  const { user, suggestedUsers } = useSelector(store => store.auth)
  const dispatch = useDispatch()
  useEffect(() => {
    const getSuggestedUser = async () => {
      try {
        const res = await api.get("/user/suggested",);
        if (res.data.success) {
          dispatch(setSuggestedUsers(res.data.data))
        }
      } catch (error) {
        myErrorRes(error)
      }
    }
    getSuggestedUser()
  }, []);
  return (
    <div className='w-full text-foreground hidden md:block'>
      <div className=' p-4 my-4 flex gap-4 items-center'>
        <MyAvatar className={"w-10 h-10"} src={user?.profilePic?.url} />
        <span>{user?.username}</span>
      </div>
      <SuggestedUser suggestedUsers={suggestedUsers} />

    </div>
  )
}

export default RightSideBar
