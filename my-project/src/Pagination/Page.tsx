import React, { useContext } from 'react'
import { movieContext } from '../Context/MovieContext'

const Page = () => {
    const pageContext=useContext(movieContext)
    if(!pageContext){
        throw new Error("Cant get different page content")
    }
    const{page,setpage}=pageContext
  return (
    <div className='flex gap-3 justify-center mt-5 pb-3 items-center'>
        <div>
<button
onClick={()=>{if(page>1){
    setpage(page-1)
}}}
className='border border-gray-400 p-2 cursor-pointer hover:bg-[#79C142] hover:text-white rounded-md px-3 text-(--text) text-lg'
>Prev</button>
        </div>
      
            <span className='text-(--text)'>Page:{page}</span>
        
        <div>
            <button
            onClick={()=>setpage(page+1)}
            className='border border-gray-400 p-2 rounded-md px-3 cursor-pointer hover:text-white hover:bg-[#79C142] text-(--text) text-lg '>
                Next
            </button>
        </div>
    </div>
  )
}

export default Page