import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '@/store/authSlice.js'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import LogoutDialog from './LogoutDialog'
import CreatePostDialog from './CreatePostDialog'
import { myErrorRes } from '@/lib/utils'
import api from '@/lib/axios'
import ThemeToggleBtn from './ThemeToggleBtn'

const Sidebar = () => {
  const [selected, setselected] = useState();
  const { user } = useSelector(state => state.auth)
  const {likeNotification} = useSelector(s=>s.realTimeNotification)
  const dispatch = useDispatch()
  const links = [
    { title: "Home", icon: <Home /> },
    { title: "Search", icon: <Search /> },
    { title: "Explore", icon: <TrendingUp /> },
    { title: "Messages", icon: <MessageCircle /> },
    { title: "Notification", icon: <Heart /> },
    { title: "Create", icon: <PlusSquare /> },
    {
      title: "Profile", icon: (<Avatar className={"h-7 w-7"}>
        <AvatarImage src={user?.profilePic?.url} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>)
    },
    { title: "Logout", icon: <LogOut /> },
  ]

  const navigate = useNavigate()
  const [openLogoutDiaglog, setOpenLogoutDiaglog] = useState(false)
  const [openPostDiaglog, setOpenPostDiaglog] = useState(false)
  const logoutHandler = async () => {
    try {
      const response = await api.post("/user/logout", {},)
      if (response.data.success) {
        toast.success(response.data.message)
        dispatch(logoutUser())
      }
    } catch (error) {
      console.log(error)
      myErrorRes(error)
    } finally {
    }
  }
  const sidebarHandler = (text) => {
    setselected(text)
    if (text === "Logout") {
      setOpenLogoutDiaglog(true)
    } else if (text === "Create") {
      setOpenPostDiaglog(true);
    } else if (text === "Profile") {
      navigate(`/profile/${user?.username}`)
    } else if (text === "Home") {
      navigate(`/`)
    } else if (text === "Messages") {
      navigate("/message")
    } else if (text === "Search") {
      navigate("/search")
    } else if (text === "Explore") {
      navigate("/trending")
    } else if (text === "Notification") {
      navigate("/notification")
    }
  }
  return (
    <div className=' fixed md:block hidden w-1/5 md:top-0 h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border z-10'>
      <div className='flex items-center justify-between px-4'>
        <h1 className='m-4 text-xl font-bold'>Logo</h1>
        <ThemeToggleBtn/>
      </div>
      <div>
        {links.map((link, idx) => (
          <div onClick={() => sidebarHandler(link.title)} key={idx} className={`flex gap-3 p-4 relative  ${selected ===link.title ? "bg-primary":"hover:bg-primary/50"} transition-all duration-100 ease-in-out cursor-pointer`}>
            <div className='relative'>{link.icon}
           {link.title ==="Notification" && likeNotification.length > 0  &&(
            <div className='bg-red-600 rounded-full text-center w-4 h-4 text-xs absolute -top-2 -left-2'>{likeNotification?.length}</div>
           )}
            </div>
            <span >{link.title}</span>
          </div>
        ))}
        <LogoutDialog isOpen={openLogoutDiaglog} setisOpen={setOpenLogoutDiaglog} logoutHandler={logoutHandler} />
        <CreatePostDialog openPostDiaglog={openPostDiaglog} setOpenPostDiaglog={setOpenPostDiaglog} />
      </div >
    </div >
  )
}

export default Sidebar
