import React, { useState } from 'react'
import MyAvatar from './MyAvatar'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { myErrorRes } from '@/lib/utils'
import { useDispatch, useSelector } from 'react-redux'
import { setMessages } from '@/store/chatSlice'
import useGetAllMessages from '@/hooks/useGetAllMessages'
import axios from 'axios'
import useGetRTMessages from '@/hooks/useGetRTMessages'
import api from '@/lib/axios'


const ChatBox = ({ selectedUser, isOnline }) => {
    useGetRTMessages();
    const { user } = useSelector(s => s.auth)
    useGetAllMessages(selectedUser?._id)
    const [textMessage, setTextMessage] = useState("");
    const { messages } = useSelector(s => s.chat)
    const dispatch = useDispatch()

    const sendMessageHandler = async () => {
        try {
            const res = await api.post(`/message/send/${selectedUser?._id}`, { textMessage });

            if (res.data.success) {
                console.log("newmessage = ", res.data.data)
                dispatch(setMessages([...messages, res.data.data]))
                setTextMessage("")
            }

        } catch (error) {
            myErrorRes(error)
        }
    }
    return (
        <div className='flex-1 flex flex-col '>
            <div className='flex  gap-4 items-center p-2'>
                <MyAvatar src={selectedUser?.profilePic?.url} />
                <div className='flex flex-col'>
                    <span className='text-lg font-medium'>{selectedUser?.username}</span>
                    <span className={`text-xs ${isOnline ? "text-green-500" : "text-red-500"}`}>{isOnline ? "online" : "offline"}</span>
                </div>
            </div>
            <hr />
            <div className='flex-1 overflow-y-auto'>
                <div className='flex flex-col gap-3 items-center justify-center my-10'>
                    <MyAvatar className={"w-25 h-25"} src={selectedUser?.profilePicUrl} />
                    <Button className={"cursor-pointer"} variant='secondary'>View Profile</Button>
                </div>
                <div className=''>
                    {messages.length > 0 && messages?.map((msg) => (
                        <div className={`flex p-2   ${msg?.senderId === user?._id ? "justify-end" : "justify-start"}`} key={msg?._id}>
                            <span className={`p-2 rounded-2xl ${msg?.senderId === user?._id ? "bg-primary" : "bg-sidebar"}`}>
                                {
                                    msg?.message
                                }
                            </span>

                        </div>
                    ))}
                </div>
            </div>
            <div className='flex p-2 items-center gap-2'>
                <Input onChange={(e) => setTextMessage(e.target.value)} value={textMessage} className={""} placeholder={"send message"} />
                <Button onClick={sendMessageHandler} >send</Button>
            </div>
        </div>
    )
}

export default ChatBox
