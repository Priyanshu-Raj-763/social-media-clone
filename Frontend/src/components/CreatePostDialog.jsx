import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useRef, useState } from "react"
import { Textarea } from "./ui/textarea"
import { readFileAsDataURL } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"
import { useDispatch, useSelector } from "react-redux"
import { setPosts } from "@/store/postSlice"
import api from "@/lib/axios"
const CreatePostDialog = ({ openPostDiaglog, setOpenPostDiaglog }) => {
    const dispatch = useDispatch()
    const { posts } = useSelector(state => state.post)
    const imageRef = useRef();
    const [file, setFile] = useState("");
    const [caption, setcaption] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const [loading, setLoading] = useState(false);
    const fileChangeHandler = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file)
            const dataUrl = await readFileAsDataURL(file);
            setImagePreview(dataUrl)
        }
    }
    const postHandler = async () => {
        const formData = new FormData();
        formData.append("caption", caption);
        formData.append("image", file)
        try {
            setLoading(true)
            const response = await api.post("/post/create",formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (response.data.success) {
                dispatch(setPosts([response.data.data, ...posts]))
                setOpenPostDiaglog(false)
                toast.success(response.data.message);
            }
        } catch (error) {
            // console.log(error)
            if (axios.isAxiosError(error)) {
                toast.error(
                    error.response?.data?.message || "Something went wrong"
                );
            } else {
                toast.error("Unexpected error");
            }
        } finally {
            setLoading(false)
        }
    }
    return (
        <Dialog open={openPostDiaglog} onOpenChnage={setOpenPostDiaglog}>
            <DialogContent className={"border-none"} onInteractOutside={() => {
                setOpenPostDiaglog(false)
                setImagePreview("")
            }} showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle className={"text-center text-foreground"}>Create new post</DialogTitle>
                    <DialogDescription className={"text-center"}>
                        select your image from your device
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center justify-center min-h-80 flex-col gap-4">
                    {
                        imagePreview && (
                            <div className="flex items-center justify-center">
                                <img className=" max-h-80 w-80 rounded-md object-cover" src={imagePreview} alt="image_preview" />
                            </div>
                        )
                    }
                    <Textarea className={""} placeholder={"Write your caption here.."} value={caption} onChange={(e) => setcaption(e.target.value)} />
                    <input ref={imageRef} type="file" accept="image/*" className="hidden" onChange={fileChangeHandler} />
                    <Button onClick={() => {
                        imageRef.current.click()
                    }} className={"rounded-lg cursor-pointer mx-auto"}>Select From Device</Button>
                </div>
                {
                    imagePreview && caption && (
                        <Button onClick={postHandler} disabled={loading} className="bg-accent text-accent-foreground hover:bg-accent-foreground/10 cursor-pointer transition-colors duration-100 border border-accent-foreground">
                            {loading ? (<Loader2 className="w-4 h-4 animate-spin" />) : "Post"}
                        </Button>
                    )
                }
            </DialogContent>
        </Dialog>
    )
}
export default CreatePostDialog
