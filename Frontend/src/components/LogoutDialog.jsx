import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const LogoutDialog = ({isOpen,setisOpen,logoutHandler}) => {
  return (
    <Dialog open={isOpen} onOpenChnage={setisOpen}>
          <DialogContent onInteractOutside={() => setisOpen(false)} showCloseButton={false}>
            <DialogHeader>
              <DialogTitle className={"text-foreground"}>Are you sure you want to logout?</DialogTitle>
              <DialogDescription> 
                You will need to log in again to access your account.
              </DialogDescription>
            </DialogHeader>
            <div className='flex items-center justify-end gap-2 py-2'>
              <Button variant="secondary" className={"cursor-pointer"} onClick={() => setisOpen(false)} >Cancel</Button>
              <Button onClick={logoutHandler} variant='destructive' className={"cursor-pointer"}>Logout</Button>
            </div>
          </DialogContent>
        </Dialog>
  )
}

export default LogoutDialog
