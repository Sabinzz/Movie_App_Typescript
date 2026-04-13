import { Icon } from '@iconify/react'
import React, { useContext, useEffect } from 'react'
import { movieContext } from '../Context/MovieContext'

const FinalMovieFetch = () => {
    const finalContext=useContext(movieContext)
    if(!finalContext){
        throw new Error("can fetch ")
    }
    const{movieDetail,selectedGenre,selectedYear,movieName }=finalContext
    const genreQuery=selectedGenre.join(",")
  
      async function fetchMovie(){

    }
 
   
  return (
    <div>
         <div className='relative'>
            <button
            onClick={fetchMovie}
            
            className='h-7 w-22 pl-5 text-[#212529] rounded-xl bg-[#79C142]'>Filter</button>
        <Icon className='absolute top-1 left-3 translate-y-0.5' icon="lucide:search"/>
            </div>
    </div>
  )
}

export default FinalMovieFetch