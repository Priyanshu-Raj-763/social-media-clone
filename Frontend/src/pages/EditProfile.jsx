import MyAvatar from '@/components/MyAvatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { setLoggedInUser } from '@/store/authSlice'
import { toast } from 'sonner'
import { myErrorRes } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'
import api from '@/lib/axios'

const EditProfile = () => {
  const { user } = useSelector(s => s.auth);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [preview, setPreview] = useState(user?.profilePic?.url);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      username: user?.username,
      bio: user?.bio,
      gender: user?.gender
    }
  })
  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image too large");
      return;
    }
    setValue("profilePic", file)
    const url = URL.createObjectURL(file)
    setPreview(url);
  }
  const updateProfileHandler = async (data) => {
    try {
      setLoading(true)
      const formData = new FormData()
      if (data.username?.trim()) {
        formData.append("username", data.username.trim());
      }

      if (data.bio?.trim()) {
        formData.append("bio", data.bio);
      }

      if (data.gender) {
        formData.append("gender", data.gender);
      }

      if (data.profilePic instanceof File) {
        formData.append("profilePic", data.profilePic);
      }
      const res = await api.put("/user/profile/edit", formData,{
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data?.success) {
        const updatedUser = res.data.data;
        dispatch(setLoggedInUser(updatedUser));
        toast.success(res.data.message || "Profile updated");
        navigate(`/profile/${updatedUser.username}`, { replace: true });
      }
    } catch (error) {
      myErrorRes(error)
    } finally {
      setLoading(false)
    }
  }
  const imageRef = useRef()
  return (
    <div className='pl-40 min-h-screen pt-10'>
      <div className='max-w-fit  border border-border p-4 text-foreground space-y-4'>
        <h1 className='text-2xl font-bold  p-5'>Edit Profile</h1>
        <form onSubmit={handleSubmit(updateProfileHandler)} className='space-y-4'>
          <div className=' p-4 flex gap-4 items-center justify-between w-xl bg-popover rounded-xl'>
            <MyAvatar className={"w-10 h-10"} src={preview} />
            <input type="file" accept="image/*" className='hidden' onChange={fileChangeHandler} ref={imageRef} />
            <Button type="button" className={"cursor-pointer"} onClick={() => imageRef.current.click()}>Edit Photo</Button>
          </div>
          <div className=''>
            <Label htmlFor="username" className={"mb-2 font-semibold text-md"} >Username</Label>
            <Input id="username" name="username" className={""} {...register("username", {
              required: "Username is required",
            })} />
          </div>
          <div>
            <Label htmlFor="bio" className={"mb-2 font-semibold text-md"}>Bio</Label>
            <Input id="bio" name="bio" className={""} {...register("bio")} />
          </div>
          <div>
            <Label htmlFor="gender" className={"mb-2 font-semibold text-md"} >Gender</Label>
            <Select defaultValue={user?.gender || "Select Gender"}
              onValueChange={(v) => setValue("gender", v)}>
              <SelectTrigger className="w-full max-w-48">
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className='flex justify-end'>
            <Button disabled={loading} type="submit" className={"cursor-pointer"}>{loading ? "Saving..." : "Save"}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProfile
