import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const MyAvatar = ({ src = "https://imgs.search.brave.com/Vhx9ztJ8zy3-GQhynXeSiq4tQizwKLO_Jsvr2o8Qdq8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTIy/MzY3MTM5Mi92ZWN0/b3IvZGVmYXVsdC1w/cm9maWxlLXBpY3R1/cmUtYXZhdGFyLXBo/b3RvLXBsYWNlaG9s/ZGVyLXZlY3Rvci1p/bGx1c3RyYXRpb24u/anBnP3M9NjEyeDYx/MiZ3PTAmaz0yMCZj/PXMwYVRkbVQ1YVU2/YjhvdDdWS20xMURl/SUQ2TmN0UkNwQjc1/NXJBMUJJUDA9", Fallback = "CN", className }) => {
  return (
    <Avatar className={`${className}`}>
      <AvatarImage src={src} />
      <AvatarFallback>{Fallback}</AvatarFallback>
    </Avatar>
  )
}

export default MyAvatar
