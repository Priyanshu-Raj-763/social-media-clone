import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const MyAvatar = ({src,Fallback="CN" ,className}) => {
  return (
    <Avatar className={`${className}`}>
      <AvatarImage src={src} />
      <AvatarFallback>{Fallback}</AvatarFallback>
    </Avatar>
  )
}

export default MyAvatar
