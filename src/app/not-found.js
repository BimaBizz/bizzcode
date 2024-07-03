'use client'
import { useRouter } from 'next/navigation'
 
export default function NotFound() {

  const router = useRouter()
 
  return (
    <main className="h-screen w-full flex justify-center items-center bg-cover bg-no-repeat bg-center" style={{backgroundImage: "url('/404.png')"}}>
        <div className='flex flex-col justify-center items-center'>
            <h2 className='text-9xl font-bold'>404</h2>
            <p className='text-3xl font-semibold my-5'>Page not found</p>
            <button
                onClick={() => router.back()}
                className='bg-indigo-500 hover:bg-indigo-700 rounded-lg text-white font-bold py-2 px-4'
            >
               Go Back
            </button>
        </div>
    </main>
  )
}