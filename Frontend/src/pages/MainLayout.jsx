import { Outlet, } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import BottomBar from '@/components/BottomBar'


const MainLayout = () => {
  return (
    <main className=' md:flex bg-background transition-all duration-200'>
      <div className='flex-1'>
        <Sidebar />
        <BottomBar />
      </div>
      <div className='flex-4'>
        
        <Outlet />
      </div>
    </main>
  )
}

export default MainLayout
