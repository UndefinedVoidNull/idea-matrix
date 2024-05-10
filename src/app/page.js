"use client"
import { MatrixSlides } from "@/components/MatrixSlides"

// import dynamic from 'next/dynamic'
// const MatrixSlides = dynamic(() => import('@/components/MatrixSlides'), { ssr: false })
// console.log(MatrixSlides)

export default function Home() {
  return (
    <div className='flex flex-row w-screen h-screen justify-center items-center'>
      <div>
        <MatrixSlides />
      </div>
    </div>
  )
}