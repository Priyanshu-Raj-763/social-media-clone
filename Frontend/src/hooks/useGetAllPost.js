import api from "@/lib/axios";
import { setPosts } from "@/store/postSlice.js";
import axios from "axios";
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const useGetAllPost = () => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch()
    useEffect(() => {
        const getAllPost = async () => {
            try {
                setLoading(true)
                const response = await api.get("/post/getpost",)
                if (response.data.success) {
                    dispatch(setPosts(response.data.data))
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    toast.error(
                        error.response?.data?.message || "Something went wrong"
                    );
                } else {
                    toast.error("Unexpected error");
                }
            }finally{
                setLoading(false)
            }
        }
        getAllPost()
    }, []);
    return loading
}

export default useGetAllPost
