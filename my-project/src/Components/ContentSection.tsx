import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import Filter from './Filter'
import ShowMovie from './ShowMovie'
interface MovieDetailProps{
    movieDetail:any[]
}

const ContentSection = ({movieDetail}:MovieDetailProps) => {
    const [filter, setfilter] = useState<boolean>(false)
  return (
   <div className='bg-[#020916] min-h-screen w-full'>
    <div className='flex justify-between px-10  pt-5'>
<div>
    <h1 className='text-[#DAECEF]  border-b border-gray-600 text-2xl'>Popular Movies</h1>
</div>
<div onClick={()=>{
    setfilter(!filter)
}} className='h-7 cursor-pointer w-20 bg-[#141E2D] flex items-center pl-2 gap-1'>
<Icon className='text-[#6C757D]' fontSize={16} icon="mdi:filter"/>
<h1

className='text-[#6C757D] text-sm'>FILTER</h1>
</div>
    </div>
  <div
  className={`px-2 overflow-hidden transition-all duration-300 ease-in-out ${
    filter ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
  }`}
>
  <Filter />
</div>
<div>
    <ShowMovie movieDetail={movieDetail}/>
</div>
   </div>
  )
}

export default ContentSection