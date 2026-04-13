import React, { useContext, useState } from 'react'
import NavImg from '../assets/Nav.png'
import { Icon } from '@iconify/react'
import axios from 'axios'
import ContentSection from './ContentSection'
import { movieContext } from '../Context/MovieContext'



const Navbar = () => {
 const searchContext=useContext(movieContext)

  if(!searchContext){
    throw new Error("shit cant search")
  }
  const{movieName,setmovieName}=searchContext
  const [error, seterror] = useState<boolean>(false)
const context=useContext(movieContext)
if(!context){
throw new Error("useMovieContext must be used inside MovieContextProvider")
}
const{movieDetail,setmovieDetail}=context
  const handleMovieApi=async()=>{
      if (!movieName.trim()) return;
    try{
const res=await axios.get('https://api.themoviedb.org/3/search/movie'
,{
  params:{
    api_key:'50e506c1eb5aff5ab14c27ea3bebb47e',
    query:movieName
  }
}
 

)
 const movies = res.data.results
  const detailedMovies = await Promise.all(
      movies.map(async (movie: any) => {
        const detailRes = await axios.get(
          `https://api.themoviedb.org/3/movie/${movie.id}`,
          {
            params: {
              api_key: '50e506c1eb5aff5ab14c27ea3bebb47e'
            }
          }
        )

        return {
          ...movie,
          runtime: detailRes.data.runtime
        }
      })
    )

    setmovieDetail(detailedMovies)
  
   

seterror(false)
    }
    catch(error){
seterror(true)
    }
   

  }

  return (
    <div>
      <div className='w-full h-20 bg-[#0F1622]'>
      <div className='flex justify-between items-center h-full'>
        <div>
          <img className='h-8 ml-10 object-cover' src={NavImg} alt="" />
        </div>
        <div className=' mr-10 flex gap-10 items-center'>
          <div className='relative group'>
            <input
            value={movieName}
              type="text"
              className='border h-11 w-72 outline-none rounded-full border-black bg-[#3F454E] placeholder:text-[#A3B5BD] pl-12 pr-5 hover:bg-white transition-all duration-300'
              placeholder='Enter keywords...'
              onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{
setmovieName(e.target.value)

              }}
onKeyDown={(e) => {
  if (e.key === "Enter") handleMovieApi();
}}
            />
            <Icon
              icon="charm:search"
              className='absolute top-1/2 left-4 -translate-y-1/2 text-white group-hover:text-black transition-colors duration-200'
              fontSize={20}
              onClick={handleMovieApi}
            />
          </div>
          <div className='flex items-center gap-1.5 cursor-pointer '>
            <div className='h-8 w-8 bg-[#3F454E] flex items-center justify-center rounded-full'>
              <Icon icon="mdi:user" className='text-white' fontSize={18} />
            </div>
            <h1 className='text-white'>Login</h1>
          </div>

        </div>
      </div>
    </div>
    <div>
      <ContentSection movieDetail={movieDetail}/>
    </div>
    </div>
  )
}

export default Navbar