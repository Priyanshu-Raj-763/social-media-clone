import { getSocket } from "@/lib/socket";
import { setMessages } from "@/store/chatSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"


const useGetRTMessages = () => {
    const dispatch = useDispatch();
    const  socket  = getSocket()
    const { messages } = useSelector(s => s.chat)
    useEffect(() => {
        socket?.on("newMessage", (newMessage) => {
            dispatch(setMessages([...messages, newMessage]))
        })

        return () => {
            socket?.off("newMessage")
        }
    }, [messages, setMessages]);
}

export default useGetRTMessages
