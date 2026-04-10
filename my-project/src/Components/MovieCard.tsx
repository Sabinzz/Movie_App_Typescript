import React from 'react'

interface MovieCardProps {
  movieDetail: {
    id: number
    title: string
    poster_path: string | null
    release_date: string
    runtime: number
  }
}

const MovieCard = ({ movieDetail }: MovieCardProps) => {
  return (
    <div className='w-[65vw] bg-[#181818] absolute top-0 -translate-y-40 left-60 h-[95vh] flex justify-center'>
      
      <div>
        <img
          className='h-80 w-[65vw] object-cover rounded-xl cursor-pointer'
          src={
            movieDetail.poster_path
              ? `https://image.tmdb.org/t/p/w500${movieDetail.poster_path}`
              : "/fallback.jpg"
          }
          alt={movieDetail.title}
        />

        
      </div>

    </div>
  )
}

export default MovieCard