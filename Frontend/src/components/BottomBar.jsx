import { Heart, Home, MessageCircle, PlusSquare, Search } from 'lucide-react'
import { useState } from 'react';
import CreatePostDialog from './CreatePostDialog';
import MyAvatar from './MyAvatar';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const BottomBar = () => {
    const navigate = useNavigate()
    const { user } = useSelector(state => state.auth)
    const [selectedTab, setSelectedTab] = useState("Home");
    const [openPostDiaglog, setOpenPostDiaglog] = useState(false)
    const links = [
        {
            title: "Home", icon: <Home fill={selectedTab === "Home" ? "currentColor" : "none"}
                stroke="currentColor" className={`cursor-pointer transition-transform duration-200 ease-in-out  hover:scale-110 active:scale-95`} />
        },
        { title: "Search ", icon: <Search /> },
        { title: "Create", icon: <PlusSquare /> },
        { title: "Messages", icon: <MessageCircle /> },
        {
            title: "Notification", icon: <Heart fill={selectedTab === "Notification" ? "currentColor" : "none"}
                stroke="currentColor" className={`cursor-pointer transition-transform duration-200 ease-in-out  hover:scale-110 active:scale-95`} />
        },
        {
            title: "Profile", icon: (<MyAvatar className={"h-6 w-6"} src={user?.profilePic?.url} />)
        },
    ]
    const bottomBarHandler = (text) => {
        if (text === "Home") {
            navigate(`/`)
        } else if (text === "Create") {
            setOpenPostDiaglog(true);
        } else if (text === "Profile") {
            navigate(`/profile/${user?.username}`)
        } else if (text === "Messages") {
            navigate("/message")
        }
        else if (text === "Notification") {
            navigate("/notification")
        }
    }

    return (
        <div className=' md:hidden z-20 w-full bg-background/50
        backdrop-blur-sm text-foreground fixed h-10 bottom-0 '>
            <div className='flex justify-between items-center'>
                {links.map((link, idx) => (
                    <div onClick={() => {
                        setSelectedTab(link.title)
                        bottomBarHandler(link.title)
                    }} key={idx} className='py-1 px-4 cursor-pointer'>
                        {link.icon}
                    </div>
                ))}
                <CreatePostDialog openPostDiaglog={openPostDiaglog} setOpenPostDiaglog={setOpenPostDiaglog} />
            </div>
        </div>
    )
}

export default BottomBar
