import { Icon } from '@iconify/react'
import React from 'react'

const Filter = () => {
  return (
    <div className='flex flex-col px-10 pt-10 gap-6'>
<div className='flex gap-10'>
    <h1 className='text-white'>Type:</h1>
    <div className='flex gap-4'>
        <div className='flex gap-2 text-[16px]'>
            <input name='radio-btn' type="radio" id='All'/>
            <label htmlFor="All" className='text-[#485C67]'>All</label>
        </div>
        <div className='flex gap-2 text-[16px]'>
            <input name='radio-btn' type="radio" id='Movies'/>
            <label htmlFor="Movies" className='text-[#485C67]'>Movies</label>
        </div>
        <div className='flex gap-2 text-[16px]'>
            <input name='radio-btn' type="radio" id='TV Shows'/>
            <label htmlFor="TV Shows" className='text-[#485C67]'>TV Shows</label>
        </div>

    </div>
   
</div>
 <hr className='border border-gray-900'/>

<div className='flex gap-3'>
    <h1 className='text-white'>Released:</h1>
     <div className='flex gap-4'>
        <div className='flex gap-2 text-[16px]'>
            <input name='Year-Radio' type="radio" id='All'/>
            <label htmlFor="All" className='text-[#485C67]'>All</label>
        </div>
        <div className='flex gap-2 text-[16px]'>
            <input name='Year-Radio' type="radio" id='Movies'/>
            <label htmlFor="Movies" className='text-[#485C67]'>2026</label>
        </div>
        <div className='flex gap-2 text-[16px] '>
            <input name='Year-Radio' type="radio" id='TV Shows'/>
            <label htmlFor="TV Shows" className='text-[#485C67]'>2025</label>
        </div>

    </div>
     <div className='flex gap-4 pl-2'>
        <div className='flex gap-2 text-[16px]'>
            <input name='Year-Radio' type="radio" id='All'/>
            <label htmlFor="All" className='text-[#485C67]'>2024</label>
        </div>
        <div className='flex gap-2 text-[16px]'>
            <input name='Year-Radio' type="radio" id='Movies'/>
            <label htmlFor="Movies" className='text-[#485C67]'>2023</label>
        </div>
        <div className='flex gap-2 text-[16px]'>
            <input name='Year-Radio' type="radio" id='TV Shows'/>
            <label htmlFor="TV Shows" className='text-[#485C67]'>2022</label>
        </div>
        <div className='flex gap-2 text-[16px]'>
            <input name='Year-Radio' type="radio" id='TV Shows'/>
            <label htmlFor="TV Shows" className='text-[#485C67]'>Older</label>
        </div>

    </div>
    
    
   
</div>
 <hr className='border border-gray-900'/>
<div>
    <h1 className='text-white'>Genre:</h1>
   
</div>
 <hr className='border border-gray-900'/>
<div className='flex gap-2'>
    <div className='relative'>
    <button className='h-7 w-22 pl-5 text-[#212529] rounded-xl bg-[#79C142]'>Filter</button>
<Icon className='absolute top-1 left-3 translate-y-0.5' icon="lucide:search"/>
    </div>
    <div className='relative group cursor-pointer'>
        <button className='group-hover:text-white bg-[#1D2C42] h-7 w-22 pl-5  text-[#6C757D]  rounded-xl transition-colors duration-200'>Close</button>
        <Icon icon="charm:cross" className='group-hover:text-white absolute top-1  -translate-x-1 left-3 text-[#6C757D] transition-colors duration-200' fontSize={22}/>
    </div>

</div>

    </div>
  )
}

export default Filter