import api from "@/lib/axios";
import { setPosts } from "@/store/postSlice.js";
import axios from "axios";
import { useEffect } from "react"
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const useGetAllPost = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        const getAllPost = async () => {
            try {
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
            }
        }
        getAllPost()
    }, []);
}

export default useGetAllPost
