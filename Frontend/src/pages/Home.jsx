import React from 'react'
import RightSideBar from '../components/RightSideBar'
import useGetAllPost from '@/hooks/useGetAllPost'
import Posts from '@/components/Posts'

const Home = () => {
  useGetAllPost()
  return (
    <div className=' min-h-screen md:flex text-foreground bg-background'>
      <div className='flex-3 flex justify-center py-8 px-4'>
        <Posts />
      </div>
      <div className='flex-2'>
        <RightSideBar />
      </div>
    </div>
  )
}

export default Home
