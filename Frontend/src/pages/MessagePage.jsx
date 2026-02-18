import ChatBox from '@/components/ChatBox'
import MyAvatar from '@/components/MyAvatar'
import { MessageCircleOff } from 'lucide-react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

const MessagePage = () => {
  const { user, suggestedUsers } = useSelector(s => s.auth)
  const { onlineUsers } = useSelector(s => s.chat)
  const [selectedUser, setSelectedUser] = useState(null);
  return (
    <section className='h-screen flex text-foreground bg-background'>
      <div className='w-1/4 border-r border-r-border'>
        <h1 className='font-bold text-xl p-2'>{user?.username}</h1>
        <hr />
        <div className=''>
          {
            suggestedUsers.length > 0 ? suggestedUsers.map((suggestedUser) => {
              const isOnline = onlineUsers.includes(suggestedUser?._id)
              return (<div onClick={() => setSelectedUser(suggestedUser)} key={suggestedUser?._id} className='flex gap-3 p-2 cursor-pointer '>
                <MyAvatar src={suggestedUser?.profilePic?.url} />
                <div className='flex flex-col'>
                  <span className='font-medium'>{suggestedUser?.username}</span>
                  <span className={`text-xs ${isOnline ? "text-green-500" : "text-red-500"}`}>{isOnline ? "online" : "offline"}</span>
                </div>
              </div>)
            }) : (
              <div>no users</div>
            )
          }
        </div>
      </div>
      {
        selectedUser ? (<ChatBox isOnline={onlineUsers.includes(selectedUser?._id)} selectedUser={selectedUser} />) : (
          <div className='h-screen w-full flex gap-4 flex-col items-center justify-center'>
            <MessageCircleOff className='h-24 w-24' />
            <h1 className='text-2xl text-accent-foreground '>No Chats!!</h1>

          </div>)
      }
    </section>
  )
}

export default MessagePage
