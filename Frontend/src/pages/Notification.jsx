import MyAvatar from '@/components/MyAvatar'
import { setNotification } from '@/store/RTNSlice'
import { BellOff } from 'lucide-react'
import  { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const Notfication = () => {
  const { likeNotification } = useSelector(s => s.realTimeNotification)
  const dispatch = useDispatch()
  useEffect(() => {
    return () => {
      dispatch(setNotification([]))
    }
  }, []);
  return (
    <div className=' flex justify-center min-h-screen bg-background text-secondary-foreground text-center mt-10'>
      <div className='flex flex-col gap-2'>
        {likeNotification?.length > 0 ? (likeNotification.map((noti) => (
          <div className='flex max-w-2xl items-center rounded-xl gap-6 shadow-xl shadow-accent-foreground p-2 border-b border-b-primary'>
            <MyAvatar className={"w-10 h-10 "} src={noti?.userDetails?.profilePic?.url} />
            <span className='text-lg grow'>{noti?.userDetails?.username} liked your post</span>
            <img className='w-10 h-10 rounded-md' src={noti?.post?.image?.url} />
          </div>
        ))) : (
          <div className='text-2xl font-semibold text-red-500 font-mono flex gap-6 items-center'>
            <BellOff className='text-red-500  ' />
            <span>No Notifications</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default Notfication
