import { Icon } from '@iconify/react'
import axios from 'axios'
import React, { useState } from 'react'

interface MovieCardProps {
  id: number
  title: string
  poster_path: string | null
  release_date: string
  runtime: number
  overview:string
}

interface cardProps {
  movieDetail: MovieCardProps
  onClose(): void
}

const MovieCard = ({ movieDetail, onClose }: cardProps) => {
  const [trailerKey, settrailerKey] = useState<string | null>(null)
const playTrailer = async (movieId: number) => {
  try {
    const res = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/videos`,
      {
        params: {
          api_key:'50e506c1eb5aff5ab14c27ea3bebb47e',
        },
      }
    );
console.log(res.data.results)
    const trailer = res.data.results.find(
      (vid: any) =>
        vid.type === "Trailer" && vid.site === "YouTube"
    );

    if (trailer) {
      settrailerKey(trailer.key);
    }

  } catch (error) {
    console.error("Trailer fetch failed", error);
  }
};

  return (


    <div //IT covers whole page
      onClick={onClose}
      className="fixed inset-0 bg-black/70 flex justify-center backdrop-blur-sm transition-all duration-300 z-50"
    >
    
      <div
        onClick={(e) => e.stopPropagation()}//stops it to be clicked deep
        className="relative w-[65vw] overflow-auto bg-[#020916] rounded-xl"
      >
        <img
          className='max-h-[70vh] w-full object-cover object-top rounded-xl'
          src={
            movieDetail.poster_path
              ? `https://image.tmdb.org/t/p/w500${movieDetail.poster_path}`
              : "/fallback.jpg"
          }
          alt={movieDetail.title}
        />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/60 to-transparent rounded-xl"></div>
        <div
          onClick={onClose}
          className='absolute top-3 right-3 z-30 cursor-pointer bg-[#181818] rounded-full p-2'
        >
          <Icon icon="basil:cross-outline" color='white' fontSize={30} />
       
        </div>
        <div 
        onClick={()=>{
          settrailerKey(null)
          playTrailer(movieDetail.id)}}
        className='w-27 h-10 cursor-pointer bg-white flex items-center gap-1 px-3 rounded-sm absolute top-100 left-5 translate-y-10'>
<Icon icon="mdi:play" fontSize={34}/>
<h1 className='font-semibold text-xl'>Play</h1>
        </div>
        <div className='w-10 z-10 h-11 p-0.5  border-2 rounded-lg border-[#7A7A7A] absolute top-100 left-35 translate-y-10'>
<Icon icon="mdi-light:plus" color='white' fontSize={32}/>
        </div>
        <div className='w-10 z-10 h-11 p-1  border-2 rounded-lg border-[#7A7A7A] absolute top-100 left-48 translate-y-10'>
<Icon icon="ei:like" color='white' fontSize={30}/>
        </div>
{/* Detail Section */}
 <div className="p-5 text-white">
    
      <h1 className="text-2xl font-semibold relative">
        {movieDetail.title}
      </h1>

    
      <div className="flex gap-3 text-zinc-400  mt-1 relative">
        <span>{movieDetail.release_date.split("-")[0]}</span>
        <span>{movieDetail.runtime}m</span>
      </div>

   
      <p className="mt-2 text-white leading-tight relative">
        {movieDetail.overview}
      </p>
    </div>

      {trailerKey && <iframe src={`https://www.youtube.com/embed/${trailerKey}`} className='w-full z-10 h-[520px] absolute top-0 ' allowFullScreen/>}


      
     
      </div>
    </div>
  )
}

export default MovieCard