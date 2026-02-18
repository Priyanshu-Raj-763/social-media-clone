import api from "@/lib/axios";
import { myErrorRes } from "@/lib/utils";
import { setMessages } from "@/store/chatSlice";
import axios from "axios";
import { useEffect } from "react"
import { useDispatch } from "react-redux";


const useGetAllMessages = (id) => {
    const dispatch = useDispatch()
    useEffect(() => {
        const getAllMessages = async () => {
            try {
                const res = await api.get(`/message/getMessage/${id}`)
                if (res.data.success) {
                    dispatch(setMessages(res.data.data))

                }
            } catch (error) {
                myErrorRes(error)
            }
        }
        getAllMessages()
    }, [id,dispatch]);
}

export default useGetAllMessages
